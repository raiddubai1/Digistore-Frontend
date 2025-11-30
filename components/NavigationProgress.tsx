"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const previousPath = useRef(pathname);

  const startProgress = useCallback(() => {
    setIsNavigating(true);
    setProgress(0);
    
    // Clear any existing interval
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    // Animate progress from 0 to 90% over time
    let currentProgress = 0;
    progressInterval.current = setInterval(() => {
      currentProgress += Math.random() * 15;
      if (currentProgress > 90) {
        currentProgress = 90;
        if (progressInterval.current) {
          clearInterval(progressInterval.current);
        }
      }
      setProgress(currentProgress);
    }, 100);
  }, []);

  const completeProgress = useCallback(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    setProgress(100);
    
    // Hide after animation completes
    setTimeout(() => {
      setIsNavigating(false);
      setProgress(0);
    }, 200);
  }, []);

  // Listen for route changes
  useEffect(() => {
    const currentPath = pathname + searchParams.toString();
    const prevPath = previousPath.current + (searchParams.toString() || '');
    
    if (currentPath !== prevPath) {
      completeProgress();
    }
    previousPath.current = pathname;
  }, [pathname, searchParams, completeProgress]);

  // Listen for navigation start via link clicks
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.href) {
        const url = new URL(anchor.href, window.location.origin);
        
        // Only trigger for internal navigation
        if (url.origin === window.location.origin && url.pathname !== pathname) {
          startProgress();
        }
      }
    };

    // Listen for programmatic navigation
    const originalPushState = window.history.pushState.bind(window.history);
    window.history.pushState = (...args) => {
      startProgress();
      return originalPushState(...args);
    };

    document.addEventListener('click', handleClick);
    
    return () => {
      document.removeEventListener('click', handleClick);
      window.history.pushState = originalPushState;
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [pathname, startProgress]);

  if (!isNavigating && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-0.5 bg-transparent pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-[#ff6f61] via-[#ff8c7a] to-[#ff6f61] transition-all duration-150 ease-out shadow-[0_0_10px_rgba(255,111,97,0.5)]"
        style={{
          width: `${progress}%`,
          opacity: isNavigating ? 1 : 0,
        }}
      />
    </div>
  );
}

