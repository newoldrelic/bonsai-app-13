import React from 'react';
import { Currency, useCurrencyStore, CURRENCY_SYMBOLS, CURRENCY_FLAGS } from '../utils/currency';

export function CurrencySelector() {
  const { current, setCurrency } = useCurrencyStore();
  const currencies: Currency[] = ['USD', 'CAD', 'GBP', 'EUR'];

  return (
    <div className="flex flex-col items-center space-y-2">
      <span className="text-sm text-stone-500 dark:text-stone-400">Select currency</span>
      <div className="flex items-center space-x-2">
        {currencies.map((currency) => (
          <button
            key={currency}
            onClick={() => setCurrency(currency)}
            className={`px-2 py-1 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
              current === currency
                ? 'bg-bonsai-green text-white'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            <img
              src={CURRENCY_FLAGS[currency]}
              alt={`${currency} flag`}
              className="w-4 h-3 object-cover rounded-sm"
              loading="lazy"
            />
            <span>{CURRENCY_SYMBOLS[currency]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}