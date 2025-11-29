import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ReferralStats {
  totalReferrals: number;
  pendingEarnings: number;
  paidEarnings: number;
  clickCount: number;
  conversionRate: number;
}

interface Referral {
  id: string;
  referredEmail: string;
  status: 'pending' | 'completed' | 'cancelled';
  earnings: number;
  createdAt: string;
  completedAt?: string;
}

interface ReferralState {
  referralCode: string | null;
  referralLink: string;
  stats: ReferralStats;
  referrals: Referral[];
  appliedReferralCode: string | null;
  
  // Actions
  setReferralCode: (code: string) => void;
  applyReferralCode: (code: string) => void;
  clearAppliedCode: () => void;
  updateStats: (stats: Partial<ReferralStats>) => void;
  addReferral: (referral: Referral) => void;
}

// Generate a unique referral code
const generateReferralCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'REF-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const useReferralStore = create<ReferralState>()(
  persist(
    (set, get) => ({
      referralCode: null,
      referralLink: '',
      stats: {
        totalReferrals: 0,
        pendingEarnings: 0,
        paidEarnings: 0,
        clickCount: 0,
        conversionRate: 0,
      },
      referrals: [],
      appliedReferralCode: null,

      setReferralCode: (code) => {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        set({
          referralCode: code,
          referralLink: `${baseUrl}?ref=${code}`,
        });
      },

      applyReferralCode: (code) => {
        set({ appliedReferralCode: code });
      },

      clearAppliedCode: () => {
        set({ appliedReferralCode: null });
      },

      updateStats: (newStats) => {
        set((state) => ({
          stats: { ...state.stats, ...newStats },
        }));
      },

      addReferral: (referral) => {
        set((state) => ({
          referrals: [referral, ...state.referrals],
          stats: {
            ...state.stats,
            totalReferrals: state.stats.totalReferrals + 1,
          },
        }));
      },
    }),
    {
      name: 'digistore1-referral',
      partialize: (state) => ({
        appliedReferralCode: state.appliedReferralCode,
      }),
    }
  )
);

// Commission rate (10%)
export const REFERRAL_COMMISSION_RATE = 0.10;

// Minimum payout threshold
export const MINIMUM_PAYOUT = 50;

