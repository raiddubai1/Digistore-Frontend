"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import { Search, ShoppingCart, User, Menu, Globe, LogOut, Settings, Heart, Package, Sparkles, TrendingUp, Bell, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const pathname = usePathname();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("EN");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { itemCount, openCart } = useCartStore();
  const { user, logout, isAuthenticated } = useAuth();
  const cartItemsCount = mounted ? itemCount() : 0;

  const languages = [
    { code: "EN", name: "English", flag: "🇺🇸" },
    { code: "AR", name: "العربية", flag: "🇸🇦" },
    { code: "ES", name: "Español", flag: "🇪🇸" },
    { code: "FR", name: "Français", flag: "🇫🇷" },
    { code: "DE", name: "Deutsch", flag: "🇩🇪" },
  ];

  const handleLanguageChange = (code: string) => {
    setSelectedLanguage(code);
    setLanguageMenuOpen(false);
  };

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      scrolled ? "bg-white/95 backdrop-blur-lg shadow-lg" : "bg-white shadow-md"
    )}>
      {/* Top Announcement Bar - Modern Gradient */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 text-white py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between text-sm">
            {/* Left - Special Offer Badge */}
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
              <span className="font-medium hidden sm:inline">Limited Time: 30% OFF on All Digital Products!</span>
              <span className="font-medium sm:hidden">30% OFF Today!</span>
            </div>

            {/* Right - Language & Support */}
            <div className="flex items-center gap-4">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                  className="flex items-center gap-1.5 hover:text-blue-200 transition-colors px-2 py-1 rounded-lg hover:bg-white/10"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-sm font-medium hidden md:inline">{selectedLanguage}</span>
                  <ChevronDown className={cn("w-3 h-3 transition-transform", languageMenuOpen && "rotate-180")} />
                </button>

                {/* Language Dropdown - Modern Design */}
                {languageMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setLanguageMenuOpen(false)}
                    ></div>
                    <div className="absolute right-0 top-full mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 overflow-hidden">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Select Language</p>
                      </div>
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => handleLanguageChange(lang.code)}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-all text-left group",
                            selectedLanguage === lang.code && "bg-blue-50 border-l-4 border-blue-600"
                          )}
                        >
                          <span className="text-2xl">{lang.flag}</span>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600">{lang.name}</div>
                          </div>
                          {selectedLanguage === lang.code && (
                            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Support Link */}
              <Link href="/support" className="text-sm font-medium hover:text-blue-200 transition-colors hidden lg:inline">
                24/7 Support
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>

          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for digital products, templates, eBooks..."
                className="w-full h-12 pl-12 pr-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all text-sm bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search Icon - Mobile */}
            <button className="lg:hidden p-2.5 hover:bg-gray-100 rounded-xl transition-colors">
              <Search className="w-5 h-5 text-gray-700" />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2.5 hover:bg-gray-100 rounded-xl transition-colors group hidden sm:block"
            >
              <Heart className="w-5 h-5 text-gray-700 group-hover:text-blue-600 transition-colors" />
            </Link>

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative p-2.5 hover:bg-gray-100 rounded-xl transition-colors group"
            >
              <ShoppingCart className="w-5 h-5 text-gray-700 group-hover:text-blue-600 transition-colors" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            {isAuthenticated && user ? (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full ring-2 ring-blue-100" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center text-white text-sm font-semibold ring-2 ring-blue-100">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <ChevronDown className={cn("w-4 h-4 text-gray-600 transition-transform", userMenuOpen && "rotate-180")} />
                </button>

                {/* User Dropdown */}
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    ></div>
                    <div className="absolute right-0 top-full mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 overflow-hidden">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          href="/account"
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors group"
                        >
                          <User className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                          <span className="text-sm text-gray-700 group-hover:text-blue-600">My Account</span>
                        </Link>
                        <Link
                          href="/account/orders"
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors group"
                        >
                          <Package className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                          <span className="text-sm text-gray-700 group-hover:text-blue-600">My Orders</span>
                        </Link>
                        <Link
                          href="/wishlist"
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors group"
                        >
                          <Heart className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                          <span className="text-sm text-gray-700 group-hover:text-blue-600">Wishlist</span>
                        </Link>
                        <Link
                          href="/account/settings"
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors group"
                        >
                          <Settings className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                          <span className="text-sm text-gray-700 group-hover:text-blue-600">Settings</span>
                        </Link>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-gray-100 pt-2">
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors group"
                        >
                          <LogOut className="w-4 h-4 text-gray-600 group-hover:text-red-600" />
                          <span className="text-sm text-gray-700 group-hover:text-red-600">Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-200 transition-all hover:scale-105"
              >
                <User className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <MobileMenu isOpen={mobileDrawerOpen} onClose={() => setMobileDrawerOpen(false)} />
    </header>
  );
}


