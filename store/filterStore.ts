"use client";

import { create } from "zustand";

interface FilterState {
  isFilterOpen: boolean;
  openFilter: () => void;
  closeFilter: () => void;
  toggleFilter: () => void;
  // Filter badge count
  filterCount: number;
  setFilterCount: (count: number) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  isFilterOpen: false,
  openFilter: () => set({ isFilterOpen: true }),
  closeFilter: () => set({ isFilterOpen: false }),
  toggleFilter: () => set((state) => ({ isFilterOpen: !state.isFilterOpen })),
  filterCount: 0,
  setFilterCount: (count) => set({ filterCount: count }),
}));

