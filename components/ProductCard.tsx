"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { Heart, ShoppingCart, Star, Download, GitCompare } from "lucide-react";
import { formatPrice, getThumbnailUrl } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCompareStore } from "@/store/compareStore";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: Product;
  priority?: boolean; // For above-the-fold images
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const { addItem: addToCompare, removeItem: removeFromCompare, isInCompare, items: compareItems } = useCompareStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isWishlisted = mounted ? isInWishlist(product.id) : false;
  const isComparing = mounted ? isInCompare(product.id) : false;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    toast.success("Added to cart!");
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist!");
    }
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isComparing) {
      removeFromCompare(product.id);
      toast.success("Removed from compare");
    } else {
      if (compareItems.length >= 4) {
        toast.error("Maximum 4 products can be compared");
        return;
      }
      addToCompare(product);
      toast.success("Added to compare!");
    }
  };

  return (
    <Link href={`/products/${product.slug}`} className="group block h-full">
      <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700 hover:border-[#FF6B35]/30 dark:hover:border-slate-600 hover:shadow-2xl dark:hover:shadow-slate-900/50 active:scale-[0.98] transition-all duration-300 h-full flex flex-col">
        {/* Image Container - with consistent padding */}
        <div className="relative aspect-square lg:aspect-[4/3] bg-gray-50 dark:bg-slate-700 overflow-hidden flex-shrink-0 p-2 lg:p-3">
          {/* Product Image */}
          {product.thumbnailUrl ? (
            <Image
              src={getThumbnailUrl(product.thumbnailUrl)}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              priority={priority}
              className="object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-2 lg:inset-3 flex items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-slate-600 dark:to-slate-700">
              <div className="w-24 h-24 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-gray-200 via-gray-100 to-gray-50 dark:from-slate-500 dark:via-slate-600 dark:to-slate-700 flex items-center justify-center shadow-lg">
                <Download className="w-12 h-12 lg:w-10 lg:h-10 text-gray-400 dark:text-slate-400" />
              </div>
            </div>
          )}

          {/* Badges - Improved Visibility with accent color */}
          <div className="absolute top-3 left-3 lg:top-4 lg:left-4 flex flex-col gap-1.5">
            {product.price === 0 && (
              <span className="px-2.5 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-[10px] lg:text-xs font-bold rounded-full shadow-lg">
                🎁 Free
              </span>
            )}
            {product.bestseller && (
              <span className="px-2.5 py-1 bg-gradient-to-r from-[#FF6B35] to-orange-500 text-white text-[10px] lg:text-xs font-bold rounded-full shadow-lg">
                🔥 Bestseller
              </span>
            )}
            {product.newArrival && (
              <span className="px-2.5 py-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-[10px] lg:text-xs font-bold rounded-full shadow-lg">
                ✨ New
              </span>
            )}
            {product.discount && product.discount > 0 && (
              <span className="px-2.5 py-1 bg-gradient-to-r from-[#FF6B35] to-red-500 text-white text-[10px] lg:text-xs font-bold rounded-full shadow-lg">
                -{product.discount}% OFF
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 lg:top-4 lg:right-4 flex flex-col gap-2">
            <button
              onClick={handleToggleWishlist}
              className="w-10 h-10 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform"
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  isWishlisted ? "fill-[#FF6B35] text-[#FF6B35]" : "text-gray-400 dark:text-slate-400"
                }`}
              />
            </button>
            <button
              onClick={handleToggleCompare}
              className={`w-10 h-10 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform ${
                isComparing ? "bg-[#FF6B35] text-white" : "bg-white/95 dark:bg-slate-800/95 text-gray-400 dark:text-slate-400"
              }`}
            >
              <GitCompare className="w-4 h-4" />
            </button>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 dark:group-hover:bg-white/5 transition-colors" />
        </div>

        {/* Content - Improved Mobile Spacing */}
        <div className="p-4 lg:p-5 flex flex-col flex-1">
          {/* Category */}
          <div className="text-[10px] lg:text-xs text-gray-600 dark:text-gray-400 font-bold mb-2 uppercase tracking-wider">
            {product.category}
          </div>

          {/* Title - Larger on Mobile */}
          <h3 className="font-bold text-gray-900 dark:text-white mb-2 lg:mb-3 line-clamp-2 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors text-base lg:text-base leading-tight">
            {product.title}
          </h3>

          {/* Rating - Compact */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {product.rating}
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({product.reviewCount})
            </span>
          </div>

          {/* Price & Add to Cart - Bolder on Mobile with accent color */}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-slate-700">
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2">
                <span className="text-xl lg:text-2xl font-black text-[#FF6B35]">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-gray-400 dark:text-gray-500 line-through font-medium">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              {/* Downloads Count */}
              <div className="flex items-center gap-1 text-[10px] lg:text-xs text-gray-500 dark:text-gray-400">
                <Download className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                <span className="font-medium">{product.downloadCount.toLocaleString()} downloads</span>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-12 h-12 lg:w-11 lg:h-11 bg-gradient-to-br from-[#FF6B35] to-[#ff6f61] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex-shrink-0"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

