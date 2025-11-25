"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Search, ShoppingCart, User, Grid } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useState, useEffect } from "react";

interface NavItem {
  name: string;
  href: string;
  icon: typeof Home;
  badge?: boolean;
}

export default function BottomNav() {
  const pathname = usePathname();
  const { itemCount } = useCartStore();
  const [mounted, setMounted] = useState(false);
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
      name: "Categories",
      href: "/categories",
      icon: Grid,
    },
    {
      name: "Search",
      href: "/products",
      icon: Search,
    },
    {
      name: "Cart",
      href: "/cart",
      icon: ShoppingCart,
      badge: true,
    },
    {
      name: "Account",
      href: "/account",
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 lg:hidden safe-area-bottom">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-colors relative",
                isActive
                  ? "text-primary"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    "w-6 h-6",
                    isActive && "scale-110"
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {item.badge && cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemsCount > 9 ? "9+" : cartItemsCount}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-medium",
                  isActive && "font-semibold"
                )}
              >
                {item.name}
              </span>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-b-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

