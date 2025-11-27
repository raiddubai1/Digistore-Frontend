const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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
}

export interface CategoriesResponse {
  success: boolean;
  data: {
    categories: Category[];
  };
}

export interface CategoryResponse {
  success: boolean;
  data: {
    category: Category;
  };
}

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_URL}/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    const result: CategoriesResponse = await response.json();
    return result.data.categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category> {
  try {
    const response = await fetch(`${API_URL}/categories/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Category not found");
      }
      throw new Error(`Failed to fetch category: ${response.statusText}`);
    }

    const result: CategoryResponse = await response.json();
    return result.data.category;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw error;
  }
}

