"use client";

import { useEffect, useState } from "react";
import { X, Check, RotateCcw, ChevronDown, ChevronUp, Tag, DollarSign, Star, FileType, ChevronRight, ChevronLeft, Sliders } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryWithChildren {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  children?: CategoryWithChildren[];
  productCount?: number;
}

interface AttributeWithCounts {
  id: string;
  name: string;
  slug: string;
  optionsWithCounts: { option: string; count: number }[];
}

interface FilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryWithChildren[];
  selectedCategories: string[];
  selectedSubcategories?: string[];
  selectedPriceRanges: string[];
  selectedRatings: string[];
  selectedFileTypes?: string[];
  availableTags?: { tag: string; count: number }[];
  selectedTags?: string[];
  // Attributes support
  attributes?: AttributeWithCounts[];
  selectedAttributes?: Record<string, string[]>;
  onToggleAttribute?: (attributeSlug: string, value: string) => void;
  onToggleCategory: (category: string) => void;
  onToggleSubcategory?: (subcategory: string) => void;
  onTogglePriceRange: (range: string) => void;
  onToggleRating: (rating: string) => void;
  onToggleFileType?: (fileType: string) => void;
  onToggleTag?: (tag: string) => void;
  onClearAll: () => void;
}

const priceRanges = [
  { value: "free", label: "Free", icon: "🆓" },
  { value: "0-2.99", label: "$0 - $2.99", icon: "💵" },
  { value: "3-4.99", label: "$3 - $4.99", icon: "💰" },
  { value: "5-6.99", label: "$5 - $6.99", icon: "💵" },
  { value: "7-9.99", label: "$7 - $9.99", icon: "💰" },
  { value: "10+", label: "$10+", icon: "💎" },
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

// Collapsible section component with internal scrolling
function FilterSection({
  title,
  icon: Icon,
  count,
  children,
  defaultOpen = false,
  maxHeight = "200px"
}: {
  title: string;
  icon: React.ElementType;
  count: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
  maxHeight?: string;
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
      {/* Expanded content with its own scroll container */}
      <div
        className={cn(
          "transition-all duration-300 ease-out",
          isOpen ? "opacity-100 pb-4" : "max-h-0 opacity-0 overflow-hidden"
        )}
      >
        <div
          className="px-1 overflow-y-auto overscroll-contain"
          style={{
            maxHeight: isOpen ? maxHeight : '0px',
            WebkitOverflowScrolling: 'touch'
          }}
          onTouchMove={(e) => e.stopPropagation()}
        >
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
  selectedSubcategories = [],
  selectedPriceRanges,
  selectedRatings,
  selectedFileTypes = [],
  availableTags = [],
  selectedTags = [],
  attributes = [],
  selectedAttributes = {},
  onToggleAttribute,
  onToggleCategory,
  onToggleSubcategory,
  onTogglePriceRange,
  onToggleRating,
  onToggleFileType,
  onToggleTag,
  onClearAll,
}: FilterBottomSheetProps) {
  // Count selected attribute values
  const selectedAttributeCount = Object.values(selectedAttributes).reduce((sum, values) => sum + values.length, 0);
  const totalFilters = selectedCategories.length + selectedSubcategories.length + selectedPriceRanges.length + selectedRatings.length + selectedFileTypes.length + selectedTags.length + selectedAttributeCount;

  // Drill-down state for category navigation
  const [categoryDrillDown, setCategoryDrillDown] = useState<string | null>(null);

  // Filter to only parent categories with products
  const parentCategories = categories.filter(cat => !cat.parentId && (cat.productCount || 0) > 0);

  // Get subcategories for a specific parent
  const getSubcategoriesForParent = (parentSlug: string) => {
    const parent = categories.find(c => c.slug === parentSlug);
    if (!parent) return [];
    return categories.filter(c => c.parentId === parent.id && (c.productCount || 0) > 0);
  };

  // Get subcategories for drill-down view
  const drillDownSubcategories = categoryDrillDown ? getSubcategoriesForParent(categoryDrillDown) : [];
  const drillDownParent = categoryDrillDown ? categories.find(c => c.slug === categoryDrillDown) : null;

  // Get subcategories for selected parent categories (for display)
  const availableSubcategories = categories.filter(cat => {
    if (!cat.parentId) return false;
    const parentSlug = categories.find(p => p.id === cat.parentId)?.slug;
    return parentSlug && selectedCategories.includes(parentSlug) && (cat.productCount || 0) > 0;
  });

  // Reset drill-down when sheet closes
  useEffect(() => {
    if (!isOpen) {
      setCategoryDrillDown(null);
    }
  }, [isOpen]);

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
          {/* Active Category Filters Summary */}
          {(selectedCategories.length > 0 || selectedSubcategories.length > 0) && (
            <div className="py-3 border-b border-gray-100 mb-2">
              <div className="text-xs text-gray-500 mb-2 font-medium">Active Category Filters</div>
              <div className="flex flex-wrap gap-2">
                {selectedCategories.map(slug => {
                  const cat = categories.find(c => c.slug === slug);
                  return cat ? (
                    <button
                      key={slug}
                      onClick={() => onToggleCategory(slug)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#ff6f61] text-white text-xs rounded-full font-medium"
                    >
                      {cat.name}
                      <X className="w-3 h-3" />
                    </button>
                  ) : null;
                })}
                {selectedSubcategories.map(slug => {
                  const cat = categories.find(c => c.slug === slug);
                  return cat && onToggleSubcategory ? (
                    <button
                      key={slug}
                      onClick={() => onToggleSubcategory(slug)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded-full font-medium"
                    >
                      {cat.name}
                      <X className="w-3 h-3" />
                    </button>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* Categories Section with Drill-Down */}
          {parentCategories.length > 0 && !categoryDrillDown && (
            <FilterSection
              title="Categories"
              icon={Tag}
              count={selectedCategories.length}
              defaultOpen={true}
              maxHeight="320px"
            >
              <div className="space-y-2">
                {parentCategories.map((category) => {
                  const hasSubcategories = getSubcategoriesForParent(category.slug).length > 0;
                  const isSelected = selectedCategories.includes(category.slug);

                  return (
                    <div key={category.id} className="flex gap-2">
                      {/* Select button */}
                      <button
                        onClick={() => onToggleCategory(category.slug)}
                        className={cn(
                          "flex-1 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left",
                          isSelected
                            ? "bg-[#ff6f61] text-white shadow-sm"
                            : "bg-gray-50 text-gray-700 active:bg-gray-100"
                        )}
                      >
                        {isSelected && <Check className="w-4 h-4 flex-shrink-0" />}
                        <span className="flex-1 truncate">{category.name}</span>
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full",
                          isSelected ? "bg-white/20" : "bg-gray-200 text-gray-600"
                        )}>
                          {category.productCount || 0}
                        </span>
                      </button>
                      {/* Drill-down button (only if has subcategories) */}
                      {hasSubcategories && (
                        <button
                          onClick={() => setCategoryDrillDown(category.slug)}
                          className="px-3 py-3 rounded-xl bg-gray-100 text-gray-600 active:bg-gray-200 transition-all"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </FilterSection>
          )}

          {/* Subcategories Drill-Down View */}
          {categoryDrillDown && drillDownParent && onToggleSubcategory && (
            <div className="py-2">
              {/* Back button */}
              <button
                onClick={() => setCategoryDrillDown(null)}
                className="flex items-center gap-2 px-2 py-2 mb-3 text-sm font-semibold text-gray-700 active:bg-gray-50 rounded-lg w-full"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Back to Categories</span>
              </button>

              {/* Parent category header */}
              <div className="flex items-center justify-between px-2 mb-3">
                <h3 className="text-lg font-bold text-gray-900">{drillDownParent.name}</h3>
                <button
                  onClick={() => onToggleCategory(drillDownParent.slug)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
                    selectedCategories.includes(drillDownParent.slug)
                      ? "bg-[#ff6f61] text-white"
                      : "bg-gray-100 text-gray-700"
                  )}
                >
                  {selectedCategories.includes(drillDownParent.slug) ? "Selected ✓" : "Select All"}
                </button>
              </div>

              {/* Subcategories grid */}
              <div className="grid grid-cols-2 gap-2">
                {drillDownSubcategories.map((subcategory) => {
                  const isSelected = selectedSubcategories.includes(subcategory.slug);

                  return (
                    <button
                      key={subcategory.id}
                      onClick={() => onToggleSubcategory(subcategory.slug)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-medium transition-all text-left",
                        isSelected
                          ? "bg-[#ff6f61] text-white shadow-sm"
                          : "bg-gray-50 text-gray-700 active:bg-gray-100"
                      )}
                    >
                      {isSelected && <Check className="w-4 h-4 flex-shrink-0" />}
                      <span className="flex-1 truncate">{subcategory.name}</span>
                      <span className={cn(
                        "text-xs px-1.5 py-0.5 rounded-full",
                        isSelected ? "bg-white/20" : "bg-gray-200 text-gray-500"
                      )}>
                        {subcategory.productCount || 0}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Only show other filters when NOT in drill-down mode */}
          {!categoryDrillDown && (
            <>
          {/* Subcategories Section - Quick access when parent category is selected */}
          {availableSubcategories.length > 0 && onToggleSubcategory && (
            <FilterSection
              title="Subcategories"
              icon={Tag}
              count={selectedSubcategories.length}
              defaultOpen={true}
              maxHeight="220px"
            >
              <div className="grid grid-cols-2 gap-2">
                {availableSubcategories.map((subcategory) => (
                  <button
                    key={subcategory.id}
                    onClick={() => onToggleSubcategory(subcategory.slug)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                      selectedSubcategories.includes(subcategory.slug)
                        ? "bg-[#ff6f61] text-white shadow-sm"
                        : "bg-gray-50 text-gray-700 active:bg-gray-100"
                    )}
                  >
                    {selectedSubcategories.includes(subcategory.slug) && (
                      <Check className="w-4 h-4 flex-shrink-0" />
                    )}
                    <span className="truncate text-left">{subcategory.name}</span>
                    <span className={cn(
                      "text-xs px-1.5 py-0.5 rounded-full ml-auto",
                      selectedSubcategories.includes(subcategory.slug) ? "bg-white/20" : "bg-gray-200 text-gray-600"
                    )}>
                      {subcategory.productCount || 0}
                    </span>
                  </button>
                ))}
              </div>
            </FilterSection>
          )}

          {/* Tags Section - Only show when we have tags available for the selected category */}
          {availableTags.length > 0 && onToggleTag && (
            <FilterSection
              title="Tags"
              icon={Tag}
              count={selectedTags.length}
              maxHeight="200px"
            >
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tagItem) => (
                  <button
                    key={tagItem.tag}
                    onClick={() => onToggleTag(tagItem.tag)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                      selectedTags.includes(tagItem.tag)
                        ? "bg-[#ff6f61] text-white shadow-sm"
                        : "bg-gray-100 text-gray-700 active:bg-gray-200"
                    )}
                  >
                    <span>{tagItem.tag}</span>
                    <span className={cn(
                      "text-xs",
                      selectedTags.includes(tagItem.tag) ? "text-white/70" : "text-gray-500"
                    )}>
                      ({tagItem.count})
                    </span>
                  </button>
                ))}
              </div>
            </FilterSection>
          )}

          {/* Attributes Sections - Dynamic based on available attributes */}
          {attributes.length > 0 && onToggleAttribute && (
            <>
              {attributes.map((attr) => (
                <FilterSection
                  key={attr.id}
                  title={attr.name}
                  icon={Sliders}
                  count={(selectedAttributes[attr.slug] || []).length}
                  maxHeight="220px"
                >
                  <div className="space-y-2">
                    {attr.optionsWithCounts.map(({ option, count }) => (
                      <button
                        key={option}
                        onClick={() => onToggleAttribute(attr.slug, option)}
                        className={cn(
                          "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all",
                          (selectedAttributes[attr.slug] || []).includes(option)
                            ? "bg-[#ff6f61] text-white shadow-sm"
                            : "bg-gray-50 text-gray-700 active:bg-gray-100"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span>{option}</span>
                          <span className={cn(
                            "text-xs",
                            (selectedAttributes[attr.slug] || []).includes(option) ? "text-white/70" : "text-gray-400"
                          )}>
                            ({count})
                          </span>
                        </div>
                        {(selectedAttributes[attr.slug] || []).includes(option) && (
                          <Check className="w-5 h-5" />
                        )}
                      </button>
                    ))}
                  </div>
                </FilterSection>
              ))}
            </>
          )}

          {/* Price Range Section */}
          <FilterSection
            title="Price Range"
            icon={DollarSign}
            count={selectedPriceRanges.length}
            maxHeight="280px"
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
            maxHeight="180px"
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
              maxHeight="220px"
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
            </>
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

