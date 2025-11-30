"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Home, ShoppingBag, ShoppingCart, User, Heart, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useState, useEffect, useCallback, useRef } from "react";

interface NavItem {
  name: string;
  href?: string;
  icon: typeof Home;
  badge?: boolean;
  action?: () => void;
}

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount, openCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [loadingTab, setLoadingTab] = useState<string | null>(null);
  const [pressedTab, setPressedTab] = useState<string | null>(null);
  const cartItemsCount = mounted ? itemCount() : 0;
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Clear loading state when pathname changes
  useEffect(() => {
    if (loadingTab) {
      setLoadingTab(null);
    }
    // Clear any pending timeout
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
      navigationTimeoutRef.current = null;
    }
  }, [pathname]);

  // Get locale from pathname
  const getLocale = () => {
    const match = pathname?.match(/^\/([a-z]{2})(?=\/|$)/);
    return match ? match[1] : 'en';
  };

  // Check if a nav item is active
  const isNavActive = (href?: string) => {
    if (!href) return false;
    const pathWithoutLocale = pathname?.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/';
    const normalizedPath = pathWithoutLocale === '' ? '/' : pathWithoutLocale;

    if (href === '/') {
      return normalizedPath === '/';
    }
    return normalizedPath === href || normalizedPath.startsWith(href + '/');
  };

  const navItems: NavItem[] = [
    { name: "Home", href: "/", icon: Home },
    { name: "Shop", href: "/products", icon: ShoppingBag },
    { name: "Cart", icon: ShoppingCart, badge: true, action: () => openCart() },
    { name: "Wishlist", href: "/wishlist", icon: Heart },
    { name: "Account", href: "/account", icon: User },
  ];

  // Handle navigation with loading state
  const handleNavClick = useCallback((item: NavItem, e: React.MouseEvent) => {
    if (item.action) {
      item.action();
      return;
    }

    if (!item.href) return;

    const isActive = isNavActive(item.href);
    if (isActive) return; // Don't navigate if already on the page

    e.preventDefault();
    setLoadingTab(item.name);

    const locale = getLocale();
    const fullPath = `/${locale}${item.href === '/' ? '' : item.href}`;

    // Set a timeout to clear loading state in case navigation fails
    navigationTimeoutRef.current = setTimeout(() => {
      setLoadingTab(null);
    }, 5000);

    router.push(fullPath);
  }, [pathname, router]);

  // Handle touch/press feedback
  const handlePressStart = (name: string) => setPressedTab(name);
  const handlePressEnd = () => setPressedTab(null);

  return (
    <nav
      className="fixed left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 z-50 lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
      style={{
        bottom: 0,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        transform: 'translateZ(0)',
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden',
      }}
    >
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = isNavActive(item.href);
          const isLoading = loadingTab === item.name;
          const isPressed = pressedTab === item.name;

          const content = (
            <div
              className={cn(
                "relative flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all duration-150",
                isActive && "bg-gray-100 dark:bg-slate-800",
                isPressed && !isActive && "bg-gray-50 dark:bg-slate-800/50 scale-95",
                isLoading && "opacity-70"
              )}
            >
              {/* Icon with loading spinner overlay */}
              <div className="relative">
                {isLoading ? (
                  <Loader2 className="w-5 h-5 text-[#ff6f61] animate-spin" />
                ) : (
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-all duration-150",
                      isActive ? "text-[#ff6f61]" : "text-gray-500 dark:text-gray-400",
                      isPressed && "scale-90"
                    )}
                    strokeWidth={isActive ? 2.5 : 1.5}
                  />
                )}
                {/* Cart badge */}
                {item.badge && cartItemsCount > 0 && !isLoading && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 bg-[#ff6f61] text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-scale-in">
                    {cartItemsCount > 9 ? "9+" : cartItemsCount}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  "text-[10px] transition-all duration-150",
                  isActive ? "font-semibold text-[#ff6f61]" : "font-normal text-gray-500 dark:text-gray-400",
                  isLoading && "text-[#ff6f61]"
                )}
              >
                {item.name}
              </span>

              {/* Active indicator dot */}
              {isActive && (
                <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#ff6f61] rounded-full" />
              )}
            </div>
          );

          const commonProps = {
            onTouchStart: () => handlePressStart(item.name),
            onTouchEnd: handlePressEnd,
            onTouchCancel: handlePressEnd,
            onMouseDown: () => handlePressStart(item.name),
            onMouseUp: handlePressEnd,
            onMouseLeave: handlePressEnd,
          };

          if (item.action) {
            return (
              <button
                key={item.name}
                onClick={() => item.action?.()}
                className="flex items-center justify-center select-none touch-manipulation"
                {...commonProps}
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={item.name}
              href={`/${getLocale()}${item.href === '/' ? '' : item.href}`}
              onClick={(e) => handleNavClick(item, e)}
              className="flex items-center justify-center select-none touch-manipulation"
              prefetch={true}
              {...commonProps}
            >
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

