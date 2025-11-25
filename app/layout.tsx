import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import MegaMenu from "@/components/MegaMenu";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import Cart from "@/components/Cart";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Digistore1 - Premium Digital Products Marketplace",
  description: "Download high-quality digital products instantly. eBooks, templates, tools, and more. Your one-stop shop for digital downloads.",
  keywords: ["digital products", "ebooks", "templates", "downloads", "digital marketplace"],
  authors: [{ name: "Digistore1" }],
  openGraph: {
    title: "Digistore1 - Premium Digital Products",
    description: "Download high-quality digital products instantly",
    url: "https://www.digistore1.com",
    siteName: "Digistore1",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen" suppressHydrationWarning>
        <AuthProvider>
          <Header />
          <MegaMenu />
          <main className="flex-1 pb-16 lg:pb-0">
            {children}
          </main>
          <Footer />
          <BottomNav />
          <Cart />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#fff",
                color: "#2D2D2D",
                border: "1px solid #E5E7EB",
                borderRadius: "0.75rem",
                padding: "1rem",
              },
              success: {
                iconTheme: {
                  primary: "#10B981",
                  secondary: "#fff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#EF4444",
                  secondary: "#fff",
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
