import { IconType } from 'lucide-react';

export interface Feature {
  text: string;
  icon: IconType;
  premium?: boolean;
}

export interface PricingConfig {
  enabled: boolean;
  prices: {
    monthly: number;
    annual: number;
    annualDiscount: number;
  };
  gifts: {
    enabled: boolean;
    options: {
      oneMonth: {
        price: number;
        originalPrice: number;
        discount: number;
      };
      threeMonths: {
        price: number;
        originalPrice: number;
        discount: number;
      };
      sixMonths: {
        price: number;
        originalPrice: number;
        discount: number;
      };
      twelveMonths: {
        price: number;
        originalPrice: number;
        discount: number;
      };
    };
  };
}

// Use price IDs instead of product IDs
export const PRICING_TIERS = {
  HOBBY: 'price_hobby',
  PREMIUM_MONTHLY: 'price_1QRxxTFwFmksLDAYCdCcGTRi',
  PREMIUM_ANNUAL: 'price_1QRy3FFwFmksLDAYfqbgjBBV',
  GIFT_1MONTH: 'price_1QSHugFwFmksLDAYjQuAmXol',
  GIFT_3MONTHS: 'price_1QSHxDFwFmksLDAYPsH9C0PO',
  GIFT_6MONTHS: 'price_1QSHzDFwFmksLDAYvJwVmAlO',
  GIFT_12MONTHS: 'price_1QSI1FFwFmksLDAYZHxQar3y'
} as const;

export const PRICING_CONFIG: PricingConfig = {
  enabled: true,
  prices: {
    monthly: 5.99,
    annual: 59.99,
    annualDiscount: 20
  },
  gifts: {
    enabled: true,
    options: {
      oneMonth: {
        price: 9.99,
        originalPrice: 14.99,
        discount: 33
      },
      threeMonths: {
        price: 24.99,
        originalPrice: 39.99,
        discount: 38
      },
      sixMonths: {
        price: 44.99,
        originalPrice: 74.99,
        discount: 40
      },
      twelveMonths: {
        price: 79.99,
        originalPrice: 139.99,
        discount: 43
      }
    }
  }
};

export const HOBBY_FEATURES: Feature[] = [
  { text: 'Store up to 3 bonsai trees', icon: 'TreeDeciduous' as unknown as IconType },
  { text: '3 free species identifications', icon: 'Camera' as unknown as IconType },
  { text: 'Style guide access', icon: 'TreeDeciduous' as unknown as IconType },
  { text: 'Basic maintenance tracking', icon: 'Bell' as unknown as IconType },
  { text: 'Care reminders', icon: 'Bell' as unknown as IconType }
];

export const PREMIUM_FEATURES: Feature[] = [
  { text: 'Everything in Hobby, plus:', icon: 'Crown' as unknown as IconType },
  { text: 'Store unlimited bonsai trees', icon: 'TreeDeciduous' as unknown as IconType, premium: true },
  { text: 'Unlimited species identification', icon: 'Camera' as unknown as IconType, premium: true },
  { text: 'Advanced health diagnosis', icon: 'Camera' as unknown as IconType, premium: true },
  { text: 'Expert coaching access', icon: 'Stethoscope' as unknown as IconType, premium: true },
  { text: 'Priority support', icon: 'Bot' as unknown as IconType, premium: true }
];