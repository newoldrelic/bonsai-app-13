import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Crown, Check, ArrowRight, Leaf, Stethoscope, Book, MessageCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useSubscriptionStore } from '../store/subscriptionStore';

export function SubscriptionSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();
  const { getCurrentPlan } = useSubscriptionStore();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId || !user) {
      navigate('/');
    }
  }, [sessionId, user, navigate]);

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white dark:bg-stone-800 rounded-xl shadow-xl p-8">
            <div className="w-16 h-16 bg-bonsai-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Crown className="w-8 h-8 text-bonsai-green" />
            </div>
            
            <h1 className="text-3xl font-bold text-bonsai-bark dark:text-white mb-4">
              Welcome to Premium!
            </h1>
            
            <p className="text-lg text-stone-600 dark:text-stone-300 mb-8">
              Thank you for subscribing. Your premium features are now active.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3 text-stone-600 dark:text-stone-300">
                <Check className="w-5 h-5 text-bonsai-green flex-shrink-0" />
                <span>Unlimited bonsai trees</span>
              </div>
              <div className="flex items-center space-x-3 text-stone-600 dark:text-stone-300">
                <Check className="w-5 h-5 text-bonsai-green flex-shrink-0" />
                <span>Advanced health analytics</span>
              </div>
              <div className="flex items-center space-x-3 text-stone-600 dark:text-stone-300">
                <Check className="w-5 h-5 text-bonsai-green flex-shrink-0" />
                <span>Expert coaching access</span>
              </div>
            </div>

            <div className="grid gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-bonsai-green text-white px-6 py-3 rounded-lg hover:bg-bonsai-moss transition-colors flex items-center justify-center space-x-2 group"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => navigate('/species-identifier')}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors"
                >
                  <Leaf className="w-5 h-5" />
                  <span>Species Identifier</span>
                </button>

                <button
                  onClick={() => navigate('/health-analytics')}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors"
                >
                  <Stethoscope className="w-5 h-5" />
                  <span>Health Analytics</span>
                </button>

                <button
                  onClick={() => navigate('/care-guide')}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors"
                >
                  <Book className="w-5 h-5" />
                  <span>Care Guide</span>
                </button>

                <button
                  onClick={() => navigate('/expert-coaching')}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Expert Coaching</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}