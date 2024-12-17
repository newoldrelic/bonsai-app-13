import React, { useState, useEffect, useRef } from 'react';
import { Check, AlertCircle, Crown, Gift } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { CurrencySelector } from '../components/CurrencySelector';
import { useCurrencyStore, formatPrice } from '../utils/currency';
import { PRICING_CONFIG, PRICING_TIERS, HOBBY_FEATURES, PREMIUM_FEATURES } from '../config/pricing';
import { EmailCollectionModal } from '../components/EmailCollectionModal';

export function PricingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const { createCheckoutSession, getCurrentPlan, loading, error, clearError } = useSubscriptionStore();
  const { current: currency } = useCurrencyStore();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null);
  const [isGift, setIsGift] = useState(false);
  const giftSectionRef = useRef<HTMLDivElement>(null);

  // Map Stripe price IDs to our display plan IDs
  const currentDisplayPlan = (() => {
    const stripePlanId = getCurrentPlan();
    switch (stripePlanId) {
      case 'price_1QRxxTFwFmksLDAYCdCcGTRi':
        return 'premium-monthly';
      case 'price_1QRy3FFwFmksLDAYfqbgjBBV':
        return 'premium-annual';
      default:
        return 'hobby';
    }
  })();

  useEffect(() => {
    const state = location.state as { scrollToGifts?: boolean };
    if (state?.scrollToGifts && giftSectionRef.current) {
      giftSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      // Clear the state
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const handleSubscribe = async (priceId: string, isGiftPurchase = false) => {
    if (!user) {
      setSelectedPriceId(priceId);
      setIsGift(isGiftPurchase);
      setShowEmailModal(true);
      return;
    }
    await createCheckoutSession(priceId, user.email!, undefined);
  };

  const handleEmailSubmit = async ({ userEmail, giftEmail }: { userEmail: string; giftEmail?: string }) => {
    if (selectedPriceId) {
      await createCheckoutSession(selectedPriceId, userEmail, giftEmail);
    }
  };

  const getPlanLabel = (planId: string) => {
    if (planId === currentDisplayPlan) {
      return (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-bonsai-green text-white px-4 py-1 rounded-full text-sm font-medium">
          Current Plan
        </div>
      );
    }
    if (planId === 'premium-monthly') {
      return (
        <div className="absolute -top-3 right-4 bg-bonsai-terra text-white px-4 py-1 rounded-full text-sm font-medium whitespace-nowrap">
          Most Popular
        </div>
      );
    }
    if (planId === 'premium-annual') {
      return (
        <div className="absolute -top-3 right-4 bg-bonsai-terra text-white px-4 py-1 rounded-full text-sm font-medium whitespace-nowrap">
          Best Value
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-900 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-bonsai-bark dark:text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-300 max-w-2xl mx-auto mb-6">
            Select the perfect plan for your bonsai journey. Upgrade or downgrade anytime.
          </p>
          <CurrencySelector />
        </div>

        {error && (
          <div className="max-w-md mx-auto mb-8 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Hobby Plan */}
          <div className={`card p-8 relative ${currentDisplayPlan === 'hobby' ? 'ring-2 ring-bonsai-green' : ''}`}>
            {getPlanLabel('hobby')}
            <h3 className="text-2xl font-bold text-bonsai-bark dark:text-white mb-2">
              Hobby
            </h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-bonsai-bark dark:text-white">
                {formatPrice(0, currency)}
              </span>
            </div>
            <ul className="space-y-4 mb-8">
              {HOBBY_FEATURES.map((feature, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-bonsai-green flex-shrink-0 mt-0.5" />
                  <span className="text-stone-600 dark:text-stone-300 text-sm">
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>
            <button
              className="w-full py-3 px-4 rounded-lg font-medium bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 cursor-default"
            >
              Free Plan
            </button>
          </div>

          {/* Premium Monthly */}
          <div className={`card p-8 relative ${currentDisplayPlan === 'premium-monthly' ? 'ring-2 ring-bonsai-green' : ''}`}>
            {getPlanLabel('premium-monthly')}
            <h3 className="text-2xl font-bold text-bonsai-bark dark:text-white mb-2">
              Premium Monthly
            </h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-bonsai-bark dark:text-white">
                {formatPrice(PRICING_CONFIG.prices.monthly, currency)}
              </span>
              <span className="text-stone-600 dark:text-stone-300">/month</span>
            </div>
            <ul className="space-y-4 mb-8">
              {PREMIUM_FEATURES.map((feature, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-bonsai-green flex-shrink-0 mt-0.5" />
                  <span className="text-stone-600 dark:text-stone-300 text-sm flex items-center gap-2">
                    {feature.premium && <Crown className="w-4 h-4 text-bonsai-terra" />}
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSubscribe(PRICING_TIERS.PREMIUM_MONTHLY)}
              disabled={loading || currentDisplayPlan === 'premium-monthly'}
              className="w-full py-3 px-4 rounded-lg font-medium bg-bonsai-green text-white hover:bg-bonsai-moss transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Subscribe Monthly'}
            </button>
          </div>

          {/* Premium Annual */}
          <div className={`card p-8 relative ${currentDisplayPlan === 'premium-annual' ? 'ring-2 ring-bonsai-green' : ''}`}>
            {getPlanLabel('premium-annual')}
            <h3 className="text-2xl font-bold text-bonsai-bark dark:text-white mb-2">
              Premium Annual
            </h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-bonsai-bark dark:text-white">
                {formatPrice(PRICING_CONFIG.prices.annual, currency)}
              </span>
              <span className="text-stone-600 dark:text-stone-300">/year</span>
              <div className="text-sm text-bonsai-terra mt-1">
                Save {PRICING_CONFIG.prices.annualDiscount}%
              </div>
            </div>
            <ul className="space-y-4 mb-8">
              {PREMIUM_FEATURES.map((feature, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-bonsai-green flex-shrink-0 mt-0.5" />
                  <span className="text-stone-600 dark:text-stone-300 text-sm flex items-center gap-2">
                    {feature.premium && <Crown className="w-4 h-4 text-bonsai-terra" />}
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSubscribe(PRICING_TIERS.PREMIUM_ANNUAL)}
              disabled={loading || currentDisplayPlan === 'premium-annual'}
              className="w-full py-3 px-4 rounded-lg font-medium bg-bonsai-green text-white hover:bg-bonsai-moss transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Subscribe Annually'}
            </button>
          </div>
        </div>

        {/* Gift Options */}
        {PRICING_CONFIG.gifts.enabled && (
          <div className="mt-16" id="gift-options" ref={giftSectionRef}>
            <h2 className="text-2xl font-bold text-center text-bonsai-bark dark:text-white mb-8">
              Gift Premium Access
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {Object.entries(PRICING_CONFIG.gifts.options).map(([duration, option]) => (
                <div key={duration} className="card p-6 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
                  <div className="text-center mb-4">
                    <Gift className="w-8 h-8 text-bonsai-terra mx-auto mb-2" />
                    <h3 className="text-xl font-bold text-bonsai-bark dark:text-white">
                      {duration === 'twelveMonths' ? '12 Months' :
                       duration === 'sixMonths' ? '6 Months' :
                       duration === 'threeMonths' ? '3 Months' : '1 Month'}
                    </h3>
                    <div className="mt-2">
                      <span className="text-sm text-stone-500 line-through">
                        {formatPrice(option.originalPrice, currency)}
                      </span>
                      <span className="text-2xl font-bold text-bonsai-terra ml-2">
                        {formatPrice(option.price, currency)}
                      </span>
                    </div>
                    <div className="text-sm text-bonsai-terra mt-1">
                      Save {option.discount}%
                    </div>
                    <p className="text-sm text-stone-600 dark:text-stone-300 mt-2">
                      One-time payment
                    </p>
                  </div>
                  <button
                    onClick={() => handleSubscribe(PRICING_TIERS[`GIFT_${duration === 'twelveMonths' ? '12MONTHS' : 
                                                                        duration === 'sixMonths' ? '6MONTHS' :
                                                                        duration === 'threeMonths' ? '3MONTHS' : '1MONTH'}`], true)}
                    disabled={loading}
                    className="w-full py-2 px-4 rounded-lg font-medium bg-bonsai-terra text-white hover:bg-bonsai-clay transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Gift Now'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 text-center text-sm text-stone-500 dark:text-stone-400">
          <p>
            All plans include a 14-day money-back guarantee. Cancel anytime.
            <br />
            Questions? Contact our support team.
          </p>
        </div>

        {showEmailModal && (
          <EmailCollectionModal
            onClose={() => setShowEmailModal(false)}
            onSubmit={handleEmailSubmit}
            isGift={isGift}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}