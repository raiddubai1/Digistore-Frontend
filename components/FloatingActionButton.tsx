"use client";

import { useState } from "react";
import { Plus, Search, ShoppingCart, Heart, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { cn } from "@/lib/utils";

interface FABProps {
  onSearchClick: () => void;
  onCartClick: () => void;
}

export default function FloatingActionButton({ onSearchClick, onCartClick }: FABProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { items } = useCartStore();
  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="fixed bottom-20 right-4 z-40 lg:hidden">
      {/* Expanded Actions */}
      <div
        className={cn(
          "flex flex-col gap-3 mb-3 transition-all duration-300",
          isExpanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        )}
      >
        {/* Search Action */}
        <button
          onClick={() => {
            onSearchClick();
            setIsExpanded(false);
          }}
          className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform border-2 border-gray-200"
        >
          <Search className="w-6 h-6 text-gray-700" />
        </button>

        {/* Cart Action */}
        <button
          onClick={() => {
            onCartClick();
            setIsExpanded(false);
          }}
          className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform border-2 border-gray-200 relative"
        >
          <ShoppingCart className="w-6 h-6 text-gray-700" />
          {cartItemsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-[#ff6f61] to-gray-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
              {cartItemsCount > 9 ? "9+" : cartItemsCount}
            </span>
          )}
        </button>

        {/* Wishlist Action */}
        <button
          onClick={() => {
            window.location.href = "/wishlist";
          }}
          className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform border-2 border-gray-200"
        >
          <Heart className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Main FAB Button */}
      <button
        onClick={toggleExpanded}
        className={cn(
          "w-16 h-16 rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-all",
          isExpanded
            ? "bg-gray-700 rotate-45"
            : "bg-gradient-to-r from-gray-600 to-[#ff6f61]"
        )}
      >
        {isExpanded ? (
          <X className="w-7 h-7 text-white" />
        ) : (
          <Plus className="w-7 h-7 text-white" />
        )}
      </button>
    </div>
  );
}

