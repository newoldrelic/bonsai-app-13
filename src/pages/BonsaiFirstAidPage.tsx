import React from 'react';
import { Stethoscope, Crown, TreeDeciduous, ArrowRight, AlertCircle } from 'lucide-react';
import { ImageUpload } from '../components/ImageUpload';
import { useNavigate } from 'react-router-dom';
import { useSubscriptionStore } from '../store/subscriptionStore';

export function BonsaiFirstAidPage() {
  const navigate = useNavigate();
  const { getCurrentPlan } = useSubscriptionStore();
  const currentPlan = getCurrentPlan();
  const isSubscribed = currentPlan.id !== 'hobby';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Stethoscope className="w-8 h-8 text-bonsai-green" />
            <h1 className="text-3xl font-bold text-bonsai-bark dark:text-white">Dynamic Health Analytics</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Get instant expert analysis and personalized treatment recommendations for your bonsai.
          </p>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-bonsai-bark dark:text-white mb-4">
              Analyze Your Bonsai's Health
            </h2>
            <ImageUpload onImageCapture={() => {}} />
            
            {!isSubscribed && (
              <div className="mt-4 p-4 bg-bonsai-terra/10 rounded-lg flex items-start space-x-3">
                <Crown className="w-5 h-5 text-bonsai-terra flex-shrink-0 mt-1" />
                <div>
                  <p className="text-bonsai-terra font-medium">Premium Feature</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Upgrade to receive expert analysis and treatment recommendations.
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

          <div className="card p-6">
            <h2 className="text-xl font-semibold text-bonsai-bark dark:text-white mb-4">
              Common Health Issues
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-bonsai-green/10 rounded-lg">
                <h3 className="font-medium text-bonsai-bark dark:text-white mb-2">
                  Leaf Problems
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Yellowing, browning, or dropping leaves can indicate watering issues or nutrient deficiencies.
                </p>
              </div>
              <div className="p-4 bg-bonsai-green/10 rounded-lg">
                <h3 className="font-medium text-bonsai-bark dark:text-white mb-2">
                  Root Health
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Root rot, compacted soil, or poor drainage can affect your tree's overall health.
                </p>
              </div>
              <div className="p-4 bg-bonsai-green/10 rounded-lg">
                <h3 className="font-medium text-bonsai-bark dark:text-white mb-2">
                  Pest Infestations
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Spider mites, scale insects, or other pests can damage your bonsai's health.
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
                  Instant identification of health issues and diseases
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-bonsai-green flex-shrink-0 mt-1" />
                <p className="text-gray-600 dark:text-gray-300">
                  Detailed treatment recommendations from expert analysis
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-bonsai-green flex-shrink-0 mt-1" />
                <p className="text-gray-600 dark:text-gray-300">
                  Progress tracking and recovery monitoring
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