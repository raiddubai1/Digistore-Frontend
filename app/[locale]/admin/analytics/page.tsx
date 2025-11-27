"use client";

import { BarChart3, TrendingUp, DollarSign, ShoppingCart, Users, Package } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Track your store's performance and insights</p>
      </div>

      {/* Coming Soon */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6">
          <BarChart3 className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Analytics Dashboard Coming Soon</h2>
        <p className="text-gray-600 max-w-md mx-auto mb-8">
          We're building comprehensive analytics to help you track sales, revenue, customer behavior, and more.
        </p>
        
        {/* Preview Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
          <div className="p-6 bg-gray-50 rounded-xl">
            <TrendingUp className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Sales Trends</h3>
            <p className="text-sm text-gray-600">Track daily, weekly, and monthly sales performance</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-xl">
            <Users className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Customer Insights</h3>
            <p className="text-sm text-gray-600">Understand your customer demographics and behavior</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-xl">
            <Package className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Product Performance</h3>
            <p className="text-sm text-gray-600">See which products are performing best</p>
          </div>
        </div>
      </div>
    </div>
  );
}

