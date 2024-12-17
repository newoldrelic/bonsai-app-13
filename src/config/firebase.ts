import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, logEvent, Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDATJrKcVbQGPL-qaMzbG9ZJT1EeCDc9RQ",
  authDomain: "bonsai-c0690.firebaseapp.com",
  projectId: "bonsai-c0690",
  storageBucket: "bonsai-c0690.firebasestorage.app",
  messagingSenderId: "755508788438",
  appId: "1:755508788438:web:80947149c2649f1f385d77",
  measurementId: "G-MBVTEP2XRT"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize analytics only in browser environment
let analytics: Analytics | undefined;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Helper function to log events
export const logAnalyticsEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (!analytics) return;
  
  try {
    logEvent(analytics, eventName, eventParams);
  } catch (error) {
    console.error('Failed to log analytics event:', error);
  }
};