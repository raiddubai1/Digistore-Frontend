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
      <body className="overflow-x-hidden" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
