"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Mail, Send, Heart, Sparkles, Gift, Package, Users } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white mt-auto relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-gray-500/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#ff6f61]/10 to-transparent rounded-full blur-3xl"></div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            {/* Brand Column */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <Logo />
              </div>
              <p className="text-gray-400 leading-relaxed max-w-md">
                Your trusted marketplace for high-quality digital products. Download instantly and start creating amazing things today.
              </p>
              
              {/* Newsletter */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wide">Stay Updated</h4>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent backdrop-blur-sm"
                  />
                  <button className="px-5 py-3 bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl hover:shadow-lg hover:shadow-gray-400/50 transition-all hover:scale-105">
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-11 h-11 rounded-xl bg-white/10 hover:bg-gradient-to-r hover:from-gray-500 hover:to-gray-600 flex items-center justify-center transition-all hover:scale-110 backdrop-blur-sm border border-white/10"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-11 h-11 rounded-xl bg-white/10 hover:bg-gradient-to-r hover:from-gray-500 hover:to-gray-600 flex items-center justify-center transition-all hover:scale-110 backdrop-blur-sm border border-white/10"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-11 h-11 rounded-xl bg-white/10 hover:bg-gradient-to-r hover:from-gray-500 hover:to-gray-600 flex items-center justify-center transition-all hover:scale-110 backdrop-blur-sm border border-white/10"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-11 h-11 rounded-xl bg-white/10 hover:bg-gradient-to-r hover:from-gray-500 hover:to-gray-600 flex items-center justify-center transition-all hover:scale-110 backdrop-blur-sm border border-white/10"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Shop Column */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-white">Shop</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/products" className="text-gray-400 hover:text-[#ff6f61] transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff6f61] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="text-gray-400 hover:text-[#ff6f61] transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff6f61] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Categories
                  </Link>
                </li>
                <li>
                  <Link href="/bundles" className="text-gray-400 hover:text-[#ff6f61] transition-colors flex items-center gap-2 group">
                    <Package className="w-3.5 h-3.5 text-[#ff6f61] opacity-0 group-hover:opacity-100 transition-opacity" />
                    Product Bundles
                  </Link>
                </li>
                <li>
                  <Link href="/products?filter=new" className="text-gray-400 hover:text-[#ff6f61] transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff6f61] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link href="/products?filter=bestsellers" className="text-gray-400 hover:text-[#ff6f61] transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff6f61] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Best Sellers
                  </Link>
                </li>
              </ul>
            </div>

            {/* Features Column */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-white">Features</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/gift-cards" className="text-gray-400 hover:text-[#ff6f61] transition-colors flex items-center gap-2 group">
                    <Gift className="w-3.5 h-3.5 text-[#ff6f61] opacity-0 group-hover:opacity-100 transition-opacity" />
                    Gift Cards
                  </Link>
                </li>
                <li>
                  <Link href="/account/referrals" className="text-gray-400 hover:text-[#ff6f61] transition-colors flex items-center gap-2 group">
                    <Users className="w-3.5 h-3.5 text-[#ff6f61] opacity-0 group-hover:opacity-100 transition-opacity" />
                    Referral Program
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="text-gray-400 hover:text-[#ff6f61] transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff6f61] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-[#ff6f61] transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff6f61] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-400 hover:text-[#ff6f61] transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff6f61] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Column */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-white">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-[#ff6f61] transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff6f61] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-[#ff6f61] transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff6f61] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/licenses" className="text-gray-400 hover:text-[#ff6f61] transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff6f61] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    License Information
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-gray-400 hover:text-[#ff6f61] transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff6f61] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="/refund-policy" className="text-gray-400 hover:text-[#ff6f61] transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff6f61] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Refund Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-gray-400">
                <span>© {currentYear} Digistore1. All rights reserved.</span>
                <span className="hidden md:inline">•</span>
                <span className="hidden md:inline flex items-center gap-1">
                  Made with <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" /> for creators
                </span>
              </div>

              {/* Payment Methods */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">We accept:</span>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
                    <span className="text-xs font-bold text-white">VISA</span>
                  </div>
                  <div className="px-3 py-1.5 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
                    <span className="text-xs font-bold text-white">MC</span>
                  </div>
                  <div className="px-3 py-1.5 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
                    <span className="text-xs font-bold text-white">AMEX</span>
                  </div>
                  <div className="px-3 py-1.5 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
                    <span className="text-xs font-bold text-white">PayPal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Bottom Gradient */}
        <div className="h-1 bg-gradient-to-r from-gray-500 via-gray-600 to-[#ff6f61]"></div>
      </div>
    </footer>
  );
}


