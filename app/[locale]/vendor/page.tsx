'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  Package, DollarSign, ShoppingCart, TrendingUp, 
  Plus, Eye, Edit, Trash2, BarChart3, Clock, CheckCircle, XCircle
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalProducts: number;
  totalSales: number;
  pendingProducts: number;
  totalRevenue: number;
  availableBalance: number;
}

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  status: string;
  thumbnail: string;
  category: { name: string };
  _count: { reviews: number; orderItems: number };
  createdAt: string;
}

export default function VendorDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'sales'>('overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    if (!loading && user?.role !== 'VENDOR' && user?.role !== 'ADMIN') {
      router.push('/');
      return;
    }
    if (isAuthenticated && (user?.role === 'VENDOR' || user?.role === 'ADMIN')) {
      fetchDashboardData();
    }
  }, [loading, isAuthenticated, user, router]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      
      const [statsRes, productsRes] = await Promise.all([
        fetch(`${API_URL}/vendor/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/vendor/products`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.data);
      }
      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData.data.products || []);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      PUBLISHED: 'bg-green-100 text-green-700',
      PENDING_REVIEW: 'bg-yellow-100 text-yellow-700',
      DRAFT: 'bg-gray-100 text-gray-700',
      REJECTED: 'bg-red-100 text-red-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-red-900 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
          <p className="text-gray-300 mt-1">Welcome back, {user?.name}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Products</p>
                <p className="text-2xl font-bold">{stats?.totalProducts || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Sales</p>
                <p className="text-2xl font-bold">{stats?.totalSales || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Revenue</p>
                <p className="text-2xl font-bold">${Number(stats?.totalRevenue || 0).toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold">{stats?.pendingProducts || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-4 mb-8">
          <Link
            href="/vendor/products/new"
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add New Product
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b">
          {(['overview', 'products', 'sales'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'text-red-600 border-b-2 border-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Product</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Sales</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                            {product.thumbnail && (
                              <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover" />
                            )}
                          </div>
                          <span className="font-medium">{product.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{product.category?.name || 'N/A'}</td>
                      <td className="px-6 py-4 font-semibold">${product.price}</td>
                      <td className="px-6 py-4">{product._count?.orderItems || 0}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(product.status)}`}>
                          {product.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/product/${product.slug}`} className="p-2 hover:bg-gray-100 rounded-lg">
                            <Eye className="w-4 h-4 text-gray-500" />
                          </Link>
                          <Link href={`/vendor/products/${product.id}/edit`} className="p-2 hover:bg-gray-100 rounded-lg">
                            <Edit className="w-4 h-4 text-gray-500" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        No products yet. <Link href="/vendor/products/new" className="text-red-600 hover:underline">Add your first product</Link>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Recent Products</h3>
              <div className="space-y-4">
                {products.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg overflow-hidden">
                      {product.thumbnail && (
                        <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{product.title}</p>
                      <p className="text-xs text-gray-500">${product.price}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(product.status)}`}>
                      {product.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
                {products.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No products yet</p>
                )}
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <span className="text-gray-600">Available Balance</span>
                  <span className="text-2xl font-bold text-green-600">${Number(stats?.availableBalance || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                  <span className="text-gray-600">Total Revenue</span>
                  <span className="text-2xl font-bold text-blue-600">${Number(stats?.totalRevenue || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                  <span className="text-gray-600">Platform Fee (15%)</span>
                  <span className="text-lg font-semibold text-purple-600">${(Number(stats?.totalRevenue || 0) * 0.15 / 0.85).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sales Tab */}
        {activeTab === 'sales' && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Sales History</h3>
            <p className="text-gray-500 text-center py-12">Sales data will appear here once you make sales.</p>
          </div>
        )}
      </div>
    </div>
  );
}

