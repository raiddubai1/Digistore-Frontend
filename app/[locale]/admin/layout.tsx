"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  BarChart3,
  FolderTree,
  Star,
  Tag,
  MoreHorizontal,
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

const getNavigation = (basePath: string) => [
  { name: "Dashboard", href: `${basePath}/admin`, icon: LayoutDashboard },
  { name: "Products", href: `${basePath}/admin/products`, icon: Package },
  { name: "Categories", href: `${basePath}/admin/categories`, icon: FolderTree },
  { name: "Attributes", href: `${basePath}/admin/attributes`, icon: Tag },
  { name: "Orders", href: `${basePath}/admin/orders`, icon: ShoppingCart },
  { name: "Customers", href: `${basePath}/admin/customers`, icon: Users },
  { name: "Reviews", href: `${basePath}/admin/reviews`, icon: Star },
  { name: "Analytics", href: `${basePath}/admin/analytics`, icon: BarChart3 },
  { name: "Settings", href: `${basePath}/admin/settings`, icon: Settings },
];

// Mobile bottom nav - show 4 items + more menu
const getMobileNav = (basePath: string) => [
  { name: "Home", href: `${basePath}/admin`, icon: LayoutDashboard },
  { name: "Products", href: `${basePath}/admin/products`, icon: Package },
  { name: "Orders", href: `${basePath}/admin/orders`, icon: ShoppingCart },
  { name: "Analytics", href: `${basePath}/admin/analytics`, icon: BarChart3 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Extract locale from pathname (e.g., /en/admin -> en)
  // Check if first segment is a valid locale, otherwise use empty string (default locale)
  const validLocales = ['en', 'ar', 'es', 'fr', 'de'];
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0] || '';
  // If first segment is a valid locale, use it; otherwise use empty string for default locale
  const locale = validLocales.includes(firstSegment) ? firstSegment : '';
  // Build base path: with locale prefix if specified, otherwise just root
  const basePath = locale ? `/${locale}` : '';
  const navigation = getNavigation(basePath);
  const mobileNav = getMobileNav(basePath);

  // Check if current path matches or starts with nav item href
  const isActive = (href: string) => {
    if (href === `${basePath}/admin`) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <div className="h-screen overflow-hidden bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <Link href={`${basePath}/admin`} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">Admin Panel</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User & Logout */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">{user?.name || 'Admin User'}</div>
                <div className="text-xs text-gray-500">{user?.email || 'admin@digistore1.com'}</div>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
            <Link
              href={basePath || '/'}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors mt-2"
            >
              <span className="font-medium">← Back to Store</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64 h-full flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 z-30 flex-shrink-0">
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex-1 lg:flex-none">
              <h1 className="text-xl font-bold">
                {navigation.find((item) => item.href === pathname)?.name || "Admin"}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href={basePath || '/'}
                className="text-sm text-gray-600 hover:text-primary transition-colors"
              >
                View Store →
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 pb-20 lg:pb-8">{children}</main>

        {/* Mobile Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-area-pb">
          <div className="flex items-center justify-around h-16">
            {mobileNav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 ${
                    active ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${active ? "stroke-[2.5]" : ""}`} />
                  <span className="text-[10px] font-medium">{item.name}</span>
                </Link>
              );
            })}
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex flex-col items-center justify-center flex-1 h-full gap-0.5 text-gray-400"
            >
              <MoreHorizontal className="w-5 h-5" />
              <span className="text-[10px] font-medium">More</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
    </ProtectedRoute>
  );
}

