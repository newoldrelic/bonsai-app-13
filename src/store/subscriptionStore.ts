import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { auth, db } from '../config/firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import type { UserSubscription } from '../types';
import { createCheckoutSession } from '../services/stripeService';
import { debug } from '../utils/debug';

interface SubscriptionState {
  subscription: UserSubscription | null;
  loading: boolean;
  error: string | null;
  checkoutSession: string | null;
  createCheckoutSession: (priceId: string, userEmail: string, giftEmail?: string) => Promise<void>;
  getCurrentPlan: () => string;
  clearError: () => void;
  setSubscription: (subscription: UserSubscription | null) => void;
  refreshSubscription: () => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionState>()((set, get) => ({
  subscription: null,
  loading: false,
  error: null,
  checkoutSession: null,

  setSubscription: (subscription) => {
    debug.info('Setting subscription:', subscription);
    set({ subscription });
  },

  refreshSubscription: async () => {
    const user = auth.currentUser;
    if (!user?.email) {
      set({ subscription: null });
      return;
    }

    try {
      set({ loading: true });
      const subscriptionRef = doc(db, 'subscriptions', user.email);
      const docSnap = await getDoc(subscriptionRef);
      
      if (docSnap.exists()) {
        const subscription = docSnap.data() as UserSubscription;
        set({ subscription, loading: false });
      } else {
        set({ subscription: null, loading: false });
      }
    } catch (error) {
      debug.error('Error refreshing subscription:', error);
      set({ subscription: null, loading: false, error: 'Failed to load subscription' });
    }
  },

  createCheckoutSession: async (priceId: string, userEmail: string, giftEmail?: string) => {
    try {
      set({ loading: true, error: null });
      const checkoutUrl = await createCheckoutSession(priceId, userEmail, giftEmail);
      window.location.href = checkoutUrl;
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      set({ 
        error: error.message || 'Failed to start checkout process',
        loading: false 
      });
    }
  },

  getCurrentPlan: () => {
    const { subscription } = get();
    if (!subscription) return 'hobby';
    if (subscription.status !== 'active') return 'hobby';
    return subscription.planId;
  },

  clearError: () => set({ error: null })
}));

// Set up subscription listener
auth.onAuthStateChanged(async (user) => {
  if (user?.email) {
    const subscriptionRef = doc(db, 'subscriptions', user.email);
    
    try {
      // Get initial subscription state
      const docSnap = await getDoc(subscriptionRef);
      if (docSnap.exists()) {
        const subscription = docSnap.data() as UserSubscription;
        useSubscriptionStore.getState().setSubscription(subscription);
      } else {
        useSubscriptionStore.getState().setSubscription(null);
      }

      // Set up real-time listener
      const unsubscribe = onSnapshot(subscriptionRef, 
        (doc) => {
          if (doc.exists()) {
            const subscription = doc.data() as UserSubscription;
            debug.info('Subscription updated:', subscription);
            useSubscriptionStore.getState().setSubscription(subscription);
          } else {
            debug.info('No subscription found');
            useSubscriptionStore.getState().setSubscription(null);
          }
        },
        (error) => {
          debug.error('Error listening to subscription changes:', error);
          useSubscriptionStore.getState().setSubscription(null);
        }
      );

      return () => {
        unsubscribe();
      };
    } catch (error) {
      debug.error('Error setting up subscription listener:', error);
      useSubscriptionStore.getState().setSubscription(null);
    }
  } else {
    useSubscriptionStore.getState().setSubscription(null);
  }
});

// Initialize subscription state
useSubscriptionStore.getState().refreshSubscription();

// Refresh subscription on page focus
if (typeof window !== 'undefined') {
  window.addEventListener('focus', () => {
    useSubscriptionStore.getState().refreshSubscription();
  });
}