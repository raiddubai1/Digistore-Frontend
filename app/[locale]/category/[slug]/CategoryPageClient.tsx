"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import Breadcrumb from "@/components/Breadcrumb";
import { CategorySEO } from "@/data/category-seo";
import { Category, Product } from "@/types";
import { ChevronDown, ChevronUp, Filter, Grid, List, Loader2, Star } from "lucide-react";
import { demoProducts } from "@/data/demo-products";
import { productsAPI } from "@/lib/api";

interface CategoryPageClientProps {
  slug: string;
  locale: string;
  seoContent: CategorySEO;
  category: Category;
  categories: Category[];
  productCount: number;
}

export default function CategoryPageClient({
  slug,
  locale,
  seoContent,
  category,
  categories,
  productCount,
}: CategoryPageClientProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(productCount);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("popular");
  const [bottomContentExpanded, setBottomContentExpanded] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Fetch products for this category
  const fetchProducts = useCallback(async (pageNum: number, append: boolean = false) => {
    if (append) {
      setIsLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      // Try API first
      if (process.env.NEXT_PUBLIC_API_URL) {
        const response = await productsAPI.getAll({
          page: pageNum,
          limit: 12,
          category: slug,
          sort: sortBy,
        });
        
        if (response.products && response.products.length > 0) {
          if (append) {
            setProducts(prev => [...prev, ...response.products]);
          } else {
            setProducts(response.products);
          }
          setTotal(response.total || response.products.length);
          return;
        }
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }

    // Fallback to demo data
    const filteredProducts = demoProducts.filter(p => 
      p.category === slug || 
      (typeof p.category === 'object' && (p.category as any)?.slug === slug)
    );
    
    // Apply sorting
    const sortedProducts = [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        default: // popular
          return (b.salesCount || 0) - (a.salesCount || 0);
      }
    });

    const startIndex = (pageNum - 1) * 12;
    const paginatedProducts = sortedProducts.slice(0, startIndex + 12);
    
    if (append) {
      setProducts(paginatedProducts);
    } else {
      setProducts(paginatedProducts);
    }
    setTotal(sortedProducts.length);
    
    setLoading(false);
    setIsLoadingMore(false);
  }, [slug, sortBy]);

  useEffect(() => {
    fetchProducts(1, false);
  }, [fetchProducts]);

  // Load more products
  const loadMoreProducts = useCallback(() => {
    if (!isLoadingMore && products.length < total) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProducts(nextPage, true);
    }
  }, [isLoadingMore, products.length, total, page, fetchProducts]);

  // Get subcategories
  const subcategories = categories.filter(c => c.parentId === category.id);

  // Breadcrumb items
  const breadcrumbItems = [
    { label: "Home", href: `/${locale}` },
    { label: "Categories", href: `/${locale}/categories` },
    { label: category.name, href: `/${locale}/category/${slug}` },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* ===== MOBILE LAYOUT ===== */}
      <div className="lg:hidden">
        {/* Breadcrumb */}
        <div className="bg-white dark:bg-slate-800 px-4 py-2 border-b border-gray-100 dark:border-slate-700">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* SEO Header Section */}
        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-slate-800 dark:to-slate-800 px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {seoContent.title}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {seoContent.introText}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {total} products available
            </span>
          </div>
        </div>

        {/* Subcategories (if any) */}
        {subcategories.length > 0 && (
          <div className="bg-white dark:bg-slate-800 px-4 py-3 border-b border-gray-100 dark:border-slate-700">
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-2">
                {subcategories.map((sub) => (
                  <Link
                    key={sub.id}
                    href={`/${locale}/category/${sub.slug}`}
                    className="px-3 py-1.5 bg-gray-100 dark:bg-slate-700 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap"
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sort & View Options */}
        <div className="bg-white dark:bg-slate-800 px-4 py-3 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm bg-gray-100 dark:bg-slate-700 border-0 rounded-lg px-3 py-2"
          >
            <option value="popular">Most Popular</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg ${viewMode === "list" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="p-4">
          {loading ? (
            <div className="grid grid-cols-2 gap-3">
              {[...Array(6)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              <div className={viewMode === "grid" ? "grid grid-cols-2 gap-3" : "space-y-3"}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Load More */}
              {products.length < total && (
                <div className="mt-6 text-center" ref={loadMoreRef}>
                  <button
                    onClick={loadMoreProducts}
                    disabled={isLoadingMore}
                    className="px-6 py-3 bg-gray-900 text-white rounded-xl font-medium disabled:opacity-50"
                  >
                    {isLoadingMore ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading...
                      </span>
                    ) : (
                      "Load More Products"
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Bottom SEO Content - Collapsible */}
        <div className="bg-white dark:bg-slate-800 mt-4 mx-4 mb-8 rounded-xl border border-gray-100 dark:border-slate-700 overflow-hidden">
          <button
            onClick={() => setBottomContentExpanded(!bottomContentExpanded)}
            className="w-full px-4 py-3 flex justify-between items-center text-left"
          >
            <span className="font-semibold text-gray-900 dark:text-white text-sm">
              About {category.name}
            </span>
            {bottomContentExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          {bottomContentExpanded && (
            <div className="px-4 pb-4 prose prose-sm dark:prose-invert max-w-none">
              {seoContent.bottomContent.split('\n').map((paragraph, idx) => (
                <p key={idx} className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ===== DESKTOP LAYOUT ===== */}
      <div className="hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Breadcrumb items={breadcrumbItems} />
          </div>

          {/* SEO Header Section */}
          <div className="bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 dark:from-slate-800 dark:to-slate-800 rounded-2xl p-8 mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {seoContent.title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
              {seoContent.introText}
            </p>
            <div className="mt-4 flex items-center gap-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {total} products available
              </span>
            </div>
          </div>

          {/* Subcategories (if any) */}
          {subcategories.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Browse Subcategories
              </h2>
              <div className="flex flex-wrap gap-3">
                {subcategories.map((sub) => (
                  <Link
                    key={sub.id}
                    href={`/${locale}/category/${sub.slug}`}
                    className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors"
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Toolbar */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4 mb-6 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Showing {products.length} of {total} products
              </span>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm bg-gray-100 dark:bg-slate-700 border-0 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <div className="flex gap-2 border-l border-gray-200 dark:border-slate-700 pl-4">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-gray-900 text-white" : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200"}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-gray-900 text-white" : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200"}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              <div className={viewMode === "grid" ? "grid grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Load More */}
              {products.length < total && (
                <div className="mt-10 text-center">
                  <button
                    onClick={loadMoreProducts}
                    disabled={isLoadingMore}
                    className="px-8 py-3 bg-gray-900 dark:bg-primary text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    {isLoadingMore ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Loading more products...
                      </span>
                    ) : (
                      `Load More Products (${total - products.length} remaining)`
                    )}
                  </button>
                </div>
              )}
            </>
          )}

          {/* Bottom SEO Content Section */}
          <div className="mt-16 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
            <button
              onClick={() => setBottomContentExpanded(!bottomContentExpanded)}
              className="w-full px-8 py-5 flex justify-between items-center text-left hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <span className="font-bold text-xl text-gray-900 dark:text-white">
                Learn More About {category.name}
              </span>
              {bottomContentExpanded ? (
                <ChevronUp className="w-6 h-6 text-gray-400" />
              ) : (
                <ChevronDown className="w-6 h-6 text-gray-400" />
              )}
            </button>

            <div className={`overflow-hidden transition-all duration-300 ${bottomContentExpanded ? "max-h-[2000px]" : "max-h-0"}`}>
              <div className="px-8 pb-8 prose prose-lg dark:prose-invert max-w-none">
                {seoContent.bottomContent.split('\n').map((paragraph, idx) => {
                  if (paragraph.startsWith('- ')) {
                    return (
                      <li key={idx} className="text-gray-600 dark:text-gray-300 ml-4">
                        {paragraph.substring(2)}
                      </li>
                    );
                  }
                  if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                    return (
                      <h3 key={idx} className="text-lg font-bold text-gray-900 dark:text-white mt-6 mb-2">
                        {paragraph.replace(/\*\*/g, '')}
                      </h3>
                    );
                  }
                  if (paragraph.trim()) {
                    return (
                      <p key={idx} className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                        {paragraph.replace(/\*\*/g, '')}
                      </p>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
