import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import ConditionalLayout from "@/components/ConditionalLayout";
import PWAProvider from "@/components/PWAProvider";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Supported languages: English, Portuguese, Arabic, Spanish
const locales = ['en', 'pt', 'ar', 'es'];

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover", // For iPhone notch support
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.digistore1.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "Digistore1 - Premium Digital Products Marketplace",
  description: "Download high-quality digital products instantly. eBooks, templates, tools, and more. Your one-stop shop for digital downloads.",
  keywords: ["digital products", "ebooks", "templates", "downloads", "digital marketplace"],
  authors: [{ name: "Digistore1" }],
  alternates: {
    canonical: "/en",
    languages: {
      "en": "/en",
      "pt": "/pt",
      "ar": "/ar",
      "es": "/es",
      "x-default": "/en",
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Digistore1",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "Digistore1 - Premium Digital Products",
    description: "Download high-quality digital products instantly",
    url: BASE_URL,
    siteName: "Digistore1",
    type: "website",
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeProvider>
        <div className="flex flex-col min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
          <AuthProvider>
            <PWAProvider>
              <ConditionalLayout>
                <div className="page-content">
                  {children}
                </div>
              </ConditionalLayout>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: "var(--bg-card)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border-color)",
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
            </PWAProvider>
          </AuthProvider>
        </div>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}

