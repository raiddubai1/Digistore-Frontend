"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, X, Check } from "lucide-react";
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
  selectedCategories: string[];  // Level 1 (parent)
  selectedSubcategories: string[];  // Level 2 (sub)
  selectedLevel3?: string[];  // Level 3 (sub-sub)
  onToggleCategory: (slug: string) => void;
  onToggleSubcategory: (slug: string) => void;
  onToggleLevel3?: (slug: string) => void;
  onClearCategories?: () => void;
}

export default function CategoryFilter({
  categories,
  selectedCategories,
  selectedSubcategories,
  selectedLevel3 = [],
  onToggleCategory,
  onToggleSubcategory,
  onToggleLevel3,
  onClearCategories,
}: CategoryFilterProps) {
  // Navigation state: which level we're viewing
  // null = show level 1, string = show children of that slug
  const [viewingSlug, setViewingSlug] = useState<string | null>(null);

  // Get parent categories (Level 1)
  const parentCategories = categories.filter(c => !c.parentId && (c.productCount || 0) > 0);

  // Get children for a category by slug
  const getChildrenForSlug = (slug: string) => {
    const parent = categories.find(c => c.slug === slug);
    if (!parent) return [];
    return categories.filter(c => c.parentId === parent.id && (c.productCount || 0) > 0);
  };

  // Get the category by slug
  const getCategoryBySlug = (slug: string) => categories.find(c => c.slug === slug);

  // Get the parent of a category
  const getParentOfSlug = (slug: string) => {
    const cat = categories.find(c => c.slug === slug);
    if (!cat?.parentId) return null;
    return categories.find(c => c.id === cat.parentId);
  };

  // Determine current level being viewed
  const viewingCategory = viewingSlug ? getCategoryBySlug(viewingSlug) : null;
  const viewingChildren = viewingSlug ? getChildrenForSlug(viewingSlug) : [];
  const viewingParent = viewingSlug ? getParentOfSlug(viewingSlug) : null;

  // Calculate depth of viewing category
  const getDepth = (slug: string | null): number => {
    if (!slug) return 0;
    const cat = getCategoryBySlug(slug);
    if (!cat?.parentId) return 1;
    const parent = categories.find(c => c.id === cat.parentId);
    return parent ? getDepth(parent.slug) + 1 : 1;
  };
  const currentDepth = getDepth(viewingSlug);

  const totalSelected = selectedCategories.length + selectedSubcategories.length + selectedLevel3.length;

  // Handle selection based on depth
  const handleSelect = (slug: string, depth: number) => {
    if (depth === 1) onToggleCategory(slug);
    else if (depth === 2) onToggleSubcategory(slug);
    else if (depth === 3 && onToggleLevel3) onToggleLevel3(slug);
  };

  // Check if selected based on depth
  const isSelected = (slug: string, depth: number) => {
    if (depth === 1) return selectedCategories.includes(slug);
    if (depth === 2) return selectedSubcategories.includes(slug);
    if (depth === 3) return selectedLevel3.includes(slug);
    return false;
  };

  // Handle clear and reset view
  const handleClear = () => {
    setViewingSlug(null);
    onClearCategories?.();
  };

  // Build breadcrumb trail
  const getBreadcrumb = () => {
    if (!viewingSlug) return [];
    const trail: { slug: string; name: string }[] = [];
    let current = getCategoryBySlug(viewingSlug);
    while (current) {
      trail.unshift({ slug: current.slug, name: current.name });
      current = current.parentId ? categories.find(c => c.id === current!.parentId) : undefined;
    }
    return trail;
  };
  const breadcrumb = getBreadcrumb();

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm text-gray-700">Categories</h3>
        {totalSelected > 0 && (
          <button
            onClick={handleClear}
            className="text-xs text-primary hover:text-primary-dark font-medium flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {/* Active Filters Summary */}
      {totalSelected > 0 && (
        <div className="flex flex-wrap gap-1 mb-3 pb-2 border-b border-gray-100">
          {selectedCategories.map(slug => {
            const cat = getCategoryBySlug(slug);
            return cat ? (
              <span key={slug} className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary text-white text-[10px] rounded-full font-medium">
                {cat.name}
                <button onClick={() => onToggleCategory(slug)}><X className="w-2.5 h-2.5" /></button>
              </span>
            ) : null;
          })}
          {selectedSubcategories.map(slug => {
            const cat = getCategoryBySlug(slug);
            return cat ? (
              <span key={slug} className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/70 text-white text-[10px] rounded-full font-medium">
                {cat.name}
                <button onClick={() => onToggleSubcategory(slug)}><X className="w-2.5 h-2.5" /></button>
              </span>
            ) : null;
          })}
          {selectedLevel3.map(slug => {
            const cat = getCategoryBySlug(slug);
            return cat && onToggleLevel3 ? (
              <span key={slug} className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/50 text-white text-[10px] rounded-full font-medium">
                {cat.name}
                <button onClick={() => onToggleLevel3(slug)}><X className="w-2.5 h-2.5" /></button>
              </span>
            ) : null;
          })}
        </div>
      )}

      {/* Breadcrumb navigation */}
      {viewingSlug && (
        <div className="flex items-center gap-1 mb-2 text-xs">
          <button
            onClick={() => setViewingSlug(null)}
            className="text-primary hover:underline font-medium"
          >
            All
          </button>
          {breadcrumb.map((crumb, i) => (
            <span key={crumb.slug} className="flex items-center gap-1">
              <ChevronRight className="w-3 h-3 text-gray-400" />
              {i === breadcrumb.length - 1 ? (
                <span className="text-gray-600 font-medium">{crumb.name}</span>
              ) : (
                <button
                  onClick={() => setViewingSlug(crumb.slug)}
                  className="text-primary hover:underline font-medium"
                >
                  {crumb.name}
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      {/* Category List */}
      <div className="space-y-1 max-h-[280px] overflow-y-auto">
        {/* Back button when drilling down */}
        {viewingSlug && (
          <button
            onClick={() => setViewingSlug(viewingParent?.slug || null)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all text-left mb-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        )}

        {/* Show categories at current level */}
        {(viewingSlug ? viewingChildren : parentCategories).map((category) => {
          const children = getChildrenForSlug(category.slug);
          const hasChildren = children.length > 0;
          const depth = currentDepth + 1;
          const selected = isSelected(category.slug, depth);

          return (
            <div key={category.id} className="flex gap-1">
              {/* Select button */}
              <button
                onClick={() => handleSelect(category.slug, depth)}
                className={cn(
                  "flex-1 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all text-left",
                  selected
                    ? "bg-primary text-white shadow-sm"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                )}
              >
                {selected && <Check className="w-4 h-4 flex-shrink-0" />}
                <span className="flex-1 truncate">{category.name}</span>
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-full",
                  selected ? "bg-white/20" : "bg-gray-200 text-gray-500"
                )}>
                  {category.productCount}
                </span>
              </button>
              {/* Drill-down button */}
              {hasChildren && (
                <button
                  onClick={() => setViewingSlug(category.slug)}
                  className="px-2 py-2 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all"
                  title={`View ${children.length} subcategories`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

