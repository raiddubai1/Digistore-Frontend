/**
 * Input sanitization utilities for user-generated content
 */

// HTML entities to escape
const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

/**
 * Escape HTML special characters to prevent XSS
 */
export function escapeHtml(str: string): string {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/[&<>"'`=/]/g, (char) => HTML_ENTITIES[char] || char);
}

/**
 * Remove HTML tags from a string
 */
export function stripHtml(str: string): string {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/<[^>]*>/g, '');
}

/**
 * Sanitize a string for safe display (escape HTML and trim)
 */
export function sanitizeText(str: string): string {
  if (!str || typeof str !== 'string') return '';
  return escapeHtml(str.trim());
}

/**
 * Sanitize a URL to prevent javascript: and data: URLs
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') return '';
  
  const trimmed = url.trim().toLowerCase();
  
  // Block dangerous protocols
  if (
    trimmed.startsWith('javascript:') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('vbscript:')
  ) {
    return '';
  }
  
  // Allow relative URLs, http, https, mailto, tel
  if (
    trimmed.startsWith('/') ||
    trimmed.startsWith('#') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:')
  ) {
    return url.trim();
  }
  
  // Default to adding https:// for bare domains
  if (trimmed.match(/^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}/)) {
    return `https://${url.trim()}`;
  }
  
  return '';
}

/**
 * Sanitize an email address
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') return '';
  
  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  return emailRegex.test(trimmed) ? trimmed : '';
}

/**
 * Sanitize a phone number (keep only digits and common separators)
 */
export function sanitizePhone(phone: string): string {
  if (!phone || typeof phone !== 'string') return '';
  return phone.replace(/[^\d\s\-\+\(\)]/g, '').trim();
}

/**
 * Sanitize a search query (remove special regex characters)
 */
export function sanitizeSearchQuery(query: string): string {
  if (!query || typeof query !== 'string') return '';
  // Remove regex special characters but keep spaces and common punctuation
  return query.replace(/[.*+?^${}()|[\]\\]/g, '').trim();
}

/**
 * Sanitize an object's string values recursively
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  if (!obj || typeof obj !== 'object') return obj;
  
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeText(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) =>
        typeof item === 'string' ? sanitizeText(item) : sanitizeObject(item)
      );
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized as T;
}

/**
 * Validate and sanitize a numeric string
 */
export function sanitizeNumber(value: string, options?: { min?: number; max?: number }): number | null {
  if (!value || typeof value !== 'string') return null;
  
  const num = parseFloat(value.replace(/[^\d.-]/g, ''));
  
  if (isNaN(num)) return null;
  if (options?.min !== undefined && num < options.min) return options.min;
  if (options?.max !== undefined && num > options.max) return options.max;
  
  return num;
}

