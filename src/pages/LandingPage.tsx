import React, { useState } from 'react';
import { ArrowRight, Plus, Gift, X, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useBonsaiStore } from '../store/bonsaiStore';
import { FEATURES } from '../config/features';

// notification test button
//
import { Bell } from 'lucide-react';
import { notificationService } from '../services/notificationService';
import { debug } from '../utils/debug';
export function TestNotificationButton() {
  const handleTestClick = async () => {
    try {
      debug.info('Testing notification...');
      await notificationService.testNotification();
    } catch (error) {
      debug.error('Test notification failed:', error);
    }
  };

  return (
    <button
      onClick={handleTestClick}
      className="flex items-center space-x-2 px-4 py-2 bg-bonsai-green text-white rounded-lg hover:bg-bonsai-moss transition-colors"
    >
      <Bell className="w-4 h-4" />
      <span>Test Notifications</span>
    </button>
  );
}
//import { TestNotificationButton } from './TestNotificationButton';
// end notification test button

// scheduled notification test button
//import React from 'react';
import { Clock } from 'lucide-react';
//import { notificationService } from '../services/notificationService';
//import { debug } from '../utils/debug';

export function TestScheduledNotificationButton() {
  const handleTestClick = async () => {
    try {
      debug.info('Testing scheduled notification...');
      await notificationService.testScheduledNotification();
    } catch (error) {
      debug.error('Test scheduled notification failed:', error);
    }
  };

  return (
    <button
      onClick={handleTestClick}
      className="flex items-center space-x-2 px-4 py-2 bg-bonsai-green text-white rounded-lg hover:bg-bonsai-moss transition-colors"
    >
      <Clock className="w-4 h-4" />
      <span>Test Scheduled Notification (1min)</span>
    </button>
  );
}
// end scheduled notification test button

// bare bones notification to test browser
//import React from 'react';

export function NotificationDebugButton() {
  const testBasicNotification = () => {
    console.log('Testing basic notification');
    new Notification('Basic Test', {
      body: 'Direct browser notification'
    });
  };

  const testServiceWorkerNotification = async () => {
    console.log('Testing service worker notification');
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.showNotification('Service Worker Test', {
        body: 'Via service worker'
      });
    }
  };

  const checkNotificationStatus = () => {
    console.log('=== Notification Status ===');
    console.log('Notification API available:', 'Notification' in window);
    console.log('Permission:', Notification.permission);
    console.log('Service Worker API available:', 'serviceWorker' in navigator);
    navigator.serviceWorker.getRegistration().then(registration => {
      console.log('Service Worker registered:', !!registration);
      if (registration) {
        console.log('Service Worker state:', registration.active?.state);
      }
    });
  };

  return (
    <div className="space-y-2">
      <div className="text-sm text-gray-600">Notification Debug Panel</div>
      <div className="space-x-2">
        <button
          onClick={testBasicNotification}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Test Basic
        </button>
        <button
          onClick={testServiceWorkerNotification}
          className="px-4 py-2 bg-green-500 text-white rounded-lg"
        >
          Test Service Worker
        </button>
        <button
          onClick={checkNotificationStatus}
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
        >
          Check Status
        </button>
      </div>
    </div>
  );
}
// end bare bones button for browser

