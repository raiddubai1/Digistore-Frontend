"use client";

import { Download, ShoppingBag, User, Settings, LogOut } from "lucide-react";
import { useState } from "react";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("downloads");

  // Mock user data
  const user = {
    name: "John Doe",
    email: "john@example.com",
    joinedDate: "January 2024",
  };

  // Mock purchases
  const purchases = [
    {
      id: "1",
      orderId: "ORD-1234567890",
      date: "2024-03-15",
      total: 29.99,
      items: [
        {
          title: "The Complete Guide to Digital Marketing",
          downloadUrl: "#",
          fileType: "PDF",
          fileSize: "12.5 MB",
        },
      ],
    },
    {
      id: "2",
      orderId: "ORD-1234567891",
      date: "2024-03-10",
      total: 19.99,
      items: [
        {
          title: "Social Media Marketing Mastery",
          downloadUrl: "#",
          fileType: "PDF",
          fileSize: "8.2 MB",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
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
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-6">My Downloads</h2>
                <div className="space-y-4">
                  {purchases.flatMap((purchase) =>
                    purchase.items.map((item, index) => (
                      <div
                        key={`${purchase.id}-${index}`}
                        className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-primary transition-colors"
                      >
                        <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Download className="w-8 h-8 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold mb-1">{item.title}</h3>
                          <p className="text-sm text-gray-500">
                            {item.fileType} • {item.fileSize}
                          </p>
                          <p className="text-xs text-gray-400">
                            Purchased on {new Date(purchase.date).toLocaleDateString()}
                          </p>
                        </div>
                        <button className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-semibold hover:shadow-lg transition-all flex items-center gap-2">
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
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Order History</h2>
                <div className="space-y-4">
                  {purchases.map((purchase) => (
                    <div
                      key={purchase.id}
                      className="border border-gray-200 rounded-xl p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold mb-1">Order #{purchase.orderId}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(purchase.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">${purchase.total.toFixed(2)}</div>
                          <span className="inline-block px-3 py-1 bg-success/10 text-success text-xs font-semibold rounded-full">
                            Completed
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {purchase.items.map((item, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            • {item.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                <div className="space-y-6">
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
                  <button className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-semibold hover:shadow-lg transition-all">
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

