// TreeFormNavigation.tsx
// Controls form navigation and submission

import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface TreeFormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  submitting: boolean;
}

export function TreeFormNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  submitting
}: TreeFormNavigationProps) {
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="flex-shrink-0 mt-auto p-3 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between">
      <button
        type="button"
        onClick={onPrevious}
        disabled={currentStep === 0}
        className="flex items-center space-x-2 px-3 py-1.5 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg transition-colors disabled:opacity-50"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Previous</span>
      </button>

      {isLastStep ? (
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center space-x-2 px-4 py-1.5 bg-bonsai-green text-white rounded-lg hover:bg-bonsai-moss transition-colors disabled:opacity-50"
        >
          <span>{submitting ? 'Adding Tree...' : 'Add Tree'}</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onNext();
          }}
          className="flex items-center space-x-2 px-3 py-1.5 text-bonsai-green hover:bg-bonsai-green/10 rounded-lg transition-colors"
        >
          <span>Next</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}