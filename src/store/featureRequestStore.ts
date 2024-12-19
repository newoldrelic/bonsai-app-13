// store/featureRequestStore.ts

import { create } from 'zustand';
import { 
  collection, 
  addDoc,
  updateDoc,
  doc,
  query,
  getDocs,
  where,
  orderBy,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { auth, db, logAnalyticsEvent } from '../config/firebase';
import type { FeatureRequest, NewFeatureRequest } from '../types/feature-request';
import { debug } from '../utils/debug';

interface FeatureRequestStore {
  requests: FeatureRequest[];
  loading: boolean;
  error: string | null;
  userVotes: Record<string, boolean>;
  submitRequest: (request: NewFeatureRequest) => Promise<void>;
  loadRequests: () => Promise<void>;
  voteForRequest: (requestId: string) => Promise<void>;
  clearError: () => void;
}

export const useFeatureRequestStore = create<FeatureRequestStore>((set, get) => ({
  requests: [],
  loading: false,
  error: null,
  userVotes: {},

  clearError: () => set({ error: null }),

  loadRequests: async () => {
    try {
      set({ loading: true, error: null });
      
      const q = query(
        collection(db, 'featureRequests'),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const requests = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as FeatureRequest[];

      // Load user votes if authenticated
      const userVotes: Record<string, boolean> = {};
      if (auth.currentUser) {
        const votesQuery = query(
          collection(db, 'featureRequestVotes'),
          where('userId', '==', auth.currentUser.uid)
        );
        const votesSnapshot = await getDocs(votesQuery);
        votesSnapshot.docs.forEach(doc => {
          userVotes[doc.data().requestId] = true;
        });
      }

      set({ requests, userVotes, loading: false });
      logAnalyticsEvent('feature_requests_loaded');
    } catch (error) {
      console.error('Error loading feature requests:', error);
      set({ 
        error: 'Failed to load feature requests. Please try again.',
        loading: false 
      });
      logAnalyticsEvent('feature_requests_load_error');
    }
  },

  submitRequest: async (request: NewFeatureRequest) => {
    if (!auth.currentUser) {
      set({ error: 'Please sign in to submit feature requests' });
      return;
    }

    try {
      set({ loading: true, error: null });

      const newRequest = {
        ...request,
        status: 'pending' as const,
        votes: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'featureRequests'), newRequest);
      
      // Reload requests to get the latest data
      await get().loadRequests();
      
      set({ loading: false });
      logAnalyticsEvent('feature_request_submitted');
    } catch (error) {
      console.error('Error submitting feature request:', error);
      set({ 
        error: 'Failed to submit feature request. Please try again.',
        loading: false 
      });
      logAnalyticsEvent('feature_request_submit_error');
    }
  },

  voteForRequest: async (requestId: string) => {
    if (!auth.currentUser) {
      set({ error: 'Please sign in to vote' });
      return;
    }

    try {
      set({ loading: true, error: null });

      // Check if user has already voted
      const userVotes = get().userVotes;
      if (userVotes[requestId]) {
        set({ error: 'You have already voted for this request', loading: false });
        return;
      }

      // Add vote document
      await addDoc(collection(db, 'featureRequestVotes'), {
        requestId,
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp()
      });

      // Increment vote count
      const requestRef = doc(db, 'featureRequests', requestId);
      await updateDoc(requestRef, {
        votes: increment(1),
        updatedAt: serverTimestamp()
      });

      // Update local state
      set(state => ({
        userVotes: { ...state.userVotes, [requestId]: true },
        loading: false
      }));

      // Reload requests to get updated vote counts
      await get().loadRequests();
      
      logAnalyticsEvent('feature_request_voted');
    } catch (error) {
      console.error('Error voting for feature request:', error);
      set({ 
        error: 'Failed to register vote. Please try again.',
        loading: false 
      });
      logAnalyticsEvent('feature_request_vote_error');
    }
  }
}));