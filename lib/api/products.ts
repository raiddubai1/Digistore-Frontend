import { Product } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

// Helper to map API product to frontend Product type
function mapApiProduct(p: any): Product {
  return {
    ...p,
    category: typeof p.category === 'object' ? p.category?.slug : p.category,
    categoryName: typeof p.category === 'object' ? p.category?.name : p.category,
    license: p.license || 'personal',
    createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
    updatedAt: p.updatedAt ? new Date(p.updatedAt) : new Date(),
  };
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  fileType?: string;
  sort?: string;
  featured?: boolean;
  bestseller?: boolean;
}

export async function getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
  // If no API URL is configured, throw error to trigger fallback
  if (!API_URL) {
    throw new Error("API URL not configured");
  }

  try {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const response = await fetch(`${API_URL}/products?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Always fetch fresh data
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data = await response.json();
    // Handle nested API response format
    if (data.success && data.data?.products) {
      return {
        products: data.data.products.map(mapApiProduct),
        total: data.data.pagination?.total || data.data.products.length,
        page: data.data.pagination?.page || 1,
        totalPages: data.data.pagination?.totalPages || 1,
      };
    }
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

export async function getProductBySlug(slug: string): Promise<Product> {
  if (!API_URL) {
    throw new Error("API URL not configured");
  }

  try {
    const response = await fetch(`${API_URL}/products/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Product not found");
      }
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }

    const data = await response.json();
    // Handle nested API response format
    if (data.success && data.data) {
      return mapApiProduct(data.data);
    }
    return mapApiProduct(data);
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  if (!API_URL) {
    throw new Error("API URL not configured");
  }

  try {
    const response = await fetch(`${API_URL}/products/featured`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch featured products: ${response.statusText}`);
    }

    const data = await response.json();
    // Handle nested API response format
    if (data.success && data.data?.products) {
      return data.data.products.map(mapApiProduct);
    }
    if (Array.isArray(data)) {
      return data.map(mapApiProduct);
    }
    return [];
  } catch (error) {
    console.error("Error fetching featured products:", error);
    throw error;
  }
}

export async function getBestsellers(): Promise<Product[]> {
  if (!API_URL) {
    throw new Error("API URL not configured");
  }

  try {
    const response = await fetch(`${API_URL}/products/bestsellers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch bestsellers: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.success && data.data?.products) {
      return data.data.products.map(mapApiProduct);
    }
    if (Array.isArray(data)) {
      return data.map(mapApiProduct);
    }
    return [];
  } catch (error) {
    console.error("Error fetching bestsellers:", error);
    throw error;
  }
}

export async function getNewArrivals(): Promise<Product[]> {
  if (!API_URL) {
    throw new Error("API URL not configured");
  }

  try {
    const response = await fetch(`${API_URL}/products/new-arrivals`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch new arrivals: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.success && data.data?.products) {
      return data.data.products.map(mapApiProduct);
    }
    if (Array.isArray(data)) {
      return data.map(mapApiProduct);
    }
    return [];
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    throw error;
  }
}

