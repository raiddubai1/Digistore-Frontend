import Link from "next/link";
import { demoCategories } from "@/data/demo-products";
import { getCategories } from "@/lib/api/categories";
import type { Category } from "@/types";
import { ArrowRight, Briefcase, User, Home, Code, Globe, Heart, Package, ChevronRight } from "lucide-react";

// Force dynamic rendering to prevent build-time API calls
export const dynamic = 'force-dynamic';

const categoryIcons: Record<string, any> = {
  briefcase: Briefcase,
  user: User,
  "paw-print": Heart,
  home: Home,
  code: Code,
  globe: Globe,
  package: Package,
};

const categoryEmojis: Record<string, string> = {
  "business-and-marketing": "💼",
  "personal-development": "🧠",
  "animals-and-pets": "🐾",
  "home-and-lifestyle": "🏠",
  "technology": "💻",
  "society-and-politics": "🌍",
  // API categories
  "ebooks": "📚",
  "digital-marketing-business": "📱",
  "canva-templates": "🎨",
  "lightroom-presets": "📷",
  "ebooks-guides": "📖",
  "stock-media": "🎬",
  "planners-printables": "📅",
  "courses-training": "🎓",
  "business-cards-templates": "💳",
  "games-educational": "🎮",
  "instagram-templates": "📸",
  "facebook-templates": "👍",
  "marketing": "📣",
  "business": "💼",
};

interface CategoriesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function CategoriesPage({ params }: CategoriesPageProps) {
  const { locale } = await params;

  // Use demo data by default (API integration can be enabled when backend is ready)
  let categories: Category[] = demoCategories;

  // Try to fetch from API if available
  if (process.env.NEXT_PUBLIC_API_URL) {
    try {
      const allCategories = await getCategories();
      // Filter only parent categories (no parentId) and map to match Category type
      const parentCategories = allCategories
        .filter(cat => !cat.parentId)
        .map(cat => ({
          ...cat,
          productCount: cat._count?.products || 0,
        }));
      if (parentCategories && parentCategories.length > 0) {
        categories = parentCategories;
      }
    } catch (error) {
      console.error("Error fetching categories, using demo data:", error);
    }
  }

  return (
    <>
      {/* ===== MOBILE LAYOUT ===== */}
      <div className="lg:hidden min-h-screen bg-white pb-24">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-4">
          <h1 className="text-xl font-bold text-center">Categories</h1>
        </div>

        {/* Category List */}
        <div className="divide-y divide-gray-100">
          {categories.map((category: any) => {
            const emoji = categoryEmojis[category.slug] || "📦";
            return (
              <Link
                key={category.id}
                href={`/${locale}/category/${category.slug}`}
                className="flex items-center gap-4 px-4 py-4 active:bg-gray-50"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                  {emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-500">
                    {category._count?.products || category.productCount || 0} products
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
            );
          })}
        </div>

        {/* Browse All */}
        <div className="p-4 mt-4">
          <Link
            href={`/${locale}/products`}
            className="block w-full py-4 bg-gray-900 text-white text-center rounded-xl font-semibold"
          >
            Browse All Products
          </Link>
        </div>
      </div>

      {/* ===== DESKTOP LAYOUT ===== */}
      <div className="hidden lg:block min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 dark:text-white">
              Browse by Category
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Explore our diverse collection of digital products organized by category
            </p>
          </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {categories.length > 0 ? (
            categories.map((category: any) => {
              const IconComponent = categoryIcons[category.icon || "package"] || Package;
              const emoji = categoryEmojis[category.slug] || "📦";

              return (
                <Link
                  key={category.id}
                  href={`/${locale}/category/${category.slug}`}
                  className="group"
                >
                  <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-gray-200 dark:border-slate-700 hover:border-primary p-8 transition-all hover:shadow-xl">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-3xl">
                      {emoji}
                    </div>

                    {/* Category Name */}
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>

                    {/* Description */}
                    {category.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {category.description}
                      </p>
                    )}

                    {/* Product Count */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {category._count?.products || category.productCount || 0} products
                      </span>
                      <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {/* Subcategories */}
                    {category.children && category.children.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500 mb-2">Subcategories:</p>
                        <div className="flex flex-wrap gap-2">
                          {category.children.slice(0, 3).map((child: any) => (
                            <span
                              key={child.id}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                            >
                              {child.name}
                            </span>
                          ))}
                          {category.children.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{category.children.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No categories available at the moment.</p>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-12 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Can't find what you're looking for?
            </h2>
            <p className="text-gray-600 mb-6">
              Browse all products or use our search to find exactly what you need
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${locale}/products`}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-semibold hover:shadow-lg transition-all hover:scale-105"
              >
                View All Products
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-full font-semibold hover:border-primary transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

