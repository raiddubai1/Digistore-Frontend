"use client";

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-10 h-10 text-[#ff6f61] animate-spin mx-auto" />
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
}

