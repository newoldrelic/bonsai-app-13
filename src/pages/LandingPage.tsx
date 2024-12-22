import React, { useState } from 'react';
import { ArrowRight, Plus, Gift, X, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useBonsaiStore } from '../store/bonsaiStore';

export function LandingPage() {
  const navigate = useNavigate();
  const { user, signInWithGoogle, signInWithEmail, createAccount, loading, error, checkEmailExists } = useAuthStore();
  const { trees } = useBonsaiStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [showGiftSticker, setShowGiftSticker] = useState(false); // not showing the 'Perfect Gift' sticker until next xmas
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
    <div className="h-[calc(100vh-168px)] flex flex-col bg-stone-100 dark:bg-stone-900">
      <div className="relative flex-1">
        <img 
          src="bonsai-background.jpg"
          alt="Beautiful bonsai tree"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent dark:from-black/90 dark:via-black/70 dark:to-black/30">
          <div className="h-full flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl">
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

                <h1 className="text-white dark:text-white">
                  <span className="block text-5xl md:text-7xl lg:text-8xl font-bold leading-none">BONSAI</span>
                  <span className="block text-2xl md:text-4xl lg:text-5xl font-medium mt-1">FOR BEGINNERS</span>
                </h1>
                
                <p className="text-white/90 dark:text-white/90 text-base md:text-lg leading-relaxed max-w-xl mt-3">
                  Your personal guide to the art of bonsai cultivation. Track, learn, and grow with expert guidance from 
                  <a href="https://www.amazon.com/stores/author/B0DM2F226F/about" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80"> Ken Nakamura</a>, 
                  author of <a href="https://www.amazon.com/dp/1917554109" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80">Bonsai for Beginners</a>.
                </p>
                {!user ? (
                  <div className="space-y-2 max-w-[320px] mt-6">
                    <form onSubmit={handleEmailAuth} className="flex flex-col gap-2">
                      <div className="flex w-full">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Begin with Only Your Email"
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
                        <span>Your Bonsai Garden</span>
                        <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                    </button>

                    <br/>
                      <button 
                        onClick={() => navigate('/dashboard', { state: { showAddForm: true } })}
                        className="btn border-2 border-white text-white hover:bg-white hover:text-bonsai-stone text-center group px-6 py-2 rounded-full"
                      >
                        <span className="flex items-center justify-center space-x-2">
                          <span>Add Bonsai</span>
                          <Plus className="w-5 h-5 transform group-hover:rotate-90 transition-transform" />
                        </span>
                      </button>
                    
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}