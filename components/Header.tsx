"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import CurrencySelector from "./CurrencySelector";
import { Search, ShoppingCart, User, Menu, Globe, LogOut, Settings, Heart, Package, Sparkles, ChevronDown, LayoutDashboard, Sun, Moon, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

// Supported languages: English, Portuguese, Arabic, Spanish
const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "pt", name: "Português", flag: "🇧🇷" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "es", name: "Español", flag: "🇪🇸" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("common");
  const [isPending, startTransition] = useTransition();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { itemCount, openCart } = useCartStore();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();
  const cartItemsCount = mounted ? itemCount() : 0;

  // Get current locale from pathname
  const getCurrentLocale = (): string => {
    const segments = pathname.split('/');
    const possibleLocale = segments[1];
    if (languages.some(lang => lang.code === possibleLocale)) {
      return possibleLocale;
    }
    return 'en'; // Default to English
  };

  const currentLocale = getCurrentLocale();
  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0];

  const handleLanguageChange = (newLocale: string) => {
    startTransition(() => {
      // Remove current locale from pathname if it exists
      const pathnameWithoutLocale = pathname.replace(/^\/(en|pt|ar|es)/, "") || "/";

      // Always add locale prefix (using localePrefix: 'always' for SEO)
      const newPathname = `/${newLocale}${pathnameWithoutLocale}`;

      router.push(newPathname);
      setLanguageMenuOpen(false);
    });
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
      scrolled
        ? "bg-gradient-to-r from-white via-gray-50/95 to-white dark:from-slate-900 dark:via-slate-800/95 dark:to-slate-900 backdrop-blur-lg shadow-lg shadow-gray-200/50 dark:shadow-slate-900/50"
        : "bg-gradient-to-r from-white via-gray-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 shadow-md shadow-gray-100 dark:shadow-slate-800/50"
    )}>
      {/* Top Announcement Bar - Hidden on Mobile for App-like Feel */}
      <div className="hidden lg:block bg-gradient-to-r from-primary via-secondary to-primary text-white py-1.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between text-sm">
            {/* Left - Special Offer Badge */}
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
              <span className="font-medium">🎉 {t("newUserOffer")} <span className="font-bold">30% {t("off")}</span> {t("yourFirstPurchase")} <span className="bg-white/20 px-2 py-0.5 rounded font-bold">WELCOME30</span></span>
            </div>

            {/* Right - Language & Support */}
            <div className="flex items-center gap-4">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                  disabled={isPending}
                  className="flex items-center gap-1.5 hover:text-gray-200 transition-colors px-2 py-1 rounded-lg hover:bg-white/10"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-sm font-medium hidden md:inline">{currentLanguage.flag} {currentLanguage.name}</span>
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
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t("selectLanguage")}</p>
                      </div>
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => handleLanguageChange(lang.code)}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-all text-left group",
                            currentLocale === lang.code && "bg-primary/10 border-l-4 border-primary"
                          )}
                        >
                          <span className="text-2xl">{lang.flag}</span>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900 group-hover:text-primary">{lang.name}</div>
                          </div>
                          {currentLocale === lang.code && (
                            <Check className="w-4 h-4 text-primary" />
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Support Link */}
              <Link href="/support" className="text-sm font-medium hover:text-gray-200 transition-colors">
                {t("support")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - Compact on Mobile */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex h-14 lg:h-20 items-center justify-between gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>

          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                className="w-full h-12 pl-12 pr-4 rounded-full border-2 border-gray-200 dark:border-slate-600 focus:border-gray-400 dark:focus:border-slate-500 focus:ring-4 focus:ring-gray-100 dark:focus:ring-slate-700 focus:outline-none transition-all text-sm bg-gray-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle - Mobile */}
            <button
              onClick={toggleTheme}
              className="lg:hidden relative p-2.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors group"
              aria-label="Toggle theme"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>

            {/* Cart - Mobile Only (Bottom nav handles other actions) */}
            <button
              onClick={openCart}
              className="lg:hidden relative p-2.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors group"
            >
              <ShoppingCart className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-gray-500 transition-colors" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#ff6f61] to-gray-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                  {cartItemsCount > 9 ? "9+" : cartItemsCount}
                </span>
              )}
            </button>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Currency Selector */}
              <CurrencySelector />

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="relative p-2.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors group"
                aria-label="Toggle theme"
              >
                {resolvedTheme === "dark" ? (
                  <Sun className="w-5 h-5 text-yellow-500 group-hover:text-yellow-400 transition-colors" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700 group-hover:text-gray-500 transition-colors" />
                )}
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors group"
              >
                <Heart className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-gray-500 transition-colors" />
              </Link>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative p-2.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors group"
              >
                <ShoppingCart className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-gray-500 transition-colors" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </div>

            {/* User Menu */}
            {isAuthenticated && user ? (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full ring-2 ring-gray-100" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-500 to-gray-600 flex items-center justify-center text-white text-sm font-semibold ring-2 ring-gray-100">
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

                      {/* Admin Dashboard Link */}
                      {isAdmin && (
                        <div className="py-2 border-b border-gray-100">
                          <Link
                            href="/admin"
                            className="flex items-center gap-3 px-4 py-2.5 bg-red-50 hover:bg-red-100 transition-colors group"
                          >
                            <LayoutDashboard className="w-4 h-4 text-red-600" />
                            <span className="text-sm font-medium text-red-600">{t("adminDashboard")}</span>
                          </Link>
                        </div>
                      )}

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          href="/account"
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors group"
                        >
                          <User className="w-4 h-4 text-gray-600 group-hover:text-gray-500" />
                          <span className="text-sm text-gray-700 group-hover:text-gray-500">{t("myAccount")}</span>
                        </Link>
                        <Link
                          href="/account/orders"
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors group"
                        >
                          <Package className="w-4 h-4 text-gray-600 group-hover:text-gray-500" />
                          <span className="text-sm text-gray-700 group-hover:text-gray-500">{t("myOrders")}</span>
                        </Link>
                        <Link
                          href="/wishlist"
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors group"
                        >
                          <Heart className="w-4 h-4 text-gray-600 group-hover:text-gray-500" />
                          <span className="text-sm text-gray-700 group-hover:text-gray-500">{t("wishlist")}</span>
                        </Link>
                        <Link
                          href="/account?tab=settings"
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors group"
                        >
                          <Settings className="w-4 h-4 text-gray-600 group-hover:text-gray-500" />
                          <span className="text-sm text-gray-700 group-hover:text-gray-500">{t("settings")}</span>
                        </Link>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-gray-100 pt-2">
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors group"
                        >
                          <LogOut className="w-4 h-4 text-gray-600 group-hover:text-red-600" />
                          <span className="text-sm text-gray-700 group-hover:text-red-600">{t("logout")}</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-full font-medium hover:shadow-lg hover:shadow-gray-200 transition-all hover:scale-105"
              >
                <User className="w-4 h-4" />
                <span>{t("login")}</span>
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


