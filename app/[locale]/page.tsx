import Link from "next/link";
import { ArrowRight, Download, Shield, Zap, Star, Sparkles, TrendingUp, Users, Award, CheckCircle, Rocket, Gift, Tag, ShoppingCart, Package } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import OfferOfTheDay from "@/components/OfferOfTheDay";
import CategoriesSection from "@/components/CategoriesSection";
import BlogSection from "@/components/BlogSection";
import { getFeaturedProducts, getBestsellers, getNewArrivals } from "@/lib/api/products";
import { getCategories } from "@/lib/api/categories";
import { demoProducts, demoCategories } from "@/data/demo-products";

interface HomeProps {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;

  // Use demo data by default (API integration can be enabled when backend is ready)
  let featuredProducts = demoProducts.filter((p) => p.featured);
  let bestsellerProducts = demoProducts.filter((p) => p.bestseller).slice(0, 3);
  let newProducts = demoProducts.filter((p) => p.newArrival);
  let categories = demoCategories;

  // Try to fetch from API if available
  if (process.env.NEXT_PUBLIC_API_URL) {
    try {
      const [featured, bestsellers, newArrivals, apiCategories] = await Promise.all([
        getFeaturedProducts(),
        getBestsellers(),
        getNewArrivals(),
        getCategories(),
      ]);

      if (featured && featured.length > 0) featuredProducts = featured;
      if (bestsellers && bestsellers.length > 0) bestsellerProducts = bestsellers;
      if (newArrivals && newArrivals.length > 0) newProducts = newArrivals;
      if (apiCategories && apiCategories.length > 0) categories = apiCategories;
    } catch (error) {
      console.error("Error fetching data, using demo data:", error);
      // Continue with demo data
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Clean & Professional Design */}
      <section className="pt-6 pb-12 md:pt-3.5 md:pb-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-orange-50 rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 lg:px-16 lg:py-[50px]">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Content */}
              <div className="text-center lg:text-left space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-100">
                <span className="flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-gray-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gray-500"></span>
                </span>
                <span className="text-sm font-bold bg-gradient-to-r from-gray-500 to-[#ff6f61] bg-clip-text text-transparent">
                  40,000+ Premium Digital Products
                </span>
              </div>

