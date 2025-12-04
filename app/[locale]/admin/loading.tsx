"use client";

import { TableSkeleton } from "@/components/Skeletons";

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between animate-pulse">
          <div className="h-8 w-48 bg-gray-200 dark:bg-slate-700 rounded" />
          <div className="h-10 w-32 bg-gray-200 dark:bg-slate-700 rounded-lg" />
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-gray-200 dark:bg-slate-700 rounded" />
                  <div className="h-8 w-24 bg-gray-200 dark:bg-slate-700 rounded" />
                </div>
                <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
        
        {/* Table */}
        <TableSkeleton rows={8} cols={5} />
      </div>
    </div>
  );
}

