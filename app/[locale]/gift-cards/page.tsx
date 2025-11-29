'use client';

import { useState } from 'react';
import { Gift, CreditCard, Mail, User, MessageSquare, Check, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { GIFT_CARD_AMOUNTS, generateGiftCardCode, useGiftCardStore } from '@/store/giftCardStore';

export default function GiftCardsPage() {
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { addPurchasedCard } = useGiftCardStore();

  const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount;
  const isValidAmount = finalAmount >= 5 && finalAmount <= 500;

  const handlePurchase = async () => {
    if (!recipientEmail) {
      toast.error('Please enter recipient email');
      return;
    }
    if (!isValidAmount) {
      toast.error('Amount must be between $5 and $500');
      return;
    }

    setIsProcessing(true);

    // Simulate purchase
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newCard = {
      id: Date.now().toString(),
      code: generateGiftCardCode(),
      amount: finalAmount,
      balance: finalAmount,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      purchasedAt: new Date().toISOString(),
      recipientEmail,
      recipientName,
      message,
      status: 'active' as const,
    };

    addPurchasedCard(newCard);
    toast.success('Gift card purchased successfully!');
    setIsProcessing(false);

    // Reset form
    setRecipientEmail('');
    setRecipientName('');
    setMessage('');
    setCustomAmount('');
  };

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
              <div className="grid grid-cols-3 gap-3 mb-4">
                {GIFT_CARD_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount('');
                    }}
                    className={`py-3 rounded-xl font-bold transition-all ${
                      selectedAmount === amount && !customAmount
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  placeholder="Custom amount (5-500)"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(0);
                  }}
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6f61] focus:border-transparent"
                  min="5"
                  max="500"
                />
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
                  <p className="text-3xl font-bold">${finalAmount.toFixed(2)}</p>
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

            {/* Purchase Button */}
            <button
              onClick={handlePurchase}
              disabled={isProcessing || !isValidAmount}
              className="w-full py-4 bg-[#ff6f61] text-white font-bold rounded-xl hover:bg-[#e55a4d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>Processing...</>
              ) : (
                <>
                  <Gift className="w-5 h-5" />
                  Purchase Gift Card - ${finalAmount.toFixed(2)}
                </>
              )}
            </button>

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

