"use client";

import { ArrowUpDown, SlidersHorizontal } from "lucide-react";

interface FloatingSortFilterProps {
  onSortClick: () => void;
  onFilterClick: () => void;
  activeFiltersCount?: number;
}

export default function FloatingSortFilter({
  onSortClick,
  onFilterClick,
  activeFiltersCount = 0,
}: FloatingSortFilterProps) {
  return (
    // Positioned right above the bottom nav - centered pill buttons like ZARA
    <div className="fixed bottom-[calc(64px+env(safe-area-inset-bottom)+8px)] left-1/2 -translate-x-1/2 z-40 lg:hidden">
      <div className="flex items-center gap-2">
        {/* Sort Button */}
        <button
          onClick={onSortClick}
          className="flex items-center gap-1.5 px-4 py-2 bg-black text-white text-xs font-medium tracking-wide rounded-sm active:bg-gray-800 transition-colors"
        >
          <ArrowUpDown className="w-3 h-3" />
          SORT
        </button>

        {/* Filter Button */}
        <button
          onClick={onFilterClick}
          className="flex items-center gap-1.5 px-4 py-2 bg-black text-white text-xs font-medium tracking-wide rounded-sm active:bg-gray-800 transition-colors"
        >
          <SlidersHorizontal className="w-3 h-3" />
          FILTER
          {/* Active Filters Badge */}
          {activeFiltersCount > 0 && (
            <span className="ml-1 w-4 h-4 bg-white text-black text-[10px] font-bold rounded-full flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

