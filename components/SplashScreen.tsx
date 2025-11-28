"use client";

import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    // Check if splash has been shown in this session
    const hasShownSplash = sessionStorage.getItem("splashShown");

    if (hasShownSplash) {
      setIsVisible(false);
      return;
    }

    // Start fade out after 1.5 seconds
    const fadeTimer = setTimeout(() => {
      setIsAnimating(false);
    }, 1500);

    // Remove splash after animation completes
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem("splashShown", "true");
    }, 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-gradient-to-br from-gray-600 via-gray-700 to-[#ff6f61] flex items-center justify-center transition-opacity duration-500 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="text-center">
        {/* Logo Animation */}
        <div className="mb-8 animate-bounce-slow">
          <div className="w-24 h-24 mx-auto bg-white rounded-3xl shadow-2xl flex items-center justify-center transform hover:scale-110 transition-transform">
            <ShoppingBag className="w-12 h-12 text-gray-700" strokeWidth={2.5} />
          </div>
        </div>

        {/* Brand Name */}
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-white tracking-tight">
            <span className="text-white">Digi</span>
            <span className="text-white">store</span>
            <span className="text-[#ff6f61] bg-white px-2 rounded-lg">1</span>
          </h1>
          <p className="text-white/80 text-sm font-medium tracking-wide">
            Digital Excellence
          </p>
        </div>

        {/* Loading Indicator */}
        <div className="mt-8 flex justify-center">
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: "0ms" }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: "150ms" }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: "300ms" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

