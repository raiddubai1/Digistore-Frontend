'use client';

import { useState, useEffect } from 'react';
import { categoriesAPI } from '@/lib/api';

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
  _count?: {
    products: number;
  };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await categoriesAPI.getAll();
        setCategories(response.data.data.categories);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching categories:', err);
        setError(err.message || 'Failed to fetch categories');
        // Set empty array on error
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}

