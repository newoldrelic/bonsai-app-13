import type { HandlerEvent, HandlerResponse } from '@netlify/functions';
import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const NODE_ENV = process.env.NODE_ENV || 'production';

const stripe = new Stripe(STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'
});

// Helper to determine if a price ID is for a gift
const isGiftPrice = (priceId: string): boolean => {
  return priceId.startsWith('price_1QSH') || priceId.startsWith('price_1QSI');
};

export const handler = async (event: HandlerEvent): Promise<HandlerResponse> => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  if (!STRIPE_SECRET_KEY) {
    console.error('Missing STRIPE_SECRET_KEY environment variable');
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Payment service is not properly configured' })
    };
  }

  try {
    if (!event.body) {
      throw new Error('Missing request body');
    }

    const { priceId, userEmail, giftEmail, returnUrl } = JSON.parse(event.body);
    console.info('Creating checkout session:', { priceId, userEmail, giftEmail });

    if (!priceId || !userEmail || !returnUrl) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Missing required parameters',
          details: {
            priceId: !priceId,
            userEmail: !userEmail,
            returnUrl: !returnUrl
          }
        })
      };
    }

    // Verify the price ID exists in Stripe
    try {
      await stripe.prices.retrieve(priceId);
    } catch (error) {
      console.error('Invalid price ID:', error);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Invalid price ID',
          details: error instanceof Error ? error.message : 'Unknown error'
        })
      };
    }

    const isGift = isGiftPrice(priceId);

    const session = await stripe.checkout.sessions.create({
      mode: isGift ? 'payment' : 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: userEmail,
      success_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${returnUrl}/pricing`,
      allow_promotion_codes: true,
      metadata: {
        userEmail,
        giftEmail: giftEmail || '',
        isGift: isGift ? 'true' : 'false'
      }
    });

    if (!session.url) {
      throw new Error('Failed to generate checkout URL');
    }

    console.info('Checkout session created successfully:', { sessionId: session.id });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ url: session.url })
    };

  } catch (error: unknown) {
    console.error('Checkout session error:', error);
    
    let statusCode = 500;
    let errorMessage = 'Failed to create checkout session';

    if (error instanceof Error) {
      errorMessage = error.message;
      if ((error as any).statusCode) {
        statusCode = (error as any).statusCode;
      }
    }
    
    return {
      statusCode,
      headers,
      body: JSON.stringify({ 
        error: errorMessage,
        details: NODE_ENV === 'development' ? error : undefined
      })
    };
  }
};