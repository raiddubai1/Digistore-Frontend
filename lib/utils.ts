import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx and tailwind-merge for optimal class handling
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Supported currencies with exchange rates (relative to USD)
// Only 4 currencies: USD (default), EUR, GBP, AED
export const CURRENCIES = {
  USD: { symbol: '$', name: 'US Dollar', rate: 1, flag: '🇺🇸' },
  EUR: { symbol: '€', name: 'Euro', rate: 0.92, flag: '🇪🇺' },
  GBP: { symbol: '£', name: 'British Pound', rate: 0.79, flag: '🇬🇧' },
  AED: { symbol: 'د.إ', name: 'UAE Dirham', rate: 3.67, flag: '🇦🇪' },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;

// Country to currency mapping for auto-detection
const COUNTRY_CURRENCY_MAP: Record<string, CurrencyCode> = {
  // EUR countries
  'DE': 'EUR', 'FR': 'EUR', 'IT': 'EUR', 'ES': 'EUR', 'NL': 'EUR',
  'BE': 'EUR', 'AT': 'EUR', 'PT': 'EUR', 'IE': 'EUR', 'FI': 'EUR',
  'GR': 'EUR', 'SK': 'EUR', 'SI': 'EUR', 'EE': 'EUR', 'LV': 'EUR',
  'LT': 'EUR', 'CY': 'EUR', 'MT': 'EUR', 'LU': 'EUR',
  // GBP
  'GB': 'GBP', 'UK': 'GBP',
  // AED countries (UAE and nearby)
  'AE': 'AED', 'SA': 'AED', 'QA': 'AED', 'KW': 'AED', 'BH': 'AED', 'OM': 'AED',
  // USD (US and others default to USD)
  'US': 'USD',
};

/**
 * Auto-detect currency based on visitor's location
 * Uses timezone as a fallback if geolocation fails
 */
export async function detectCurrency(): Promise<CurrencyCode> {
  try {
    // Try to get country from a free geo IP service
    const response = await fetch('https://ipapi.co/json/', {
      signal: AbortSignal.timeout(3000)
    });
    if (response.ok) {
      const data = await response.json();
      const countryCode = data.country_code;
      if (countryCode && COUNTRY_CURRENCY_MAP[countryCode]) {
        return COUNTRY_CURRENCY_MAP[countryCode];
      }
    }
  } catch {
    // Fallback to timezone-based detection
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (timezone.startsWith('Europe/London')) return 'GBP';
      if (timezone.startsWith('Europe/')) return 'EUR';
      if (timezone.startsWith('Asia/Dubai') || timezone.startsWith('Asia/Riyadh')) return 'AED';
    } catch {
      // Ignore timezone detection errors
    }
  }
  return 'USD'; // Default fallback
}

/**
 * Initialize currency - auto-detect if not set
 */
export async function initializeCurrency(): Promise<CurrencyCode> {
  if (typeof window === 'undefined') return 'USD';

  const stored = localStorage.getItem('currency') as CurrencyCode;
  // Only use stored value if it's one of our 4 allowed currencies
  if (stored && CURRENCIES[stored]) {
    return stored;
  }

  // Auto-detect and store
  const detected = await detectCurrency();
  localStorage.setItem('currency', detected);
  localStorage.setItem('currencyAutoDetected', 'true');
  return detected;
}

/**
 * Get stored currency or default to USD
 */
export function getCurrentCurrency(): CurrencyCode {
  if (typeof window === 'undefined') return 'USD';
  const stored = localStorage.getItem('currency') as CurrencyCode;
  // Validate it's one of our 4 allowed currencies
  if (stored && CURRENCIES[stored]) {
    return stored;
  }
  return 'USD';
}

/**
 * Set current currency
 */
export function setCurrency(currency: CurrencyCode): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('currency', currency);
    localStorage.removeItem('currencyAutoDetected'); // Mark as manually selected
    window.dispatchEvent(new Event('currencyChange'));
  }
}

/**
 * Smart rounding for clean, professional pricing
 * Rounds to psychological price points: .49, .95, .99
 */
