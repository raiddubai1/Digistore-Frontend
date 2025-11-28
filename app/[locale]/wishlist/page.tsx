"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, ChevronLeft } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { demoProducts } from "@/data/demo-products";
import toast from "react-hot-toast";

// For now, we'll use a simple state. In production, this would be a store like cartStore
export default function WishlistPage() {
  // Demo: show first 3 products as wishlist items (in production, use a wishlist store)
  const [wishlistItems, setWishlistItems] = useState(demoProducts.slice(0, 3));
  const { addItem } = useCartStore();

  const removeFromWishlist = (productId: string) => {
    setWishlistItems(items => items.filter(item => item.id !== productId));
    toast.success("Removed from wishlist");
  };

  const addToCart = (product: any) => {
    addItem(product);
    toast.success("Added to cart!");
  };

  const moveToCart = (product: any) => {
    addItem(product);
    removeFromWishlist(product.id);
    toast.success("Moved to cart!");
  };

  return (
    <>
      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen bg-gray-50 pb-24">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-100">
          <div className="flex items-center justify-between px-4 py-3">
            <Link href="/" className="p-2 -ml-2">
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </Link>
            <h1 className="text-lg font-bold text-gray-900">Wishlist</h1>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 text-center mb-6">Save items you love by tapping the heart icon</p>
            <Link
              href="/products"
              className="px-6 py-3 bg-gray-900 text-white rounded-full font-semibold"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {wishlistItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl p-3 flex gap-3">
                <Link href={`/products/${item.slug}`} className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                    {item.thumbnailUrl ? (
                      <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                    )}
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.slug}`}>
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">{item.title}</h3>
                  </Link>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-bold text-gray-900">${item.price}</span>
                    {item.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">${item.originalPrice}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => moveToCart(item)}
                      className="flex-1 py-2 bg-gray-900 text-white text-xs font-semibold rounded-full"
                    >
                      Move to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-full"
                    >
                      <Trash2 className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block min-h-screen bg-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>
          
          {wishlistItems.length === 0 ? (
            <div className="text-center py-20">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
              <p className="text-gray-500 mb-6">Save items you love by clicking the heart icon</p>
              <Link href="/products" className="px-6 py-3 bg-gray-900 text-white rounded-full font-semibold">
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden group">
                  <Link href={`/products/${item.slug}`}>
                    <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                      {item.thumbnailUrl ? (
                        <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                      )}
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link href={`/products/${item.slug}`}>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#ff6f61]">{item.title}</h3>
                    </Link>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-xl font-bold text-gray-900">${item.price}</span>
                      {item.originalPrice && <span className="text-gray-400 line-through">${item.originalPrice}</span>}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => moveToCart(item)} className="flex-1 py-2.5 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 flex items-center justify-center gap-2">
                        <ShoppingCart className="w-4 h-4" /> Move to Cart
                      </button>
                      <button onClick={() => removeFromWishlist(item.id)} className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50">
                        <Trash2 className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

