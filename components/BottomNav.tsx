"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Search, ShoppingCart, User, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useState, useEffect } from "react";
import SearchModal from "./SearchModal";

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
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const cartItemsCount = mounted ? itemCount() : 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems: NavItem[] = [
    {
      name: "Home",
      href: "/",
      icon: Home,
    },
    {
      name: "Search",
      icon: Search,
      action: () => setSearchModalOpen(true),
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
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 lg:hidden shadow-2xl">
        {/* Safe area for iOS devices */}
        <div className="pb-safe">
          <div className="grid grid-cols-5 h-16">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.href ? pathname === item.href || pathname?.startsWith(item.href + '/') : false;

              const content = (
                <>
                  {/* Active indicator bar */}
                  {isActive && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-gray-600 to-[#ff6f61] rounded-b-full" />
                  )}

                  {/* Icon with badge */}
                  <div className="relative">
                    <Icon
                      className={cn(
                        "w-6 h-6 transition-all duration-200",
                        isActive && "scale-110"
                      )}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                    {item.badge && cartItemsCount > 0 && (
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-[#ff6f61] to-gray-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse">
                        {cartItemsCount > 9 ? "9+" : cartItemsCount}
                      </span>
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className={cn(
                      "text-[10px] font-medium transition-all duration-200",
                      isActive ? "font-bold" : "font-normal"
                    )}
                  >
                    {item.name}
                  </span>

                  {/* Tap effect overlay */}
                  <div className="absolute inset-0 bg-gray-100 opacity-0 active:opacity-100 transition-opacity rounded-lg pointer-events-none" />
                </>
              );

              if (item.action) {
                return (
                  <button
                    key={item.name}
                    onClick={item.action}
                    className={cn(
                      "flex flex-col items-center justify-center gap-1 transition-all duration-200 relative group",
                      isActive
                        ? "text-gray-900"
                        : "text-gray-400 active:text-gray-600"
                    )}
                  >
                    {content}
                  </button>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href!}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 transition-all duration-200 relative group",
                    isActive
                      ? "text-gray-900"
                      : "text-gray-400 active:text-gray-600"
                  )}
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </>
  );
}

