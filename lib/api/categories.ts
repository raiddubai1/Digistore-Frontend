const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

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
  if (!API_URL) {
    throw new Error("API URL not configured");
  }

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
  if (!API_URL) {
    throw new Error("API URL not configured");
  }

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

export interface UpdateCategoryData {
  name?: string;
  slug?: string;
  description?: string;
  icon?: string;
  parentId?: string | null;
  order?: number;
  active?: boolean;
}

export async function updateCategory(id: string, data: UpdateCategoryData): Promise<Category> {
  if (!API_URL) {
    throw new Error("API URL not configured");
  }

  // Get token from localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (!token) {
    throw new Error("Authentication required");
  }

  try {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to update category: ${response.statusText}`);
    }

    const result: CategoryResponse = await response.json();
    return result.data.category;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
}

export interface CreateCategoryData {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  parentId?: string | null;
  order?: number;
  active?: boolean;
}

export async function createCategory(data: CreateCategoryData): Promise<Category> {
  if (!API_URL) {
    throw new Error("API URL not configured");
  }

  // Get token from localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (!token) {
    throw new Error("Authentication required");
  }

  try {
    const response = await fetch(`${API_URL}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to create category: ${response.statusText}`);
    }

    const result: CategoryResponse = await response.json();
    return result.data.category;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
}

