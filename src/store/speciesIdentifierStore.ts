import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SpeciesIdentifierState {
  usageCount: number;
  incrementUsage: () => void;
  resetUsage: () => void;
}

const FREE_TIER_LIMIT = 3;

export const useSpeciesIdentifierStore = create<SpeciesIdentifierState>()(
  persist(
    (set) => ({
      usageCount: 0,
      incrementUsage: () => set((state) => ({ usageCount: state.usageCount + 1 })),
      resetUsage: () => set({ usageCount: 0 }),
    }),
    {
      name: 'species-identifier-usage'
    }
  )
);

export const getFreeUsagesRemaining = () => {
  const { usageCount } = useSpeciesIdentifierStore.getState();
  return Math.max(0, FREE_TIER_LIMIT - usageCount);
};

export const hasRemainingUsages = () => {
  return getFreeUsagesRemaining() > 0;
};