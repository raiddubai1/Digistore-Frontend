"use client";

import Link from "next/link";
import { Search, ChevronRight, TrendingUp, Sparkles, Star, Clock } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "./ProductCard";
import { Product, Category } from "@/types";

interface MobileHomeProps {
  featuredProducts: Product[];
  bestsellerProducts: Product[];
  newProducts: Product[];
  categories: Category[];
  locale: string;
}

// Category icon mapping with colors
const categoryConfig: { [key: string]: { emoji: string; bgColor: string } } = {
  // Main categories
  "business-and-marketing": { emoji: "💼", bgColor: "bg-blue-100" },
  "personal-development": { emoji: "🧠", bgColor: "bg-purple-100" },
  "animals-and-pets": { emoji: "🐾", bgColor: "bg-orange-100" },
  "home-and-lifestyle": { emoji: "🏠", bgColor: "bg-green-100" },
  "technology": { emoji: "💻", bgColor: "bg-cyan-100" },
  "society-and-politics": { emoji: "🌍", bgColor: "bg-red-100" },
  // API category slugs
  "marketing": { emoji: "📣", bgColor: "bg-pink-100" },
  "business": { emoji: "💼", bgColor: "bg-blue-100" },
  "ebooks": { emoji: "📚", bgColor: "bg-indigo-100" },
  "digital-marketing-business": { emoji: "📱", bgColor: "bg-purple-100" },
  "affiliate-marketing": { emoji: "🤝", bgColor: "bg-green-100" },
  "marketing-templates": { emoji: "📝", bgColor: "bg-yellow-100" },
  "business-resources": { emoji: "📊", bgColor: "bg-teal-100" },
  "instagram-templates": { emoji: "📸", bgColor: "bg-pink-100" },
  "business-planners": { emoji: "📅", bgColor: "bg-blue-100" },
  "portrait-presets": { emoji: "🖼️", bgColor: "bg-amber-100" },
  "stock-videos": { emoji: "🎬", bgColor: "bg-red-100" },
  "marketing-courses": { emoji: "🎓", bgColor: "bg-violet-100" },
  "pet-animal-guides": { emoji: "🐕", bgColor: "bg-orange-100" },
  "canva-templates": { emoji: "🎨", bgColor: "bg-cyan-100" },
  "facebook-templates": { emoji: "👍", bgColor: "bg-blue-100" },
  "business-branding": { emoji: "✨", bgColor: "bg-rose-100" },
};

export default function MobileHome({
  featuredProducts,
  bestsellerProducts,
  newProducts,
  categories,
  locale,
}: MobileHomeProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/${locale}/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Product section component - 2-column grid layout
  const ProductSection = ({
    title,
    icon: Icon,
    iconColor,
    products,
    seeAllLink,
    badge,
    badgeColor,
  }: {
    title: string;
    icon: any;
    iconColor: string;
    products: Product[];
    seeAllLink: string;
    badge?: string;
    badgeColor?: string;
  }) => (
    <section className="mb-6 px-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${iconColor}`} />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
          {badge && (
            <span className={`px-2 py-0.5 ${badgeColor} text-[10px] font-bold rounded-full`}>
              {badge}
            </span>
          )}
        </div>
        <Link href={seeAllLink} className="flex items-center text-sm font-medium text-[#ff6f61]">
          See all
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {products.slice(0, 4).map((product) => (
          <MiniProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-20">
      {/* Compact Search Bar */}
      <div className="sticky top-0 z-40 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 px-4 py-3">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search digital products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-full border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 focus:bg-white dark:focus:bg-slate-600 focus:border-gray-400 dark:focus:border-slate-500 focus:ring-2 focus:ring-gray-100 dark:focus:ring-slate-600 focus:outline-none transition-all text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>
        </form>
      </div>

      {/* Categories - Horizontal Scroll Pills */}
      <div className="bg-white dark:bg-slate-800 py-3 border-b border-gray-100 dark:border-slate-700">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 px-4">
            {categories.slice(0, 6).map((category) => {
              const config = categoryConfig[category.slug] || { emoji: "📦", bgColor: "bg-gray-100 dark:bg-slate-700" };
              return (
                <Link
                  key={category.id}
                  href={`/${locale}/products?category=${category.slug}`}
                  className={`flex items-center gap-2 px-4 py-2 ${config.bgColor} rounded-full whitespace-nowrap flex-shrink-0 active:scale-95 transition-transform`}
                >
                  <span className="text-base">{config.emoji}</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{category.name.split(' ')[0]}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-4">
        {/* Trending Now */}
        <ProductSection
          title="Trending Now"
          icon={TrendingUp}
          iconColor="text-orange-500"
          products={bestsellerProducts}
          seeAllLink={`/${locale}/products?filter=bestsellers`}
          badge="HOT"
          badgeColor="bg-orange-100 text-orange-600"
        />

        {/* Featured Products */}
        <ProductSection
          title="Featured"
          icon={Sparkles}
          iconColor="text-blue-500"
          products={featuredProducts}
          seeAllLink={`/${locale}/products`}
        />

        {/* New Arrivals */}
        {newProducts.length > 0 && (
          <ProductSection
            title="New Arrivals"
            icon={Clock}
            iconColor="text-green-500"
            products={newProducts}
            seeAllLink={`/${locale}/products?filter=new`}
            badge="NEW"
            badgeColor="bg-green-100 text-green-600"
          />
        )}

        {/* 2-Column Grid Section - All Products */}
        <section className="px-4 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Explore Products</h2>
            <Link href={`/${locale}/products`} className="flex items-center text-sm font-medium text-[#ff6f61]">
              View all
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[...featuredProducts, ...bestsellerProducts].slice(0, 6).map((product, index) => (
              <MiniProductCard key={`${product.id}-${index}`} product={product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

// Compact product card for mobile grid/scroll
function MiniProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="block">
      <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm active:scale-[0.98] transition-transform">
        {/* Product Image */}
        <div className="relative aspect-square bg-gray-100">
          <img
            src={product.thumbnailUrl}
            alt={product.title}
            className="w-full h-full object-cover"
          />
          {/* Badges */}
          {product.discount && product.discount > 0 && (
            <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-[#ff6f61] text-white text-[10px] font-bold rounded">
              -{product.discount}%
            </span>
          )}
          {product.bestseller && !product.discount && (
            <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-orange-500 text-white text-[10px] font-bold rounded">
              🔥 HOT
            </span>
          )}
          {product.newArrival && !product.discount && !product.bestseller && (
            <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded">
              ✨ NEW
            </span>
          )}
        </div>
        {/* Content */}
        <div className="p-2.5">
          <h3 className="text-xs font-medium text-gray-900 line-clamp-2 leading-tight mb-1.5">
            {product.title}
          </h3>
          <div className="flex items-center gap-1 mb-1.5">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-[10px] font-medium text-gray-700">{product.rating}</span>
            <span className="text-[10px] text-gray-400">({product.reviewCount})</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-bold text-gray-900">${product.price}</span>
            {product.originalPrice && (
              <span className="text-[10px] text-gray-400 line-through">${product.originalPrice}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

