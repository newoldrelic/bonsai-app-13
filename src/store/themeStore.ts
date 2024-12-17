import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getCookieConsent } from '../components/CookieConsent';

interface ThemeStore {
  isDark: boolean;
  toggle: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      isDark: true, // Default to dark mode
      toggle: () => set((state) => {
        const newIsDark = !state.isDark;
        if (newIsDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { isDark: newIsDark };
      }),
    }),
    {
      name: 'theme-storage',
      skipIfCookiesDisabled: true,
      beforeHydration: () => {
        return getCookieConsent();
      },
      onRehydrateStorage: () => (state) => {
        if (getCookieConsent() && state?.isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
    }
  )
);