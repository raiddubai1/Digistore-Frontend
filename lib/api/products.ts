import { Product } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
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

    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

export async function getProductBySlug(slug: string): Promise<Product> {
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

    return await response.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
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

    return await response.json();
  } catch (error) {
    console.error("Error fetching featured products:", error);
    throw error;
  }
}

export async function getBestsellers(): Promise<Product[]> {
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

    return await response.json();
  } catch (error) {
    console.error("Error fetching bestsellers:", error);
    throw error;
  }
}

export async function getNewArrivals(): Promise<Product[]> {
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

    return await response.json();
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    throw error;
  }
}