function smartRoundPrice(price: number): number {
  if (price <= 0) return 0;

  const wholePart = Math.floor(price);
  const decimalPart = price - wholePart;

  // For very small prices (under $1), round to nearest .49 or .99
  if (wholePart === 0) {
    if (decimalPart < 0.25) return 0.49;
    if (decimalPart < 0.75) return 0.49;
    return 0.99;
  }

  // For prices $1-$10, use .49, .95, or .99 endings
  if (wholePart < 10) {
    if (decimalPart < 0.25) return wholePart - 0.01; // e.g., 2.99 (from previous whole)
    if (decimalPart < 0.50) return wholePart + 0.49;
    if (decimalPart < 0.75) return wholePart + 0.49;
    if (decimalPart < 0.90) return wholePart + 0.95;
    return wholePart + 0.99;
  }

  // For prices $10+, round to .99
  if (decimalPart < 0.50) {
    return wholePart - 0.01; // e.g., 14.99
  }
  return wholePart + 0.99;
}

/**
 * Convert price from USD to target currency
 */
export function convertPrice(priceUSD: number, targetCurrency?: CurrencyCode): number {
  const currency = targetCurrency || getCurrentCurrency();
  return priceUSD * CURRENCIES[currency].rate;
}

/**
 * Format price in specified or current currency
 * Returns "Free" for $0 prices
 * Applies smart rounding for clean display
 */
export function formatPrice(price: number, currency?: CurrencyCode): string {
  // Show "Free" for zero-price items
  if (price === 0) {
    return "Free";
  }

  const currencyCode = currency || getCurrentCurrency();
  const convertedPrice = currency ? price : convertPrice(price, currencyCode);

  // Apply smart rounding for clean pricing
  const roundedPrice = smartRoundPrice(convertedPrice);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(roundedPrice);
}

/**
 * Format date
 */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

/**
 * Truncate text
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

/**
 * Generate slug from text
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/**
 * Optimize Cloudinary image URL with automatic format and quality
 * Adds f_auto (auto format - WebP, AVIF based on browser) and q_auto (auto quality)
 * @param url - Original Cloudinary URL
 * @param options - Optional transformation options
 * @returns Optimized URL
 */
export function optimizeCloudinaryUrl(
  url: string | undefined | null,
  options?: {
    width?: number;
    height?: number;
    quality?: 'auto' | 'auto:low' | 'auto:eco' | 'auto:good' | 'auto:best';
    crop?: 'fill' | 'fit' | 'scale' | 'thumb' | 'crop';
  }
): string {
  if (!url) return '';

  // Only process Cloudinary URLs
  if (!url.includes('res.cloudinary.com')) {
    return url;
  }

  // Check if transformations already exist
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return url;

  // Build transformation string
  const transforms: string[] = ['f_auto', `q_${options?.quality || 'auto'}`];

  if (options?.width) {
    transforms.push(`w_${options.width}`);
  }
  if (options?.height) {
    transforms.push(`h_${options.height}`);
  }
  if (options?.crop) {
    transforms.push(`c_${options.crop}`);
  }

  const transformString = transforms.join(',');

  // Check if there are already transformations after /upload/
  const afterUpload = url.substring(uploadIndex + 8);
  const hasExistingTransforms = afterUpload.startsWith('v') === false && !afterUpload.match(/^[a-z]/);

  if (hasExistingTransforms) {
    // Insert our transforms before existing ones
    return url.slice(0, uploadIndex + 8) + transformString + '/' + afterUpload;
  } else {
    // No existing transforms, add ours
    return url.slice(0, uploadIndex + 8) + transformString + '/' + afterUpload;
  }
}

/**
 * Get optimized thumbnail URL (small size for cards)
 */
export function getThumbnailUrl(url: string | undefined | null): string {
  return optimizeCloudinaryUrl(url, { width: 400, height: 400, crop: 'fill' });
}

/**
 * Get optimized product image URL (medium size for product pages)
 */
export function getProductImageUrl(url: string | undefined | null): string {
  return optimizeCloudinaryUrl(url, { width: 800 });
}

/**
 * Get optimized hero/banner image URL (large size)
 */
export function getHeroImageUrl(url: string | undefined | null): string {
  return optimizeCloudinaryUrl(url, { width: 1200 });
}

