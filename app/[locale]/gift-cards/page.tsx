'use client';

import { useState, useEffect, useCallback } from 'react';
import { Gift, CreditCard, Mail, MessageSquare, Check, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { GIFT_CARD_AMOUNTS, useGiftCardStore } from '@/store/giftCardStore';
import { giftCardsAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function GiftCardsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');
  const [purchaserEmail, setPurchaserEmail] = useState('');
  const [purchaserName, setPurchaserName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pendingGiftCardId, setPendingGiftCardId] = useState<string | null>(null);

  const { addPurchasedCard } = useGiftCardStore();

  // Set purchaser info from user
  useEffect(() => {
    if (user) {
      setPurchaserEmail(user.email || '');
      setPurchaserName(user.name || '');
    }
  }, [user]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load PayPal script
  useEffect(() => {
    if (mounted && !paypalLoaded && typeof window !== 'undefined') {
      const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
      if (!clientId) {
        console.warn('PayPal client ID not configured');
        return;
      }

      const existingScript = document.querySelector(`script[src*="paypal.com/sdk/js"]`);
      if (existingScript) {
        setPaypalLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture`;
      script.async = true;
      script.onload = () => setPaypalLoaded(true);
      document.body.appendChild(script);
    }
  }, [mounted, paypalLoaded]);

  const isFormValid = recipientEmail && recipientName && (purchaserEmail || user?.email);

  // Initialize PayPal button
  const initPayPalButton = useCallback(() => {
    if (!paypalLoaded || !(window as any).paypal || !isFormValid) return;

    const container = document.getElementById('paypal-giftcard-button');
    if (!container) return;

    // Clear existing buttons
    container.innerHTML = '';

    (window as any).paypal.Buttons({
      style: {
        layout: 'vertical' as const,
        color: 'gold' as const,
        shape: 'rect' as const,
        label: 'paypal' as const,
        height: 50,
      },
      createOrder: async () => {
        try {
          const response = await giftCardsAPI.createOrder({
            amount: selectedAmount,
            recipientEmail,
            recipientName,
            personalMessage: message || undefined,
            purchaserEmail: purchaserEmail || user?.email,
            purchaserName: purchaserName || user?.name,
          });

          setPendingGiftCardId(response.data.data.giftCardId);
          return response.data.data.paypalOrderId;
        } catch (error: any) {
          toast.error(error.response?.data?.message || 'Failed to create gift card order');
          throw error;
        }
      },
      onApprove: async (data: any) => {
        setIsProcessing(true);
        try {
          const response = await giftCardsAPI.capturePayment({
            paypalOrderId: data.orderID,
            giftCardId: pendingGiftCardId!,
          });

          const giftCard = response.data.data.giftCard;

          // Add to local store
          addPurchasedCard({
            id: giftCard.id,
            code: giftCard.code,
            amount: giftCard.amount,
            balance: giftCard.amount,
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            purchasedAt: new Date().toISOString(),
            recipientEmail: giftCard.recipientEmail,
            recipientName: giftCard.recipientName,
            message,
            status: 'active',
          });

          toast.success('Gift card purchased successfully! The recipient will receive an email shortly.');

          // Reset form
          setRecipientEmail('');
          setRecipientName('');
          setMessage('');
          setPendingGiftCardId(null);
        } catch (error: any) {
          toast.error(error.response?.data?.message || 'Failed to complete purchase');
        } finally {
          setIsProcessing(false);
        }
      },
      onError: (err: any) => {
        console.error('PayPal error:', err);
        toast.error('Payment failed. Please try again.');
        setIsProcessing(false);
      },
      onCancel: () => {
        toast.error('Payment cancelled');
        setIsProcessing(false);
      },
    }).render('#paypal-giftcard-button');
  }, [paypalLoaded, isFormValid, selectedAmount, recipientEmail, recipientName, message, purchaserEmail, purchaserName, user, pendingGiftCardId, addPurchasedCard]);

  useEffect(() => {
    if (paypalLoaded && isFormValid) {
      initPayPalButton();
    }
  }, [paypalLoaded, isFormValid, initPayPalButton]);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-12">
      {/* Header */}
      <div className="bg-gradient-to-br from-black to-gray-800 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8 lg:py-12">
          <div className="flex items-center gap-3 lg:hidden mb-4">
            <Link href="/" className="p-1">
              <ChevronLeft className="w-6 h-6" />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#ff6f61] rounded-2xl flex items-center justify-center">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">Gift Cards</h1>
              <p className="text-gray-300">Give the gift of digital products</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Gift Card Form */}
          <div className="space-y-6">
            {/* Amount Selection */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#ff6f61]" />
                Select Amount
              </h2>
              <div className="grid grid-cols-4 gap-3">
                {GIFT_CARD_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setSelectedAmount(amount)}
                    className={`py-3 rounded-xl font-bold transition-all ${
                      selectedAmount === amount
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>

            {/* Recipient Details */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#ff6f61]" />
                Recipient Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recipient Email *
                  </label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="friend@example.com"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6f61] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recipient Name (optional)
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6f61] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Preview & Message */}
          <div className="space-y-6">
            {/* Gift Card Preview */}
            <div className="bg-gradient-to-br from-black via-gray-800 to-gray-900 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-gray-400 text-sm">Gift Card</p>
                  <p className="text-3xl font-bold">${selectedAmount.toFixed(2)}</p>
                </div>
                <Gift className="w-10 h-10 text-[#ff6f61]" />
              </div>
              <div className="space-y-1">
                <p className="text-gray-400 text-xs">TO</p>
                <p className="font-medium">{recipientName || recipientEmail || 'Recipient'}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs text-gray-400">DIGISTORE1 GIFT CARD</p>
              </div>
            </div>

            {/* Personal Message */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#ff6f61]" />
                Personal Message (optional)
              </h2>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a personal message..."
                rows={3}
                maxLength={200}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6f61] focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{message.length}/200</p>
            </div>

            {/* Your Email (for guest) */}
            {!user && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="font-semibold mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#ff6f61]" />
                  Your Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      value={purchaserEmail}
                      onChange={(e) => setPurchaserEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6f61] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={purchaserName}
                      onChange={(e) => setPurchaserName(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6f61] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Purchase with PayPal */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Gift className="w-5 h-5 text-[#ff6f61]" />
                Complete Purchase - ${selectedAmount.toFixed(2)}
              </h2>

              {!isFormValid && (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-700 text-sm">
                  Please fill in the recipient email and name to continue.
                </div>
              )}

              {isProcessing ? (
                <div className="w-full py-4 bg-gray-200 rounded-xl flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-gray-700 font-semibold">Processing...</span>
                </div>
              ) : paypalLoaded && isFormValid ? (
                <div id="paypal-giftcard-button" className="w-full"></div>
              ) : !paypalLoaded ? (
                <div className="w-full py-4 bg-gray-200 rounded-xl flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2" />
                  <span className="text-gray-500">Loading payment options...</span>
                </div>
              ) : null}

              <p className="text-center text-xs text-gray-500 mt-3">
                🔒 Secure checkout with PayPal
              </p>
            </div>

            {/* Features */}
            <div className="bg-gray-100 rounded-xl p-4">
              <div className="space-y-2 text-sm">
                {[
                  'Delivered instantly via email',
                  'Valid for 1 year from purchase',
                  'Can be used on any product',
                  'No fees or expiration penalties',
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-gray-600">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

