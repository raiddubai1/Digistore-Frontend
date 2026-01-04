"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, ShoppingBag } from "lucide-react";
import Link from "next/link";

const STORAGE_KEY = "digistore1_welcomed";

export default function WelcomePopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has seen the popup
    const hasSeenPopup = localStorage.getItem(STORAGE_KEY);
    
    if (!hasSeenPopup) {
      // Show popup after a short delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setIsVisible(false);
  };

  const handleStartShopping = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>

        {/* Gradient header */}
        <div className="bg-gradient-to-br from-[#FF6B35] via-[#ff8a5c] to-[#FFB347] pt-10 pb-8 px-6 text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <span className="text-5xl">🎉</span>
          </div>
          <h2 className="text-2xl font-black text-white mb-1">
            Welcome to DigiStore1!
          </h2>
          <p className="text-white/90 text-sm">
            We're excited to have you here
          </p>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          {/* Discount highlight */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-4 mb-5">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-bold text-lg">Special Offer</span>
            </div>
            <p className="text-3xl font-black text-green-600 mb-1">
              30% OFF
            </p>
            <p className="text-gray-600 text-sm">
              on your first purchase!
            </p>
          </div>

          <p className="text-gray-500 text-sm mb-5">
            No code needed – discount applies automatically at checkout
          </p>

          {/* CTA Button */}
          <Link
            href="/products"
            onClick={handleStartShopping}
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-[#FF6B35] to-[#ff8a5c] text-white font-bold rounded-full hover:shadow-lg hover:scale-[1.02] transition-all"
          >
            <ShoppingBag className="w-5 h-5" />
            Start Shopping
          </Link>

          <button
            onClick={handleClose}
            className="mt-3 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}

