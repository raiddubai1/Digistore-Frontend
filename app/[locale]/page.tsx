import { redirect } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Download, Shield, Star, Sparkles, TrendingUp, Award, Gift, Tag, ShoppingCart, Package } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import OfferOfTheDay from "@/components/OfferOfTheDay";
import CategoriesSection from "@/components/CategoriesSection";
// import BlogSection from "@/components/BlogSection"; // Hidden until blog content is ready
import MobileHome from "@/components/MobileHome";
import RecentlyViewed from "@/components/RecentlyViewed";
import { getFeaturedProducts, getBestsellers, getNewArrivals } from "@/lib/api/products";
import { getCategories } from "@/lib/api/categories";

interface HomeProps {
  params: Promise<{ locale: string }>;
}

// Force dynamic rendering to prevent caching issues
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Set to true to redirect homepage to the landing page
// Landing page saved at: /[locale]/ultimate-bundle (hidden, not linked)
const REDIRECT_TO_LANDING = false;

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;
  const t = await getTranslations("home");
  const tCommon = await getTranslations("common");

  // Redirect to Ultimate Bundle landing page if enabled
  if (REDIRECT_TO_LANDING) {
    redirect(`/${locale}/ultimate-bundle`);
  }

  // Initialize with empty arrays - we use real API data
  let featuredProducts: any[] = [];
  let bestsellerProducts: any[] = [];
  let newProducts: any[] = [];
  let categories: any[] = [];

  // Fetch from API
  try {
    const [featured, bestsellers, newArrivals, apiCategories] = await Promise.all([
      getFeaturedProducts(),
      getBestsellers(),
      getNewArrivals(),
      getCategories(),
    ]);

    featuredProducts = featured || [];
    bestsellerProducts = bestsellers || [];
    newProducts = newArrivals || [];
    categories = apiCategories || [];
  } catch (error) {
    console.error("Error fetching data:", error);
    // Continue with empty arrays - sections will be hidden if no data
  }

  return (
    <>
      {/* Mobile Home - Etsy-inspired clean design */}
      <div className="lg:hidden">
        <MobileHome
          featuredProducts={featuredProducts}
          bestsellerProducts={bestsellerProducts}
          newProducts={newProducts}
          categories={categories}
          locale={locale}
        />
      </div>

      {/* Desktop Home - Full featured layout */}
      <div className="hidden lg:block min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Hero Section - Desktop Only */}
      <section className="pt-0 pb-16">
        <div className="w-full">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#F8FAFF] via-white to-[#FFF8F6] dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 shadow-xl border-b border-gray-100 dark:border-slate-700 px-4 sm:px-8 lg:px-16 py-8 lg:py-[25px]">

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left Column - Content */}
              <div className="text-center lg:text-left space-y-6 lg:space-y-[50px] lg:pt-8">
              {/* Main Heading */}
              <div className="space-y-3 lg:space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
                  <span className="block text-gray-900 dark:text-white">{t("hero.titleLine1")}</span>
                  <span className="block bg-gradient-to-r from-gray-600 via-[#ff8a7a] to-[#ff6f61] bg-clip-text text-transparent">
                    {t("hero.titleLine2")}
                  </span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  {t("hero.subtitle")}
                </p>

                {/* First Purchase Promo Badge */}
                <div className="flex justify-center lg:justify-start pt-2">
                  <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-[#FF6B35] to-[#ff8a5c] dark:from-[#FF6B35] dark:to-[#ff8a5c] rounded-full shadow-lg shadow-orange-200 dark:shadow-orange-900/30 hover:shadow-xl hover:scale-105 transition-all cursor-default">
                    <Sparkles className="w-4 h-4 text-white" />
                    <span className="text-sm font-bold text-white">
                      🎉 {t("hero.promoBadge")}
                    </span>
                  </div>
                </div>
              </div>

              {/* CTA Buttons - Full Width on Mobile */}
              <div className="flex flex-col gap-3 lg:flex-row lg:gap-4 lg:justify-start">
                <Link
                  href={`/${locale}/products`}
                  className="w-full lg:w-auto inline-flex items-center justify-center px-8 py-4 lg:py-3.5 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-full font-bold text-base hover:shadow-xl hover:shadow-gray-200 dark:hover:shadow-slate-900 transition-all active:scale-95 lg:hover:scale-105"
                >
                  {t("hero.browseProducts")}
                </Link>
                <Link
                  href={`/${locale}/categories`}
                  className="w-full lg:w-auto inline-flex items-center justify-center px-8 py-4 lg:py-3.5 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white rounded-full font-bold text-base hover:border-gray-300 dark:hover:border-slate-500 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                  {t("hero.viewCategories")}
                </Link>
              </div>

              {/* Trust Indicators - Compact on Mobile */}
              <div className="flex flex-wrap gap-6 lg:gap-8 justify-center lg:justify-start items-center">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 border-2 border-white dark:border-slate-800"></div>
                    <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-gradient-to-r from-[#ff6f61] to-gray-400 border-2 border-white dark:border-slate-800"></div>
                    <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 border-2 border-white dark:border-slate-800"></div>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-gray-900 dark:text-white">50,000+</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{t("stats.customers")}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 lg:w-5 lg:h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-gray-900 dark:text-white">4.9/5</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{t("stats.rating")}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Animated Laptop Mockup */}
            <div className="relative hidden lg:block">
              <div className="relative h-[450px] flex items-center justify-center">
                {/* Laptop Container */}
                <div className="relative animate-float">
                  {/* Laptop Screen - Modern White/Silver Design */}
                  <div className="relative w-[440px] h-[300px] rounded-2xl bg-gradient-to-br from-white via-gray-50 to-gray-100 p-3 shadow-2xl border-2 border-gray-200">
                    {/* Screen Display */}
                    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 via-white to-orange-50 rounded-xl overflow-hidden shadow-inner border border-gray-200">
                      {/* Screen Content - Product Thumbnails */}
                      <div className="absolute inset-0 p-4 overflow-hidden">
                        {/* Browser Bar */}
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-300">
                          <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-red-400 to-red-500 shadow"></div>
                            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 shadow"></div>
                            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-green-400 to-green-500 shadow"></div>
                          </div>
                          <div className="flex-1 h-6 bg-white rounded-lg border border-gray-300 shadow-sm"></div>
                        </div>

                        {/* Product Grid */}
                        <div className="grid grid-cols-3 gap-2.5">
                          {/* Product Card 1 - Orange */}
                          <div className="bg-gradient-to-br from-[#ff6f61] to-orange-500 rounded-lg p-2.5 shadow-lg animate-pulse-slow transform hover:scale-105 transition-all">
                            <div className="w-full h-12 bg-white/40 rounded-md mb-1.5 backdrop-blur-sm border border-white/50"></div>
                            <div className="h-1.5 bg-white/60 rounded mb-1"></div>
                            <div className="h-1.5 bg-white/50 rounded w-2/3"></div>
                          </div>

                          {/* Product Card 2 - Gray */}
                          <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg p-2.5 shadow-lg animate-pulse-slow transform hover:scale-105 transition-all" style={{ animationDelay: '0.2s' }}>
                            <div className="w-full h-12 bg-white/40 rounded-md mb-1.5 backdrop-blur-sm border border-white/50"></div>
                            <div className="h-1.5 bg-white/60 rounded mb-1"></div>
                            <div className="h-1.5 bg-white/50 rounded w-2/3"></div>
                          </div>

                          {/* Product Card 3 - Blue */}
                          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-2.5 shadow-lg animate-pulse-slow transform hover:scale-105 transition-all" style={{ animationDelay: '0.4s' }}>
                            <div className="w-full h-12 bg-white/40 rounded-md mb-1.5 backdrop-blur-sm border border-white/50"></div>
                            <div className="h-1.5 bg-white/60 rounded mb-1"></div>
                            <div className="h-1.5 bg-white/50 rounded w-2/3"></div>
                          </div>

                          {/* Product Card 4 - Purple */}
                          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-2.5 shadow-lg animate-pulse-slow transform hover:scale-105 transition-all" style={{ animationDelay: '0.6s' }}>
                            <div className="w-full h-12 bg-white/40 rounded-md mb-1.5 backdrop-blur-sm border border-white/50"></div>
                            <div className="h-1.5 bg-white/60 rounded mb-1"></div>
                            <div className="h-1.5 bg-white/50 rounded w-2/3"></div>
                          </div>

                          {/* Product Card 5 - Green */}
                          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg p-2.5 shadow-lg animate-pulse-slow transform hover:scale-105 transition-all" style={{ animationDelay: '0.8s' }}>
                            <div className="w-full h-12 bg-white/40 rounded-md mb-1.5 backdrop-blur-sm border border-white/50"></div>
                            <div className="h-1.5 bg-white/60 rounded mb-1"></div>
                            <div className="h-1.5 bg-white/50 rounded w-2/3"></div>
                          </div>

                          {/* Product Card 6 - Pink */}
                          <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg p-2.5 shadow-lg animate-pulse-slow transform hover:scale-105 transition-all" style={{ animationDelay: '1s' }}>
                            <div className="w-full h-12 bg-white/40 rounded-md mb-1.5 backdrop-blur-sm border border-white/50"></div>
                            <div className="h-1.5 bg-white/60 rounded mb-1"></div>
                            <div className="h-1.5 bg-white/50 rounded w-2/3"></div>
                          </div>
                        </div>
                      </div>

                      {/* Screen Glare Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none"></div>
                    </div>

                    {/* Camera */}
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rounded-full shadow-inner"></div>
                  </div>

                  {/* Laptop Base/Keyboard - Modern White Design */}
                  <div className="relative w-[510px] h-4 bg-gradient-to-b from-gray-100 via-white to-gray-200 rounded-b-3xl shadow-xl border-x-2 border-b-2 border-gray-200 -mt-1">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                    {/* Keyboard hint */}
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-32 h-0.5 bg-gray-300 rounded-full"></div>
                  </div>

                  {/* Laptop Shadow */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[530px] h-10 bg-gray-400/20 blur-3xl rounded-full"></div>
                </div>

                {/* Floating UI Elements Around Laptop */}
                {/* Shopping Cart Icon */}
                <div className="absolute top-8 right-8 w-16 h-16 bg-gradient-to-br from-[#ff6f61] to-orange-500 rounded-2xl shadow-xl flex items-center justify-center animate-float-delayed">
                  <ShoppingCart className="w-8 h-8 text-white" />
                </div>

                {/* Star Rating */}
                <div className="absolute top-32 left-4 bg-white rounded-xl shadow-xl px-4 py-3 animate-float">
                  <div className="flex gap-1 mb-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <p className="text-xs font-bold text-gray-700">4.9/5 Rating</p>
                </div>

                {/* Download Icon */}
                <div className="absolute bottom-24 left-8 w-14 h-14 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl shadow-xl flex items-center justify-center animate-float" style={{ animationDelay: '0.5s' }}>
                  <Package className="w-7 h-7 text-white" />
                </div>

                {/* Notification Badge */}
                <div className="absolute bottom-8 right-12 bg-white rounded-full shadow-xl px-4 py-2 animate-float-delayed">
                  <p className="text-xs font-bold text-gray-700">🎉 New Products!</p>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* Features Section - Modern Cards */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white dark:from-slate-800 dark:to-slate-800 border-2 border-gray-100 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 transition-all hover:shadow-xl hover:shadow-gray-100 dark:hover:shadow-slate-900/50 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
                  <Download className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{t("features.instantDownload.title")}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                  {t("features.instantDownload.description")}
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-white dark:from-slate-800 dark:to-slate-800 border-2 border-orange-100 dark:border-slate-700 hover:border-orange-300 dark:hover:border-slate-600 transition-all hover:shadow-xl hover:shadow-orange-100 dark:hover:shadow-slate-900/50 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-transparent rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-[#ff6f61] to-[#ff6f61] rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{t("features.securePayment.title")}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                  {t("features.securePayment.description")}
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-green-50 to-white dark:from-slate-800 dark:to-slate-800 border-2 border-green-100 dark:border-slate-700 hover:border-green-300 dark:hover:border-slate-600 transition-all hover:shadow-xl hover:shadow-green-100 dark:hover:shadow-slate-900/50 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-transparent rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
                  <Award className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{t("features.highQuality.title")}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                  {t("features.highQuality.description")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Modern Design */}
      <section className="py-12 bg-gradient-to-r from-gray-500 via-gray-600 to-gray-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-black text-white">100%</div>
              <div className="text-gray-100 font-medium text-sm md:text-base">{t("stats.editableTemplates")}</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-black text-white">5K+</div>
              <div className="text-gray-100 font-medium text-sm md:text-base">{t("stats.happyCustomers")}</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Star className="w-5 h-5 md:w-6 md:h-6 fill-yellow-300 text-yellow-300" />
                <span className="text-4xl md:text-5xl font-black text-white">4.9</span>
              </div>
              <div className="text-gray-100 font-medium text-sm md:text-base">{t("stats.averageRating")}</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-black text-white">24/7</div>
              <div className="text-gray-100 font-medium text-sm md:text-base">{t("stats.support")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-24 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-12">
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-800 rounded-full mb-4">
                <Sparkles className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-bold text-gray-500 dark:text-gray-400">{t("sections.featured.badge")}</span>
              </div>
              <h2 className="text-4xl font-black mb-3">
                <span className="text-gray-900 dark:text-white">{t("sections.featured.titlePart1")} </span>
                <span className="bg-gradient-to-r from-gray-500 to-[#ff6f61] bg-clip-text text-transparent">{t("sections.featured.titlePart2")}</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {t("sections.featured.subtitle")}
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-3 gap-8 mb-12">
              {featuredProducts.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center">
              <Link
                href={`/${locale}/products`}
                className="inline-flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-full font-bold text-base hover:shadow-xl hover:shadow-gray-200 transition-all hover:scale-105 group"
              >
                {tCommon("viewAllProducts")}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Offer of the Day */}
      <OfferOfTheDay />

      {/* Bestsellers Section */}
      {bestsellerProducts.length > 0 && (
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-slate-800 dark:to-slate-900">
          <div className="max-w-7xl mx-auto px-12">
            <div className="flex items-center justify-between mb-12">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 rounded-full mb-4">
                  <TrendingUp className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <span className="text-sm font-bold text-orange-600 dark:text-orange-400">{t("sections.bestsellers.badge")}</span>
                </div>
                <h2 className="text-5xl font-black text-gray-900 dark:text-white">{t("sections.bestsellers.title")}</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">{t("sections.bestsellers.subtitle")}</p>
              </div>
              <Link
                href={`/${locale}/products?filter=bestsellers`}
                className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 font-bold hover:gap-3 transition-all"
              >
                {tCommon("viewAll")}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-3 gap-8">
              {bestsellerProducts.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <CategoriesSection categories={categories} />

      {/* New Arrivals */}
      {newProducts.length > 0 && (
        <section className="py-24 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="flex items-center justify-between mb-12">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                  <Sparkles className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">{t("sections.newArrivals.badge")}</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">{t("sections.newArrivals.title")}</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">{t("sections.newArrivals.subtitle")}</p>
              </div>
              <Link
                href={`/${locale}/products?filter=new`}
                className="hidden md:inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 font-bold hover:gap-3 transition-all"
              >
                {tCommon("viewAll")}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {newProducts.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog Section - Hidden until blog content is ready */}
      {/* <BlogSection /> */}

      {/* Recently Viewed Products */}
      <section className="py-12 bg-gray-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <RecentlyViewed title={t("sections.recentlyViewed.title")} maxItems={6} />
        </div>
      </section>

      {/* CTA Section - Modern Design */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700 p-12 md:p-16 text-center">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

            <div className="relative z-10 max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm rounded-full">
                <Gift className="w-5 h-5 text-white" />
                <span className="text-sm font-bold text-white">{t("cta.badge")}</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                {t("cta.title")}
              </h2>
              <p className="text-lg text-gray-100">
                {t("cta.description")} <span className="font-bold">{t("cta.discount")}</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link
                  href={`/${locale}/products`}
                  className="inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-white text-gray-500 rounded-full font-bold text-base hover:shadow-xl transition-all hover:scale-105 group"
                >
                  {t("cta.shopNow")}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href={`/${locale}/deals`}
                  className="inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-gray-400/20 backdrop-blur-sm border-2 border-white/30 text-white rounded-full font-bold text-base hover:bg-gray-400/30 transition-all"
                >
                  <Tag className="w-5 h-5" />
                  {t("cta.viewDeals")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
