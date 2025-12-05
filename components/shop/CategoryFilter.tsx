"use client";

import { ChevronLeft, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryWithChildren {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  children?: CategoryWithChildren[];
  productCount?: number;
}

interface CategoryFilterProps {
  categories: CategoryWithChildren[];
  selectedCategories: string[];
  selectedSubcategories: string[];
  onToggleCategory: (slug: string) => void;
  onToggleSubcategory: (slug: string) => void;
  onClearCategories?: () => void;
}

export default function CategoryFilter({
  categories,
  selectedCategories,
  selectedSubcategories,
  onToggleCategory,
  onToggleSubcategory,
  onClearCategories,
}: CategoryFilterProps) {
  // Get parent categories with products
  const parentCategories = categories.filter(c => !c.parentId && (c.productCount || 0) > 0);

  // Get subcategories for selected parent categories
  const getSubcategoriesForParent = (parentSlug: string) => {
    const parent = categories.find(c => c.slug === parentSlug);
    if (!parent) return [];
    return categories.filter(c => c.parentId === parent.id && (c.productCount || 0) > 0);
  };

  // Get all available subcategories based on selected parents
  const availableSubcategories = selectedCategories.flatMap(slug => getSubcategoriesForParent(slug));

  // Get the selected parent category for header display
  const selectedParent = selectedCategories.length === 1
    ? categories.find(c => c.slug === selectedCategories[0])
    : null;

  const totalSelected = selectedCategories.length + selectedSubcategories.length;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm text-gray-700">Categories</h3>
        {totalSelected > 0 && onClearCategories && (
          <button
            onClick={onClearCategories}
            className="text-xs text-primary hover:text-primary-dark font-medium flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {/* When a category is selected - show stacked layout */}
      {selectedCategories.length > 0 ? (
        <div className="space-y-3">
          {/* Selected category header with back */}
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <button
              onClick={onClearCategories}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            </button>
            <div className="flex-1 flex flex-wrap gap-1.5">
              {selectedCategories.map(slug => {
                const cat = categories.find(c => c.slug === slug);
                return cat ? (
                  <span
                    key={slug}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-primary text-white text-xs rounded-full font-medium"
                  >
                    {cat.name}
                    <button onClick={() => onToggleCategory(slug)} className="hover:bg-white/20 rounded-full">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ) : null;
              })}
            </div>
          </div>

          {/* Subcategories - full width */}
          {availableSubcategories.length > 0 && (
            <div>
              <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-2">
                Subcategories
              </div>
              <div className="space-y-1 max-h-[200px] overflow-y-auto">
                {availableSubcategories.map((subcategory) => {
                  const isSelected = selectedSubcategories.includes(subcategory.slug);

                  return (
                    <button
                      key={subcategory.id}
                      onClick={() => onToggleSubcategory(subcategory.slug)}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all text-left",
                        isSelected
                          ? "bg-primary text-white shadow-sm"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      {isSelected && <Check className="w-4 h-4 flex-shrink-0" />}
                      <span className="flex-1">{subcategory.name}</span>
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        isSelected ? "bg-white/20" : "bg-gray-200 text-gray-500"
                      )}>
                        {subcategory.productCount}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* No category selected - show full-width category list */
        <div className="space-y-1 max-h-[280px] overflow-y-auto">
          {parentCategories.map((category) => {
            const hasSubcategories = getSubcategoriesForParent(category.slug).length > 0;

            return (
              <button
                key={category.id}
                onClick={() => onToggleCategory(category.slug)}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left bg-gray-50 text-gray-700 hover:bg-gray-100"
              >
                <span className="flex-1">{category.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-500">
                  {category.productCount}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

