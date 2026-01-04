import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${inter.variable} overflow-x-hidden`} suppressHydrationWarning>
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Digistore1" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Digistore1" />
        <meta name="msapplication-TileColor" content="#FF6B35" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className="overflow-x-hidden" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
