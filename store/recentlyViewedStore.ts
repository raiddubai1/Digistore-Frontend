import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types";

export interface RecentlyViewedItem {
  product: Product;
  viewedAt: Date;
}

interface RecentlyViewedStore {
  items: RecentlyViewedItem[];
  maxItems: number;
  
  // Actions
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearAll: () => void;
  
  // Computed values
  getRecentItems: (limit?: number) => RecentlyViewedItem[];
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set, get) => ({
      items: [],
      maxItems: 20, // Keep last 20 viewed products

      addItem: (product) => {
        const items = get().items;
        const maxItems = get().maxItems;
        
        // Remove if already exists (we'll add it again with new timestamp)
        const filteredItems = items.filter(
          (item) => item.product.id !== product.id
        );

        // Add to beginning of array with current timestamp
        const newItems = [
          {
            product,
            viewedAt: new Date(),
          },
          ...filteredItems,
        ].slice(0, maxItems); // Keep only maxItems

        set({ items: newItems });
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.product.id !== productId),
        });
      },

      clearAll: () => {
        set({ items: [] });
      },

      getRecentItems: (limit = 10) => {
        return get().items.slice(0, limit);
      },
    }),
    {
      name: "digistore1-recently-viewed",
      partialize: (state) => ({ items: state.items }),
    }
  )
);

