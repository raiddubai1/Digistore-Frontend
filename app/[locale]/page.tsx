import Link from "next/link";
import { ArrowRight, Download, Shield, Zap, Star } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { demoProducts } from "@/data/demo-products";

export default function Home() {
  const featuredProducts = demoProducts.filter((p) => p.featured);
  const bestsellerProducts = demoProducts.filter((p) => p.bestseller).slice(0, 3);
  const newProducts = demoProducts.filter((p) => p.newArrival);
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Canva Inspired */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pt-12 pb-20 md:pt-16 md:pb-32">
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Large Circle - Top Right */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl animate-pulse"></div>

          {/* Medium Circle - Bottom Left */}
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-tr from-accent/20 to-primary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

          {/* Small Circle - Top Left */}
          <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-secondary/30 to-accent/30 rounded-full blur-2xl animate-bounce"></div>

          {/* Floating Shapes */}
          <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-pink-300/20 to-purple-300/20 rounded-3xl rotate-12 blur-xl animate-float"></div>
          <div className="absolute bottom-1/3 left-1/3 w-24 h-24 bg-gradient-to-br from-blue-300/20 to-teal-300/20 rounded-2xl -rotate-12 blur-xl animate-float-delayed"></div>

          {/* Soft Glow Spots - Premium Feel */}
          <div className="absolute top-1/3 left-1/2 w-96 h-96 bg-gradient-radial from-primary/10 via-transparent to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-gradient-radial from-secondary/10 via-transparent to-transparent rounded-full blur-3xl"></div>

          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="text-center lg:text-left lg:-mt-[60px]">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg mb-4 border border-white/20">
                <span className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-sm font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  40,000+ Digital Products Available
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-[1.1]">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent block">
                  Premium Digital
                </span>
                <span className="text-gray-900 block">Products Marketplace</span>
              </h1>

              <p className="text-base md:text-lg text-gray-600 mb-6 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Download high-quality eBooks, templates, and digital tools instantly. Start creating amazing content today. 🚀
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-6">
                <Link
                  href="/products"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-semibold hover:shadow-2xl transition-all hover:scale-105 text-base shadow-lg"
                >
                  Browse Products
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/categories"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-gray-700 rounded-full font-semibold hover:border-primary hover:bg-white transition-all text-base shadow-lg"
                >
                  View Categories
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-6 justify-center lg:justify-start items-center text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">4.9/5 Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span className="font-semibold">Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold">Instant Access</span>
                </div>
              </div>
            </div>

            {/* Right Column - Premium 3D Floating Cards */}
            <div className="relative hidden lg:block xl:ml-8">
              {/* Soft Background Glows */}
              <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-gradient-radial from-purple-200/40 via-pink-200/20 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-gradient-radial from-blue-200/40 via-cyan-200/20 to-transparent rounded-full blur-3xl"></div>
              </div>

              {/* Floating Cards Container */}
              <div className="relative h-[520px] scale-95 xl:scale-100">

                {/* Card 1 - Purple Gradient - Top Right */}
                <div className="absolute top-0 right-0 w-64 h-80 transform rotate-[6deg] hover:rotate-[2deg] transition-all duration-500 animate-float">
                  <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-purple-400/90 via-pink-400/90 to-purple-500/90 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(147,51,234,0.4)] border border-white/20 overflow-hidden">
                    {/* Glassmorphism overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>

                    {/* Abstract UI Elements */}
                    <div className="absolute top-6 left-6 right-6">
                      <div className="h-2 w-3/4 bg-white/20 rounded-full mb-3"></div>
                      <div className="h-2 w-1/2 bg-white/15 rounded-full"></div>
                    </div>

                    <div className="absolute top-24 left-6 right-6 space-y-3">
                      <div className="h-16 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10"></div>
                      <div className="h-16 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10"></div>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="h-12 bg-white/20 rounded-xl backdrop-blur-sm border border-white/20"></div>
                    </div>

                    {/* Decorative circles */}
                    <div className="absolute top-1/2 right-4 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
                    <div className="absolute bottom-1/4 left-4 w-16 h-16 bg-white/5 rounded-full blur-lg"></div>
                  </div>
                </div>

                {/* Card 2 - Blue/Teal Gradient - Middle Left */}
                <div className="absolute top-28 left-0 w-60 h-72 transform rotate-[-5deg] hover:rotate-[-2deg] transition-all duration-500 animate-float-delayed">
                  <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-blue-400/90 via-cyan-400/90 to-teal-500/90 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(59,130,246,0.4)] border border-white/20 overflow-hidden">
                    {/* Glassmorphism overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>

                    {/* Abstract UI Grid */}
                    <div className="absolute top-6 left-6 right-6">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="h-12 bg-white/15 rounded-xl"></div>
                        <div className="h-12 bg-white/15 rounded-xl"></div>
                        <div className="h-12 bg-white/15 rounded-xl"></div>
                      </div>
                    </div>

                    <div className="absolute top-28 left-6 right-6">
                      <div className="h-24 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10 mb-3"></div>
                      <div className="h-2 w-2/3 bg-white/20 rounded-full mb-2"></div>
                      <div className="h-2 w-1/2 bg-white/15 rounded-full"></div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute bottom-6 right-6 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
                    <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-white/30 rounded-full"></div>
                    <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-white/30 rounded-full"></div>
                  </div>
                </div>

                {/* Card 3 - Orange/Pink Gradient - Bottom Right */}
                <div className="absolute bottom-0 right-16 w-56 h-64 transform rotate-[8deg] hover:rotate-[3deg] transition-all duration-500 animate-float">
                  <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-orange-400/90 via-red-400/90 to-pink-500/90 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(249,115,22,0.4)] border border-white/20 overflow-hidden">
                    {/* Glassmorphism overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>

                    {/* Abstract Chart/Graph */}
                    <div className="absolute top-6 left-6 right-6">
                      <div className="h-2 w-1/2 bg-white/20 rounded-full mb-4"></div>
                      <div className="flex items-end gap-2 h-20">
                        <div className="flex-1 bg-white/15 rounded-t-lg h-12"></div>
                        <div className="flex-1 bg-white/15 rounded-t-lg h-16"></div>
                        <div className="flex-1 bg-white/20 rounded-t-lg h-20"></div>
                        <div className="flex-1 bg-white/15 rounded-t-lg h-14"></div>
                      </div>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 space-y-2">
                      <div className="h-2 w-full bg-white/15 rounded-full"></div>
                      <div className="h-2 w-3/4 bg-white/15 rounded-full"></div>
                      <div className="h-2 w-1/2 bg-white/15 rounded-full"></div>
                    </div>

                    {/* Decorative circles */}
                    <div className="absolute top-1/3 right-4 w-16 h-16 bg-white/5 rounded-full blur-lg"></div>
                    <div className="absolute bottom-1/3 left-6 w-2 h-2 bg-white/40 rounded-full"></div>
                    <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-white/40 rounded-full"></div>
                  </div>
                </div>

                {/* Card 4 - Accent Purple/Blue - Small Top Left */}
                <div className="absolute top-12 left-12 w-48 h-56 transform rotate-[-8deg] hover:rotate-[-4deg] transition-all duration-500 animate-float-delayed opacity-90">
                  <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-indigo-400/80 via-purple-400/80 to-blue-500/80 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(99,102,241,0.3)] border border-white/20 overflow-hidden">
                    {/* Glassmorphism overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>

                    {/* Abstract Circles Pattern */}
                    <div className="absolute top-6 left-6 right-6">
                      <div className="flex gap-2 mb-4">
                        <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                        <div className="w-8 h-8 bg-white/15 rounded-full"></div>
                        <div className="w-8 h-8 bg-white/10 rounded-full"></div>
                      </div>
                      <div className="h-2 w-2/3 bg-white/20 rounded-full mb-2"></div>
                      <div className="h-2 w-1/2 bg-white/15 rounded-full"></div>
                    </div>

                    <div className="absolute top-28 left-6 right-6">
                      <div className="h-20 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10"></div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Instant Download</h3>
              <p className="text-gray-600">
                Get your digital products immediately after purchase. No waiting, no hassle.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Payment</h3>
              <p className="text-gray-600">
                Your transactions are protected with industry-standard encryption.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">High Quality</h3>
              <p className="text-gray-600">
                All products are carefully curated to ensure the highest quality standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">40,000+</div>
              <div className="text-gray-600">Digital Products</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary mb-2">50,000+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">4.9</div>
              <div className="text-gray-600 flex items-center justify-center gap-1">
                <Star className="w-4 h-4 fill-accent text-accent" />
                Average Rating
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
              <p className="text-gray-600">
                Hand-picked premium digital products
              </p>
            </div>
            <Link
              href="/products"
              className="text-primary font-semibold hover:text-primary-dark flex items-center gap-2"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Bestsellers</h2>
              <p className="text-gray-600">
                Most popular products this month
              </p>
            </div>
            <Link
              href="/products?filter=bestsellers"
              className="text-primary font-semibold hover:text-primary-dark flex items-center gap-2"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bestsellerProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newProducts.length > 0 && (
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">New Arrivals</h2>
                <p className="text-gray-600">
                  Latest additions to our collection
                </p>
              </div>
              <Link
                href="/products?filter=new"
                className="text-primary font-semibold hover:text-primary-dark flex items-center gap-2"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {newProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of satisfied customers and download your first digital product today.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-semibold hover:shadow-lg transition-all hover:scale-105"
            >
              Start Shopping
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
