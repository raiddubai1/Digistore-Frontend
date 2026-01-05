"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, FolderTree, Eye, EyeOff, Loader2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { categoriesAPI } from "@/lib/api";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  active: boolean;
  order: number;
  parentId?: string;
  children?: Category[];
  _count?: { products: number };
}

// Helper to count all categories including nested
const countAllCategories = (categories: Category[]): { total: number; level2: number; level3: number } => {
  let total = 0;
  let level2 = 0;
  let level3 = 0;

  categories.forEach(cat => {
    total++; // Level 1
    if (cat.children) {
      cat.children.forEach(sub => {
        total++;
        level2++;
        if (sub.children) {
          sub.children.forEach(() => {
            total++;
            level3++;
          });
        }
      });
    }
  });

  return { total, level2, level3 };
};

export default function CategoriesPage() {
  const pathname = usePathname();
  // Supported languages: English, Portuguese, Arabic, Spanish
  const validLocales = ['en', 'pt', 'ar', 'es'];
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0] || '';
  const basePath = validLocales.includes(firstSegment) ? `/${firstSegment}` : '/en';
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getAll();
      if (response.data?.success && response.data?.data?.categories) {
        // Decode HTML entities and organize categories
        const cats = response.data.data.categories.map((cat: any) => ({
          ...cat,
          name: cat.name?.replace(/&amp;/g, '&') || cat.name,
          productsCount: cat._count?.products || 0,
        }));
        setCategories(cats);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId: string, categoryName: string, hasChildren: boolean, productCount: number = 0) => {
    if (hasChildren) {
      toast.error("Cannot delete category with subcategories. Delete subcategories first.");
      return;
    }

    if (productCount > 0) {
      toast.error(`Cannot delete "${categoryName}" - it has ${productCount} product(s). Move or delete products first.`);
      return;
    }

    if (deleteConfirm === categoryId) {
      try {
        await categoriesAPI.delete(categoryId);
        toast.success(`"${categoryName}" deleted successfully!`);
        fetchCategories(); // Refresh list
      } catch (error: any) {
        // Extract error message from API response
        const errorMessage = error.response?.data?.message || error.message || "Failed to delete category";
        toast.error(errorMessage);
      }
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(categoryId);
      toast("Click again to confirm delete", { icon: "⚠️" });
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">Manage product categories and subcategories</p>
        </div>
        <Link
          href={`${basePath}/admin/categories/new`}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </Link>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                    <p className="mt-2 text-gray-500">Loading categories...</p>
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No categories found
                  </td>
                </tr>
              ) : categories.filter(c => !c.parentId).map((category) => (
                <>
                  {/* Level 1 - Parent Category */}
                  <tr key={category.id} className="hover:bg-gray-50 bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white">
                          <FolderTree className="w-5 h-5" />
                        </div>
                        <div className="font-bold text-gray-900">{category.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">{category.slug}</code>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">{category._count?.products || 0}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${category.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                        {category.active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {category.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{category.order}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`${basePath}/admin/categories/${category.id}`} className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(category.id, category.name, !!(category.children && category.children.length > 0), category._count?.products || 0)}
                          className={`p-2 rounded-lg transition-colors ${deleteConfirm === category.id ? 'text-white bg-red-600' : 'text-gray-600 hover:text-red-600 hover:bg-red-50'}`}
                          title={deleteConfirm === category.id ? "Click again to confirm" : "Delete"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Level 2 - Subcategories */}
                  {category.children?.map((subcat) => (
                    <>
                      <tr key={subcat.id} className="hover:bg-blue-50/30">
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3 pl-8">
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                              <FolderTree className="w-4 h-4" />
                            </div>
                            <div className="font-semibold text-gray-800">{subcat.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <code className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{subcat.slug}</code>
                        </td>
                        <td className="px-6 py-3">
                          <span className="text-sm font-medium text-gray-900">{subcat._count?.products || 0}</span>
                        </td>
                        <td className="px-6 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${subcat.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                            {subcat.active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <span className="text-sm text-gray-600">{subcat.order}</span>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`${basePath}/admin/categories/${subcat.id}`} className="p-1.5 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                              <Edit className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              onClick={() => handleDelete(subcat.id, subcat.name, !!(subcat.children && subcat.children.length > 0), subcat._count?.products || 0)}
                              className={`p-1.5 rounded-lg transition-colors ${deleteConfirm === subcat.id ? 'text-white bg-red-600' : 'text-gray-500 hover:text-red-600 hover:bg-red-50'}`}
                              title={deleteConfirm === subcat.id ? "Click again to confirm" : "Delete"}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Level 3 - Sub-subcategories */}
                      {subcat.children?.map((subsubcat) => (
                        <tr key={subsubcat.id} className="hover:bg-purple-50/30">
                          <td className="px-6 py-2">
                            <div className="flex items-center gap-3 pl-20">
                              <ChevronRight className="w-3 h-3 text-gray-300" />
                              <div className="w-6 h-6 rounded bg-purple-100 flex items-center justify-center text-purple-600">
                                <FolderTree className="w-3 h-3" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-700 text-sm">{subsubcat.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-2">
                            <code className="text-xs text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">{subsubcat.slug}</code>
                          </td>
                          <td className="px-6 py-2">
                            <span className="text-sm text-gray-600">{subsubcat._count?.products || 0}</span>
                          </td>
                          <td className="px-6 py-2">
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs ${subsubcat.active ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-500"}`}>
                              {subsubcat.active ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-6 py-2">
                            <span className="text-xs text-gray-500">{subsubcat.order}</span>
                          </td>
                          <td className="px-6 py-2">
                            <div className="flex items-center justify-end gap-1">
                              <Link href={`${basePath}/admin/categories/${subsubcat.id}`} className="p-1 text-gray-400 hover:text-primary hover:bg-gray-100 rounded transition-colors" title="Edit">
                                <Edit className="w-3 h-3" />
                              </Link>
                              <button
                                onClick={() => handleDelete(subsubcat.id, subsubcat.name, false, subsubcat._count?.products || 0)}
                                className={`p-1 rounded transition-colors ${deleteConfirm === subsubcat.id ? 'text-white bg-red-600' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}
                                title={deleteConfirm === subsubcat.id ? "Click again to confirm" : "Delete"}
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      {(() => {
        const counts = countAllCategories(categories.filter(c => !c.parentId));
        return (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">Parent Categories</div>
              <div className="text-2xl font-bold text-gray-900">{categories.filter(c => !c.parentId).length}</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">Level 2 (Subcategories)</div>
              <div className="text-2xl font-bold text-blue-600">{counts.level2}</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">Level 3 (Sub-sub)</div>
              <div className="text-2xl font-bold text-purple-600">{counts.level3}</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">Total All Levels</div>
              <div className="text-2xl font-bold text-green-600">{counts.total}</div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}


