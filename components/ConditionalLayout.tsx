"use client";

import { Suspense } from "react";
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

  // Check if we're on an admin page
  const isAdminPage = pathname.includes('/admin');

  // If admin page, render only children without the main site layout
  if (isAdminPage) {
    return (
      <>
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        {children}
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

