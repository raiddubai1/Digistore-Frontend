'use client';

import { useState, useEffect } from 'react';
import { Gift, CreditCard, Check, ChevronLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useGiftCardStore } from '@/store/giftCardStore';
import { giftCardsAPI } from '@/lib/api';

export default function RedeemGiftCardPage() {
  const searchParams = useSearchParams();
  const [code, setCode] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [cardInfo, setCardInfo] = useState<{
    balance: number;
    originalAmount: number;
    expiresAt: string | null;
  } | null>(null);
  const [error, setError] = useState('');

  const { applyGiftCard, appliedGiftCard } = useGiftCardStore();

  // Pre-fill code from URL if present
  useEffect(() => {
    const urlCode = searchParams.get('code');
    if (urlCode) {
      setCode(urlCode.toUpperCase());
      // Auto-check balance
      checkBalanceForCode(urlCode.toUpperCase());
    }
  }, [searchParams]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Gift card format: GC-XXXX-XXXX-XXXX
    const value = e.target.value.toUpperCase();
    setCode(value);
    setError('');
    setCardInfo(null);
  };

  const checkBalanceForCode = async (codeToCheck: string) => {
    setIsChecking(true);
    setError('');

    try {
      const response = await giftCardsAPI.validate(codeToCheck);
      const data = response.data.data;

      setCardInfo({
        balance: data.balance,
        originalAmount: data.originalAmount,
        expiresAt: data.expiresAt,
      });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to validate gift card';
      setError(message);
      setCardInfo(null);
    } finally {
      setIsChecking(false);
    }
  };

  const checkBalance = async () => {
    if (!code || code.length < 10) {
      setError('Please enter a valid gift card code (e.g., GC-XXXX-XXXX-XXXX)');
      return;
    }
    await checkBalanceForCode(code);
  };

  const handleApply = () => {
    if (cardInfo) {
      applyGiftCard(code, cardInfo.balance);
      toast.success(`Gift card applied! $${cardInfo.balance.toFixed(2)} will be used at checkout.`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-4 lg:py-8">
          <div className="flex items-center gap-3">
            <Link href="/gift-cards" className="p-1 lg:hidden">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-lg lg:text-2xl font-bold">Redeem Gift Card</h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Applied Card Banner */}
        {appliedGiftCard && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <Check className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800">Gift Card Applied</p>
              <p className="text-sm text-green-600">
                ${appliedGiftCard.balance.toFixed(2)} will be used at checkout
              </p>
            </div>
          </div>
        )}

        {/* Code Input */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#ff6f61]/10 rounded-xl flex items-center justify-center">
              <Gift className="w-6 h-6 text-[#ff6f61]" />
            </div>
            <div>
              <h2 className="font-semibold">Enter Gift Card Code</h2>
              <p className="text-sm text-gray-500">Code from your gift card email (e.g., GC-XXXX-XXXX-XXXX)</p>
            </div>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              value={code}
              onChange={handleCodeChange}
              placeholder="GC-XXXX-XXXX-XXXX"
              className="w-full px-4 py-4 text-center text-xl font-mono tracking-wider border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6f61] focus:border-transparent uppercase"
              maxLength={20}
            />

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={checkBalance}
              disabled={isChecking || code.length < 10}
              className="w-full py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isChecking ? 'Checking...' : 'Check Balance'}
            </button>
          </div>
        </div>

        {/* Card Info */}
        {cardInfo && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-[#ff6f61]" />
                <span className="font-semibold">Card Balance</span>
              </div>
              <span className="text-2xl font-bold text-green-600">
                ${cardInfo.balance.toFixed(2)}
              </span>
            </div>

            {cardInfo.balance < cardInfo.originalAmount && (
              <div className="text-sm text-gray-400 mb-2">
                Original value: ${cardInfo.originalAmount.toFixed(2)}
              </div>
            )}

            {cardInfo.expiresAt && (
              <div className="text-sm text-gray-500 mb-4">
                Expires: {new Date(cardInfo.expiresAt).toLocaleDateString()}
              </div>
            )}

            {cardInfo.balance <= 0 ? (
              <div className="w-full py-3 bg-gray-200 text-gray-500 font-medium rounded-xl text-center">
                This gift card has been fully used
              </div>
            ) : (
              <button
                onClick={handleApply}
                disabled={!!appliedGiftCard}
                className="w-full py-3 bg-[#ff6f61] text-white font-medium rounded-xl hover:bg-[#e55a4d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {appliedGiftCard ? 'Already Applied' : 'Apply to Checkout'}
              </button>
            )}
          </div>
        )}

        {/* Help Section */}
        <div className="bg-gray-100 rounded-xl p-4">
          <h3 className="font-medium mb-2">Where to find your code?</h3>
          <p className="text-sm text-gray-600">
            Your gift card code was sent to your email when the gift card was purchased. 
            Check your inbox or spam folder for an email from Digistore1.
          </p>
        </div>

        {/* Buy Gift Card Link */}
        <Link
          href="/gift-cards"
          className="block text-center text-[#ff6f61] font-medium hover:underline"
        >
          Don't have a gift card? Buy one →
        </Link>
      </div>
    </div>
  );
}

