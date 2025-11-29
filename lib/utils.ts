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
export const CURRENCIES = {
  USD: { symbol: '$', name: 'US Dollar', rate: 1 },
  EUR: { symbol: '€', name: 'Euro', rate: 0.92 },
  GBP: { symbol: '£', name: 'British Pound', rate: 0.79 },
  CAD: { symbol: 'CA$', name: 'Canadian Dollar', rate: 1.36 },
  AUD: { symbol: 'A$', name: 'Australian Dollar', rate: 1.53 },
  JPY: { symbol: '¥', name: 'Japanese Yen', rate: 149 },
  INR: { symbol: '₹', name: 'Indian Rupee', rate: 83 },
  AED: { symbol: 'د.إ', name: 'UAE Dirham', rate: 3.67 },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;

/**
 * Get stored currency or default to USD
 */
export function getCurrentCurrency(): CurrencyCode {
  if (typeof window === 'undefined') return 'USD';
  return (localStorage.getItem('currency') as CurrencyCode) || 'USD';
}

/**
 * Set current currency
 */
export function setCurrency(currency: CurrencyCode): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('currency', currency);
    window.dispatchEvent(new Event('currencyChange'));
  }
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
 */
export function formatPrice(price: number, currency?: CurrencyCode): string {
  const currencyCode = currency || getCurrentCurrency();
  const convertedPrice = currency ? price : convertPrice(price, currencyCode);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: currencyCode === 'JPY' ? 0 : 2,
    maximumFractionDigits: currencyCode === 'JPY' ? 0 : 2,
  }).format(convertedPrice);
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

