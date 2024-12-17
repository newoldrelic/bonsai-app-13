import React from 'react';
import { Book, Crown, TreeDeciduous, ArrowRight, Cloud, MapPin, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSubscriptionStore } from '../store/subscriptionStore';

export function CareGuidePage() {
  const navigate = useNavigate();
  const { getCurrentPlan } = useSubscriptionStore();
  const currentPlan = getCurrentPlan();
  const isSubscribed = currentPlan.id !== 'hobby';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Book className="w-8 h-8 text-bonsai-green" />
            <h1 className="text-3xl font-bold text-bonsai-bark dark:text-white">Tailored Care Guide</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Expert care instructions customized to your tree's species, location, and current conditions.
          </p>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-bonsai-bark dark:text-white mb-4">
              Your Personalized Care Guide
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 mb-4">
                <input
                  type="text"
                  placeholder="Enter your location"
                  className="flex-1 px-4 py-2 border border-stone-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-bonsai-green focus:border-bonsai-green bg-white dark:bg-stone-900"
                />
                <button 
                  className="btn-primary px-4 py-2"
                  onClick={() => !isSubscribed && navigate('/pricing')}
                >
                  Get Guide
                </button>
              </div>
              
              {!isSubscribed && (
                <div className="p-4 bg-bonsai-terra/10 rounded-lg flex items-start space-x-3">
                  <Crown className="w-5 h-5 text-bonsai-terra flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-bonsai-terra font-medium">Premium Feature</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Upgrade to receive personalized care guides based on your location and conditions.
                    </p>
                    <button
                      onClick={() => navigate('/pricing')}
                      className="mt-3 text-bonsai-terra hover:text-bonsai-clay transition-colors text-sm font-medium"
                    >
                      View Pricing
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-semibold text-bonsai-bark dark:text-white mb-4">
              Seasonal Care Tips
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-bonsai-green/10 rounded-lg">
                <h3 className="font-medium text-bonsai-bark dark:text-white mb-2">
                  Spring Care
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Essential tips for the growing season, including repotting and fertilization schedules.
                </p>
              </div>
              <div className="p-4 bg-bonsai-green/10 rounded-lg">
                <h3 className="font-medium text-bonsai-bark dark:text-white mb-2">
                  Summer Protection
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Guidance on watering, sun protection, and pest prevention during hot months.
                </p>
              </div>
              <div className="p-4 bg-bonsai-green/10 rounded-lg">
                <h3 className="font-medium text-bonsai-bark dark:text-white mb-2">
                  Winter Preparation
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Winterization techniques and protection from frost damage.
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-semibold text-bonsai-bark dark:text-white mb-4 flex items-center space-x-2">
              <Crown className="w-6 h-6 text-bonsai-terra" />
              <span>Premium Features</span>
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-bonsai-green flex-shrink-0 mt-1" />
                <p className="text-gray-600 dark:text-gray-300">
                  Location-aware care recommendations adapted to your climate
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-bonsai-green flex-shrink-0 mt-1" />
                <p className="text-gray-600 dark:text-gray-300">
                  Weather-based adjustments for optimal care timing
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-bonsai-green flex-shrink-0 mt-1" />
                <p className="text-gray-600 dark:text-gray-300">
                  Species-specific guidance for perfect growth conditions
                </p>
              </div>
              
              {!isSubscribed && (
                <button
                  onClick={() => navigate('/pricing')}
                  className="w-full mt-4 btn-primary group relative overflow-hidden px-6 py-3 rounded-full"
                >
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    <span>Upgrade to Access</span>
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-bonsai-terra to-bonsai-clay transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}