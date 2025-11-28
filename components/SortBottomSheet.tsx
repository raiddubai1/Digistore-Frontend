"use client";

import { useEffect } from "react";
import { X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SortOption {
  value: string;
  label: string;
}

interface SortBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentSort: string;
  onSortChange: (value: string) => void;
}

const sortOptions: SortOption[] = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

export default function SortBottomSheet({
  isOpen,
  onClose,
  currentSort,
  onSortChange,
}: SortBottomSheetProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSelect = (value: string) => {
    onSortChange(value);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-50 transition-opacity lg:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl transition-transform duration-300 ease-out lg:hidden",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle Bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
          <h2 className="text-lg font-bold">Sort By</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="px-4 py-2 pb-[calc(16px+env(safe-area-inset-bottom))]">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-colors",
                currentSort === option.value
                  ? "bg-gray-900 text-white"
                  : "hover:bg-gray-100"
              )}
            >
              <span className="font-medium text-sm">{option.label}</span>
              {currentSort === option.value && (
                <Check className="w-5 h-5" />
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

