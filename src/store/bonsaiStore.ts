import { create } from 'zustand';
import { 
  collection, 
  addDoc, 
  updateDoc,
  deleteDoc,
  doc, 
  query, 
  where, 
  getDocs,
  onSnapshot,
  serverTimestamp,
  enableIndexedDbPersistence,
  enableMultiTabIndexedDbPersistence,
  waitForPendingWrites
} from 'firebase/firestore';
import type { BonsaiTree, MaintenanceLog } from '../types';
import { auth, db, logAnalyticsEvent } from '../config/firebase';
import { debug } from '../utils/debug';
import { notificationService } from '../services/notificationService';

// Enable offline persistence
try {
  enableMultiTabIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      enableIndexedDbPersistence(db);
    } else if (err.code === 'unimplemented') {
      console.warn('Browser doesn\'t support IndexedDB persistence');
    }
  });
} catch (err) {
  console.warn('Error enabling persistence:', err);
}

interface BonsaiStore {
  trees: BonsaiTree[];
  loading: boolean;
  error: string | null;
  offline: boolean;
  addTree: (tree: Omit<BonsaiTree, 'id' | 'maintenanceLogs' | 'userEmail'>, isSubscribed: boolean) => Promise<BonsaiTree>;
  addMaintenanceLog: (treeId: string, log: Omit<MaintenanceLog, 'id'>) => Promise<void>;
  updateTree: (id: string, updates: Partial<BonsaiTree>) => Promise<void>;
  deleteTree: (id: string) => Promise<void>;
  loadTrees: () => Promise<void>;
  clearError: () => void;
}

