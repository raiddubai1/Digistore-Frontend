"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import { Search, ShoppingCart, User, Menu, Globe, LogOut, Settings, Heart, Gift } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/contexts/AuthContext";
// import LanguageSwitcher from "./LanguageSwitcher"; // Temporarily disabled

export default function Header() {
  const pathname = usePathname();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [clickedItem, setClickedItem] = useState<string | null>(null);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("EN");
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { itemCount, openCart } = useCartStore();
  const { user, logout, isAuthenticated } = useAuth();
  const cartItemsCount = mounted ? itemCount() : 0;

  const handleClick = (item: string) => {
    setClickedItem(item);
    setTimeout(() => setClickedItem(null), 300);
  };

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
    // Here you would typically update the i18n locale
    console.log(`Language changed to: ${code}`);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md">
      {/* Top Announcement Bar */}
      <div className="bg-secondary text-white py-1.5 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between text-xs">
            {/* Left - Language Dropdown */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span className="text-xs">{selectedLanguage}</span>
                <svg className={cn("w-3 h-3 transition-transform", languageMenuOpen && "rotate-180")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Language Dropdown */}
              {languageMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setLanguageMenuOpen(false)}
                  ></div>
                  <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 transition-colors text-left",
                          selectedLanguage === lang.code && "bg-primary/5"
                        )}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <div className="flex-1">
                          <div className="text-xs font-medium text-gray-900">{lang.name}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Center - Welcome Message */}
            <div className="flex-1 text-center">
              <span className="text-xs font-medium">Welcome to Digistore</span>
            </div>

            {/* Right - Free Products Link */}
            <Link
              href="/products?filter=free"
              className="flex items-center gap-1 hover:text-accent transition-colors"
            >
              <Gift className="w-3.5 h-3.5" />
              <span className="hidden md:inline text-xs">Free Products</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 border-b border-gray-300">
        {/* Top Bar */}
        <div className="flex h-16 md:h-20 items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search for digital products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-[15px] border-2 border-gray-300 focus:border-primary focus:ring-4 focus:ring-primary/20 focus:outline-none transition-all text-sm bg-gray-50 focus:bg-white shadow-sm hover:border-gray-400"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Wishlist */}
            <Link
              href="/wishlist"
              onClick={() => handleClick('wishlist')}
              className={cn(
                "relative flex items-center gap-2 px-4 h-10 rounded-full transition-all",
                "hover:bg-gray-100",
                pathname === '/wishlist' && "bg-primary/10",
                clickedItem === 'wishlist' && "scale-95 bg-primary/20"
              )}
            >
              <Heart className={cn(
                "w-5 h-5",
                pathname === '/wishlist' ? "text-primary fill-primary" : "text-gray-600"
              )} />
              <span className="hidden lg:inline text-sm font-medium text-gray-700">
                Wishlist
              </span>
            </Link>

            {/* Account / User Menu */}
            {isAuthenticated && user ? (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={cn(
                    "flex items-center gap-2 px-4 h-10 rounded-full transition-all hover:bg-gray-100",
                    userMenuOpen && "bg-gray-100"
                  )}
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-teal-600 flex items-center justify-center text-white text-xs font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden lg:inline text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    ></div>

                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-teal-100 text-teal-800">
                          {user.role}
                        </span>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/account"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                        >
                          <User className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-700">My Account</span>
                        </Link>

                        {user.role === 'VENDOR' && (
                          <Link
                            href="/vendor/dashboard"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                          >
                            <Settings className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-700">Vendor Dashboard</span>
                          </Link>
                        )}

                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-700">Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => handleClick('login')}
                className={cn(
                  "hidden sm:flex items-center gap-2 px-4 h-10 rounded-full transition-all",
                  pathname === '/login'
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-gray-100",
                  clickedItem === 'login' && "scale-95 bg-primary/20"
                )}
              >
                <User className={cn(
                  "w-5 h-5",
                  pathname === '/login' ? "text-primary" : "text-gray-600"
                )} />
                <span className={cn(
                  "hidden lg:inline text-sm font-medium",
                  pathname === '/login' ? "text-primary" : "text-gray-700"
                )}>
                  Sign In
                </span>
              </Link>
            )}

            {/* Cart */}
            <button
              onClick={() => {
                handleClick('cart');
                openCart();
              }}
              className={cn(
                "relative flex items-center gap-2 px-4 h-10 rounded-full transition-all",
                "hover:bg-gray-100",
                clickedItem === 'cart' && "scale-95 bg-primary/20"
              )}
            >
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
              <span className="hidden lg:inline text-sm font-medium text-gray-700">
                Cart
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => {
                handleClick('menu');
                setMobileDrawerOpen(!mobileDrawerOpen);
              }}
              className={cn(
                "lg:hidden p-2 rounded-lg transition-all",
                "hover:bg-gray-100",
                clickedItem === 'menu' && "scale-95 bg-primary/20"
              )}
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      <MobileMenu isOpen={mobileDrawerOpen} onClose={() => setMobileDrawerOpen(false)} />
    </header>
  );
}

