// store/supportRequestStore.ts

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
        where('email', '==', auth.currentUser.email),
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
    try {
      set({ loading: true, error: null });

      const newRequest = {
        ...request,
        status: 'pending' as const,
        userId: auth.currentUser?.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'supportRequests'), newRequest);

      // Create mailto URL for immediate email
      const mailtoUrl = `mailto:support@bonsaiforbeginners.app?subject=${encodeURIComponent(request.subject)}&body=${encodeURIComponent(
        `Name: ${request.name}\nEmail: ${request.email}\n\n${request.message}`
      )}`;
      window.location.href = mailtoUrl;
      
      // Reload requests if user is authenticated
      if (auth.currentUser) {
        await get().loadUserRequests();
      }
      
      set({ loading: false });
      logAnalyticsEvent('support_request_submitted');
    } catch (error) {
      console.error('Error submitting support request:', error);
      set({ 
        error: 'Failed to submit support request. Please try again.',
        loading: false 
      });
      logAnalyticsEvent('support_request_submit_error');
    }
  }
}));