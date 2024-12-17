import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './components/Dashboard';
import { Header } from './components/Header';
import { MaintenanceView } from './components/MaintenanceView';
import { HistoryView } from './components/HistoryView';
import { StyleGuide } from './components/StyleGuide';
import { TreeDetails } from './components/TreeDetails';
import { PricingPage } from './pages/PricingPage';
import { SubscriptionSuccessPage } from './pages/SubscriptionSuccessPage';
import { AuthError } from './components/AuthError';
import { CookieConsent } from './components/CookieConsent';
import { useAuthStore } from './store/authStore';
import { useSubscriptionStore } from './store/subscriptionStore';
import { useBonsaiStore } from './store/bonsaiStore';
import { SpeciesIdentifierPage } from './pages/SpeciesIdentifierPage';
import { HealthAnalyticsPage } from './pages/HealthAnalyticsPage';
import { CareGuidePage } from './pages/CareGuidePage';
import { ExpertCoachingPage } from './pages/ExpertCoachingPage';
import { VoiceChatPage } from './pages/VoiceChatPage';
import { logAnalyticsEvent } from './config/firebase';
import { debug } from './utils/debug';
import { registerServiceWorker } from './utils/notifications';

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
      <div className="fixed bottom-4 left-4 right-4 bg-bonsai-green text-white rounded-lg shadow-lg p-4 z-50 text-center">
        <p className="font-medium mb-2">App installed successfully! 🎉</p>
        <p className="text-sm">You can now close this browser tab and use the installed app on your home screen.</p>
      </div>
    );
  }

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white dark:bg-stone-800 rounded-lg shadow-lg p-4 z-50">
      <button 
        onClick={() => setShowPrompt(false)}
        className="absolute top-2 right-2 p-1 text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
        aria-label="Close prompt"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="flex flex-col items-center space-y-3">
        <img src="/bonsai-icon.svg" alt="Bonsai Care" className="w-16 h-16" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-stone-800 dark:text-white">
            Install Bonsai Care
          </h3>
          {isIOS ? (
            <div className="text-sm text-stone-600 dark:text-stone-300 mt-1 space-y-2">
              <p>To install Bonsai Care on your iPhone:</p>
              <ol className="list-decimal list-inside space-y-1 text-left">
                <li>Tap the Share button <span className="inline-block w-6 h-6 align-middle">□</span> at the bottom of the screen</li>
                <li>Scroll down and tap "Add to Home Screen"</li>
                <li>Tap "Add" to confirm</li>
              </ol>
            </div>
          ) : (
            <p className="text-sm text-stone-600 dark:text-stone-300 mt-1">
              Get quick access to your bonsai care schedule by installing the app on your device. You can also continue using the browser version if you prefer.
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowPrompt(false)}
            className="px-6 py-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg transition-colors text-sm"
          >
            Continue in Browser
          </button>
          {!isIOS && (
            <button
              onClick={handleInstallClick}
              className="bg-bonsai-green text-white px-6 py-2 rounded-lg hover:bg-bonsai-moss transition-colors text-sm"
            >
              Install App
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-bonsai-green border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    logAnalyticsEvent('unauthorized_access_attempt');
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function PremiumRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthStore();
  const { getCurrentPlan } = useSubscriptionStore();
  const currentPlan = getCurrentPlan();
  const isSubscribed = currentPlan !== 'hobby';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-bonsai-green border-t-transparent"></div>
      </div>
    );
  }

  if (!user || !isSubscribed) {
    logAnalyticsEvent('premium_access_attempt');
    return <Navigate to="/pricing" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const { loading } = useAuthStore();

  // Register service worker early
  useEffect(() => {
    registerServiceWorker().catch(error => {
      debug.error('Failed to register service worker:', error);
    });
  }, []);

  // Set up message listener for maintenance tasks
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === 'MAINTENANCE_DONE') {
        const { data, notificationTag } = event.data;
        if (data?.treeId && data?.type) {
          try {
            // Add maintenance log for the completed task
            const log = {
              type: data.type,
              date: new Date().toISOString(),
              notes: 'Marked as done from notification',
              images: []
            };
            await useBonsaiStore.getState().addMaintenanceLog(data.treeId, log);
            debug.info('Maintenance task completed:', { treeId: data.treeId, type: data.type });
          } catch (error) {
            debug.error('Failed to log maintenance completion:', error);
          }
        }
      }
    };

    navigator.serviceWorker?.addEventListener('message', handleMessage);
    return () => {
      navigator.serviceWorker?.removeEventListener('message', handleMessage);
    };
  }, []);

  React.useEffect(() => {
    logAnalyticsEvent('app_loaded');
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-bonsai-green border-t-transparent"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/success" element={<SubscriptionSuccessPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/tree/:id" element={
            <ProtectedRoute>
              <TreeDetails />
            </ProtectedRoute>
          } />
          <Route path="/maintenance" element={
            <ProtectedRoute>
              <MaintenanceView />
            </ProtectedRoute>
          } />
          <Route path="/history" element={
            <ProtectedRoute>
              <HistoryView />
            </ProtectedRoute>
          } />
          <Route path="/guide" element={
            <ProtectedRoute>
              <StyleGuide />
            </ProtectedRoute>
          } />
          <Route path="/species-identifier" element={
            <PremiumRoute>
              <SpeciesIdentifierPage />
            </PremiumRoute>
          } />
          <Route path="/health-analytics" element={
            <PremiumRoute>
              <HealthAnalyticsPage />
            </PremiumRoute>
          } />
          <Route path="/care-guide" element={
            <PremiumRoute>
              <CareGuidePage />
            </PremiumRoute>
          } />
          <Route path="/expert-coaching" element={
            <PremiumRoute>
              <ExpertCoachingPage />
            </PremiumRoute>
          } />
          <Route path="/voice-chat" element={
            <PremiumRoute>
              <VoiceChatPage />
            </PremiumRoute>
          } />
        </Routes>
        <AuthError />
        <CookieConsent />
        <InstallPrompt />
      </div>
    </BrowserRouter>
  );
}