"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, FolderTree, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CategoriesPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';

  // Mock data - will be replaced with API calls
  const [categories, setCategories] = useState([
    {
      id: "1",
      name: "Business and Marketing",
      slug: "business-and-marketing",
      description: "eBooks on business strategies, marketing, and entrepreneurship",
      icon: "briefcase",
      active: true,
      order: 1,
      productsCount: 12,
      children: [
        { id: "1-1", name: "Digital Marketing", slug: "digital-marketing", productsCount: 5 },
        { id: "1-2", name: "Entrepreneurship", slug: "entrepreneurship", productsCount: 7 },
      ],
    },
    {
      id: "2",
      name: "Personal Development",
      slug: "personal-development",
      description: "Self-improvement, relationships, and personal growth",
      icon: "user",
      active: true,
      order: 2,
      productsCount: 8,
      children: [
        { id: "2-1", name: "Relationships", slug: "relationships", productsCount: 3 },
        { id: "2-2", name: "Self-Help", slug: "self-help", productsCount: 5 },
      ],
    },
    {
      id: "3",
      name: "Technology",
      slug: "technology",
      description: "Programming, software development, and tech guides",
      icon: "code",
      active: true,
      order: 3,
      productsCount: 15,
      children: [
        { id: "3-1", name: "Programming", slug: "programming", productsCount: 10 },
        { id: "3-2", name: "Web Development", slug: "web-development", productsCount: 5 },
      ],
    },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">Manage product categories and subcategories</p>
        </div>
        <Link
          href={`/${locale}/admin/categories/new`}
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
              {categories.map((category) => (
                <>
                  {/* Parent Category */}
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white">
                          <FolderTree className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{category.name}</div>
                          <div className="text-sm text-gray-500">{category.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {category.slug}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">{category.productsCount}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        category.active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}>
                        {category.active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {category.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{category.order}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/${locale}/admin/categories/${category.id}`}
                          className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Subcategories */}
                  {category.children?.map((subcategory) => (
                    <tr key={subcategory.id} className="hover:bg-gray-50 bg-gray-25">
                      <td className="px-6 py-3 pl-16">
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-8 bg-gray-300 rounded-full"></div>
                          <div className="text-sm font-medium text-gray-700">{subcategory.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <code className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {subcategory.slug}
                        </code>
                      </td>
                      <td className="px-6 py-3">
                        <span className="text-sm text-gray-600">{subcategory.productsCount}</span>
                      </td>
                      <td className="px-6 py-3">
                        <span className="text-xs text-gray-500">Subcategory</span>
                      </td>
                      <td className="px-6 py-3">
                        <span className="text-sm text-gray-400">-</span>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/${locale}/admin/categories/${subcategory.id}`}
                            className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-sm text-gray-500 mb-1">Total Categories</div>
          <div className="text-2xl font-bold text-gray-900">{categories.length}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-sm text-gray-500 mb-1">Total Subcategories</div>
          <div className="text-2xl font-bold text-gray-900">
            {categories.reduce((acc, cat) => acc + (cat.children?.length || 0), 0)}
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-sm text-gray-500 mb-1">Active Categories</div>
          <div className="text-2xl font-bold text-green-600">
            {categories.filter(cat => cat.active).length}
          </div>
        </div>
      </div>
    </div>
  );
}


