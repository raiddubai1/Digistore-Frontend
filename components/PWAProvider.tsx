'use client';

import { useEffect, useState } from 'react';
import { usePWA, useOnlineStatus } from '@/hooks/usePWA';
import PWAInstallPrompt from './PWAInstallPrompt';
import { WifiOff } from 'lucide-react';

export default function PWAProvider({ children }: { children: React.ReactNode }) {
  const isOnline = useOnlineStatus();
  const [showOfflineBanner, setShowOfflineBanner] = useState(false);

  useEffect(() => {
    // Register service worker on mount
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker registered');
        })
        .catch((err) => {
          console.error('[PWA] SW registration failed:', err);
        });
    }
  }, []);

  useEffect(() => {
    if (!isOnline) {
      setShowOfflineBanner(true);
    } else {
      // Hide banner after a short delay when back online
      const timer = setTimeout(() => setShowOfflineBanner(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  return (
    <>
      {/* Offline Banner */}
      {showOfflineBanner && (
        <div 
          className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
            isOnline ? 'bg-green-500' : 'bg-gray-800'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-2 text-white text-sm">
            {isOnline ? (
              <>
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span>Back online!</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4" />
                <span>You're offline. Some features may not work.</span>
              </>
            )}
          </div>
        </div>
      )}

      {children}

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </>
  );
}

