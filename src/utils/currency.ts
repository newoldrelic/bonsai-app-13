import { create } from 'zustand';

export type Currency = 'USD' | 'CAD' | 'GBP' | 'EUR';

interface CurrencyState {
  current: Currency;
  setCurrency: (currency: Currency) => void;
}

export const useCurrencyStore = create<CurrencyState>((set) => ({
  current: 'USD',
  setCurrency: (currency) => set({ current: currency })
}));

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  CAD: '$',
  GBP: '£',
  EUR: '€'
};

export const CURRENCY_FLAGS: Record<Currency, string> = {
  USD: 'https://flagcdn.com/w20/us.png',
  CAD: 'https://flagcdn.com/w20/ca.png',
  GBP: 'https://flagcdn.com/w20/gb.png',
  EUR: 'https://flagcdn.com/w20/eu.png'
};

export const EXCHANGE_RATES: Record<Currency, number> = {
  USD: 1,
  CAD: 1.35,
  GBP: 0.79,
  EUR: 0.92
};

function roundToNearestNinetyNine(price: number): number {
  // Special case for free tier
  if (price === 0) return 0;
  
  // Round up to the next whole number and subtract 0.01
  return Math.ceil(price) - 0.01;
}

export function formatPrice(price: number, currency: Currency): string {
  // Special case for free tier
  if (price === 0) return 'Free';
  
  // Convert the price to the target currency
  const convertedPrice = price * EXCHANGE_RATES[currency];
  
  // Round to nearest .99
  const roundedPrice = roundToNearestNinetyNine(convertedPrice);
  
  // Get the currency symbol
  const symbol = CURRENCY_SYMBOLS[currency];
  
  // Format with 2 decimal places
  return `${symbol}${roundedPrice.toFixed(2)}`;
}