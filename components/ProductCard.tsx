"use client";

import Link from "next/link";
import { Product } from "@/types";
import { Heart, ShoppingCart, Star, Download } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    toast.success("Added to cart!");
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <Link href={`/products/${product.slug}`} className="group block h-full">
      <div className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-primary/50 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden flex-shrink-0">
          {/* Placeholder Image - Replace with actual image */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <Download className="w-12 h-12 text-primary" />
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.bestseller && (
              <span className="px-3 py-1 bg-accent text-white text-xs font-bold rounded-full">
                Bestseller
              </span>
            )}
            {product.newArrival && (
              <span className="px-3 py-1 bg-secondary text-white text-xs font-bold rounded-full">
                New
              </span>
            )}
            {product.discount && product.discount > 0 && (
              <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full">
                -{product.discount}%
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          >
            <Heart
              className={`w-5 h-5 ${
                isWishlisted ? "fill-accent text-accent" : "text-gray-400"
              }`}
            />
          </button>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          {/* Category */}
          <div className="text-xs text-primary font-semibold mb-2 uppercase tracking-wide">
            {product.category}
          </div>

          {/* Title */}
          <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors text-base">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-accent text-accent" />
              <span className="text-sm font-semibold text-gray-900">
                {product.rating}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price & Add to Cart */}
          <div className="flex items-center justify-between mt-auto pt-3">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              {/* Downloads Count */}
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                <Download className="w-3.5 h-3.5" />
                <span>{product.downloadCount.toLocaleString()} downloads</span>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-11 h-11 bg-gradient-to-br from-primary to-secondary text-white rounded-full flex items-center justify-center hover:shadow-lg hover:scale-105 transition-all flex-shrink-0"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

