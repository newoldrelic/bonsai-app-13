const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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
      <div className="fixed top-0 left-0 right-0 bg-bonsai-green text-white px-4 py-3 shadow-lg z-[60] animate-slideDown">
        <div className="container mx-auto flex items-center justify-between">
          <p className="font-medium">App installed successfully! 🎉 You can now close this browser tab.</p>
          <button 
            onClick={() => setShowSuccessMessage(false)}
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
    <div className="fixed top-0 left-0 right-0 bg-white dark:bg-stone-800 shadow-lg z-[60] animate-slideDown">
      <div className="container mx-auto p-4">
        <button 
          onClick={() => setShowPrompt(false)}
          className="absolute top-2 right-4 p-1 text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
          aria-label="Close prompt"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="flex items-center space-x-4">
          <img src="/bonsai-icon.svg" alt="Bonsai Care" className="w-12 h-12" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-stone-800 dark:text-white">
              Install Bonsai Care
            </h3>
            {isIOS ? (
              <div className="text-sm text-stone-600 dark:text-stone-300 mt-1">
                <p>Tap <span className="inline-block w-4 h-4 align-middle">□</span> then "Add to Home Screen" to install</p>
              </div>
            ) : (
              <p className="text-sm text-stone-600 dark:text-stone-300 mt-1">
                Get quick access to your bonsai care schedule
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPrompt(false)}
              className="px-4 py-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg transition-colors text-sm"
            >
              Not Now
            </button>
            {!isIOS && (
              <button
                onClick={handleInstallClick}
                className="bg-bonsai-green text-white px-4 py-2 rounded-lg hover:bg-bonsai-moss transition-colors text-sm"
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