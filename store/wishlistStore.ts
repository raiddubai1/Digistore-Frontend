import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types";

export interface WishlistItem {
  product: Product;
  addedAt: Date;
}

interface WishlistStore {
  items: WishlistItem[];
  
  // Actions
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
  moveToCart: (productId: string, addToCart: (product: Product) => void) => void;
  
  // Computed values
  itemCount: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const items = get().items;
        const exists = items.find((item) => item.product.id === product.id);

        if (!exists) {
          set({
            items: [
              ...items,
              {
                product,
                addedAt: new Date(),
              },
            ],
          });
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.product.id !== productId),
        });
      },

      toggleItem: (product) => {
        const items = get().items;
        const exists = items.find((item) => item.product.id === product.id);

        if (exists) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },

      clearWishlist: () => {
        set({ items: [] });
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item.product.id === productId);
      },

      moveToCart: (productId, addToCart) => {
        const item = get().items.find((item) => item.product.id === productId);
        if (item) {
          addToCart(item.product);
          get().removeItem(productId);
        }
      },

      itemCount: () => {
        return get().items.length;
      },
    }),
    {
      name: "digistore1-wishlist",
      // Persist all items
      partialize: (state) => ({ items: state.items }),
    }
  )
);

