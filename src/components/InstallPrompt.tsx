import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { debug } from '../utils/debug';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInStandaloneMode = (window.navigator as any).standalone;
    
    if (!isStandalone && !isInStandaloneMode) {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      if (isMobile) {
        // Delay showing the prompt to allow page to load
        setTimeout(() => setShowPrompt(true), 2000);
      }
    }

    if (!isIOS) {
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setShowPrompt(true);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    }
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    // Wait for animation to complete before hiding
    setTimeout(() => {
      setShowPrompt(false);
      setIsClosing(false);
    }, 300); // Match animation duration
  };

  const handleInstallClick = async () => {
    if (!isIOS && deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      debug.info(`User response to install prompt: ${outcome}`);

      if (outcome === 'accepted') {
        setShowSuccessMessage(true);
        setShowPrompt(false);
      }
      
      setDeferredPrompt(null);
    }
  };

  // Add to your app's CSS or tailwind.config.js
  // @keyframes slideUpIn {
  //   from { transform: translateY(100%); opacity: 0; }
  //   to { transform: translateY(0); opacity: 1; }
  // }
  // @keyframes slideDownOut {
  //   from { transform: translateY(0); opacity: 1; }
  //   to { transform: translateY(100%); opacity: 0; }
  // }

  if (showSuccessMessage) {
    return (
      <div 
        className="fixed bottom-[calc(4rem+1px)] left-0 right-0 bg-bonsai-green text-white px-4 py-3 shadow-lg z-50 animate-[slideUpIn_0.3s_ease-out]"
        style={{ 
          animation: isClosing ? 'slideDownOut 0.3s ease-in forwards' : 'slideUpIn 0.3s ease-out'
        }}
      >
        <div className="container mx-auto flex items-center justify-between">
          <p className="font-medium">App installed successfully! 🎉 You can now close this browser tab.</p>
          <button 
            onClick={handleClose}
            className="ml-4 p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (!showPrompt) return null;

  return (
    <div 
      className="fixed bottom-[calc(4rem+1px)] left-0 right-0 bg-white dark:bg-stone-800 shadow-lg z-50 border-t border-stone-200 dark:border-stone-700"
      style={{ 
        animation: isClosing ? 'slideDownOut 0.3s ease-in forwards' : 'slideUpIn 0.3s ease-out'
      }}
    >
      <div className="container mx-auto p-4">
        <button 
          onClick={handleClose}
          className="absolute top-2 right-4 p-1 text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 transition-colors"
          aria-label="Close prompt"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="flex items-center space-x-4 mb-[env(safe-area-inset-bottom)]">
          <div className="relative w-12 h-12">
            <img 
              src="/bonsai-icon.svg" 
              alt="Bonsai Care" 
              className="w-12 h-12 animate-[scaleIn_0.5s_ease-out]"
            />
            <div 
              className="absolute inset-0 bg-bonsai-green/10 rounded-xl animate-pulse"
              style={{ animationDuration: '2s' }}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-stone-800 dark:text-white truncate opacity-0 animate-[fadeSlideUp_0.5s_ease-out_0.1s_forwards]">
              Install Bonsai Care
            </h3>
            <div className="overflow-hidden">
              {isIOS ? (
                <div 
                  className="text-sm text-stone-600 dark:text-stone-300 mt-1 opacity-0 animate-[fadeSlideUp_0.5s_ease-out_0.2s_forwards]"
                >
                  <p>
                    Tap <span className="inline-block w-4 h-4 align-middle">□</span> then "Add to Home Screen" to install
                  </p>
                </div>
              ) : (
                <p 
                  className="text-sm text-stone-600 dark:text-stone-300 mt-1 truncate opacity-0 animate-[fadeSlideUp_0.5s_ease-out_0.2s_forwards]"
                >
                  Get quick access to your bonsai care schedule
                </p>
              )}
            </div>
          </div>
          
          <div 
            className="flex items-center gap-2 flex-shrink-0 opacity-0 animate-[fadeSlideUp_0.5s_ease-out_0.3s_forwards]"
          >
            <button
              onClick={handleClose}
              className="px-4 py-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg transition-colors text-sm whitespace-nowrap"
            >
              Not Now
            </button>
            {!isIOS && (
              <button
                onClick={handleInstallClick}
                className="bg-bonsai-green text-white px-4 py-2 rounded-lg hover:bg-bonsai-moss transition-colors text-sm whitespace-nowrap"
              >
                Install
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;