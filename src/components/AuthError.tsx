import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export function AuthError() {
  const { error, clearError } = useAuthStore();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  if (!error) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2">
      <span>{error}</span>
      <button
        onClick={clearError}
        className="p-1 hover:bg-red-200 rounded-full transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}