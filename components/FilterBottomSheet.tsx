"use client";

import { useEffect, useState } from "react";
import { X, Check, RotateCcw, ChevronDown, ChevronUp, Tag, DollarSign, Star, FileType } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  categories: { id: string; name: string; slug: string }[];
  selectedCategories: string[];
  selectedPriceRanges: string[];
  selectedRatings: string[];
  selectedFileTypes?: string[];
  onToggleCategory: (category: string) => void;
  onTogglePriceRange: (range: string) => void;
  onToggleRating: (rating: string) => void;
  onToggleFileType?: (fileType: string) => void;
  onClearAll: () => void;
}

const priceRanges = [
  { value: "free", label: "Free", icon: "🆓" },
  { value: "under-10", label: "Under $10", icon: "💵" },
  { value: "10-25", label: "$10 - $25", icon: "💰" },
  { value: "25-50", label: "$25 - $50", icon: "💎" },
  { value: "over-50", label: "Over $50", icon: "👑" },
];

const ratings = [
  { value: "5", label: "4.5+ Stars", stars: 5 },
  { value: "4", label: "4.0+ Stars", stars: 4 },
  { value: "3", label: "3.0+ Stars", stars: 3 },
];

const fileTypes = [
  { value: "pdf", label: "PDF Documents", icon: "📄" },
  { value: "zip", label: "ZIP Archives", icon: "📦" },
  { value: "mp4", label: "Videos", icon: "🎬" },
  { value: "mp3", label: "Audio Files", icon: "🎵" },
  { value: "psd", label: "Photoshop Files", icon: "🎨" },
  { value: "doc", label: "Word Documents", icon: "📝" },
  { value: "xls", label: "Spreadsheets", icon: "📊" },
];

// Collapsible section component
function FilterSection({
  title,
  icon: Icon,
  count,
  children,
  defaultOpen = false
}: {
  title: string;
  icon: React.ElementType;
  count: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 px-1 active:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
            <Icon className="w-5 h-5 text-gray-600" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            {count > 0 && (
              <p className="text-xs text-[#ff6f61] font-medium">{count} selected</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {count > 0 && (
            <span className="w-6 h-6 rounded-full bg-[#ff6f61] text-white text-xs font-bold flex items-center justify-center">
              {count}
            </span>
          )}
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-out",
          isOpen ? "max-h-[500px] opacity-100 pb-4" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-1">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function FilterBottomSheet({
  isOpen,
  onClose,
  categories,
  selectedCategories,
  selectedPriceRanges,
  selectedRatings,
  selectedFileTypes = [],
  onToggleCategory,
  onTogglePriceRange,
  onToggleRating,
  onToggleFileType,
  onClearAll,
}: FilterBottomSheetProps) {
  const totalFilters = selectedCategories.length + selectedPriceRanges.length + selectedRatings.length + selectedFileTypes.length;

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Full-Screen Filter Modal */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-white lg:hidden transition-transform duration-300 ease-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-lg font-bold">Filters</h2>
              {totalFilters > 0 && (
                <p className="text-xs text-gray-500">{totalFilters} filter{totalFilters !== 1 ? 's' : ''} applied</p>
              )}
            </div>
          </div>
          {totalFilters > 0 && (
            <button
              onClick={onClearAll}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-[#ff6f61] hover:bg-red-50 rounded-full transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        {/* Scrollable Content with Collapsible Sections */}
        <div
          className="flex-1 overflow-y-auto overscroll-contain touch-pan-y px-4"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {/* Categories Section */}
          <FilterSection
            title="Categories"
            icon={Tag}
            count={selectedCategories.length}
            defaultOpen={true}
          >
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => onToggleCategory(category.name)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                    selectedCategories.includes(category.name)
                      ? "bg-[#ff6f61] text-white shadow-sm"
                      : "bg-gray-50 text-gray-700 active:bg-gray-100"
                  )}
                >
                  {selectedCategories.includes(category.name) && (
                    <Check className="w-4 h-4 flex-shrink-0" />
                  )}
                  <span className="truncate">{category.name}</span>
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Price Range Section */}
          <FilterSection
            title="Price Range"
            icon={DollarSign}
            count={selectedPriceRanges.length}
          >
            <div className="space-y-2">
              {priceRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => onTogglePriceRange(range.value)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all",
                    selectedPriceRanges.includes(range.value)
                      ? "bg-[#ff6f61] text-white shadow-sm"
                      : "bg-gray-50 text-gray-700 active:bg-gray-100"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{range.icon}</span>
                    <span>{range.label}</span>
                  </div>
                  {selectedPriceRanges.includes(range.value) && (
                    <Check className="w-5 h-5" />
                  )}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Rating Section */}
          <FilterSection
            title="Customer Rating"
            icon={Star}
            count={selectedRatings.length}
          >
            <div className="space-y-2">
              {ratings.map((rating) => (
                <button
                  key={rating.value}
                  onClick={() => onToggleRating(rating.value)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all",
                    selectedRatings.includes(rating.value)
                      ? "bg-[#ff6f61] text-white shadow-sm"
                      : "bg-gray-50 text-gray-700 active:bg-gray-100"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-4 h-4",
                            i < rating.stars
                              ? selectedRatings.includes(rating.value)
                                ? "text-white fill-white"
                                : "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          )}
                        />
                      ))}
                    </div>
                    <span className="ml-1">{rating.label}</span>
                  </div>
                  {selectedRatings.includes(rating.value) && (
                    <Check className="w-5 h-5" />
                  )}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* File Type Section */}
          {onToggleFileType && (
            <FilterSection
              title="File Type"
              icon={FileType}
              count={selectedFileTypes.length}
            >
              <div className="grid grid-cols-2 gap-2">
                {fileTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => onToggleFileType(type.value)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                      selectedFileTypes.includes(type.value)
                        ? "bg-[#ff6f61] text-white shadow-sm"
                        : "bg-gray-50 text-gray-700 active:bg-gray-100"
                    )}
                  >
                    <span className="text-base">{type.icon}</span>
                    <span className="truncate">{type.label}</span>
                    {selectedFileTypes.includes(type.value) && (
                      <Check className="w-4 h-4 ml-auto flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </FilterSection>
          )}

          {/* Bottom padding for safe area */}
          <div className="h-32" />
        </div>

        {/* Footer - Apply Button */}
        <div
          className="fixed bottom-0 left-0 right-0 px-4 py-4 border-t border-gray-100 bg-white lg:hidden"
          style={{ paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))' }}
        >
          <button
            onClick={onClose}
            className="w-full py-4 bg-[#ff6f61] text-white font-bold rounded-2xl active:scale-[0.98] transition-transform shadow-lg"
          >
            Show Results {totalFilters > 0 && `(${totalFilters} filters)`}
          </button>
        </div>
      </div>
    </>
  );
}

