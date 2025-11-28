"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";

export default function OfferOfTheDay() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const difference = tomorrow.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time: number) => {
    return time.toString().padStart(2, "0");
  };

  return (
    <section className="py-12 md:py-16 bg-gradient-to-r from-primary via-indigo-600 to-accent relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Side - Content */}
          <div className="text-white text-center lg:text-left flex-1">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-semibold">Limited Time Offer</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Offer of the Day
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-6 max-w-xl">
              Get up to <span className="font-bold text-2xl">70% OFF</span> on selected digital products. Don't miss out!
            </p>
            <Link
              href="/products?filter=deals"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-[15px] font-semibold hover:shadow-2xl transition-all hover:scale-105 text-base"
            >
              Shop Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Right Side - Countdown Timer */}
          <div className="flex gap-4">
            {/* Hours */}
            <div className="flex flex-col items-center">
              <div className="bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-2xl p-4 md:p-6 min-w-[80px] md:min-w-[100px]">
                <div className="text-4xl md:text-5xl font-bold text-white">
                  {formatTime(timeLeft.hours)}
                </div>
              </div>
              <span className="text-white/90 text-sm font-medium mt-2">Hours</span>
            </div>

            {/* Separator */}
            <div className="flex items-center pb-6">
              <span className="text-4xl md:text-5xl font-bold text-white">:</span>
            </div>

            {/* Minutes */}
            <div className="flex flex-col items-center">
              <div className="bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-2xl p-4 md:p-6 min-w-[80px] md:min-w-[100px]">
                <div className="text-4xl md:text-5xl font-bold text-white">
                  {formatTime(timeLeft.minutes)}
                </div>
              </div>
              <span className="text-white/90 text-sm font-medium mt-2">Minutes</span>
            </div>

            {/* Separator */}
            <div className="flex items-center pb-6">
              <span className="text-4xl md:text-5xl font-bold text-white">:</span>
            </div>

            {/* Seconds */}
            <div className="flex flex-col items-center">
              <div className="bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-2xl p-4 md:p-6 min-w-[80px] md:min-w-[100px]">
                <div className="text-4xl md:text-5xl font-bold text-white">
                  {formatTime(timeLeft.seconds)}
                </div>
              </div>
              <span className="text-white/90 text-sm font-medium mt-2">Seconds</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

