'use client';

import { useState, useEffect } from 'react';
import { Package, ChevronLeft, ShoppingCart, Check, Loader2, Sparkles, Zap, Gift, Star, Award } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { bundlesAPI } from '@/lib/api';
import toast from 'react-hot-toast';

interface BundleProduct {
  id: string;
  productId: string;
  order: number;
  product: {
    id: string;
    title: string;
    slug: string;
    price: number;
    thumbnailUrl: string;
  };
}

interface Bundle {
  id: string;
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  bundlePrice: number;
  originalPrice: number;
  discount: number;
  image?: string;
  featured: boolean;
  active: boolean;
  products: BundleProduct[];
}

export default function BundlesPage() {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartStore();

  useEffect(() => {
    fetchBundles();
  }, []);

  const fetchBundles = async () => {
    try {
      setLoading(true);
      const response = await bundlesAPI.getAll();
      if (response.data?.success && response.data?.data?.bundles) {
        setBundles(response.data.data.bundles);
      }
    } catch (error) {
      console.error('Failed to fetch bundles:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSavings = (original: number, bundlePrice: number) => {
    return original - bundlePrice;
  };

  const handleAddBundle = (bundle: Bundle) => {
    // Add bundle as a single item with bundle price
    addItem({
      id: `bundle-${bundle.id}`,
      title: bundle.name,
      slug: bundle.slug,
      description: bundle.description || '',
      price: Number(bundle.bundlePrice),
      originalPrice: Number(bundle.originalPrice),
      discount: bundle.discount,
      category: 'Bundles',
      tags: ['bundle', 'deal'],
      fileType: 'bundle',
      fileUrl: '',
      previewImages: bundle.image ? [bundle.image] : [],
      thumbnailUrl: bundle.image || '',
      rating: 5,
      reviewCount: 0,
      downloadCount: 0,
      license: 'personal',
      whatsIncluded: bundle.products.map(p => p.product.title),
      featured: bundle.featured,
      bestseller: false,
      newArrival: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    toast.success(`${bundle.name} added to cart!`);
  };

  const featuredBundles = bundles.filter((b) => b.featured);
  const otherBundles = bundles.filter((b) => !b.featured);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#ff6f61]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-12">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12">
          <div className="flex items-center gap-3 lg:hidden mb-4">
            <Link href="/" className="p-1 hover:bg-white/10 rounded-full transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </Link>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#FF6B35] to-[#ff6f61] rounded-2xl flex items-center justify-center shadow-lg">
                <Package className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold">Bundle Deals</h1>
                <p className="text-gray-400">Save big with curated collections</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#FF6B35]/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-[#FF6B35]" />
                </div>
                <span className="text-gray-300">Up to 50% off</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#FF6B35]/20 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#FF6B35]" />
                </div>
                <span className="text-gray-300">Instant download</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        {/* Featured Bundles */}
        {featuredBundles.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-[#FF6B35] to-[#ff6f61] rounded-xl">
                <Star className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Bundles</h2>
            </div>
            <div className="grid lg:grid-cols-1 gap-6">
              {featuredBundles.map((bundle) => (
                <div
                  key={bundle.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Left: Image */}
                    <div className="relative md:w-[45%] flex-shrink-0">
                      {bundle.image ? (
                        <div className="aspect-[4/3] md:aspect-auto md:h-full overflow-hidden">
                          <img
                            src={bundle.image}
                            alt={bundle.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      ) : (
                        <div className="aspect-[4/3] md:aspect-auto md:h-full bg-gradient-to-br from-[#FF6B35] to-[#ff8a7a] flex items-center justify-center min-h-[200px]">
                          <Package className="w-16 h-16 text-white/50" />
                        </div>
                      )}
                      {/* Best Value Badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-gradient-to-r from-[#FF6B35] to-[#ff6f61] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                        <Award className="w-3.5 h-3.5" />
                        Best Value
                      </div>
                      {/* Discount Badge */}
                      <div className="absolute top-3 right-3 bg-white text-[#FF6B35] px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                        Save {bundle.discount}%
                      </div>
                    </div>

                    {/* Right: Content */}
                    <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
                      {/* Title & Subtitle */}
                      <div className="mb-4">
                        <h3 className="font-bold text-xl md:text-2xl text-gray-900 mb-1">{bundle.name}</h3>
                        {bundle.tagline && (
                          <p className="text-[#FF6B35] font-medium text-sm">{bundle.tagline}</p>
                        )}
                      </div>

                      {/* Key Highlights */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mb-5">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{bundle.products.length} template packs</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-600">Editable in Canva</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-600">Square & portrait sizes</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-600">Instant digital download</span>
                        </div>
                      </div>

                      {/* Pricing & CTA */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-gray-100">
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-gray-900">${Number(bundle.bundlePrice).toFixed(2)}</span>
                            <span className="text-lg text-gray-400 line-through">${Number(bundle.originalPrice).toFixed(2)}</span>
                          </div>
                          <p className="text-green-600 text-sm font-semibold">
                            You save ${calculateSavings(Number(bundle.originalPrice), Number(bundle.bundlePrice)).toFixed(2)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleAddBundle(bundle)}
                          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#FF6B35] to-[#ff6f61] text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                        >
                          <ShoppingCart className="w-5 h-5" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Other Bundles */}
        {otherBundles.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gray-100 rounded-xl">
                <Gift className="w-5 h-5 text-gray-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">More Bundles</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherBundles.map((bundle) => (
                <div
                  key={bundle.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {bundle.image ? (
                      <img
                        src={bundle.image}
                        alt={bundle.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <Package className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-[#FF6B35] text-white px-3 py-1 rounded-full text-xs font-bold">
                      -{bundle.discount}%
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{bundle.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">{bundle.products.length} products included</p>

                    {/* Product thumbnails */}
                    <div className="flex -space-x-2 mb-4">
                      {bundle.products.slice(0, 4).map((bp, idx) => (
                        <div
                          key={bp.id}
                          className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-gray-100"
                          style={{ zIndex: 4 - idx }}
                        >
                          {bp.product.thumbnailUrl ? (
                            <img src={bp.product.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gray-200" />
                          )}
                        </div>
                      ))}
                      {bundle.products.length > 4 && (
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500">
                          +{bundle.products.length - 4}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-400 line-through text-sm">${Number(bundle.originalPrice).toFixed(2)}</span>
                        <span className="text-xl font-bold text-gray-900 ml-2">${Number(bundle.bundlePrice).toFixed(2)}</span>
                      </div>
                      <button
                        onClick={() => handleAddBundle(bundle)}
                        className="p-3 bg-gray-900 text-white rounded-xl hover:bg-[#FF6B35] transition-colors"
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {bundles.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">No Bundles Available</h3>
            <p className="text-gray-500 max-w-md mx-auto">Check back later for amazing bundle deals and save big on curated product collections!</p>
          </div>
        )}

        {/* Benefits Section */}
        <section className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 lg:p-12 text-white">
          <h3 className="text-2xl font-bold mb-8 text-center">Why Buy Bundles?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#FF6B35] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8" />
              </div>
              <h4 className="font-semibold text-lg mb-2">Save Up to 50%</h4>
              <p className="text-gray-400">Massive discounts compared to buying products individually</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#FF6B35] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8" />
              </div>
              <h4 className="font-semibold text-lg mb-2">Curated Collections</h4>
              <p className="text-gray-400">Expertly selected products that work perfectly together</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#FF6B35] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8" />
              </div>
              <h4 className="font-semibold text-lg mb-2">Instant Access</h4>
              <p className="text-gray-400">Download all products immediately after purchase</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

