import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

// Supported languages: English, Portuguese, Arabic, Spanish
export const locales = ["en", "pt", "ar", "es"] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale as Locale)) {
    locale = 'en'; // Default to English
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});