              {/* Main Heading */}
              <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
                  <span className="block text-gray-900">Your Gateway to</span>
                  <span className="block bg-gradient-to-r from-gray-500 via-gray-400 to-[#ff6f61] bg-clip-text text-transparent">
                    Digital Excellence
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Discover, download, and deploy premium digital products instantly. From templates to tools, we've got everything you need to succeed. 🚀
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href={`/${locale}/products`}
                  className="inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-full font-bold text-base hover:shadow-xl hover:shadow-gray-200 transition-all hover:scale-105"
                >
                  Explore Products
                </Link>
                <Link
                  href={`/${locale}/categories`}
                  className="inline-flex items-center justify-center px-8 py-3.5 bg-white border-2 border-gray-200 text-gray-900 rounded-full font-bold text-base hover:border-gray-300 hover:bg-gray-50 transition-all shadow-md hover:shadow-lg"
                >
                  Browse Categories
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-8 justify-center lg:justify-start items-center pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#ff6f61] to-gray-400 border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 border-2 border-white"></div>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-gray-900">50,000+</div>
                    <div className="text-xs text-gray-500">Happy Customers</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-gray-900">4.9/5</div>
                    <div className="text-xs text-gray-500">Rating</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Animated Laptop Mockup */}
            <div className="relative hidden lg:block">
              <div className="relative h-[450px] flex items-center justify-center">
                {/* Laptop Container */}
                <div className="relative animate-float">
                  {/* Laptop Screen - Ultra Thin Bezel MacBook Style */}
                  <div className="relative w-[440px] h-[290px] bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700/50">
                    {/* Ultra Thin Bezel */}
                    <div className="absolute inset-[6px] bg-black rounded-lg overflow-hidden">
                      {/* Screen Content - Product Thumbnails */}
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 p-5 overflow-hidden">
                        {/* Browser Bar */}
                        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                          <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm"></div>
                          </div>
                          <div className="flex-1 h-6 bg-gray-100 rounded-lg border border-gray-200"></div>
                        </div>

                        {/* Product Grid */}
                        <div className="grid grid-cols-3 gap-3">
                          {/* Product Card 1 */}
                          <div className="bg-gradient-to-br from-[#ff6f61] to-orange-500 rounded-xl p-3 shadow-lg animate-pulse-slow transform hover:scale-105 transition-transform">
                            <div className="w-full h-14 bg-white/30 rounded-lg mb-2 backdrop-blur-sm"></div>
                            <div className="h-2 bg-white/50 rounded mb-1"></div>
                            <div className="h-2 bg-white/40 rounded w-2/3"></div>
                          </div>

                          {/* Product Card 2 */}
                          <div className="bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl p-3 shadow-lg animate-pulse-slow transform hover:scale-105 transition-transform" style={{ animationDelay: '0.2s' }}>
                            <div className="w-full h-14 bg-white/30 rounded-lg mb-2 backdrop-blur-sm"></div>
                            <div className="h-2 bg-white/50 rounded mb-1"></div>
                            <div className="h-2 bg-white/40 rounded w-2/3"></div>
                          </div>

                          {/* Product Card 3 */}
                          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-3 shadow-lg animate-pulse-slow transform hover:scale-105 transition-transform" style={{ animationDelay: '0.4s' }}>
                            <div className="w-full h-14 bg-white/30 rounded-lg mb-2 backdrop-blur-sm"></div>
                            <div className="h-2 bg-white/50 rounded mb-1"></div>
                            <div className="h-2 bg-white/40 rounded w-2/3"></div>
                          </div>

                          {/* Product Card 4 */}
                          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-3 shadow-lg animate-pulse-slow transform hover:scale-105 transition-transform" style={{ animationDelay: '0.6s' }}>
                            <div className="w-full h-14 bg-white/30 rounded-lg mb-2 backdrop-blur-sm"></div>
                            <div className="h-2 bg-white/50 rounded mb-1"></div>
                            <div className="h-2 bg-white/40 rounded w-2/3"></div>
                          </div>

                          {/* Product Card 5 */}
                          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-3 shadow-lg animate-pulse-slow transform hover:scale-105 transition-transform" style={{ animationDelay: '0.8s' }}>
                            <div className="w-full h-14 bg-white/30 rounded-lg mb-2 backdrop-blur-sm"></div>
                            <div className="h-2 bg-white/50 rounded mb-1"></div>
                            <div className="h-2 bg-white/40 rounded w-2/3"></div>
                          </div>

                          {/* Product Card 6 */}
                          <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl p-3 shadow-lg animate-pulse-slow transform hover:scale-105 transition-transform" style={{ animationDelay: '1s' }}>
                            <div className="w-full h-14 bg-white/30 rounded-lg mb-2 backdrop-blur-sm"></div>
                            <div className="h-2 bg-white/50 rounded mb-1"></div>
                            <div className="h-2 bg-white/40 rounded w-2/3"></div>
                          </div>
                        </div>
                      </div>

                      {/* Screen Glare Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-2xl rounded-full pointer-events-none"></div>
                    </div>

                    {/* Camera Notch - Smaller and more subtle */}
                    <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-gray-800 rounded-full ring-1 ring-gray-700"></div>
                  </div>

                  {/* Laptop Base - Sleeker MacBook Style */}
                  <div className="relative w-[480px] h-2 bg-gradient-to-b from-slate-400 via-slate-300 to-slate-400 shadow-xl" style={{ clipPath: 'polygon(8% 0%, 92% 0%, 100% 100%, 0% 100%)' }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                  </div>

                  {/* Keyboard Deck - Visible part */}
                  <div className="relative w-[500px] h-1 bg-gradient-to-b from-slate-300 to-slate-400 -mt-0.5" style={{ clipPath: 'polygon(6% 0%, 94% 0%, 100% 100%, 0% 100%)' }}>
                  </div>

                  {/* Laptop Shadow - More realistic */}
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[520px] h-12 bg-gradient-radial from-gray-900/30 via-gray-900/10 to-transparent blur-2xl rounded-full"></div>
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
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 hover:border-gray-300 transition-all hover:shadow-xl hover:shadow-gray-100 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
                  <Download className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Instant Download</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Get your digital products immediately after purchase. No waiting, no hassle. Start using right away.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-white border-2 border-orange-100 hover:border-orange-300 transition-all hover:shadow-xl hover:shadow-orange-100 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-transparent rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-[#ff6f61] to-[#ff6f61] rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Secure Payment</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Your transactions are protected with industry-standard encryption. Shop with confidence.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-green-50 to-white border-2 border-green-100 hover:border-green-300 transition-all hover:shadow-xl hover:shadow-green-100 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-transparent rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
                  <Award className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Premium Quality</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  All products are carefully curated to ensure the highest quality standards. Excellence guaranteed.
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
              <div className="text-4xl md:text-5xl font-black text-white">40K+</div>
              <div className="text-gray-100 font-medium text-sm md:text-base">Digital Products</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-black text-white">50K+</div>
              <div className="text-gray-100 font-medium text-sm md:text-base">Happy Customers</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Star className="w-5 h-5 md:w-6 md:h-6 fill-yellow-300 text-yellow-300" />
                <span className="text-4xl md:text-5xl font-black text-white">4.9</span>
              </div>
              <div className="text-gray-100 font-medium text-sm md:text-base">Average Rating</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-black text-white">24/7</div>
              <div className="text-gray-100 font-medium text-sm md:text-base">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-bold text-gray-500">FEATURED COLLECTION</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-3">
              <span className="text-gray-900">Discover Our </span>
              <span className="bg-gradient-to-r from-gray-500 to-[#ff6f61] bg-clip-text text-transparent">Best Products</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hand-picked premium digital products to boost your productivity and creativity
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center">
            <Link
              href={`/${locale}/products`}
              className="inline-flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-full font-bold text-base hover:shadow-xl hover:shadow-gray-200 transition-all hover:scale-105 group"
            >
              View All Products
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Offer of the Day */}
      <OfferOfTheDay />

      {/* Bestsellers Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full mb-4">
                <TrendingUp className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-bold text-orange-600">TRENDING NOW</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900">Bestsellers</h2>
              <p className="text-lg text-gray-600 mt-2">Most popular products this month</p>
            </div>
            <Link
              href={`/${locale}/products?filter=bestsellers`}
              className="hidden md:inline-flex items-center gap-2 text-gray-500 font-bold hover:gap-3 transition-all"
            >
              View All
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {bestsellerProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <CategoriesSection categories={categories} />

      {/* New Arrivals */}
      {newProducts.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="flex items-center justify-between mb-12">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full mb-4">
                  <Sparkles className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-bold text-green-600">JUST ADDED</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900">New Arrivals</h2>
                <p className="text-lg text-gray-600 mt-2">Latest additions to our collection</p>
              </div>
              <Link
                href={`/${locale}/products?filter=new`}
                className="hidden md:inline-flex items-center gap-2 text-gray-500 font-bold hover:gap-3 transition-all"
              >
                View All
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {newProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog Section */}
      <BlogSection />

      {/* CTA Section - Modern Design */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700 p-12 md:p-16 text-center">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

            <div className="relative z-10 max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm rounded-full">
                <Gift className="w-5 h-5 text-white" />
                <span className="text-sm font-bold text-white">LIMITED TIME OFFER</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                Ready to Transform Your Digital Journey?
              </h2>
              <p className="text-lg text-gray-100">
                Join thousands of satisfied customers and download your first digital product today. Get 30% OFF on your first purchase!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link
                  href={`/${locale}/products`}
                  className="inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-white text-gray-500 rounded-full font-bold text-base hover:shadow-xl transition-all hover:scale-105 group"
                >
                  Start Shopping Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href={`/${locale}/deals`}
                  className="inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-gray-400/20 backdrop-blur-sm border-2 border-white/30 text-white rounded-full font-bold text-base hover:bg-gray-400/30 transition-all"
                >
                  <Tag className="w-5 h-5" />
                  View Hot Deals
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