export function LandingPage() {
  const navigate = useNavigate();
  const { user, signInWithGoogle, signInWithEmail, createAccount, loading, error, checkEmailExists } = useAuthStore();
  const { trees } = useBonsaiStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [showGiftSticker, setShowGiftSticker] = useState(true);
  const [checkingEmail, setCheckingEmail] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!showPasswordField) {
      setCheckingEmail(true);
      try {
        console.log('Checking email:', email);
        const exists = await checkEmailExists(email);
        console.log('Email exists?', exists);
        setIsNewUser(!exists);
        console.log('Setting isNewUser to:', !exists);
        setShowPasswordField(true);
      } catch (error) {
        console.error('Error checking email:', error);
      } finally {
        setCheckingEmail(false);
      }
      return;
    }

    if (!email || !password) return;
    
    console.log('Attempting auth with isNewUser:', isNewUser);
    if (isNewUser) {
      await createAccount(email, password);
    } else {
      await signInWithEmail(email, password);
    }
  };

  const navigateToGiftSection = () => {
    navigate('/pricing', { state: { scrollToGifts: true } });
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-stone-100 dark:bg-stone-900">
      <div className="relative flex-1 min-h-0">
        <img 
          src="https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=1800"
          alt="Beautiful bonsai tree"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent dark:from-black/90 dark:via-black/70 dark:to-black/30">
          <div className="container mx-auto px-4 h-full flex flex-col">
            <div className="flex-1 flex flex-col justify-center max-w-2xl">
              {!user && showGiftSticker && (
                <div className="absolute top-8 right-8 md:right-12 transform rotate-12 animate-bounce">
                  <div className="relative group">
                    <button
                      onClick={() => setShowGiftSticker(false)}
                      className="absolute -top-3 -right-3 z-10 p-2 bg-bonsai-terra text-white rounded-full opacity-100 hover:bg-bonsai-clay transition-colors shadow-lg flex items-center gap-1.5"
                      aria-label="Close gift promotion"
                    >
                      <X className="w-4 h-4" />
                      <span className="text-sm font-medium">Close</span>
                    </button>
                    <button
                      onClick={navigateToGiftSection}
                      className="relative"
                    >
                      <div className="absolute inset-0 bg-bonsai-terra rounded-lg transform rotate-3 group-hover:rotate-6 transition-transform"></div>
                      <div className="relative bg-white dark:bg-stone-800 text-bonsai-bark dark:text-white p-4 rounded-lg shadow-lg transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                        <div className="flex items-center gap-2 text-bonsai-terra mb-2">
                          <Gift className="w-5 h-5" />
                          <span className="font-bold">Perfect Gift!</span>
                        </div>
                        <p className="text-sm dark:text-stone-300">
                          Give the gift of bonsai expertise.<br />
                          Premium access for single small cost<br />
                          See all options here...
                        </p>
                        <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-white dark:bg-stone-800 transform rotate-45"></div>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              <h1 className="text-white dark:text-white mt-4">
                <span className="block text-6xl md:text-7xl lg:text-8xl font-bold leading-none">BONSAI</span>
                <span className="block text-3xl md:text-4xl lg:text-5xl font-medium mt-1">FOR BEGINNERS</span>
              </h1>
              <p className="text-white/90 dark:text-white/90 text-base md:text-lg leading-relaxed max-w-xl mt-3">
                Your personal guide to the art of bonsai cultivation. Track, learn, and grow with expert guidance from <a href="https://www.amazon.com/stores/author/B0DM2F226F/about" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80">Ken Nakamura</a>, author of <a href="https://www.amazon.com/dp/1917554109" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80">Bonsai for Beginners</a>.
              </p>
              
              {!user ? (
                <div className="space-y-2 max-w-[280px] mt-6">
                  <form onSubmit={handleEmailAuth} className="flex flex-col gap-2">
                    <div className="flex w-full">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full min-w-0 px-4 py-3 rounded-l-full bg-stone-800/80 backdrop-blur-sm border border-white/20 text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-white/50"
                        required
                      />
                      <button
                        type="submit"
                        disabled={loading || checkingEmail}
                        className="px-6 py-3 bg-stone-800/80 backdrop-blur-sm border-l-0 border border-white/20 text-white font-medium rounded-r-full hover:bg-stone-700/80 transition-all disabled:opacity-50 flex items-center justify-center whitespace-nowrap"
                      >
                        {checkingEmail ? 'Checking...' : 'Go'}
                      </button>
                    </div>
                    {showPasswordField && (
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter password"
                          className="w-full px-6 py-3 rounded-full bg-stone-800/80 backdrop-blur-sm border border-white/20 text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-white/50 pr-12"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    )}
                  </form>

                  {showPasswordField && (
                    <button
                      onClick={() => setIsNewUser(!isNewUser)}
                      className="w-full text-center text-white/90 hover:text-white text-sm font-medium"
                    >
                      {isNewUser ? 'Already have an account? Sign in' : 'Need an account? Create one'}
                    </button>
                  )}

                  <div className="flex items-center gap-2 text-white/80">
                    <div className="flex-1 h-px bg-white/20"></div>
                    <span className="text-xs">OR</span>
                    <div className="flex-1 h-px bg-white/20"></div>
                  </div>

                  <button 
                    onClick={signInWithGoogle}
                    disabled={loading}
                    className={`w-full px-6 py-3 bg-stone-800/80 backdrop-blur-sm border border-white/20 text-white font-medium rounded-full hover:bg-stone-700/80 transition-all flex items-center justify-center gap-2 ${
                      showPasswordField ? 'opacity-50' : ''
                    }`}
                  >
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                    <span>Continue with Google</span>
                  </button>

                  {error && (
                    <p className="text-red-400 text-xs bg-red-500/10 backdrop-blur-sm rounded-lg px-3 py-1.5">
                      {error}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-3 mt-6">
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="btn-primary group relative overflow-hidden px-6 py-2 rounded-full"
                  >
                    <span className="relative z-10 flex items-center justify-center space-x-2">
                      <span>View Your Bonsai Garden</span>
                      <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                  </button>
                  

                  {trees.length === 0 && (
                    <button 
                      onClick={() => navigate('/dashboard', { state: { showAddForm: true } })}
                      className="btn border-2 border-white text-white hover:bg-white hover:text-bonsai-stone text-center group px-6 py-2 rounded-full"
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <span>Add Your First Tree</span>
                        <Plus className="w-5 h-5 transform group-hover:rotate-90 transition-transform" />
                      </span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-bonsai-stone dark:bg-stone-900 border-t border-white/10 py-4">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-5 gap-4 text-white/80">
            {FEATURES.map(feature => (
              <button 
                key={feature.id}
                onClick={() => navigate(feature.path)}
                className="flex flex-col items-center p-2 hover:bg-stone-700/80 dark:hover:bg-stone-800 rounded-lg transition-colors group"
                disabled={loading}
              >
                <feature.icon className="w-7 h-7 text-bonsai-green group-hover:scale-110 transition-transform" />
                <span className="text-center text-sm mt-1 line-clamp-1 dark:text-white/90">{feature.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}