"use client";

import { usePathname } from "next/navigation";
import Head from "next/head";

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
  
  const canonicalUrl = `${baseUrl}${cleanPath}`;

  return (
    <>
      <link rel="canonical" href={canonicalUrl} />
      {/* Add alternate language links for i18n */}
      <link rel="alternate" hrefLang="en" href={`${baseUrl}/en${cleanPath.replace(/^\/(en|ar|es|fr|de)/, '')}`} />
      <link rel="alternate" hrefLang="ar" href={`${baseUrl}/ar${cleanPath.replace(/^\/(en|ar|es|fr|de)/, '')}`} />
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/en${cleanPath.replace(/^\/(en|ar|es|fr|de)/, '')}`} />
    </>
  );
}

