"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import MegaMenu from "./MegaMenu";
import Footer from "./Footer";
import BottomNav from "./BottomNav";
import Cart from "./Cart";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // Check if we're on an admin page
  const isAdminPage = pathname.includes('/admin');
  
  // If admin page, render only children without the main site layout
  if (isAdminPage) {
    return <>{children}</>;
  }
  
  // Otherwise, render with the full site layout
  return (
    <>
      <Header />
      <MegaMenu />
      <main className="flex-1 pb-16 lg:pb-0">
        {children}
      </main>
      <Footer />
      <BottomNav />
      <Cart />
    </>
  );
}

