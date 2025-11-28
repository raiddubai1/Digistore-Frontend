"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, ShoppingBag, ShoppingCart, User, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useState, useEffect } from "react";

interface NavItem {
  name: string;
  href?: string;
  icon: typeof Home;
  badge?: boolean;
  action?: () => void;
}

export default function BottomNav() {
  const pathname = usePathname();
  const { itemCount, openCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const cartItemsCount = mounted ? itemCount() : 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if a nav item is active
  const isNavActive = (href?: string) => {
    if (!href) return false;
    // Handle locale prefix (e.g., /en, /ar)
    const pathWithoutLocale = pathname?.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/';
    const normalizedPath = pathWithoutLocale === '' ? '/' : pathWithoutLocale;

    if (href === '/') {
      return normalizedPath === '/';
    }
    return normalizedPath === href || normalizedPath.startsWith(href + '/');
  };

  const navItems: NavItem[] = [
    {
      name: "Home",
      href: "/",
      icon: Home,
    },
    {
      name: "Shop",
      href: "/products",
      icon: ShoppingBag,
    },
    {
      name: "Cart",
      icon: ShoppingCart,
      badge: true,
      action: () => openCart(),
    },
    {
      name: "Wishlist",
      href: "/wishlist",
      icon: Heart,
    },
    {
      name: "Account",
      href: "/account",
      icon: User,
    },
  ];

  return (
    <>
      <nav
        className="fixed left-0 right-0 bg-white border-t border-gray-200 z-50 lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.1)]"
        style={{
          bottom: 0,
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          transform: 'translateZ(0)', // Force GPU layer to prevent bounce
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
        }}
      >
        <div className="grid grid-cols-5 h-16">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = isNavActive(item.href);

              const content = (
                <div
                  className={cn(
                    "flex flex-col items-center justify-center gap-0.5 px-4 py-1.5 rounded-2xl transition-all duration-200",
                    isActive ? "bg-gray-100" : "bg-transparent"
                  )}
                >
                  {/* Icon */}
                  <div className="relative">
                    <Icon
                      className={cn(
                        "w-5 h-5 transition-all duration-200",
                        isActive ? "text-gray-900" : "text-gray-500"
                      )}
                      strokeWidth={isActive ? 2.5 : 1.5}
                    />
                    {/* Cart badge */}
                    {item.badge && cartItemsCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#ff6f61] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                        {cartItemsCount > 9 ? "9+" : cartItemsCount}
                      </span>
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className={cn(
                      "text-[10px] transition-all duration-200",
                      isActive ? "font-semibold text-gray-900" : "font-normal text-gray-500"
                    )}
                  >
                    {item.name}
                  </span>
                </div>
              );

              if (item.action) {
                return (
                  <button
                    key={item.name}
                    onClick={item.action}
                    className="flex items-center justify-center active:opacity-70 transition-opacity"
                  >
                    {content}
                  </button>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href!}
                  className="flex items-center justify-center active:opacity-70 transition-opacity"
                >
                  {content}
                </Link>
              );
            })}
          </div>
      </nav>
    </>
  );
}

