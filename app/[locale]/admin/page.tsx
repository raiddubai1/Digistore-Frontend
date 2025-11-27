"use client";

import { DollarSign, ShoppingCart, Package, Users, TrendingUp, Download } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export default function AdminDashboard() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  // Mock data
  const stats = [
    {
      name: "Total Revenue",
      value: "$45,231.89",
      change: "+20.1%",
      trend: "up",
      icon: DollarSign,
      color: "from-green-500 to-emerald-500",
    },
    {
      name: "Orders",
      value: "1,234",
      change: "+12.5%",
      trend: "up",
      icon: ShoppingCart,
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Products",
      value: "8",
      change: "+2",
      trend: "up",
      icon: Package,
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "Customers",
      value: "892",
      change: "+8.2%",
      trend: "up",
      icon: Users,
      color: "from-orange-500 to-red-500",
    },
  ];

  const recentOrders = [
    { id: "ORD-001", customer: "John Doe", product: "Digital Marketing Guide", amount: 29.99, status: "completed" },
    { id: "ORD-002", customer: "Jane Smith", product: "Social Media Mastery", amount: 19.99, status: "completed" },
    { id: "ORD-003", customer: "Bob Johnson", product: "Python Programming", amount: 34.99, status: "pending" },
    { id: "ORD-004", customer: "Alice Brown", product: "Dog Training Essentials", amount: 14.99, status: "completed" },
    { id: "ORD-005", customer: "Charlie Wilson", product: "Home Gardening", amount: 18.99, status: "completed" },
  ];

  const topProducts = [
    { name: "Python Programming for Beginners", sales: 445, revenue: 15567.55 },
    { name: "The Complete Guide to Digital Marketing", sales: 234, revenue: 7016.66 },
    { name: "Dog Training Essentials", sales: 267, revenue: 4001.33 },
    { name: "Mastering Relationships", sales: 312, revenue: 5298.88 },
  ];

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
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm mb-1">{order.customer}</div>
                  <div className="text-xs text-gray-500 truncate">{order.product}</div>
                  <div className="text-xs text-gray-400 mt-1">{order.id}</div>
                </div>
                <div className="text-right ml-4">
                  <div className="font-bold text-sm mb-1">{formatPrice(order.amount)}</div>
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                    order.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Top Products</h2>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm mb-1 truncate">{product.name}</div>
                  <div className="text-xs text-gray-500">{product.sales} sales</div>
                </div>
                <div className="font-bold text-sm">{formatPrice(product.revenue)}</div>
              </div>
            ))}
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

