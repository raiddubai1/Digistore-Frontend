'use client';

import { useState, useEffect } from 'react';
import { settingsAPI } from '@/lib/api';

export interface MenuItem {
  id: string;
  label: string;
  href: string;
  enabled: boolean;
  order: number;
}

const DEFAULT_MENU_ITEMS: MenuItem[] = [
  { id: '1', label: 'Home', href: '/', enabled: true, order: 0 },
  { id: '2', label: 'Shop', href: '/products', enabled: true, order: 1 },
  { id: '3', label: 'Categories', href: '/categories', enabled: true, order: 2 },
  { id: '4', label: 'New Arrivals', href: '/products?sort=newest', enabled: true, order: 3 },
  { id: '5', label: 'Best Sellers', href: '/products?sort=bestsellers', enabled: true, order: 4 },
];

export function useMenuItems() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(DEFAULT_MENU_ITEMS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const response = await settingsAPI.getPublic();
        const items = response.data.data.menuItems;
        if (items && Array.isArray(items)) {
          // Filter only enabled items and sort by order
          const enabledItems = items
            .filter((item: MenuItem) => item.enabled)
            .sort((a: MenuItem, b: MenuItem) => a.order - b.order);
          setMenuItems(enabledItems);
        }
        setError(null);
      } catch (err: any) {
        console.error('Error fetching menu items:', err);
        setError(err.message || 'Failed to fetch menu items');
        // Keep default menu items on error
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  return { menuItems, loading, error };
}

