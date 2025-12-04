"use client";

export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Mobile View */}
      <div className="lg:hidden pb-24">
        <div className="bg-white dark:bg-slate-800 p-4 border-b border-gray-200 dark:border-slate-700">
          <div className="h-6 w-24 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mx-auto" />
        </div>
        <div className="p-4 space-y-4">
          {/* Cart Items */}
          {[1, 2].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-4 flex gap-4 animate-pulse">
              <div className="w-20 h-20 bg-gray-200 dark:bg-slate-700 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
                <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-1/4" />
              </div>
            </div>
          ))}
          {/* Summary */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 space-y-3 animate-pulse">
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/4" />
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/6" />
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-slate-700">
              <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-1/4" />
              <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-1/5" />
            </div>
          </div>
          {/* Payment button */}
          <div className="h-14 bg-gray-200 dark:bg-slate-700 rounded-xl animate-pulse" />
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block max-w-6xl mx-auto py-12 px-8">
        <div className="h-10 w-32 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mb-8" />
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 flex gap-6 animate-pulse">
                <div className="w-24 h-24 bg-gray-200 dark:bg-slate-700 rounded-lg" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
                  <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 h-fit space-y-4 animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/5" />
                </div>
              ))}
            </div>
            <div className="h-14 bg-gray-200 dark:bg-slate-700 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

