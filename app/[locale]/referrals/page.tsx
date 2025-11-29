'use client';

import { useState, useEffect, use } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Copy, Share2, DollarSign, Users, MousePointer, TrendingUp, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface ReferralStats {
  totalReferrals: number;
  convertedReferrals: number;
  pendingEarnings: number;
  paidEarnings: number;
  clickCount: number;
  conversionRate: number;
}

interface Referral {
  id: string;
  status: string;
  commission: number;
  createdAt: string;
  convertedAt: string | null;
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default function ReferralsPage({ params }: PageProps) {
  const { locale } = use(params);
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(`/${locale}/login`);
      return;
    }
    if (isAuthenticated) {
      fetchReferralData();
    }
  }, [loading, isAuthenticated, locale, router]);

  const fetchReferralData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

      const [codeRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/referrals/my-code`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/referrals/stats`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (codeRes.ok) {
        const codeData = await codeRes.json();
        setReferralCode(codeData.data.referralCode);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.data.stats);
        setReferrals(statsData.data.referrals);
      }
    } catch (error) {
      console.error('Failed to fetch referral data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const referralLink = referralCode ? `${window.location.origin}?ref=${referralCode}` : '';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success('Referral link copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Digistore1',
          text: 'Check out Digistore1 for amazing digital products!',
          url: referralLink,
        });
      } catch {}
    } else {
      copyToClipboard();
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
        <Link href={`/${locale}/account`} className="inline-flex items-center gap-2 text-white/80 mb-4">
          <ArrowLeft className="w-5 h-5" /> Back
        </Link>
        <h1 className="text-2xl font-bold">Referral Program</h1>
        <p className="text-white/80 mt-1">Earn 10% commission on every referral purchase</p>
      </div>

      <div className="p-4 space-y-6">
        {/* Referral Link */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="font-semibold mb-3">Your Referral Link</h2>
          <div className="flex gap-2">
            <input type="text" readOnly value={referralLink} className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-sm" />
            <button onClick={copyToClipboard} className="px-4 py-2 bg-gray-900 text-white rounded-lg">
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
            <button onClick={shareLink} className="px-4 py-2 bg-red-600 text-white rounded-lg">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Users, label: 'Referrals', value: stats?.totalReferrals || 0, color: 'blue' },
            { icon: MousePointer, label: 'Clicks', value: stats?.clickCount || 0, color: 'purple' },
            { icon: DollarSign, label: 'Pending', value: `$${(stats?.pendingEarnings || 0).toFixed(2)}`, color: 'yellow' },
            { icon: TrendingUp, label: 'Earned', value: `$${(stats?.paidEarnings || 0).toFixed(2)}`, color: 'green' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm">
              <stat.icon className={`w-6 h-6 text-${stat.color}-600 mb-2`} />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Referrals */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="font-semibold mb-3">Recent Referrals</h2>
          {referrals.length === 0 ? (
            <p className="text-gray-500 text-center py-6">No referrals yet. Share your link to start earning!</p>
          ) : (
            <div className="space-y-3">
              {referrals.slice(0, 10).map((ref) => (
                <div key={ref.id} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      ref.status === 'CONVERTED' ? 'bg-green-100 text-green-700' :
                      ref.status === 'PAID' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                    }`}>{ref.status}</span>
                    <p className="text-xs text-gray-500 mt-1">{new Date(ref.createdAt).toLocaleDateString()}</p>
                  </div>
                  <p className="font-semibold text-green-600">+${Number(ref.commission).toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

