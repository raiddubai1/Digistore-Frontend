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
    // Positioned right above the bottom nav (h-16 = 64px + safe area)
    <div className="fixed bottom-[calc(64px+env(safe-area-inset-bottom))] left-0 right-0 z-40 lg:hidden">
      <div className="flex bg-black">
        {/* Sort Button */}
        <button
          onClick={onSortClick}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 text-white text-xs font-medium tracking-wide active:bg-gray-800 transition-colors border-r border-gray-700"
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          SORT
        </button>

        {/* Filter Button */}
        <button
          onClick={onFilterClick}
          className="relative flex-1 flex items-center justify-center gap-1.5 py-3 text-white text-xs font-medium tracking-wide active:bg-gray-800 transition-colors"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          FILTER
          {/* Active Filters Badge */}
          {activeFiltersCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 bg-white text-black text-[10px] font-bold rounded">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

