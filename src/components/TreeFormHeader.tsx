// TreeFormHeader.tsx
// Manages the form header and progress indicators

import React from 'react';
import { X } from 'lucide-react';

interface TreeFormHeaderProps {
  currentStep: number;
  steps: Array<{ id: string; label: string }>;
  onClose: () => void;
}

export function TreeFormHeader({ currentStep, steps, onClose }: TreeFormHeaderProps) {
  return (
    <div className="flex-shrink-0 flex flex-col items-center gap-3 p-3 border-b border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 rounded-t-xl">
      <div className="w-full flex items-center justify-between">
        <h2 className="text-lg font-semibold text-bonsai-bark dark:text-white">Add New Bonsai</h2>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-stone-500 dark:text-stone-400" />
        </button>
      </div>
      
      <div className="flex items-center gap-2">
        {steps.map((step, index) => (
          <div 
            key={step.id}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentStep 
                ? 'bg-bonsai-green' 
                : 'bg-stone-200 dark:bg-stone-700'
            }`}
            title={step.label}
          />
        ))}
      </div>
    </div>
  );
}