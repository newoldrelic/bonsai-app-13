// components/InstallPrompt.tsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show your custom prompt
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the browser's install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);

    // Clear the deferredPrompt for the next time
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white dark:bg-stone-800 rounded-lg shadow-lg p-4 z-50">
      <button 
        onClick={() => setShowPrompt(false)}
        className="absolute top-2 right-2 p-1 text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="flex flex-col items-center space-y-3">
        <img src="/bonsai-icon.svg" alt="Bonsai Care" className="w-16 h-16" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-stone-800 dark:text-white">
            Install Bonsai Care
          </h3>
          <p className="text-sm text-stone-600 dark:text-stone-300 mt-1">
            Add to your home screen for quick access to your bonsai care schedule
          </p>
        </div>
        <button
          onClick={handleInstallClick}
          className="bg-bonsai-green text-white px-6 py-2 rounded-lg hover:bg-bonsai-moss transition-colors"
        >
          Install App
        </button>
      </div>
    </div>
  );
}