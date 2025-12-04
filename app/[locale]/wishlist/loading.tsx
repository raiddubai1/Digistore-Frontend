"use client";

import { ProductCardSkeleton } from "@/components/Skeletons";

export default function WishlistLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Mobile View */}
      <div className="lg:hidden pb-24">
        <div className="bg-white dark:bg-slate-800 p-4 border-b border-gray-200 dark:border-slate-700">
          <div className="h-6 w-24 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mx-auto" />
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block max-w-7xl mx-auto py-12 px-8">
        <div className="h-10 w-40 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mb-8" />
        <div className="grid grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

