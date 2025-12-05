"use client";

import { useState, useEffect } from "react";
import { ChevronRight, X, Check } from "lucide-react";
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

      {/* Active Filters Summary */}
      {totalSelected > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3 pb-3 border-b border-gray-100">
          {selectedCategories.map(slug => {
            const cat = categories.find(c => c.slug === slug);
            return cat ? (
              <span
                key={slug}
                className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium"
              >
                {cat.name}
                <button onClick={() => onToggleCategory(slug)} className="hover:bg-primary/20 rounded-full p-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ) : null;
          })}
          {selectedSubcategories.map(slug => {
            const cat = categories.find(c => c.slug === slug);
            return cat ? (
              <span
                key={slug}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium"
              >
                {cat.name}
                <button onClick={() => onToggleSubcategory(slug)} className="hover:bg-gray-200 rounded-full p-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ) : null;
          })}
        </div>
      )}

      {/* Dual Column Layout */}
      <div className="flex gap-2">
        {/* Left Column - Parent Categories */}
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-2 px-1">
            Main
          </div>
          <div className="space-y-1 max-h-[220px] overflow-y-auto pr-1">
            {parentCategories.map((category) => {
              const isSelected = selectedCategories.includes(category.slug);
              const hasSubcategories = getSubcategoriesForParent(category.slug).length > 0;
              
              return (
                <button
                  key={category.id}
                  onClick={() => onToggleCategory(category.slug)}
                  className={cn(
                    "w-full flex items-center gap-1.5 px-2 py-2 rounded-lg text-xs font-medium transition-all text-left",
                    isSelected
                      ? "bg-primary text-white shadow-sm"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <span className="flex-1 truncate">{category.name}</span>
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-full",
                    isSelected ? "bg-white/20" : "bg-gray-200 text-gray-500"
                  )}>
                    {category.productCount}
                  </span>
                  {hasSubcategories && (
                    <ChevronRight className={cn(
                      "w-3 h-3 flex-shrink-0 transition-transform",
                      isSelected && "rotate-90"
                    )} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column - Subcategories (only when parent selected) */}
        {availableSubcategories.length > 0 && (
          <div className="flex-1 min-w-0 border-l border-gray-100 pl-2">
            <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-2 px-1">
              Sub
            </div>
            <div className="space-y-1 max-h-[220px] overflow-y-auto pr-1">
              {availableSubcategories.map((subcategory) => {
                const isSelected = selectedSubcategories.includes(subcategory.slug);
                
                return (
                  <button
                    key={subcategory.id}
                    onClick={() => onToggleSubcategory(subcategory.slug)}
                    className={cn(
                      "w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium transition-all text-left",
                      isSelected
                        ? "bg-primary text-white shadow-sm"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    {isSelected && <Check className="w-3 h-3 flex-shrink-0" />}
                    <span className="flex-1 truncate">{subcategory.name}</span>
                    <span className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded-full",
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
    </div>
  );
}

