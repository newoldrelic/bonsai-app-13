import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

export function ThemeToggle() {
  const { isDark, toggle } = useThemeStore();

  return (
    <button
      onClick={toggle}
      className="p-2 hover:bg-bonsai-bark/20 dark:hover:bg-stone-800 rounded-full transition-colors"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-white" />
      ) : (
        <Moon className="w-5 h-5 text-white" />
      )}
    </button>
  );
}