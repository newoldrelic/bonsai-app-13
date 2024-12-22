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
    setTimeout(() => {
      setShowPrompt(false);
      setIsClosing(false);
    }, 300);
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

  if (showSuccessMessage) {
    return (
      <div 
        className={`fixed bottom-16 left-0 right-0 bg-bonsai-green text-white px-4 py-3 shadow-lg z-50 transform transition-transform duration-300 ${
          isClosing ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
        }`}
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
      className={`fixed bottom-16 left-0 right-0 bg-white dark:bg-stone-800 shadow-lg z-50 border-t border-stone-200 dark:border-stone-700 transform transition-all duration-300 ${
        isClosing ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
      <div className="container mx-auto p-4">
        <button 
          onClick={handleClose}
          className="absolute top-2 right-4 p-1 text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 transition-colors"
          aria-label="Close prompt"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 transform transition-transform duration-500 translate-y-0">
            <img 
              src="/bonsai-icon.svg" 
              alt="Bonsai Care" 
              className="w-12 h-12"
            />
          </div>
          
          <div className="flex-1 min-w-0 transform transition-transform duration-500 delay-100 translate-y-0">
            <h3 className="text-lg font-semibold text-stone-800 dark:text-white truncate">
              Install Bonsai Care
            </h3>
            <div className="overflow-hidden">
              {isIOS ? (
                <div className="text-sm text-stone-600 dark:text-stone-300 mt-1">
                  <p>Tap <span className="inline-block w-4 h-4 align-middle">□</span> then "Add to Home Screen" to install</p>
                </div>
              ) : (
                <p className="text-sm text-stone-600 dark:text-stone-300 mt-1 truncate">
                  Get quick access to your bonsai care schedule
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0 transform transition-transform duration-500 delay-200 translate-y-0">
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