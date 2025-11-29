"use client";

import { Download, ShoppingBag, User, Settings, LogOut, ChevronLeft, ChevronRight, Users, FileDown, Clock, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NotificationSettings from "@/components/NotificationSettings";
import { useAuth } from "@/contexts/AuthContext";

interface OrderItem {
  id: string;
  productId: string;
  price: number;
  quantity: number;
  license: string;
  product: {
    id: string;
    title: string;
    thumbnail: string;
    slug: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  currency: string;
  createdAt: string;
  orderItems: OrderItem[];
}

interface DownloadItem {
  id: string;
  downloadToken: string;
  downloadUrl: string;
  expiresAt: string;
  downloadCount: number;
  maxDownloads: number;
  product: {
    id: string;
    title: string;
    thumbnail: string;
  };
}

export default function AccountPage() {
  const { user: authUser, isAuthenticated, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("downloads");
  const [orders, setOrders] = useState<Order[]>([]);
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    if (isAuthenticated) {
      fetchAccountData();
    }
  }, [authLoading, isAuthenticated, router]);

  const fetchAccountData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

      const [ordersRes, downloadsRes] = await Promise.all([
        fetch(`${API_URL}/orders/my-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/downloads/my-downloads`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData.data?.orders || []);
      }
      if (downloadsRes.ok) {
        const downloadsData = await downloadsRes.json();
        setDownloads(downloadsData.data?.downloads || []);
      }
    } catch (error) {
      console.error('Failed to fetch account data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (downloadToken: string) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    window.open(`${API_URL}/downloads/${downloadToken}`, '_blank');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isExpired = (expiresAt: string) => new Date(expiresAt) < new Date();

  const user = {
    name: authUser?.name || "User",
    email: authUser?.email || "",
    joinedDate: authUser?.createdAt ? formatDate(authUser.createdAt) : "Recently",
  };

  const tabs = [
    { id: "downloads", label: "Downloads", icon: Download },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* ===== MOBILE LAYOUT ===== */}
      <div className="lg:hidden min-h-screen bg-gray-50 pb-24">
        {/* Header */}
        <div className="bg-white border-b border-gray-100">
          <div className="px-4 py-4 flex items-center gap-3">
            <Link href="/" className="p-1">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-lg font-bold">My Account</h1>
          </div>

          {/* User Profile Card */}
          <div className="px-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center">
                <User className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="font-bold">{user.name}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Tab Pills */}
          <div className="px-4 pb-3 flex gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {activeTab === "downloads" && (
            <div className="space-y-3">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
                </div>
              ) : downloads.length === 0 ? (
                <div className="text-center py-12">
                  <FileDown className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No downloads yet</p>
                  <Link href="/products" className="text-red-600 text-sm hover:underline">Browse products</Link>
                </div>
              ) : (
                downloads.map((download) => (
                  <div key={download.id} className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {download.product.thumbnail ? (
                          <img src={download.product.thumbnail} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Download className="w-6 h-6 text-gray-600 m-3" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm line-clamp-2">{download.product.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {download.downloadCount}/{download.maxDownloads} downloads •
                          {isExpired(download.expiresAt) ? (
                            <span className="text-red-500"> Expired</span>
                          ) : (
                            <span> Expires {formatDate(download.expiresAt)}</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(download.downloadToken)}
                      disabled={isExpired(download.expiresAt) || download.downloadCount >= download.maxDownloads}
                      className="w-full mt-3 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download className="w-4 h-4" />
                      {isExpired(download.expiresAt) ? 'Expired' : download.downloadCount >= download.maxDownloads ? 'Limit Reached' : 'Download'}
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "orders" && (
            <div className="space-y-3">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No orders yet</p>
                  <Link href="/products" className="text-red-600 text-sm hover:underline">Start shopping</Link>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Order #{order.orderNumber?.slice(-8) || order.id.slice(-8)}</p>
                        <p className="font-bold">{order.currency} {Number(order.total).toFixed(2)}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    {order.orderItems?.map((item) => (
                      <p key={item.id} className="text-sm text-gray-600 line-clamp-1">
                        • {item.product?.title || 'Product'}
                      </p>
                    ))}
                    <p className="text-xs text-gray-400 mt-2">{formatDate(order.createdAt)}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-3">
              {/* Notification Settings */}
              <NotificationSettings />

              <div className="bg-white rounded-xl p-4 shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  defaultValue={user.name}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:outline-none"
                />
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  defaultValue={user.email}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:outline-none"
                />
              </div>
              <button className="w-full py-3 bg-gray-900 text-white font-medium rounded-xl">
                Save Changes
              </button>

              {/* Referral Program Link */}
              <Link
                href="/account/referrals"
                className="w-full py-3 bg-gradient-to-r from-[#ff6f61] to-[#ff8a7a] text-white font-medium rounded-xl flex items-center justify-center gap-2"
              >
                <Users className="w-5 h-5" />
                Referral Program - Earn 10%
              </Link>

              <button className="w-full py-3 bg-red-50 text-red-600 font-medium rounded-xl flex items-center justify-center gap-2">
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ===== DESKTOP LAYOUT ===== */}
      <div className="hidden lg:block min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-8">My Account</h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                {/* User Info */}
                <div className="text-center mb-6 pb-6 border-b border-gray-200">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="font-bold text-lg">{user.name}</h2>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <p className="text-xs text-gray-400 mt-1">Member since {user.joinedDate}</p>
                </div>

                {/* Navigation */}
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab("downloads")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === "downloads"
                        ? "bg-primary text-white"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <Download className="w-5 h-5" />
                    <span className="font-medium">My Downloads</span>
                  </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === "orders"
                      ? "bg-primary text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span className="font-medium">Order History</span>
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === "settings"
                      ? "bg-primary text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">Settings</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors">
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "downloads" && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-6 dark:text-white">My Downloads</h2>
                <div className="space-y-4">
                  {downloads.length === 0 ? (
                    <div className="text-center py-12">
                      <Download className="w-16 h-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">No downloads yet</p>
                      <Link href="/products" className="text-[#FF6B35] hover:underline mt-2 inline-block">
                        Browse products
                      </Link>
                    </div>
                  ) : (
                    downloads.map((download) => (
                      <div
                        key={download.id}
                        className="flex items-center gap-4 p-4 border border-gray-200 dark:border-slate-700 rounded-xl hover:border-[#FF6B35] transition-colors"
                      >
                        <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B35]/10 to-orange-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Download className="w-8 h-8 text-[#FF6B35]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold mb-1 dark:text-white">{download.product.title}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {download.downloadCount}/{download.maxDownloads} downloads used
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            Expires: {isExpired(download.expiresAt) ? 'Expired' : formatDate(download.expiresAt)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDownload(download.downloadToken)}
                          disabled={isExpired(download.expiresAt) || download.downloadCount >= download.maxDownloads}
                          className="px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-[#ff6f61] text-white rounded-full font-semibold hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-6 dark:text-white">Order History</h2>
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingBag className="w-16 h-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">No orders yet</p>
                      <Link href="/products" className="text-[#FF6B35] hover:underline mt-2 inline-block">
                        Start shopping
                      </Link>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-gray-200 dark:border-slate-700 rounded-xl p-6"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold mb-1 dark:text-white">Order #{order.orderNumber}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-[#FF6B35]">${order.total.toFixed(2)}</div>
                            <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                              order.status === 'COMPLETED'
                                ? 'bg-green-100 text-green-600'
                                : order.status === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-600'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {order.orderItems.map((item, index) => (
                            <div key={index} className="text-sm text-gray-600 dark:text-gray-400">
                              • {item.product.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                <div className="space-y-6">
                  {/* Notification Settings */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Notifications</h3>
                    <NotificationSettings />
                  </div>

                  <hr className="border-gray-200" />

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Profile Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          defaultValue={user.name}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          defaultValue={user.email}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-semibold hover:shadow-lg transition-all">
                      Save Changes
                    </button>
                    <Link
                      href="/account/referrals"
                      className="px-6 py-3 bg-gradient-to-r from-[#ff6f61] to-[#ff8a7a] text-white rounded-full font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                    >
                      <Users className="w-5 h-5" />
                      Referral Program
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

