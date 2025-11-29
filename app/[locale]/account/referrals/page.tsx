'use client';

import { useState, useEffect } from 'react';
import { 
  Users, DollarSign, Link2, Copy, CheckCircle, 
  TrendingUp, Clock, ArrowRight, Share2, ChevronLeft
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useReferralStore, REFERRAL_COMMISSION_RATE, MINIMUM_PAYOUT } from '@/store/referralStore';

export default function ReferralsPage() {
  const { referralCode, referralLink, stats, referrals, setReferralCode } = useReferralStore();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Generate referral code if not exists
    if (!referralCode) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = 'REF-';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setReferralCode(code);
    }
  }, [referralCode, setReferralCode]);

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Referral link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Digistore1',
          text: 'Check out Digistore1 - Amazing digital products!',
          url: referralLink,
        });
      } catch (err) {
        copyLink();
      }
    } else {
      copyLink();
    }
  };

  // Demo data for display
  const demoStats = {
    totalReferrals: stats.totalReferrals || 12,
    pendingEarnings: stats.pendingEarnings || 45.50,
    paidEarnings: stats.paidEarnings || 150.00,
    clickCount: stats.clickCount || 89,
    conversionRate: stats.conversionRate || 13.5,
  };

  const demoReferrals = referrals.length > 0 ? referrals : [
    { id: '1', referredEmail: 'j***@gmail.com', status: 'completed' as const, earnings: 15.00, createdAt: '2024-03-10' },
    { id: '2', referredEmail: 'm***@yahoo.com', status: 'pending' as const, earnings: 8.50, createdAt: '2024-03-15' },
    { id: '3', referredEmail: 's***@outlook.com', status: 'completed' as const, earnings: 22.00, createdAt: '2024-03-08' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 lg:border-none">
        <div className="max-w-4xl mx-auto px-4 py-4 lg:py-8">
          <div className="flex items-center gap-3 lg:hidden">
            <Link href="/account" className="p-1">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-lg font-bold">Referral Program</h1>
          </div>
          <h1 className="hidden lg:block text-3xl font-bold">Referral Program</h1>
          <p className="text-gray-600 mt-2 hidden lg:block">
            Earn {REFERRAL_COMMISSION_RATE * 100}% commission on every purchase from your referrals
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Referral Link Card */}
        <div className="bg-gradient-to-br from-black to-gray-800 rounded-2xl p-6 text-white">
          <h2 className="text-lg font-semibold mb-1">Your Referral Link</h2>
          <p className="text-gray-300 text-sm mb-4">
            Share this link and earn {REFERRAL_COMMISSION_RATE * 100}% on every sale!
          </p>
          
          <div className="flex gap-2">
            <div className="flex-1 bg-white/10 rounded-xl px-4 py-3 flex items-center">
              <Link2 className="w-5 h-5 text-gray-300 mr-2 flex-shrink-0" />
              <span className="truncate text-sm">{referralLink || 'Loading...'}</span>
            </div>
            <button
              onClick={copyLink}
              className="px-4 py-3 bg-[#ff6f61] rounded-xl hover:bg-[#e55a4d] transition-colors flex items-center gap-2"
            >
              {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button
              onClick={shareLink}
              className="px-4 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-sm">
            <span className="text-gray-300">Your Code:</span>
            <span className="font-mono font-bold text-[#ff6f61]">{referralCode || '...'}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <Users className="w-4 h-4" />
              <span className="text-xs">Total Referrals</span>
            </div>
            <p className="text-2xl font-bold">{demoStats.totalReferrals}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs">Click Count</span>
            </div>
            <p className="text-2xl font-bold">{demoStats.clickCount}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-yellow-500 mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-xs text-gray-500">Pending</span>
            </div>
            <p className="text-2xl font-bold">${demoStats.pendingEarnings.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-green-500 mb-2">
              <DollarSign className="w-4 h-4" />
              <span className="text-xs text-gray-500">Total Earned</span>
            </div>
            <p className="text-2xl font-bold">${demoStats.paidEarnings.toFixed(2)}</p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold mb-4">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#ff6f61]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-[#ff6f61] font-bold">1</span>
              </div>
              <div>
                <p className="font-medium">Share Your Link</p>
                <p className="text-sm text-gray-500">Share your unique referral link with friends</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#ff6f61]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-[#ff6f61] font-bold">2</span>
              </div>
              <div>
                <p className="font-medium">They Purchase</p>
                <p className="text-sm text-gray-500">When they buy, you earn commission</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#ff6f61]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-[#ff6f61] font-bold">3</span>
              </div>
              <div>
                <p className="font-medium">Get Paid</p>
                <p className="text-sm text-gray-500">Withdraw when you reach ${MINIMUM_PAYOUT}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Referrals */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold mb-4">Recent Referrals</h3>
          <div className="space-y-3">
            {demoReferrals.map((ref) => (
              <div key={ref.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium">{ref.referredEmail}</p>
                  <p className="text-sm text-gray-500">{new Date(ref.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">+${ref.earnings.toFixed(2)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    ref.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : ref.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {ref.status.charAt(0).toUpperCase() + ref.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payout Info */}
        <div className="bg-gray-100 rounded-xl p-4 text-center text-sm text-gray-600">
          <p>Minimum payout: <strong>${MINIMUM_PAYOUT}</strong> • Payouts processed monthly via PayPal</p>
        </div>
      </div>
    </div>
  );
}

