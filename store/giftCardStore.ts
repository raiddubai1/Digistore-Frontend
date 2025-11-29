import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GiftCard {
  id: string;
  code: string;
  amount: number;
  balance: number;
  expiresAt: string;
  purchasedAt: string;
  recipientEmail?: string;
  recipientName?: string;
  message?: string;
  status: 'active' | 'used' | 'expired';
}

interface GiftCardState {
  purchasedCards: GiftCard[];
  receivedCards: GiftCard[];
  appliedGiftCard: { code: string; balance: number } | null;
  
  // Actions
  addPurchasedCard: (card: GiftCard) => void;
  addReceivedCard: (card: GiftCard) => void;
  applyGiftCard: (code: string, balance: number) => void;
  clearAppliedCard: () => void;
  useBalance: (amount: number) => number; // Returns remaining amount to pay
}

// Gift card denominations
export const GIFT_CARD_AMOUNTS = [10, 25, 50, 100, 200];

// Generate a gift card code
export const generateGiftCardCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 16; i++) {
    if (i > 0 && i % 4 === 0) code += '-';
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const useGiftCardStore = create<GiftCardState>()(
  persist(
    (set, get) => ({
      purchasedCards: [],
      receivedCards: [],
      appliedGiftCard: null,

      addPurchasedCard: (card) => {
        set((state) => ({
          purchasedCards: [card, ...state.purchasedCards],
        }));
      },

      addReceivedCard: (card) => {
        set((state) => ({
          receivedCards: [card, ...state.receivedCards],
        }));
      },

      applyGiftCard: (code, balance) => {
        set({ appliedGiftCard: { code, balance } });
      },

      clearAppliedCard: () => {
        set({ appliedGiftCard: null });
      },

      useBalance: (amount) => {
        const { appliedGiftCard } = get();
        if (!appliedGiftCard) return amount;

        const usedAmount = Math.min(appliedGiftCard.balance, amount);
        const remainingBalance = appliedGiftCard.balance - usedAmount;
        const remainingToPay = amount - usedAmount;

        if (remainingBalance <= 0) {
          set({ appliedGiftCard: null });
        } else {
          set({ appliedGiftCard: { ...appliedGiftCard, balance: remainingBalance } });
        }

        return remainingToPay;
      },
    }),
    {
      name: 'digistore1-giftcards',
    }
  )
);

