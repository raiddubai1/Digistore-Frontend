"use client";

import { Suspense, useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import MegaMenu from "./MegaMenu";
import Footer from "./Footer";
import BottomNav from "./BottomNav";
import Cart from "./Cart";
import SplashScreen from "./SplashScreen";
import NavigationProgress from "./NavigationProgress";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();

  // Fix Chrome scrolling issue - force scroll recognition on document
  useEffect(() => {
    // Chrome sometimes fails to recognize the scroll container
    // This forces a reflow that fixes wheel event handling
    const fixChromeScroll = () => {
      // Trigger a minimal reflow by reading/writing a layout property
      document.documentElement.style.overflow = '';
      void document.documentElement.offsetHeight; // Force reflow
      document.documentElement.style.overflow = '';
    };

    // Run on mount and after a short delay (for hydration)
    fixChromeScroll();
    const timer = setTimeout(fixChromeScroll, 100);

    // Also fix when window regains focus (Chrome can lose scroll context)
    window.addEventListener('focus', fixChromeScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('focus', fixChromeScroll);
    };
  }, []);

  // Check if we're on an admin page
  const isAdminPage = pathname.includes('/admin');

  // Check if we're on the ultimate-bundle landing page (minimal layout)
  const isLandingPage = pathname.includes('/ultimate-bundle');

  // If admin page or landing page, render only children without the main site layout
  if (isAdminPage || isLandingPage) {
    return (
      <>
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        {children}
        {/* Keep cart available on landing page */}
        {isLandingPage && <Cart />}
      </>
    );
  }

  // Otherwise, render with the full site layout
  return (
    <>
      <Suspense fallback={null}>
        <NavigationProgress />
      </Suspense>
      <SplashScreen />
      <Header />
      <MegaMenu />
      {/* Main content - extra padding on mobile for bottom nav + safe area */}
      <main className="flex-1 pb-[calc(64px+env(safe-area-inset-bottom,0px))] lg:pb-0">
        {children}
      </main>
      <Footer />
      <BottomNav />
      <Cart />
    </>
  );
}

