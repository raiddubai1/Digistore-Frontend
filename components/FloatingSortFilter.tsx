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
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 lg:hidden">
      <div className="flex items-center gap-3 bg-black/95 backdrop-blur-sm rounded-full px-2 py-2 shadow-2xl">
        {/* Sort Button */}
        <button
          onClick={onSortClick}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-full font-semibold text-sm active:scale-95 transition-transform"
        >
          <ArrowUpDown className="w-4 h-4" />
          SORT
        </button>

        {/* Filter Button */}
        <button
          onClick={onFilterClick}
          className="relative flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-full font-semibold text-sm active:scale-95 transition-transform"
        >
          <SlidersHorizontal className="w-4 h-4" />
          FILTER
          {/* Active Filters Badge */}
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#ff6f61] text-white text-xs font-bold rounded-full flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

