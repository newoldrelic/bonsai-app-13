import React, { useState } from 'react';
import { X, Mail, Gift } from 'lucide-react';

interface EmailCollectionModalProps {
  onClose: () => void;
  onSubmit: (emails: { userEmail: string; giftEmail?: string }) => void;
  isGift?: boolean;
  loading?: boolean;
}

export function EmailCollectionModal({ onClose, onSubmit, isGift = false, loading = false }: EmailCollectionModalProps) {
  const [userEmail, setUserEmail] = useState('');
  const [giftEmail, setGiftEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!userEmail) {
      setError('Please enter your email address');
      return;
    }

    if (isGift && giftEmail && giftEmail === userEmail) {
      setError('Gift recipient email must be different from your email');
      return;
    }

    onSubmit({ userEmail, giftEmail: giftEmail || undefined });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-stone-800 rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-700">
          <h3 className="text-lg font-semibold text-bonsai-bark dark:text-white">
            {isGift ? 'Gift Premium Access' : 'Continue to Subscribe'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="userEmail" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
              Your Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="email"
                id="userEmail"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-bonsai-green focus:border-bonsai-green"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {isGift && (
            <div>
              <label htmlFor="giftEmail" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                Recipient's Email Address (Optional)
              </label>
              <div className="relative">
                <Gift className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="email"
                  id="giftEmail"
                  value={giftEmail}
                  onChange={(e) => setGiftEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-bonsai-green focus:border-bonsai-green"
                  placeholder="Enter recipient's email (optional)"
                />
              </div>
              <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                You can send the gift code to the recipient later if you prefer.
              </p>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-bonsai-green text-white rounded-lg hover:bg-bonsai-moss transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>Continue</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}