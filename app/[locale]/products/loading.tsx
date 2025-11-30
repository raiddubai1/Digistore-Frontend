"use client";

import { ProductCardSkeleton } from "@/components/Skeletons";

export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Mobile View */}
      <div className="lg:hidden">
        {/* Header skeleton */}
        <div className="bg-white dark:bg-slate-800 p-4 border-b border-gray-200 dark:border-slate-700">
          <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded-xl animate-pulse" />
        </div>
        {/* Filter pills skeleton */}
        <div className="flex gap-2 p-4 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 w-20 bg-gray-200 dark:bg-slate-700 rounded-full animate-pulse flex-shrink-0" />
          ))}
        </div>
        {/* Products grid */}
        <div className="grid grid-cols-2 gap-3 p-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block max-w-7xl mx-auto px-8 py-8">
        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div className="h-10 w-48 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse" />
          <div className="flex gap-4">
            <div className="h-10 w-32 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse" />
            <div className="h-10 w-32 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse" />
          </div>
        </div>
        {/* Products grid */}
        <div className="grid grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

