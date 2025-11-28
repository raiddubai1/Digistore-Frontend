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
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/30 to-white">
      {/* Hero Section - Ultra Modern Design */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-cyan-50 pt-16 pb-24 md:pt-24 md:pb-32">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gradient Orbs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-300/10 via-pink-300/10 to-cyan-300/10 rounded-full blur-3xl"></div>
          
          {/* Floating Shapes */}
          <div className="absolute top-20 right-1/4 w-32 h-32 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-3xl rotate-12 blur-xl animate-float"></div>
          <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-gradient-to-br from-cyan-400/30 to-blue-400/30 rounded-2xl -rotate-12 blur-xl animate-float-delayed"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Content */}
            <div className="text-center lg:text-left space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-purple-100">
                <span className="flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-purple-600 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-600"></span>
                </span>
                <span className="text-sm font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  40,000+ Premium Digital Products
                </span>
              </div>

              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight">
                  <span className="block text-gray-900">Your Gateway to</span>
                  <span className="block bg-gradient-to-r from-purple-600 via-violet-600 to-cyan-600 bg-clip-text text-transparent">
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
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-300 transition-all hover:scale-105 hover:-translate-y-1"
                >
                  <Rocket className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Explore Products
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href={`/${locale}/categories`}
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white border-2 border-gray-200 text-gray-900 rounded-2xl font-bold text-lg hover:border-purple-300 hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl"
                >
                  <Sparkles className="w-5 h-5" />
                  Browse Categories
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-8 justify-center lg:justify-start items-center pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 border-2 border-white"></div>
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
              {/* Glow Effects */}
              <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-400/40 to-pink-400/40 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-gradient-to-br from-cyan-400/40 to-blue-400/40 rounded-full blur-3xl"></div>
              </div>

              {/* Floating Cards Grid */}
              <div className="relative h-[600px]">
                {/* Card 1 - Purple Gradient */}
                <div className="absolute top-0 right-0 w-72 h-96 transform rotate-6 hover:rotate-3 transition-all duration-500 animate-float">
                  <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-purple-500 via-violet-500 to-purple-600 shadow-2xl shadow-purple-500/50 overflow-hidden border border-white/20">
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
                <div className="absolute top-32 left-0 w-64 h-80 transform -rotate-6 hover:-rotate-3 transition-all duration-500 animate-float-delayed">
                  <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-cyan-500 via-blue-500 to-cyan-600 shadow-2xl shadow-cyan-500/50 overflow-hidden border border-white/20">
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

                {/* Card 3 - Pink Gradient */}
                <div className="absolute bottom-0 right-20 w-60 h-72 transform rotate-12 hover:rotate-6 transition-all duration-500 animate-float">
                  <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 shadow-2xl shadow-pink-500/50 overflow-hidden border border-white/20">
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
      </section>

      {/* Features Section - Modern Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-purple-50 to-white border-2 border-purple-100 hover:border-purple-300 transition-all hover:shadow-2xl hover:shadow-purple-100 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-transparent rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-violet-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Download className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Instant Download</h3>
                <p className="text-gray-600 leading-relaxed">
                  Get your digital products immediately after purchase. No waiting, no hassle. Start using right away.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-cyan-50 to-white border-2 border-cyan-100 hover:border-cyan-300 transition-all hover:shadow-2xl hover:shadow-cyan-100 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-transparent rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Secure Payment</h3>
                <p className="text-gray-600 leading-relaxed">
                  Your transactions are protected with industry-standard encryption. Shop with confidence.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-pink-50 to-white border-2 border-pink-100 hover:border-pink-300 transition-all hover:shadow-2xl hover:shadow-pink-100 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-transparent rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-600 to-rose-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Premium Quality</h3>
                <p className="text-gray-600 leading-relaxed">
                  All products are carefully curated to ensure the highest quality standards. Excellence guaranteed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Modern Design */}
      <section className="py-16 bg-gradient-to-r from-purple-600 via-violet-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-5xl font-black text-white">40K+</div>
              <div className="text-purple-100 font-medium">Digital Products</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-black text-white">50K+</div>
              <div className="text-purple-100 font-medium">Happy Customers</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Star className="w-6 h-6 fill-yellow-300 text-yellow-300" />
                <span className="text-5xl font-black text-white">4.9</span>
              </div>
              <div className="text-purple-100 font-medium">Average Rating</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-black text-white">24/7</div>
              <div className="text-purple-100 font-medium">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-bold text-purple-600">FEATURED COLLECTION</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="text-gray-900">Discover Our </span>
              <span className="bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">Best Products</span>
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
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-300 transition-all hover:scale-105 group"
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
              className="hidden md:inline-flex items-center gap-2 text-purple-600 font-bold hover:gap-3 transition-all"
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
                className="hidden md:inline-flex items-center gap-2 text-purple-600 font-bold hover:gap-3 transition-all"
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
      <section className="py-24 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-purple-600 via-violet-600 to-purple-700 p-16 text-center">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-500/30 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-cyan-500/30 to-transparent rounded-full blur-3xl"></div>

            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm rounded-full">
                <Gift className="w-5 h-5 text-white" />
                <span className="text-sm font-bold text-white">LIMITED TIME OFFER</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                Ready to Transform Your Digital Journey?
              </h2>
              <p className="text-xl text-purple-100">
                Join thousands of satisfied customers and download your first digital product today. Get 30% OFF on your first purchase!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link
                  href={`/${locale}/products`}
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-purple-600 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105 group"
                >
                  Start Shopping Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href={`/${locale}/deals`}
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-purple-500/20 backdrop-blur-sm border-2 border-white/30 text-white rounded-2xl font-bold text-lg hover:bg-purple-500/30 transition-all"
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


