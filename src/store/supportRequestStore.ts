import { create } from 'zustand';
import { 
  collection, 
  addDoc,
  query,
  getDocs,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, logAnalyticsEvent } from '../config/firebase';
import type { SupportRequest, NewSupportRequest } from '../types/support-request';
import { debug } from '../utils/debug';

interface SupportRequestStore {
  requests: SupportRequest[];
  loading: boolean;
  error: string | null;
  submitRequest: (request: NewSupportRequest) => Promise<void>;
  loadUserRequests: () => Promise<void>;
  clearError: () => void;
}

export const useSupportRequestStore = create<SupportRequestStore>((set, get) => ({
  requests: [],
  loading: false,
  error: null,

  clearError: () => set({ error: null }),

  loadUserRequests: async () => {
    if (!auth.currentUser?.email) return;

    try {
      set({ loading: true, error: null });
      
      const q = query(
        collection(db, 'supportRequests'),
        where('userEmail', '==', auth.currentUser.email),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const requests = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        resolvedAt: doc.data().resolvedAt?.toDate()
      })) as SupportRequest[];

      set({ requests, loading: false });
      logAnalyticsEvent('support_requests_loaded');
    } catch (error) {
      console.error('Error loading support requests:', error);
      set({ 
        error: 'Failed to load support requests. Please try again.',
        loading: false 
      });
      logAnalyticsEvent('support_requests_load_error');
    }
  },

  submitRequest: async (request: NewSupportRequest) => {
    if (!auth.currentUser?.email) {
      set({ error: 'You must be logged in to submit a support request.' });
      return;
    }

    try {
      set({ loading: true, error: null });

      const newRequest = {
        ...request,
        status: 'pending' as const,
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Try to store in Firebase first
      await addDoc(collection(db, 'supportRequests'), newRequest);
      
      // If successful, reload requests
      await get().loadUserRequests();
      
      set({ loading: false });
      logAnalyticsEvent('support_request_submitted');
    } catch (error) {
      console.error('Error submitting support request:', error);
      
      // If Firebase storage failed, fall back to email
      const mailtoUrl = `mailto:support@bonsaiforbeginners.app?subject=${encodeURIComponent(request.subject)}&body=${encodeURIComponent(
        `Name: ${request.name}\nEmail: ${request.userEmail}\n\n${request.message}`
      )}`;
      window.location.href = mailtoUrl;
      
      set({ 
        error: 'Failed to submit support request. Opening email client as fallback.',
        loading: false 
      });
      logAnalyticsEvent('support_request_submit_error');
    }
  }
}));