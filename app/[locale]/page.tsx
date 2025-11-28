import Link from "next/link";
import { ArrowRight, Download, Shield, Zap, Star, Sparkles, TrendingUp, Users, Award, CheckCircle, Rocket, Gift, Tag } from "lucide-react";
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
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 lg:p-16">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Content */}
              <div className="text-center lg:text-left space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-blue-100">
                <span className="flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-blue-600 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
                </span>
                <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  40,000+ Premium Digital Products
                </span>
              </div>

              {/* Main Heading */}
              <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
                  <span className="block text-gray-900">Your Gateway to</span>
                  <span className="block bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600 bg-clip-text text-transparent">
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
                  className="group inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-base hover:shadow-xl hover:shadow-blue-200 transition-all hover:scale-105"
                >
                  <Rocket className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Explore Products
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href={`/${locale}/categories`}
                  className="inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-white border-2 border-gray-200 text-gray-900 rounded-xl font-bold text-base hover:border-blue-300 hover:bg-blue-50 transition-all shadow-md hover:shadow-lg"
                >
                  <Sparkles className="w-5 h-5" />
                  Browse Categories
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-8 justify-center lg:justify-start items-center pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 border-2 border-white"></div>
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

            {/* Right Column - Modern 3D Visual */}
            <div className="relative hidden lg:block">
              {/* Floating Cards Grid */}
              <div className="relative h-[450px]">
                {/* Card 1 - Blue Gradient */}
                <div className="absolute top-0 right-0 w-64 h-80 transform rotate-6 hover:rotate-3 transition-all duration-500 animate-float">
                  <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 shadow-xl shadow-blue-500/30 overflow-hidden border border-white/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                    <div className="absolute top-6 left-6 right-6 space-y-3">
                      <div className="h-3 w-3/4 bg-white/30 rounded-full"></div>
                      <div className="h-3 w-1/2 bg-white/20 rounded-full"></div>
                    </div>
                    <div className="absolute top-24 left-6 right-6 space-y-3">
                      <div className="h-20 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20"></div>
                      <div className="h-20 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20"></div>
                    </div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="h-14 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30 flex items-center justify-center">
                        <div className="w-8 h-8 bg-white/30 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2 - Cyan Gradient */}
                <div className="absolute top-24 left-0 w-56 h-72 transform -rotate-6 hover:-rotate-3 transition-all duration-500 animate-float-delayed">
                  <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-cyan-500 via-cyan-600 to-blue-600 shadow-xl shadow-cyan-500/30 overflow-hidden border border-white/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                    <div className="absolute top-6 left-6 right-6">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="h-14 bg-white/20 rounded-xl"></div>
                        <div className="h-14 bg-white/20 rounded-xl"></div>
                        <div className="h-14 bg-white/20 rounded-xl"></div>
                      </div>
                    </div>
                    <div className="absolute top-28 left-6 right-6 space-y-3">
                      <div className="h-28 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20"></div>
                      <div className="h-3 w-2/3 bg-white/30 rounded-full"></div>
                      <div className="h-3 w-1/2 bg-white/20 rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Card 3 - Light Blue Gradient */}
                <div className="absolute bottom-0 right-16 w-52 h-64 transform rotate-12 hover:rotate-6 transition-all duration-500 animate-float">
                  <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-500 shadow-xl shadow-blue-400/30 overflow-hidden border border-white/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                    <div className="absolute top-6 left-6 right-6">
                      <div className="h-3 w-1/2 bg-white/30 rounded-full mb-4"></div>
                      <div className="flex items-end gap-2 h-24">
                        <div className="flex-1 bg-white/20 rounded-t-lg h-14"></div>
                        <div className="flex-1 bg-white/20 rounded-t-lg h-20"></div>
                        <div className="flex-1 bg-white/30 rounded-t-lg h-24"></div>
                        <div className="flex-1 bg-white/20 rounded-t-lg h-16"></div>
                      </div>
                    </div>
                    <div className="absolute bottom-6 left-6 right-6 space-y-2">
                      <div className="h-2 w-full bg-white/20 rounded-full"></div>
                      <div className="h-2 w-3/4 bg-white/20 rounded-full"></div>
                    </div>
                  </div>
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
            <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100 hover:border-blue-300 transition-all hover:shadow-xl hover:shadow-blue-100 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
                  <Download className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Instant Download</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Get your digital products immediately after purchase. No waiting, no hassle. Start using right away.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-cyan-50 to-white border-2 border-cyan-100 hover:border-cyan-300 transition-all hover:shadow-xl hover:shadow-cyan-100 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-transparent rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
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
      <section className="py-12 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-black text-white">40K+</div>
              <div className="text-blue-100 font-medium text-sm md:text-base">Digital Products</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-black text-white">50K+</div>
              <div className="text-blue-100 font-medium text-sm md:text-base">Happy Customers</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Star className="w-5 h-5 md:w-6 md:h-6 fill-yellow-300 text-yellow-300" />
                <span className="text-4xl md:text-5xl font-black text-white">4.9</span>
              </div>
              <div className="text-blue-100 font-medium text-sm md:text-base">Average Rating</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-black text-white">24/7</div>
              <div className="text-blue-100 font-medium text-sm md:text-base">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-bold text-blue-600">FEATURED COLLECTION</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-3">
              <span className="text-gray-900">Discover Our </span>
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Best Products</span>
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
              className="inline-flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-base hover:shadow-xl hover:shadow-blue-200 transition-all hover:scale-105 group"
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
              className="hidden md:inline-flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all"
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
                className="hidden md:inline-flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all"
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
      <section className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-12 md:p-16 text-center">
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
              <p className="text-lg text-blue-100">
                Join thousands of satisfied customers and download your first digital product today. Get 30% OFF on your first purchase!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link
                  href={`/${locale}/products`}
                  className="inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-white text-blue-600 rounded-xl font-bold text-base hover:shadow-xl transition-all hover:scale-105 group"
                >
                  Start Shopping Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href={`/${locale}/deals`}
                  className="inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-blue-500/20 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl font-bold text-base hover:bg-blue-500/30 transition-all"
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


