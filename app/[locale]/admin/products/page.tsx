"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { demoProducts } from "@/data/demo-products";
import { formatPrice } from "@/lib/utils";
import { Plus, Search, Edit, Trash2, Eye, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { productsAPI } from "@/lib/api";

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
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchProducts();
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

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryName = (product: Product) => {
    if (typeof product.category === 'object' && product.category?.name) {
      return product.category.name.replace(/&amp;/g, '&');
    }
    return typeof product.category === 'string' ? product.category : 'Uncategorized';
  };

  const handleDelete = (productId: string, productTitle: string) => {
    if (deleteConfirm === productId) {
      // In a real app, this would delete from database
      toast.success(`"${productTitle}" deleted successfully!`);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(productId);
      setTimeout(() => setDeleteConfirm(null), 3000); // Reset after 3 seconds
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-gray-600">Manage your digital products</p>
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
          <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
            <option>All Categories</option>
            <option>Business and Marketing</option>
            <option>Personal Development</option>
            <option>Technology</option>
          </select>
          <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
            <option>All Status</option>
            <option>Published</option>
            <option>Draft</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Sales
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
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
                    <p className="mt-2 text-gray-500">Loading products...</p>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {product.thumbnailUrl ? (
                        <img src={product.thumbnailUrl} alt={product.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex-shrink-0" />
                      )}
                      <div className="min-w-0">
                        <div className="font-semibold text-sm truncate max-w-xs">
                          {product.title}
                        </div>
                        <div className="text-xs text-gray-500">{product.fileType?.toUpperCase() || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700">{getCategoryName(product)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-sm">{formatPrice(product.price)}</div>
                    {product.originalPrice && (
                      <div className="text-xs text-gray-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700">
                      {(product.downloadCount || 0).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                      product.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                      product.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {product.status === 'APPROVED' ? 'Published' : product.status || 'Published'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => router.push(`${basePath}/products/${product.slug}`)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => router.push(`${basePath}/admin/products/${product.id}/edit`)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.title)}
                        className={`p-2 rounded-lg transition-colors ${
                          deleteConfirm === product.id
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "hover:bg-red-50 text-red-600"
                        }`}
                        title={deleteConfirm === product.id ? "Click again to confirm" : "Delete"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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

