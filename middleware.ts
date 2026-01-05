import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n/request';

export default createMiddleware({
  // Supported languages: English, Portuguese, Arabic, Spanish
  locales: locales as unknown as string[],

  // Used when no locale matches
  defaultLocale: 'en',

  // Always show locale prefix for consistent SEO URLs (/en/, /pt/, /ar/, /es/)
  localePrefix: 'always'
});

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};

