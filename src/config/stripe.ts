import { loadStripe } from '@stripe/stripe-js';
import { PRICING_CONFIG, HOBBY_FEATURES, PREMIUM_FEATURES, PRICING_TIERS } from './pricing';

export const stripePromise = typeof window !== 'undefined' 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '')
  : null;

// Pricing configuration
export const PRICING_PLANS = [
  {
    id: 'hobby',
    name: 'Hobby',
    price: 0,
    interval: 'month',
    stripePriceId: PRICING_TIERS.HOBBY,
    features: HOBBY_FEATURES
  },
  {
    id: 'premium-monthly',
    name: 'Premium Monthly',
    price: PRICING_CONFIG.prices.monthly,
    interval: 'month',
    stripePriceId: PRICING_TIERS.PREMIUM_MONTHLY,
    features: PREMIUM_FEATURES,
    recommended: true
  },
  {
    id: 'premium-annual',
    name: 'Premium Annual',
    price: PRICING_CONFIG.prices.annual,
    interval: 'year',
    stripePriceId: PRICING_TIERS.PREMIUM_ANNUAL,
    features: PREMIUM_FEATURES,
    annualDiscount: PRICING_CONFIG.prices.annualDiscount
  }
] as const;