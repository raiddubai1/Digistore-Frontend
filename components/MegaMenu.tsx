"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown, Sparkles, Tag, Home, Briefcase, Code,
  Heart, Palette, DollarSign, ArrowRight, Flame, Zap, Menu,
  LucideIcon, Star, Gift, Rocket, Package, Users
} from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { useMenuItems } from "@/hooks/useMenuItems";

// Icon mapping for categories
const iconMap: Record<string, LucideIcon> = {
  briefcase: Briefcase,
  sparkles: Sparkles,
  code: Code,
  heart: Heart,
  palette: Palette,
  'dollar-sign': DollarSign,
  user: Sparkles,
  'paw-print': Heart,
  home: Home,
  gift: Gift,
  star: Star,
  rocket: Rocket,
  package: Package,
  users: Users,
  flame: Flame,
  zap: Zap,
  tag: Tag,
};

// Color palette for categories
const categoryColors = [
  "bg-[#ff6f61]",
  "bg-pink-500",
  "bg-emerald-500",
  "bg-orange-500",
  "bg-rose-500",
  "bg-amber-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-teal-500",
  "bg-indigo-500",
];

// Type for mega menu category display
interface MegaMenuCategory {
  id: string;
  name: string;
  slug: string;
  icon: LucideIcon;
  color: string;
  subcategories: { name: string; slug: string; count: number }[];
}

export default function MegaMenu() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch dynamic menu items from settings
  const { menuItems } = useMenuItems();

  // Fetch categories from API
  const { categories: apiCategories } = useCategories();

  // Transform API categories to mega menu format
  const categories: MegaMenuCategory[] = apiCategories
    .filter(cat => !cat.parentId) // Only parent categories
    .map((cat, index) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      icon: iconMap[cat.icon || 'briefcase'] || Briefcase,
      color: categoryColors[index % categoryColors.length],
      subcategories: apiCategories
        .filter(child => child.parentId === cat.id)
        .map(child => ({
          name: child.name,
          slug: child.slug,
          count: child._count?.products || 0,
        })),
    }));

  const handleMouseEnter = (categoryId: string) => {
    setActiveCategory(categoryId);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setActiveCategory(null);
    setIsOpen(false);
  };

  const activeCategoryData = categories.find(cat => cat.id === activeCategory);

  return (
    <div
      className="hidden lg:block relative"
      onMouseLeave={handleMouseLeave}
    >
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-14">
            {/* Main Navigation Links */}
            <div className="flex items-center gap-1">
              {/* Categories Dropdown Trigger - First Item */}
              <div className="relative">
                <button
                  onMouseEnter={() => categories.length > 0 && handleMouseEnter(categories[0].id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isOpen
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-700 hover:text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <Menu className="w-4 h-4" />
                  All Categories
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Dynamic Menu Items from Settings */}
              {/* Dynamic Menu Items from Settings */}
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:text-gray-500 hover:bg-gray-50 transition-all"
                >
                  {item.label}
                </Link>
              ))}
            </div>

          {/* Right Side - Special Links */}
          <div className="flex items-center gap-1">
            <Link
              href="/bundles"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:text-gray-500 hover:bg-gray-50 transition-all"
            >
              <Package className="w-4 h-4" />
              Bundles
            </Link>

            <Link
              href="/gift-cards"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-[#ff6f61] hover:bg-orange-50 transition-all"
            >
              <Gift className="w-4 h-4" />
              Gift Cards
            </Link>

            <Link
              href="/deals"
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:shadow-lg hover:shadow-gray-200 transition-all"
            >
              <Tag className="w-4 h-4" />
              Hot Deals
            </Link>
          </div>
        </div>
      </div>

      {/* Mega Menu Dropdown Panel */}
      {isOpen && (
        <div
          className="absolute left-0 right-0 top-full bg-white border-t-2 border-gray-300 shadow-2xl z-[100]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-8">
            <div className="grid grid-cols-12 gap-8">
              {/* Left Sidebar - Category List */}
              <div className="col-span-3 space-y-1">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 px-3">
                  All Categories
                </h3>
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onMouseEnter={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${
                        activeCategory === category.id
                          ? category.color + ' text-white shadow-lg'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${
                        activeCategory === category.id
                          ? 'bg-white/20'
                          : 'bg-gray-100 group-hover:bg-gray-200'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium">{category.name}</div>
                      </div>
                      <ArrowRight className={`w-4 h-4 transition-transform ${
                        activeCategory === category.id ? 'translate-x-1' : ''
                      }`} />
                    </button>
                  );
                })}
              </div>

              {/* Right Content - Subcategories */}
              {activeCategoryData && (
                <div className="col-span-9">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-3 rounded-2xl ${activeCategoryData.color}`}>
                      <activeCategoryData.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{activeCategoryData.name}</h3>
                      <p className="text-sm text-gray-500">Explore our collection of digital products</p>
                    </div>
                  </div>

                  {activeCategoryData.subcategories.length > 0 ? (
                    <div className="grid grid-cols-3 gap-4">
                      {activeCategoryData.subcategories.map((sub) => (
                        <Link
                          key={sub.slug}
                          href={`/products?category=${sub.slug}`}
                          className="group p-4 rounded-xl border-2 border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-semibold text-gray-900 group-hover:text-gray-500">
                              {sub.name}
                            </h4>
                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-500 group-hover:translate-x-1 transition-all" />
                          </div>
                          <p className="text-xs text-gray-500">{sub.count} products</p>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No subcategories available</p>
                      <p className="text-sm mt-1">Browse all products in this category</p>
                    </div>
                  )}

                  {/* View All Link */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <Link
                      href={`/products?category=${activeCategoryData.slug}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-gray-200 transition-all group"
                    >
                      View All {activeCategoryData.name}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
    </div>
  );
}


