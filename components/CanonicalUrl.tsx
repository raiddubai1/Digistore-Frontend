"use client";

import { usePathname } from "next/navigation";

// Supported languages: English, Portuguese, Arabic, Spanish
const locales = ["en", "pt", "ar", "es"] as const;

interface CanonicalUrlProps {
  baseUrl?: string;
}

export default function CanonicalUrl({
  baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.digistore1.com",
}: CanonicalUrlProps) {
  const pathname = usePathname();

  // Remove trailing slash if present
  const cleanPath = pathname.endsWith("/") && pathname !== "/"
    ? pathname.slice(0, -1)
    : pathname;

  // Remove locale prefix to get the base path
  const pathWithoutLocale = cleanPath.replace(/^\/(en|pt|ar|es)/, '') || '/';

  const canonicalUrl = `${baseUrl}${cleanPath}`;

  return (
    <>
      <link rel="canonical" href={canonicalUrl} />
      {/* Add alternate language links for i18n - SEO hreflang tags */}
      {locales.map((locale) => (
        <link
          key={locale}
          rel="alternate"
          hrefLang={locale}
          href={`${baseUrl}/${locale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`}
        />
      ))}
      {/* x-default points to English version */}
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/en${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`} />
    </>
  );
}

