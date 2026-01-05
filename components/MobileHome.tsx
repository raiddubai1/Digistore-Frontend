"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, ChevronRight, TrendingUp, Sparkles, Star, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "./ProductCard";
import WelcomePopup from "./WelcomePopup";
import { Product, Category } from "@/types";
import { getThumbnailUrl, formatPrice, getCurrentCurrency, CurrencyCode } from "@/lib/utils";

interface MobileHomeProps {
  featuredProducts: Product[];
  bestsellerProducts: Product[];
  newProducts: Product[];
  categories: Category[];
  locale: string;
}

// Category icon mapping with colors
const categoryConfig: { [key: string]: { emoji: string; bgColor: string } } = {
  // Legacy demo categories
  "business-and-marketing": { emoji: "💼", bgColor: "bg-blue-100" },
  "personal-development": { emoji: "🧠", bgColor: "bg-purple-100" },
  "animals-and-pets": { emoji: "🐾", bgColor: "bg-orange-100" },
  "home-and-lifestyle": { emoji: "🏠", bgColor: "bg-green-100" },
  "technology": { emoji: "💻", bgColor: "bg-cyan-100" },
  "society-and-politics": { emoji: "🌍", bgColor: "bg-red-100" },
  // Top-level API categories
  "ebooks": { emoji: "📚", bgColor: "bg-indigo-100" },
  "digital-marketing-business": { emoji: "📱", bgColor: "bg-purple-100" },
  "canva-templates": { emoji: "🎨", bgColor: "bg-cyan-100" },
  "lightroom-presets": { emoji: "📷", bgColor: "bg-amber-100" },
  "ebooks-guides": { emoji: "📖", bgColor: "bg-emerald-100" },
  "stock-media": { emoji: "🎬", bgColor: "bg-red-100" },
  "planners-printables": { emoji: "📅", bgColor: "bg-pink-100" },
  "courses-training": { emoji: "🎓", bgColor: "bg-violet-100" },
  "business-cards-templates": { emoji: "💳", bgColor: "bg-slate-100" },
  "games-educational": { emoji: "🎮", bgColor: "bg-lime-100" },
  // Sub-categories
  "marketing": { emoji: "📣", bgColor: "bg-pink-100" },
  "business": { emoji: "💼", bgColor: "bg-blue-100" },
  "affiliate-marketing": { emoji: "🤝", bgColor: "bg-green-100" },
  "marketing-templates": { emoji: "📝", bgColor: "bg-yellow-100" },
  "business-resources": { emoji: "📊", bgColor: "bg-teal-100" },
  "instagram-templates": { emoji: "📸", bgColor: "bg-pink-100" },
  "business-planners": { emoji: "📅", bgColor: "bg-blue-100" },
  "portrait-presets": { emoji: "🖼️", bgColor: "bg-amber-100" },
  "stock-videos": { emoji: "🎬", bgColor: "bg-red-100" },
  "marketing-courses": { emoji: "🎓", bgColor: "bg-violet-100" },
  "pet-animal-guides": { emoji: "🐕", bgColor: "bg-orange-100" },
  "facebook-templates": { emoji: "👍", bgColor: "bg-blue-100" },
  "business-branding": { emoji: "✨", bgColor: "bg-rose-100" },
  "how-to-guides": { emoji: "📘", bgColor: "bg-sky-100" },
  "nature-landscape-presets": { emoji: "🏞️", bgColor: "bg-green-100" },
  "lifestyle-presets": { emoji: "🌟", bgColor: "bg-yellow-100" },
  "personal-planners": { emoji: "📓", bgColor: "bg-purple-100" },
  "coloring-books": { emoji: "🖍️", bgColor: "bg-pink-100" },
  "icons-graphics": { emoji: "🎯", bgColor: "bg-indigo-100" },
  "mockups": { emoji: "📐", bgColor: "bg-gray-100" },
  "tech-development": { emoji: "💻", bgColor: "bg-cyan-100" },
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

  // Product section component - 2-column grid layout with better spacing
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
    <section className="mb-8 px-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconColor.replace('text-', 'bg-').replace('-500', '-100')}`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
          {badge && (
            <span className={`px-2.5 py-1 ${badgeColor} text-[10px] font-bold rounded-full`}>
              {badge}
            </span>
          )}
        </div>
        <Link href={seeAllLink} className="flex items-center text-sm font-semibold text-[#FF6B35] hover:text-[#E55A2B]">
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
      {/* Compact Search Bar - Improved */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-white via-gray-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 border-b border-gray-100 dark:border-slate-700 px-4 py-2.5 shadow-sm">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search templates, eBooks, courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus:bg-white dark:focus:bg-slate-600 focus:border-[#FF6B35] dark:focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 dark:focus:ring-[#FF6B35]/20 focus:outline-none transition-all text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm"
            />
          </div>
        </form>
      </div>

      {/* Welcome Popup for First-Time Visitors */}
      <WelcomePopup />

      {/* Marketing Banners - Horizontal Scroll */}
      <div className="bg-white dark:bg-slate-800 py-3 border-b border-gray-100 dark:border-slate-700">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-3 px-4">
            {/* Banner 1 - Bundles (Best Value First) */}
            <Link
              href={`/${locale}/bundles`}
              className="relative flex-shrink-0 w-[280px] h-[100px] rounded-2xl overflow-hidden active:scale-[0.98] transition-transform"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B35] via-[#ff6f61] to-[#ff8a7a]" />
              <div className="absolute inset-0 flex items-center justify-between px-5">
                <div>
                  <p className="text-white/80 text-xs font-medium">Save Up To 70%</p>
                  <h3 className="text-white text-lg font-bold">Mega Bundles 🎁</h3>
                  <p className="text-white text-sm font-semibold">Best Value Deals</p>
                </div>
                <div className="text-4xl">📦</div>
              </div>
            </Link>

            {/* Banner 2 - Instagram Post Templates */}
            <Link
              href={`/${locale}/products?category=instagram-templates`}
              className="relative flex-shrink-0 w-[280px] h-[100px] rounded-2xl overflow-hidden active:scale-[0.98] transition-transform"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-rose-500 to-red-500" />
              <div className="absolute inset-0 flex items-center justify-between px-5">
                <div>
                  <p className="text-white/80 text-xs font-medium">Trending Now</p>
                  <h3 className="text-white text-lg font-bold">Instagram Posts 📸</h3>
                  <p className="text-white text-sm font-semibold">Canva Templates</p>
                </div>
                <div className="text-4xl">✨</div>
              </div>
            </Link>

            {/* Banner 3 - Social Media Templates Category */}
            <Link
              href={`/${locale}/products?category=canva-templates`}
              className="relative flex-shrink-0 w-[280px] h-[100px] rounded-2xl overflow-hidden active:scale-[0.98] transition-transform"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500" />
              <div className="absolute inset-0 flex items-center justify-between px-5">
                <div>
                  <p className="text-white/80 text-xs font-medium">All Platforms</p>
                  <h3 className="text-white text-lg font-bold">Social Media 📱</h3>
                  <p className="text-white text-sm font-semibold">Template Packs</p>
                </div>
                <div className="text-4xl">🎨</div>
              </div>
            </Link>

            {/* Banner 4 - Best Sellers */}
            <Link
              href={`/${locale}/products?filter=bestsellers`}
              className="relative flex-shrink-0 w-[280px] h-[100px] rounded-2xl overflow-hidden active:scale-[0.98] transition-transform"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />
              <div className="absolute inset-0 flex items-center justify-between px-5">
                <div>
                  <p className="text-white/80 text-xs font-medium">Top Rated</p>
                  <h3 className="text-white text-lg font-bold">Best Sellers 🏆</h3>
                  <p className="text-white text-sm font-semibold">Most Popular</p>
                </div>
                <div className="text-4xl">⭐</div>
              </div>
            </Link>

            {/* Banner 5 - New Arrivals */}
            <Link
              href={`/${locale}/products?filter=new`}
              className="relative flex-shrink-0 w-[280px] h-[100px] rounded-2xl overflow-hidden active:scale-[0.98] transition-transform"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
              <div className="absolute inset-0 flex items-center justify-between px-5">
                <div>
                  <p className="text-white/80 text-xs font-medium">Just Added</p>
                  <h3 className="text-white text-lg font-bold">New Arrivals ✨</h3>
                  <p className="text-white text-sm font-semibold">Fresh Content</p>
                </div>
                <div className="text-4xl">🆕</div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Categories - Horizontal Scroll Pills */}
      <div className="bg-white dark:bg-slate-800 py-3 border-b border-gray-100 dark:border-slate-700">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 px-4">
            {categories.slice(0, 8).map((category) => {
              return (
                <Link
                  key={category.id}
                  href={`/${locale}/category/${category.slug}`}
                  className="px-4 py-2 bg-gray-100 dark:bg-slate-700 rounded-full whitespace-nowrap flex-shrink-0 active:scale-95 transition-transform"
                >
                  <span className="text-sm font-medium text-gray-800 dark:text-white">{category.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content - with better section spacing */}
      <div className="pt-6">
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

        {/* 2-Column Grid Section - All Products with better spacing */}
        <section className="px-4 mt-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Explore Products</h2>
            <Link href={`/${locale}/products`} className="flex items-center text-sm font-semibold text-[#FF6B35] hover:text-[#E55A2B]">
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

// Compact product card for mobile grid/scroll - with consistent padding
function MiniProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const [currency, setCurrency] = useState<CurrencyCode>('USD');

  useEffect(() => {
    setCurrency(getCurrentCurrency());
    const handleCurrencyChange = () => setCurrency(getCurrentCurrency());
    window.addEventListener('currencyChange', handleCurrencyChange);
    return () => window.removeEventListener('currencyChange', handleCurrencyChange);
  }, []);

  return (
    <Link href={`/products/${product.slug}`} className="block">
      <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md active:scale-[0.98] transition-all">
        {/* Product Image - with consistent padding */}
        <div className="relative aspect-square bg-gray-50 dark:bg-slate-700 p-2">
          <div className="relative w-full h-full">
            <Image
              src={getThumbnailUrl(product.thumbnailUrl) || '/placeholder-product.png'}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              priority={priority}
              className="object-cover rounded-lg"
            />
          </div>
          {/* Badges */}
          {product.discount !== undefined && product.discount > 0 && (
            <span className="absolute top-3 left-3 px-2 py-0.5 bg-[#FF6B35] text-white text-[10px] font-bold rounded-md shadow-sm z-10">
              -{product.discount}%
            </span>
          )}
          {product.bestseller && !(product.discount && product.discount > 0) && (
            <span className="absolute top-3 left-3 px-2 py-0.5 bg-orange-500 text-white text-[10px] font-bold rounded-md shadow-sm z-10">
              🔥 HOT
            </span>
          )}
          {product.newArrival && !(product.discount && product.discount > 0) && !product.bestseller && (
            <span className="absolute top-3 left-3 px-2 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded-md shadow-sm z-10">
              ✨ NEW
            </span>
          )}
        </div>
        {/* Content */}
        <div className="p-3">
          <h3 className="text-xs font-semibold text-gray-900 dark:text-white line-clamp-2 leading-tight mb-2">
            {product.title}
          </h3>
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">{product.rating}</span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500">({product.reviewCount})</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-[#FF6B35]">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-[10px] text-gray-400 dark:text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

