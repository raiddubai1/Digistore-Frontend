'use client';

import { WifiOff, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function OfflinePage() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <WifiOff className="w-12 h-12 text-gray-400" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          You're Offline
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-8">
          It looks like you've lost your internet connection. 
          Please check your connection and try again.
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleRefresh}
            className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            <Home className="w-5 h-5" />
            Go Home (Cached)
          </Link>
        </div>

        {/* Tips */}
        <div className="mt-8 p-4 bg-gray-100 rounded-xl text-left">
          <h3 className="font-medium text-gray-900 mb-2">Tips:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Check your WiFi or mobile data</li>
            <li>• Try moving to a location with better signal</li>
            <li>• Disable airplane mode if enabled</li>
          </ul>
        </div>

        {/* Branding */}
        <p className="mt-8 text-sm text-gray-400">
          Digistore1 - Digital Products Marketplace
        </p>
      </div>
    </div>
  );
}

