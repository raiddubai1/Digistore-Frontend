"use client";

import { DollarSign, ShoppingCart, Package, Users, TrendingUp, Download } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customer: { name: string; email: string };
    total: number;
    status: string;
    createdAt: string;
  }>;
  topProducts: Array<{
    id: string;
    title: string;
    sales: number;
    revenue: number;
  }>;
}

export default function AdminDashboard() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = pathname.split('/')[1] || 'en';
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    if (!authLoading && user?.role !== 'ADMIN') {
      router.push('/');
      return;
    }
    if (isAuthenticated && user?.role === 'ADMIN') {
      fetchDashboardData();
    }
  }, [authLoading, isAuthenticated, user, router]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

      const res = await fetch(`${API_URL}/admin/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setDashboardData(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    {
      name: "Total Revenue",
      value: `$${(dashboardData?.totalRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      change: "+20.1%",
      trend: "up",
      icon: DollarSign,
      color: "from-green-500 to-emerald-500",
    },
    {
      name: "Orders",
      value: (dashboardData?.totalOrders || 0).toLocaleString(),
      change: "+12.5%",
      trend: "up",
      icon: ShoppingCart,
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Products",
      value: (dashboardData?.totalProducts || 0).toString(),
      change: "+2",
      trend: "up",
      icon: Package,
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "Customers",
      value: (dashboardData?.totalCustomers || 0).toLocaleString(),
      change: "+8.2%",
      trend: "up",
      icon: Users,
      color: "from-orange-500 to-red-500",
    },
  ];

  const recentOrders = dashboardData?.recentOrders || [];
  const topProducts = dashboardData?.topProducts || [];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-semibold ${
                stat.trend === "up" ? "text-green-600" : "text-red-600"
              }`}>
                <TrendingUp className="w-4 h-4" />
                {stat.change}
              </div>
            </div>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.name}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
              </div>
            ) : recentOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No orders yet</p>
            ) : (
              recentOrders.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm mb-1">{order.customer?.name || 'Customer'}</div>
                    <div className="text-xs text-gray-500 truncate">{order.customer?.email}</div>
                    <div className="text-xs text-gray-400 mt-1">#{order.orderNumber?.slice(-8) || order.id.slice(-8)}</div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="font-bold text-sm mb-1">${Number(order.total).toFixed(2)}</div>
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === "COMPLETED"
                        ? "bg-green-100 text-green-700"
                        : order.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Top Products</h2>
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
              </div>
            ) : topProducts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No sales data yet</p>
            ) : (
              topProducts.map((product: any, index: number) => (
                <div key={product.id || product.title} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm mb-1 truncate">{product.title}</div>
                    <div className="text-xs text-gray-500">{product.sales} sales</div>
                  </div>
                  <div className="font-bold text-sm">${Number(product.revenue).toFixed(2)}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href={`/${locale}/admin/products`}
            className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-primary transition-colors"
          >
            <Package className="w-8 h-8 text-primary" />
            <div>
              <div className="font-semibold">Add Product</div>
              <div className="text-sm text-gray-500">Create new product</div>
            </div>
          </Link>
          <Link
            href={`/${locale}/admin/orders`}
            className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-primary transition-colors"
          >
            <ShoppingCart className="w-8 h-8 text-primary" />
            <div>
              <div className="font-semibold">View Orders</div>
              <div className="text-sm text-gray-500">Manage all orders</div>
            </div>
          </Link>
          <Link
            href={`/${locale}/admin/customers`}
            className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-primary transition-colors"
          >
            <Users className="w-8 h-8 text-primary" />
            <div>
              <div className="font-semibold">View Customers</div>
              <div className="text-sm text-gray-500">Customer management</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

