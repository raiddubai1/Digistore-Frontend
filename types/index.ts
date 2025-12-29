// Product Attribute
export interface ProductAttribute {
  attribute: {
    id: string;
    name: string;
    slug: string;
  };
  value: string;
}

// Product Types
export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  // SEO Fields
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  // Pricing
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  subcategory?: string;
  tags: string[];
  fileType: string; // pdf, xlsx, zip, etc.
  fileSize?: string;
  fileUrl: string;
  previewImages: string[];
  thumbnailUrl: string;
  rating: number;
  reviewCount: number;
  downloadCount: number;
  license: "personal" | "commercial" | "extended";
  whatsIncluded: string[];
  requirements?: string[];
  featured: boolean;
  bestseller: boolean;
  newArrival: boolean;
  // Canva Template Delivery
  canvaTemplateLink?: string;
  canvaTemplateLinks?: Array<{ name: string; url: string }>;
  canvaInstructions?: string;
  // YouTube Video
  youtubeVideoUrl?: string;
  // Product Attributes
  attributes?: ProductAttribute[];
  createdAt: Date;
  updatedAt: Date;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  parentId?: string;
  parent?: Category;
  children?: Category[];
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
  // Computed property for backward compatibility
  productCount?: number;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "customer" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

// Order Types
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  status: "pending" | "completed" | "failed" | "refunded";
  paymentMethod: "stripe" | "paypal";
  paymentId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  productTitle: string;
  price: number;
  license: string;
  downloadUrl?: string;
  downloadExpiry?: Date;
  downloadCount: number;
  maxDownloads: number;
}

// Review Types
export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title?: string;
  comment: string;
  helpful: number;
  verified: boolean;
  createdAt: Date;
}

// Cart Types
export interface CartItem {
  product: Product;
  license: "personal" | "commercial" | "extended";
  price: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
}

// Coupon Types
export interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  expiresAt?: Date;
  usageLimit?: number;
  usageCount: number;
  active: boolean;
}

// Wishlist Types
export interface WishlistItem {
  productId: string;
  addedAt: Date;
}

// Language Types
export type Language = "en" | "ar" | "es" | "fr" | "de";

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  rtl: boolean;
}

// Filter Types
export interface ProductFilters {
  category?: string;
  subcategory?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  fileType?: string[];
  license?: string[];
  tags?: string[];
  search?: string;
  sort?: "newest" | "popular" | "price-low" | "price-high" | "rating";
}

// Pagination Types
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

