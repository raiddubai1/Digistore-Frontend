"use client";

import { CategoryCardSkeleton } from "@/components/Skeletons";

export default function CategoriesLoading() {
  return (
    <>
      {/* Mobile View */}
      <div className="lg:hidden min-h-screen bg-white pb-24">
        {/* Header skeleton */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-4">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mx-auto" />
        </div>
        {/* Category List */}
        <div className="divide-y divide-gray-100">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-4 animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-3 bg-gray-200 rounded w-1/3" />
              </div>
              <div className="w-5 h-5 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header skeleton */}
          <div className="text-center mb-12 space-y-4">
            <div className="h-10 w-64 bg-gray-200 rounded-lg animate-pulse mx-auto" />
            <div className="h-5 w-96 bg-gray-200 rounded animate-pulse mx-auto" />
          </div>
          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl border-2 border-gray-200 p-8 animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-2xl mb-4" />
                <div className="h-6 bg-gray-200 rounded w-2/3 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-full mb-4" />
                <div className="flex items-center justify-between">
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                  <div className="h-5 w-5 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

