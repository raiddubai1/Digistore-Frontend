import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { Zap, Percent, Gift, ArrowRight, Star } from "lucide-react";
import { Product } from "@/types";

export const dynamic = 'force-dynamic';

interface DealsPageProps {
  params: Promise<{ locale: string }>;
}

async function getHotDeals(): Promise<Product[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://digistore1-backend.onrender.com/api';
    const response = await fetch(`${apiUrl}/products/hot-deals?limit=12`, {
      next: { revalidate: 60 },
      cache: 'no-store',
    });
    if (!response.ok) {
      console.error('Hot deals API returned:', response.status);
      return [];
    }
    const data = await response.json();
    return data.data?.products || [];
  } catch (error) {
    console.error('Error fetching hot deals:', error);
    return [];
  }
}

async function getBestsellers(): Promise<Product[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://digistore1-backend.onrender.com/api';
    const response = await fetch(`${apiUrl}/products/bestsellers`, {
      next: { revalidate: 60 },
      cache: 'no-store',
    });
    if (!response.ok) {
      console.error('Bestsellers API returned:', response.status);
      return [];
    }
    const data = await response.json();
    return data.data?.products || [];
  } catch (error) {
    console.error('Error fetching bestsellers:', error);
    return [];
  }
}

export default async function DealsPage({ params }: DealsPageProps) {
  const { locale } = await params;

  // Fetch hot deals and bestsellers from API
  let hotDeals: Product[] = [];
  let bestSellers: Product[] = [];

  try {
    [hotDeals, bestSellers] = await Promise.all([
      getHotDeals(),
      getBestsellers()
    ]);
  } catch (error) {
    console.error('Error loading deals page data:', error);
  }

  // Calculate time left for flash sale (mock data)
  const flashSaleEnd = new Date();
  flashSaleEnd.setHours(flashSaleEnd.getHours() + 12);

  return (
    <>
      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen bg-gray-50 dark:bg-slate-900 pb-24">
        <div className="bg-gradient-to-r from-[#FF6B35] to-orange-500 p-6">
          <h1 className="text-2xl font-bold text-white">Deals & Offers</h1>
          <p className="text-white/80 mt-1">Don't miss out on these amazing discounts!</p>
        </div>

        {/* Flash Sale Banner */}
        <div className="p-4">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5" />
              <span className="font-bold">Flash Sale</span>
            </div>
            <p className="text-sm opacity-90">Up to 50% OFF - Ends Soon!</p>
            <div className="flex gap-2 mt-3">
              <div className="bg-white/20 px-3 py-1 rounded-lg text-center">
                <span className="text-xl font-bold">12</span>
                <p className="text-[10px]">Hours</p>
              </div>
              <div className="bg-white/20 px-3 py-1 rounded-lg text-center">
                <span className="text-xl font-bold">34</span>
                <p className="text-[10px]">Mins</p>
              </div>
              <div className="bg-white/20 px-3 py-1 rounded-lg text-center">
                <span className="text-xl font-bold">56</span>
                <p className="text-[10px]">Secs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hot Deals Products */}
        <div className="p-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">🔥 Hot Deals</h2>
          {hotDeals.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {hotDeals.slice(0, 6).map((product, index) => (
                <ProductCard key={product.id} product={product} priority={index < 2} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No hot deals available right now.</p>
              <Link href={`/${locale}/products`} className="text-[#FF6B35] font-semibold mt-2 inline-block">
                Browse all products →
              </Link>
            </div>
          )}
        </div>

        {/* Best Sellers Section */}
        {bestSellers.length > 0 && (
          <div className="p-4 mt-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Best Sellers</h2>
            <div className="grid grid-cols-2 gap-3">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block min-h-screen bg-gray-50 dark:bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-8">
          {/* Hero Banner */}
          <div className="bg-gradient-to-r from-[#FF6B35] via-orange-500 to-red-500 rounded-3xl p-12 mb-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-8 h-8 text-yellow-300" />
                  <span className="text-yellow-300 font-bold text-xl">FLASH SALE</span>
                </div>
                <h1 className="text-5xl font-bold text-white mb-4">Up to 50% OFF</h1>
                <p className="text-white/80 text-xl mb-6">On Premium Digital Products</p>
                <Link
                  href={`/${locale}/products?sort=discount`}
                  className="inline-flex items-center gap-2 bg-white text-[#FF6B35] px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors"
                >
                  Shop Now <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <p className="text-white/80 text-sm mb-3">Sale Ends In:</p>
                <div className="flex gap-3">
                  <div className="bg-white text-[#FF6B35] px-4 py-3 rounded-xl text-center min-w-[60px]">
                    <span className="text-3xl font-bold">12</span>
                    <p className="text-xs">Hours</p>
                  </div>
                  <div className="bg-white text-[#FF6B35] px-4 py-3 rounded-xl text-center min-w-[60px]">
                    <span className="text-3xl font-bold">34</span>
                    <p className="text-xs">Mins</p>
                  </div>
                  <div className="bg-white text-[#FF6B35] px-4 py-3 rounded-xl text-center min-w-[60px]">
                    <span className="text-3xl font-bold">56</span>
                    <p className="text-xs">Secs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Deal Categories */}
          <div className="grid grid-cols-4 gap-6 mb-12">
            {[
              { icon: Percent, label: "Best Discounts", color: "bg-red-100 text-red-600" },
              { icon: Zap, label: "Flash Deals", color: "bg-yellow-100 text-yellow-600" },
              { icon: Gift, label: "Bundle Offers", color: "bg-purple-100 text-purple-600" },
              { icon: Star, label: "Top Rated", color: "bg-blue-100 text-blue-600" },
            ].map((item, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 p-6 rounded-2xl flex items-center gap-4 hover:shadow-lg transition-shadow cursor-pointer">
                <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Hot Deals Products */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">🔥 Hot Deals</h2>
              <Link href={`/${locale}/products`} className="text-[#FF6B35] font-semibold flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {hotDeals.length > 0 ? (
              <div className="grid grid-cols-4 gap-6">
                {hotDeals.slice(0, 8).map((product, index) => (
                  <ProductCard key={product.id} product={product} priority={index < 4} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl">
                <p className="text-gray-500 text-lg">No hot deals available right now.</p>
                <p className="text-gray-400 mt-2">Check back soon for amazing deals!</p>
                <Link href={`/${locale}/products`} className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-[#FF6B35] text-white rounded-full font-semibold hover:bg-[#E55A2B] transition-colors">
                  Browse All Products <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Best Sellers */}
          {bestSellers.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Best Sellers</h2>
                <Link href={`/${locale}/products?filter=bestsellers`} className="text-[#FF6B35] font-semibold flex items-center gap-1">
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-4 gap-6">
                {bestSellers.slice(0, 4).map((product, index) => (
                  <ProductCard key={product.id} product={product} priority={index < 4} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

