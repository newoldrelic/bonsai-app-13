import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  icon?: React.ReactNode;
}

export function Toggle({ checked, onChange, label, description, icon }: ToggleProps) {
  return (
    <div className="flex items-start space-x-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-bonsai-green focus:ring-offset-2 ${
          checked ? 'bg-bonsai-green' : 'bg-stone-200 dark:bg-stone-700'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
      {(label || description) && (
        <div className="flex-1 min-w-0">
          {label && (
            <div className="flex items-center space-x-2">
              {icon}
              <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
                {label}
              </span>
            </div>
          )}
          {description && (
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}