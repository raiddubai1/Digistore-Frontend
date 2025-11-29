import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types";

interface CompareStore {
  items: Product[];
  maxItems: number;
  
  // Actions
  addItem: (product: Product) => boolean;
  removeItem: (productId: string) => void;
  clearAll: () => void;
  isInCompare: (productId: string) => boolean;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      items: [],
      maxItems: 4,

      addItem: (product: Product) => {
        const items = get().items;
        
        // Check if already in compare
        if (items.some(item => item.id === product.id)) {
          return false;
        }
        
        // Check max limit
        if (items.length >= get().maxItems) {
          return false;
        }
        
        set({ items: [...items, product] });
        return true;
      },

      removeItem: (productId: string) => {
        set({
          items: get().items.filter(item => item.id !== productId),
        });
      },

      clearAll: () => {
        set({ items: [] });
      },

      isInCompare: (productId: string) => {
        return get().items.some(item => item.id === productId);
      },
    }),
    {
      name: "digistore1-compare",
    }
  )
);

