'use client';

import { Package, Tag, ChevronRight, ChevronLeft, ShoppingCart, Check } from 'lucide-react';
import Link from 'next/link';
import { useBundleStore, demoBundles, calculateSavings } from '@/store/bundleStore';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';

export default function BundlesPage() {
  const { bundles } = useBundleStore();
  const { addItem } = useCartStore();

  const handleAddBundle = (bundle: typeof demoBundles[0]) => {
    // Add bundle as a single item with bundle price
    addItem({
      id: `bundle-${bundle.id}`,
      title: bundle.name,
      slug: bundle.slug,
      description: bundle.description,
      price: bundle.bundlePrice,
      originalPrice: bundle.originalPrice,
      discount: bundle.discount,
      category: 'Bundles',
      tags: ['bundle', 'deal'],
      fileType: 'bundle',
      fileUrl: '',
      previewImages: [bundle.image],
      thumbnailUrl: bundle.image,
      rating: 5,
      reviewCount: 0,
      downloadCount: 0,
      license: 'personal',
      whatsIncluded: bundle.products.map(p => p.title),
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

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-12">
      {/* Header */}
      <div className="bg-gradient-to-br from-black to-gray-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12">
          <div className="flex items-center gap-3 lg:hidden mb-4">
            <Link href="/" className="p-1">
              <ChevronLeft className="w-6 h-6" />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#ff6f61] rounded-2xl flex items-center justify-center">
              <Package className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">Product Bundles</h1>
              <p className="text-gray-300">Save more when you buy together</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
        {/* Featured Bundles */}
        {featuredBundles.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-[#ff6f61]" />
              Featured Bundles
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredBundles.map((bundle) => (
                <div
                  key={bundle.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                >
                  {/* Bundle Header */}
                  <div className="bg-gradient-to-r from-[#ff6f61] to-[#ff8a7a] p-4 text-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{bundle.name}</h3>
                        <p className="text-white/80 text-sm mt-1">{bundle.products.length} products</p>
                      </div>
                      <div className="bg-white text-[#ff6f61] px-3 py-1 rounded-full text-sm font-bold">
                        Save {bundle.discount}%
                      </div>
                    </div>
                  </div>

                  {/* Products List */}
                  <div className="p-4">
                    <p className="text-gray-600 text-sm mb-4">{bundle.description}</p>
                    <div className="space-y-2 mb-4">
                      {bundle.products.map((product) => (
                        <div key={product.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-500" />
                            <span>{product.title}</span>
                          </div>
                          <span className="text-gray-400 line-through">${product.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Pricing */}
                    <div className="border-t border-gray-100 pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="text-gray-400 line-through text-sm">
                            ${bundle.originalPrice.toFixed(2)}
                          </span>
                          <span className="text-2xl font-bold ml-2">${bundle.bundlePrice.toFixed(2)}</span>
                        </div>
                        <span className="text-green-600 font-medium">
                          Save ${calculateSavings(bundle.originalPrice, bundle.bundlePrice).toFixed(2)}
                        </span>
                      </div>
                      <button
                        onClick={() => handleAddBundle(bundle)}
                        className="w-full py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Add Bundle to Cart
                      </button>
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
            <h2 className="text-xl font-bold mb-4">More Bundles</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {otherBundles.map((bundle) => (
                <div
                  key={bundle.id}
                  className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold">{bundle.name}</h3>
                    <span className="bg-[#ff6f61]/10 text-[#ff6f61] px-2 py-0.5 rounded text-xs font-bold">
                      -{bundle.discount}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{bundle.products.length} products included</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-gray-400 line-through text-sm">
                        ${bundle.originalPrice.toFixed(2)}
                      </span>
                      <span className="font-bold ml-1">${bundle.bundlePrice.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={() => handleAddBundle(bundle)}
                      className="p-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {bundles.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Bundles Available</h3>
            <p className="text-gray-500">Check back later for special bundle deals!</p>
          </div>
        )}

        {/* Info Section */}
        <div className="bg-gray-100 rounded-xl p-6">
          <h3 className="font-semibold mb-3">Why Buy Bundles?</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600">Save up to 40% compared to buying individually</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600">Curated collections for specific goals</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600">Instant access to all products in the bundle</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

