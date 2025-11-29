import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types";

export interface CartItem {
  product: Product;
  quantity: number;
  license: "personal" | "commercial" | "extended";
  price: number;
}

interface CouponCode {
  code: string;
  discount: number; // percentage
  type: 'percentage' | 'fixed';
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  coupon: CouponCode | null;

  // Actions
  addItem: (product: Product, license?: "personal" | "commercial" | "extended") => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Computed values
  itemCount: () => number;
  subtotal: () => number;
  discount: () => number;
  total: () => number;
}

// Demo coupon codes
const validCoupons: Record<string, CouponCode> = {
  'SAVE10': { code: 'SAVE10', discount: 10, type: 'percentage' },
  'SAVE20': { code: 'SAVE20', discount: 20, type: 'percentage' },
  'WELCOME': { code: 'WELCOME', discount: 15, type: 'percentage' },
  'FLAT5': { code: 'FLAT5', discount: 5, type: 'fixed' },
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      coupon: null,

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

      applyCoupon: (code: string) => {
        const upperCode = code.toUpperCase().trim();
        const coupon = validCoupons[upperCode];

        if (!coupon) {
          return { success: false, message: 'Invalid coupon code' };
        }

        if (get().coupon?.code === upperCode) {
          return { success: false, message: 'Coupon already applied' };
        }

        set({ coupon });
        return { success: true, message: `Coupon "${upperCode}" applied! ${coupon.type === 'percentage' ? `${coupon.discount}% off` : `$${coupon.discount} off`}` };
      },

      removeCoupon: () => {
        set({ coupon: null });
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

      discount: () => {
        const coupon = get().coupon;
        if (!coupon) return 0;

        const subtotal = get().subtotal();
        if (coupon.type === 'percentage') {
          return (subtotal * coupon.discount) / 100;
        }
        return Math.min(coupon.discount, subtotal);
      },

      total: () => {
        return get().subtotal() - get().discount();
      },
    }),
    {
      name: "digistore1-cart",
      // Persist items and coupon
      partialize: (state) => ({ items: state.items, coupon: state.coupon }),
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

