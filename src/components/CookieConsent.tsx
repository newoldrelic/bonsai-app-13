import React from 'react';
import { X } from 'lucide-react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CookieConsentStore {
  status: 'pending' | 'accepted' | 'declined';
  setStatus: (value: 'accepted' | 'declined') => void;
}

const useCookieConsent = create<CookieConsentStore>()(
  persist(
    (set) => ({
      status: 'pending',
      setStatus: (value) => set({ status: value }),
    }),
    {
      name: 'cookie-consent-status',
      skipIfDeclined: true
    }
  )
);

export function CookieConsent() {
  const { status, setStatus } = useCookieConsent();

  if (status !== 'pending') return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-white/90 dark:bg-stone-800/90 backdrop-blur-sm rounded-lg shadow-lg p-4 z-50 animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="text-sm text-stone-600 dark:text-stone-300">
            We use optional cookies to remember your preferences and enhance your experience.
          </p>
        </div>
        <button
          onClick={() => setStatus('declined')}
          className="text-stone-400 hover:text-stone-500 dark:text-stone-500 dark:hover:text-stone-400"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => setStatus('declined')}
          className="flex-1 px-3 py-1.5 bg-stone-100/80 dark:bg-stone-700/80 text-stone-600 dark:text-stone-300 text-sm font-medium rounded-md hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors"
        >
          Decline
        </button>
        <button
          onClick={() => setStatus('accepted')}
          className="flex-1 px-3 py-1.5 bg-bonsai-green/90 hover:bg-bonsai-green text-white text-sm font-medium rounded-md transition-colors"
        >
          Accept
        </button>
      </div>
    </div>
  );
}

// Export for use in other components
export const getCookieConsent = () => {
  const state = useCookieConsent.getState();
  return state.status === 'accepted';
};