import { create } from 'zustand';
import { auth, googleProvider, logAnalyticsEvent } from '../config/firebase';
import { 
  signInWithPopup, 
  signInWithRedirect, 
  signOut, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  type User 
} from 'firebase/auth';
import { debug } from '../utils/debug';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  createAccount: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  checkEmailExists: (email: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,

  checkEmailExists: async (email: string) => {
    try {
      debug.info('Starting email check for:', email);
      const methods = await fetchSignInMethodsForEmail(auth, email);
      debug.info('Sign-in methods found:', methods);
      return methods.length > 0;
    } catch (error: any) {
      debug.error('Error checking email:', error);
      if (error.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address');
      }
      // For any other error, assume user doesn't exist
      // but log the error for debugging
      debug.error('Unexpected error during email check:', error);
      return false;
    }
  },

  signInWithEmail: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const result = await signInWithEmailAndPassword(auth, email, password);
      logAnalyticsEvent('login', { method: 'email' });
      set({ user: result.user, loading: false });
    } catch (error: any) {
      debug.error('Error signing in with email:', error);
      let errorMessage = 'Failed to sign in. Please try again.';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email. Please create an account first.';
          break;
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          errorMessage = 'Incorrect password. Please try again.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts. Please try again later.';
          break;
      }
      
      logAnalyticsEvent('login_error', { method: 'email', error: error.code });
      set({ error: errorMessage, loading: false });
    }
  },

  createAccount: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const result = await createUserWithEmailAndPassword(auth, email, password);
      logAnalyticsEvent('sign_up', { method: 'email' });
      set({ user: result.user, loading: false });
    } catch (error: any) {
      debug.error('Error creating account:', error);
      let errorMessage = 'Failed to create account. Please try again.';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'An account already exists with this email. Please sign in instead.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters long.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/password accounts are not enabled. Please contact support.';
          break;
      }
      
      logAnalyticsEvent('sign_up_error', { method: 'email', error: error.code });
      set({ error: errorMessage, loading: false });
    }
  },

  signInWithGoogle: async () => {
    try {
      set({ loading: true, error: null });
      try {
        const result = await signInWithPopup(auth, googleProvider);
        logAnalyticsEvent('login', { method: 'google' });
        set({ user: result.user, loading: false });
      } catch (popupError: any) {
        if (popupError.code === 'auth/popup-blocked') {
          debug.info('Popup blocked, falling back to redirect...');
          await signInWithRedirect(auth, googleProvider);
        } else {
          throw popupError;
        }
      }
    } catch (error: any) {
      debug.error('Error signing in with Google:', error);
      let errorMessage = 'Failed to sign in with Google. Please try again.';
      
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Sign in cancelled. Please try again.';
          break;
        case 'auth/account-exists-with-different-credential':
          errorMessage = 'An account already exists with this email using a different sign-in method.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection and try again.';
          break;
      }
      
      logAnalyticsEvent('login_error', { method: 'google', error: error.code });
      set({ error: errorMessage, loading: false });
    }
  },

  logout: async () => {
    try {
      set({ loading: true, error: null });
      await signOut(auth);
      logAnalyticsEvent('logout');
      set({ user: null, loading: false });
    } catch (error: any) {
      debug.error('Error signing out:', error);
      set({ 
        error: 'Failed to sign out. Please try again.',
        loading: false 
      });
    }
  },

  clearError: () => set({ error: null })
}));

// Set up auth state listener
onAuthStateChanged(auth, (user) => {
  useAuthStore.setState({ user, loading: false });
  if (user) {
    logAnalyticsEvent('user_state_changed', { 
      state: 'signed_in',
      userId: user.uid
    });
  }
});