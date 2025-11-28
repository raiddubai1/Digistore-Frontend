"use client";

import { X, Check, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  categories: { id: string; name: string; slug: string }[];
  selectedCategories: string[];
  selectedPriceRanges: string[];
  selectedRatings: string[];
  onToggleCategory: (category: string) => void;
  onTogglePriceRange: (range: string) => void;
  onToggleRating: (rating: string) => void;
  onClearAll: () => void;
}

const priceRanges = [
  { value: "under-20", label: "Under $20" },
  { value: "20-50", label: "$20 - $50" },
  { value: "over-50", label: "Over $50" },
];

const ratings = [
  { value: "5", label: "★★★★★ 4.5+" },
  { value: "4", label: "★★★★☆ 4.0+" },
];

export default function FilterBottomSheet({
  isOpen,
  onClose,
  categories,
  selectedCategories,
  selectedPriceRanges,
  selectedRatings,
  onToggleCategory,
  onTogglePriceRange,
  onToggleRating,
  onClearAll,
}: FilterBottomSheetProps) {
  const totalFilters = selectedCategories.length + selectedPriceRanges.length + selectedRatings.length;

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
        style={{ maxHeight: '80vh' }}
      >
        {/* Handle Bar */}
        <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-xl font-bold">Filters</h2>
          <div className="flex items-center gap-2">
            {totalFilters > 0 && (
              <button
                onClick={onClearAll}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[#ff6f61] hover:bg-red-50 rounded-full transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div
          className="overflow-y-auto overscroll-contain px-6 py-4"
          style={{ maxHeight: 'calc(80vh - 180px)' }}
        >
          {/* Categories Section */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => onToggleCategory(category.name)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                    selectedCategories.includes(category.name)
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  {category.name}
                  {selectedCategories.includes(category.name) && (
                    <Check className="w-4 h-4 ml-1 inline" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Section */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-3">Price Range</h3>
            <div className="flex flex-wrap gap-2">
              {priceRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => onTogglePriceRange(range.value)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                    selectedPriceRanges.includes(range.value)
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rating Section */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-3">Rating</h3>
            <div className="flex flex-wrap gap-2">
              {ratings.map((rating) => (
                <button
                  key={rating.value}
                  onClick={() => onToggleRating(rating.value)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                    selectedRatings.includes(rating.value)
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  {rating.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer - Apply Button */}
        <div className="px-6 py-4 border-t border-gray-100 bg-white flex-shrink-0 pb-[calc(16px+env(safe-area-inset-bottom))]">
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-gray-900 text-white font-bold rounded-full active:scale-[0.98] transition-transform"
          >
            Show Results {totalFilters > 0 && `(${totalFilters} filters)`}
          </button>
        </div>
      </div>
    </>
  );
}

