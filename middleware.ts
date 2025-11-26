import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n/request';

export default createMiddleware({
  // A list of all locales that are supported
  locales: locales as unknown as string[],

  // Used when no locale matches
  defaultLocale: 'en',
  
  // Don't use a locale prefix for the default locale
  localePrefix: 'as-needed'
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(ar|de|es|fr|en)/:path*']
};

