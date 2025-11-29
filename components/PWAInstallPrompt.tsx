'use client';

import { useState, useEffect } from 'react';
import { X, Download, Share, Plus } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // Listen for beforeinstallprompt event (Chrome, Edge, etc.)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Check if user has dismissed prompt before
      const dismissed = localStorage.getItem('pwa-prompt-dismissed');
      const dismissedTime = dismissed ? parseInt(dismissed) : 0;
      const oneWeek = 7 * 24 * 60 * 60 * 1000;
      
      if (!dismissed || Date.now() - dismissedTime > oneWeek) {
        // Show prompt after a delay (better UX)
        setTimeout(() => setShowPrompt(true), 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS, show custom prompt if not standalone
    if (iOS && !standalone) {
      const dismissed = localStorage.getItem('pwa-prompt-dismissed');
      const dismissedTime = dismissed ? parseInt(dismissed) : 0;
      const oneWeek = 7 * 24 * 60 * 60 * 1000;
      
      if (!dismissed || Date.now() - dismissedTime > oneWeek) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setShowPrompt(false);
        setDeferredPrompt(null);
      }
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  // Don't show if already installed
  if (isStandalone || !showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 lg:left-auto lg:right-6 lg:bottom-6 lg:w-96 z-50 animate-slideUp">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-black to-gray-800 text-white p-4 flex items-center gap-3">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
            <span className="text-2xl font-bold text-[#ff6f61]">D1</span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Install Digistore1</h3>
            <p className="text-sm text-gray-300">Get the full app experience</p>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {isIOS ? (
            // iOS Instructions
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Install this app on your iPhone:
              </p>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Share className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm">Tap the <strong>Share</strong> button</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Plus className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm">Tap <strong>Add to Home Screen</strong></span>
              </div>
            </div>
          ) : (
            // Android/Desktop Install
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>✓</span>
                <span>Faster loading & offline access</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>✓</span>
                <span>Push notifications for orders</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>✓</span>
                <span>Full-screen experience</span>
              </div>
              <button
                onClick={handleInstall}
                className="w-full mt-2 flex items-center justify-center gap-2 bg-[#ff6f61] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#e55a4d] transition-colors"
              >
                <Download className="w-5 h-5" />
                Install App
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

