import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types";

export interface CartItem {
  product: Product;
  quantity: number;
  license: "personal" | "commercial" | "extended";
  price: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  
  // Actions
  addItem: (product: Product, license?: "personal" | "commercial" | "extended") => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  
  // Computed values
  itemCount: () => number;
  subtotal: () => number;
  total: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, license = "personal") => {
        const items = get().items;
        const existingItem = items.find(
          (item) => item.product.id === product.id && item.license === license
        );

        if (existingItem) {
          // Increase quantity if item already exists
          set({
            items: items.map((item) =>
              item.product.id === product.id && item.license === license
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          // Add new item
          const price = calculatePrice(product.price, license);
          set({
            items: [
              ...items,
              {
                product,
                quantity: 1,
                license,
                price,
              },
            ],
          });
        }
        
        // Open cart when item is added
        set({ isOpen: true });
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.product.id !== productId),
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      toggleCart: () => {
        set({ isOpen: !get().isOpen });
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      itemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      subtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      total: () => {
        // For now, total = subtotal (no tax or shipping for digital products)
        return get().subtotal();
      },
    }),
    {
      name: "digistore1-cart",
      // Only persist items, not the isOpen state
      partialize: (state) => ({ items: state.items }),
    }
  )
);

// Helper function to calculate price based on license type
function calculatePrice(
  basePrice: number,
  license: "personal" | "commercial" | "extended"
): number {
  switch (license) {
    case "personal":
      return basePrice;
    case "commercial":
      return basePrice * 3; // 3x for commercial
    case "extended":
      return basePrice * 5; // 5x for extended
    default:
      return basePrice;
  }
}

