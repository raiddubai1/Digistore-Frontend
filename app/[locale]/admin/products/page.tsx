"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { demoProducts } from "@/data/demo-products";
import { formatPrice } from "@/lib/utils";
import { Plus, Search, Edit, Trash2, Eye, Loader2, MoreVertical, XCircle, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import { productsAPI, categoriesAPI } from "@/lib/api";

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  originalPrice?: number;
  fileType: string;
  downloadCount: number;
  status: string;
  category?: { name: string; slug: string } | string;
  thumbnailUrl?: string;
  downloadUrl?: string;
  fileUrl?: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
}

export default function AdminProductsPage() {
  const router = useRouter();
  const pathname = usePathname();
  // Extract locale/basePath from pathname
  const validLocales = ['en', 'ar', 'es', 'fr', 'de'];
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0] || '';
  const basePath = validLocales.includes(firstSegment) ? `/${firstSegment}` : '';
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [actionMenu, setActionMenu] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);

  // Close action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActionMenu(null);
    if (actionMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [actionMenu]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll({ limit: 500 });
      if (response.data?.success && response.data?.data?.products) {
        setProducts(response.data.data.products);
        setTotal(response.data.data.pagination?.total || response.data.data.products.length);
      } else {
        // Fallback to demo data
        setProducts(demoProducts as any);
        setTotal(demoProducts.length);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts(demoProducts as any);
      setTotal(demoProducts.length);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      if (response.data?.success && response.data?.data?.categories) {
        const decodeCategory = (cat: any): Category => ({
          ...cat,
          name: cat.name?.replace(/&amp;/g, '&') || cat.name,
          children: cat.children?.map(decodeCategory),
        });
        setCategories(response.data.data.categories.map(decodeCategory));
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  // Build flat list of all categories for filter dropdown
  const buildCategoryOptions = (): { slug: string; name: string; level: number }[] => {
    const options: { slug: string; name: string; level: number }[] = [];
    categories.forEach(cat => {
      options.push({ slug: cat.slug, name: cat.name, level: 1 });
      if (cat.children) {
        cat.children.forEach(sub => {
          options.push({ slug: sub.slug, name: sub.name, level: 2 });
          if (sub.children) {
            sub.children.forEach(subsub => {
              options.push({ slug: subsub.slug, name: subsub.name, level: 3 });
            });
          }
        });
      }
    });
    return options;
  };

  const categoryOptions = buildCategoryOptions();

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !categoryFilter ||
      (typeof product.category === 'object' && product.category?.slug === categoryFilter);
    const matchesStatus = !statusFilter || product.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryName = (product: Product) => {
    if (typeof product.category === 'object' && product.category?.name) {
      return product.category.name.replace(/&amp;/g, '&');
    }
    return typeof product.category === 'string' ? product.category : 'Uncategorized';
  };

  const handleDelete = async (productId: string, productTitle: string) => {
    if (deleteConfirm === productId) {
      try {
        await productsAPI.delete(productId);
        setProducts(products.filter(p => p.id !== productId));
        toast.success(`"${productTitle}" deleted successfully!`);
      } catch (error) {
        toast.error('Failed to delete product');
      }
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(productId);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  // Toggle single product selection
  const toggleProductSelection = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  // Select/deselect all filtered products
  const toggleSelectAll = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id)));
    }
  };

  // Bulk delete selected products
  const handleBulkDelete = async () => {
    if (!bulkDeleteConfirm) {
      setBulkDeleteConfirm(true);
      return;
    }

    setBulkDeleting(true);
    const selectedArray = Array.from(selectedProducts);
    let deleted = 0;
    let failed = 0;

    for (const productId of selectedArray) {
      try {
        await productsAPI.delete(productId);
        deleted++;
      } catch (error) {
        failed++;
      }
    }

    // Refresh products list
    setProducts(products.filter(p => !selectedProducts.has(p.id)));
    setSelectedProducts(new Set());
    setBulkDeleting(false);
    setBulkDeleteConfirm(false);

    if (failed === 0) {
      toast.success(`Successfully deleted ${deleted} products`);
    } else {
      toast.error(`Deleted ${deleted} products, ${failed} failed`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-gray-600">
            {loading ? 'Loading...' : (
              <>
                <span className="font-semibold text-primary">{total.toLocaleString()}</span> total products
                {(searchQuery || categoryFilter || statusFilter) && (
                  <span> · <span className="font-semibold">{filteredProducts.length.toLocaleString()}</span> showing</span>
                )}
              </>
            )}
          </p>
        </div>
        <button
          onClick={() => router.push(`${basePath}/admin/products/new`)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-semibold hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="">All Categories</option>
            {categoryOptions.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.level === 2 ? `── ${cat.name}` : cat.level === 3 ? `──── ${cat.name}` : cat.name}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedProducts.size > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-red-700">
              {selectedProducts.size} product{selectedProducts.size > 1 ? 's' : ''} selected
            </span>
            <button
              onClick={() => setSelectedProducts(new Set())}
              className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
            >
              <XCircle className="w-4 h-4" /> Clear selection
            </button>
          </div>
          <div className="flex items-center gap-3">
            {bulkDeleteConfirm ? (
              <>
                <span className="text-red-600 font-medium">Are you sure?</span>
                <button
                  onClick={() => setBulkDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                  disabled={bulkDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkDelete}
                  disabled={bulkDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                >
                  {bulkDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" /> Yes, Delete All
                    </>
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Delete Selected
              </button>
            )}
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-[5%] px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={filteredProducts.length > 0 && selectedProducts.size === filteredProducts.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  />
                </th>
                <th className="w-[30%] px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Product
                </th>
                <th className="w-[10%] px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  File
                </th>
                <th className="w-[15%] px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">
                  Category
                </th>
                <th className="w-[10%] px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Price
                </th>
                <th className="w-[8%] px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">
                  Sales
                </th>
                <th className="w-[10%] px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">
                  Status
                </th>
                <th className="w-[6%] px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">

                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                    <p className="mt-2 text-gray-500">Loading products...</p>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : filteredProducts.map((product) => (
                <tr key={product.id} className={`hover:bg-gray-50 transition-colors ${selectedProducts.has(product.id) ? 'bg-red-50' : ''}`}>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedProducts.has(product.id)}
                      onChange={() => toggleProductSelection(product.id)}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.thumbnailUrl ? (
                        <img src={product.thumbnailUrl} alt={product.title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex-shrink-0" />
                      )}
                      <div className="min-w-0">
                        <div className="font-semibold text-sm truncate">
                          {product.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {product.fileType?.toUpperCase() || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {(product.fileUrl || product.downloadUrl) ? (
                      <a
                        href={product.fileUrl || product.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-colors text-xs font-medium"
                        title="View download file"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        View
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400">No file</span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <div className="text-sm text-gray-700 truncate">{getCategoryName(product)}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-sm">{formatPrice(product.price)}</div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="text-sm text-gray-700">
                      {(product.downloadCount || 0).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${
                      product.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                      product.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {product.status === 'APPROVED' ? 'Published' : product.status || 'Published'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActionMenu(actionMenu === product.id ? null : product.id);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                      {actionMenu === product.id && (
                        <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                          <button
                            onClick={() => {
                              router.push(`${basePath}/products/${product.slug}`);
                              setActionMenu(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" /> View
                          </button>
                          <button
                            onClick={() => {
                              router.push(`${basePath}/admin/products/${product.id}/edit`);
                              setActionMenu(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Edit className="w-4 h-4" /> Edit
                          </button>
                          <button
                            onClick={() => {
                              handleDelete(product.id, product.title);
                              setActionMenu(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {filteredProducts.length} of {total} products
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Previous
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg">1</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              2
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

