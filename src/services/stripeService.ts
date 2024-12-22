import { PRICING_TIERS } from '../config/pricing';

export async function createCheckoutSession(
  priceId: string, 
  userEmail: string,
  giftEmail?: string
): Promise<string> {
  const response = await fetch('/.netlify/functions/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      priceId,
      userEmail,
      giftEmail,
      returnUrl: `${window.location.origin}/success`
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create checkout session');
  }

  const data = await response.json();
  
  if (!data.url) {
    throw new Error('No checkout URL received');
  }

  return data.url;
}

export function getPlanDetails(planId: string) {
  return PRICING_TIERS[planId as keyof typeof PRICING_TIERS] || PRICING_TIERS.HOBBY;
}