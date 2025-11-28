"use client";

import { useEffect, useState, useRef } from "react";
import { RefreshCw } from "lucide-react";

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export default function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const threshold = 80; // Distance to trigger refresh

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      // Only trigger if at top of page
      if (window.scrollY === 0) {
        touchStartY = e.touches[0].clientY;
        setStartY(touchStartY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (window.scrollY === 0 && touchStartY > 0) {
        const touchY = e.touches[0].clientY;
        const distance = touchY - touchStartY;

        if (distance > 0) {
          // Prevent default scroll behavior
          e.preventDefault();
          // Apply resistance to pull distance
          const resistedDistance = Math.min(distance * 0.5, threshold * 1.5);
          setPullDistance(resistedDistance);
        }
      }
    };

    const handleTouchEnd = async () => {
      if (pullDistance >= threshold && !isRefreshing) {
        setIsRefreshing(true);
        try {
          await onRefresh();
        } catch (error) {
          console.error("Refresh failed:", error);
        } finally {
          setIsRefreshing(false);
        }
      }
      setPullDistance(0);
      setStartY(0);
    };

    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [pullDistance, isRefreshing, onRefresh]);

  const rotation = Math.min((pullDistance / threshold) * 360, 360);
  const opacity = Math.min(pullDistance / threshold, 1);

  return (
    <div ref={containerRef} className="relative">
      {/* Pull to Refresh Indicator */}
      <div
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-center pointer-events-none lg:hidden"
        style={{
          transform: `translateY(${Math.min(pullDistance - 40, 40)}px)`,
          opacity: opacity,
          transition: pullDistance === 0 ? "all 0.3s ease" : "none",
        }}
      >
        <div className="bg-white rounded-full shadow-lg p-3 mt-4">
          <RefreshCw
            className={`w-6 h-6 text-gray-600 ${isRefreshing ? "animate-spin" : ""}`}
            style={{
              transform: isRefreshing ? "none" : `rotate(${rotation}deg)`,
              transition: isRefreshing ? "none" : "transform 0.1s ease",
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          transform: `translateY(${pullDistance > 0 ? Math.min(pullDistance * 0.3, 30) : 0}px)`,
          transition: pullDistance === 0 ? "transform 0.3s ease" : "none",
        }}
      >
        {children}
      </div>
    </div>
  );
}

