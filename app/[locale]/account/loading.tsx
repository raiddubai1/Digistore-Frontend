"use client";

export default function AccountLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Mobile View */}
      <div className="lg:hidden pb-24">
        <div className="bg-white dark:bg-slate-800 p-6">
          <div className="flex items-center gap-4 animate-pulse">
            <div className="w-20 h-20 bg-gray-200 dark:bg-slate-700 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
            </div>
          </div>
        </div>
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-4 flex items-center gap-4 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 dark:bg-slate-700 rounded-lg" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/3" />
              </div>
              <div className="w-5 h-5 bg-gray-200 dark:bg-slate-700 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block max-w-4xl mx-auto py-12 px-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 mb-8 animate-pulse">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gray-200 dark:bg-slate-700 rounded-full" />
            <div className="flex-1 space-y-3">
              <div className="h-7 bg-gray-200 dark:bg-slate-700 rounded w-1/3" />
              <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-1/4" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-lg" />
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

