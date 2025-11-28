"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import MegaMenu from "./MegaMenu";
import Footer from "./Footer";
import BottomNav from "./BottomNav";
import Cart from "./Cart";
import SplashScreen from "./SplashScreen";
import FloatingActionButton from "./FloatingActionButton";
import SearchModal from "./SearchModal";
import { useCartStore } from "@/store/cartStore";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { openCart } = useCartStore();
  
  // Check if we're on an admin page
  const isAdminPage = pathname.includes('/admin');
  
  // If admin page, render only children without the main site layout
  if (isAdminPage) {
    return <>{children}</>;
  }
  
  // Otherwise, render with the full site layout
  return (
    <>
      <SplashScreen />
      <Header />
      <MegaMenu />
      <main className="flex-1 pb-16 lg:pb-0">
        {children}
      </main>
      <Footer />
      <BottomNav />
      <FloatingActionButton
        onSearchClick={() => setIsSearchOpen(true)}
        onCartClick={openCart}
      />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      <Cart />
    </>
  );
}