export const useBonsaiStore = create<BonsaiStore>((set, get) => {
  let unsubscribe: (() => void) | null = null;

  // Setup real-time listener with offline support
  const setupTreesListener = (userEmail: string) => {
    if (unsubscribe) {
      unsubscribe();
    }

    const q = query(
      collection(db, 'trees'),
      where('userEmail', '==', userEmail)
    );
    
    unsubscribe = onSnapshot(q, 
      {
        next: async (snapshot) => {
          const trees = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
          })) as BonsaiTree[];
          
          set({ trees, loading: false, offline: false });
          logAnalyticsEvent('trees_sync_success');

          // Initialize notification service but don't reschedule
          try {
            await notificationService.init();
          } catch (error) {
            debug.error('Failed to initialize notification service:', error);
          }
        },
        error: (error) => {
          console.error('Firestore subscription error:', error);
          if (error.code === 'unavailable') {
            set({ offline: true });
            logAnalyticsEvent('app_offline');
          } else {
            set({ error: 'Failed to sync with database', loading: false });
            logAnalyticsEvent('trees_sync_error', { error: error.code });
          }
        }
      }
    );
  };

  // Setup initial listener if user is logged in
  const user = auth.currentUser;
  if (user?.email) {
    setupTreesListener(user.email);
  }

  // Listen for auth state changes
  auth.onAuthStateChanged((user) => {
    if (user?.email) {
      setupTreesListener(user.email);
    } else if (unsubscribe) {
      unsubscribe();
      set({ trees: [] });
    }
  });

  return {
    trees: [],
    loading: false,
    error: null,
    offline: false,

    clearError: () => set({ error: null }),

    loadTrees: async () => {
      const user = auth.currentUser;
      if (!user?.email) {
        set({ error: 'Please sign in to view your collection' });
        return;
      }

      try {
        set({ loading: true, error: null });
        const q = query(
          collection(db, 'trees'),
          where('userEmail', '==', user.email)
        );
        const snapshot = await getDocs(q);
        const trees = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        })) as BonsaiTree[];
        set({ trees, loading: false, offline: false });
        logAnalyticsEvent('trees_loaded');
      } catch (error: any) {
        console.error('Error loading trees:', error);
        const isOffline = error.code === 'unavailable';
        set({ 
          error: isOffline ? 'You are currently offline. Some features may be limited.' : 'Failed to load your tree collection. Please try again.',
          loading: false,
          offline: isOffline
        });
        logAnalyticsEvent('trees_load_error', { error: error.code });
      }
    },

    addTree: async (tree, isSubscribed) => {
      const user = auth.currentUser;
      if (!user?.email) {
        set({ error: 'Please sign in to add trees' });
        throw new Error('Not signed in');
      }

      try {
        set({ loading: true, error: null });
        const currentTrees = get().trees;

        if (!isSubscribed && currentTrees.length >= 3) {
          throw new Error('Free tier is limited to 3 trees. Please upgrade to add more trees to your collection.');
        }

        const newTree = {
          ...tree,
          maintenanceLogs: [],
          userEmail: user.email,
          createdAt: serverTimestamp(),
          lastMaintenance: {},
          notificationSettings: tree.notificationSettings || {
            hours: 9,
            minutes: 0
          }
        };

        const docRef = await addDoc(collection(db, 'trees'), newTree);
        await waitForPendingWrites(db);

        // Create the complete tree object with ID
        const createdTree = {
          ...newTree,
          id: docRef.id
        } as BonsaiTree;

        set({ loading: false, error: null, offline: false });
        logAnalyticsEvent('tree_added');

        return createdTree;
      } catch (error: any) {
        console.error('Error adding tree:', error);
        const isOffline = error.code === 'unavailable';
        set({ 
          error: isOffline ? 'Changes will be saved when you\'re back online' : error.message || 'Failed to add tree. Please try again.',
          loading: false,
          offline: isOffline
        });
        logAnalyticsEvent('tree_add_error', { error: error.code });
        throw error;
      }
    },

    addMaintenanceLog: async (treeId, log) => {
      try {
        set({ loading: true, error: null });
        const tree = get().trees.find(t => t.id === treeId);
        if (!tree) throw new Error('Tree not found');

        const newLog = { ...log, id: crypto.randomUUID() };
        const updatedLogs = [...tree.maintenanceLogs, newLog];

        // Update both maintenanceLogs and lastMaintenance
        const updates = {
          maintenanceLogs: updatedLogs,
          lastMaintenance: {
            ...tree.lastMaintenance,
            [log.type]: log.date
          }
        };

        const treeRef = doc(db, 'trees', treeId);
        await updateDoc(treeRef, updates);
        await waitForPendingWrites(db);

        // Only reschedule the specific maintenance type that was completed
        if (tree.notifications[log.type as keyof typeof tree.notifications]) {
          await notificationService.updateMaintenanceSchedule(
            tree.id,
            tree.name,
            log.type as MaintenanceType,
            true,
            log.date,
            tree.notificationSettings
          );
        }

        set({ loading: false, error: null, offline: false });
        logAnalyticsEvent('maintenance_log_added');
      } catch (error: any) {
        console.error('Error adding maintenance log:', error);
        const isOffline = error.code === 'unavailable';
        set({ 
          error: isOffline ? 'Changes will be saved when you\'re back online' : error.message || 'Failed to add maintenance log. Please try again.',
          loading: false,
          offline: isOffline
        });
        logAnalyticsEvent('maintenance_log_error', { error: error.code });
        throw error;
      }
    },

    updateTree: async (id, updates) => {
      try {
        set({ loading: true, error: null });
        
        const tree = get().trees.find(t => t.id === id);
        if (!tree) throw new Error('Tree not found');

        // Ensure lastMaintenance field exists
        if (!updates.lastMaintenance) {
          updates.lastMaintenance = tree.lastMaintenance || {};
        }

        // Update tree in Firestore
        const treeRef = doc(db, 'trees', id);
        await updateDoc(treeRef, updates);
        await waitForPendingWrites(db);

        // Only update notifications if notification settings changed
        if (updates.notifications || updates.notificationSettings) {
          const notificationChanges = Object.entries(updates.notifications || tree.notifications).filter(
            ([type, enabled]) => enabled !== tree.notifications[type as keyof typeof tree.notifications]
          );

          for (const [type, enabled] of notificationChanges) {
            await notificationService.updateMaintenanceSchedule(
              id,
              updates.name || tree.name,
              type as MaintenanceType,
              enabled,
              updates.lastMaintenance[type],
              updates.notificationSettings || tree.notificationSettings
            );
          }
        }

        set({ loading: false, error: null, offline: false });
        logAnalyticsEvent('tree_updated');
      } catch (error: any) {
        console.error('Error updating tree:', error);
        const isOffline = error.code === 'unavailable';
        set({ 
          error: isOffline ? 'Changes will be saved when you\'re back online' : error.message || 'Failed to update tree. Please try again.',
          loading: false,
          offline: isOffline
        });
        logAnalyticsEvent('tree_update_error', { error: error.code });
        throw error;
      }
    },

    deleteTree: async (id) => {
      try {
        set({ loading: true, error: null });
        
        // Get the tree before deleting to access its notification settings
        const tree = get().trees.find(t => t.id === id);
        if (tree) {
          // Disable all notifications for this tree
          const enabledTypes = Object.entries(tree.notifications)
            .filter(([_, enabled]) => enabled)
            .map(([type]) => type as MaintenanceType);

          for (const type of enabledTypes) {
            await notificationService.updateMaintenanceSchedule(
              id,
              tree.name,
              type,
              false,
              undefined,
              tree.notificationSettings
            );
          }
        }

        await deleteDoc(doc(db, 'trees', id));
        await waitForPendingWrites(db);
        set({ loading: false, error: null, offline: false });
        logAnalyticsEvent('tree_deleted');
      } catch (error: any) {
        console.error('Error deleting tree:', error);
        const isOffline = error.code === 'unavailable';
        set({ 
          error: isOffline ? 'Changes will be saved when you\'re back online' : error.message || 'Failed to delete tree. Please try again.',
          loading: false,
          offline: isOffline
        });
        logAnalyticsEvent('tree_delete_error', { error: error.code });
        throw error;
      }
    }
  };
});