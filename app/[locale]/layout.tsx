import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import ConditionalLayout from "@/components/ConditionalLayout";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";

const locales = ['en', 'ar', 'es', 'fr', 'de'];

export const metadata: Metadata = {
  title: "Digistore1 - Premium Digital Products Marketplace",
  description: "Download high-quality digital products instantly. eBooks, templates, tools, and more. Your one-stop shop for digital downloads.",
  keywords: ["digital products", "ebooks", "templates", "downloads", "digital marketplace"],
  authors: [{ name: "Digistore1" }],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover", // For iPhone notch support
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
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
    url: "https://www.digistore1.com",
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
      <div className="flex flex-col min-h-screen min-h-dvh overflow-x-hidden">
        <AuthProvider>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
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
      </div>
    </NextIntlClientProvider>
  );
}

