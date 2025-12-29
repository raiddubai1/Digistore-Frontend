"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Star, Download, ShoppingCart, Heart, Share2, Check,
  ChevronLeft, ChevronRight, Minus, Plus, X, Copy, Facebook, Twitter
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useRecentlyViewedStore } from "@/store/recentlyViewedStore";
import ProductJsonLd from "@/components/ProductJsonLd";
import { Product, Review } from "@/types";
import toast from "react-hot-toast";
import { getProductImageUrl, getThumbnailUrl } from "@/lib/utils";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
  reviews: Review[];
  averageRating: number;
  locale: string;
}

// Helper function to extract YouTube video ID from various URL formats
function getYouTubeVideoId(url: string): string {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    /youtube\.com\/shorts\/([^&\s?]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return url; // Return as-is if no match
}

export default function ProductDetailClient({
  product,
  relatedProducts,
  reviews,
  averageRating,
  locale,
}: ProductDetailClientProps) {
  const { addItem } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const { addItem: addToRecentlyViewed } = useRecentlyViewedStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  const isWishlisted = mounted ? isInWishlist(product.id) : false;

  // Track recently viewed products
  useEffect(() => {
    setMounted(true);
    addToRecentlyViewed(product);
  }, [product]);

  const handleToggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist!");
    }
  };

  const images = product.previewImages?.length > 0 
    ? product.previewImages 
    : [product.thumbnailUrl];

  const handleAddToCart = () => {
    addItem(product);
    toast.success("Added to cart!");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: product.shortDescription,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or not supported, show modal
        setShowShareModal(true);
      }
    } else {
      setShowShareModal(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied!");
    setShowShareModal(false);
  };

  const shareToSocial = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(product.title);
    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${text}%20${url}`;
        break;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShowShareModal(false);
  };

  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <ProductJsonLd
        product={product}
        reviews={reviews}
        averageRating={averageRating}
      />

      {/* ===== MOBILE LAYOUT ===== */}
      <div className="lg:hidden min-h-screen bg-white pb-24">
        {/* Image Carousel - Full width, edge to edge, with overlaid buttons */}
        <div className="relative">
          <div className="aspect-[4/3] bg-gray-100">
            <img
              src={getProductImageUrl(images[currentImageIndex])}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Floating Back Button - Inside Image */}
          <Link
            href={`/${locale}/products`}
            className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md"
          >
            <ChevronLeft className="w-5 h-5 text-gray-800" />
          </Link>

          {/* Floating Action Buttons - Inside Image */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={handleShare}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md"
            >
              <Share2 className="w-5 h-5 text-gray-800" />
            </button>
            <button
              onClick={handleToggleWishlist}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md"
            >
              <Heart
                className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-800'}`}
              />
            </button>
          </div>

          {/* Image Navigation Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentImageIndex ? 'bg-white w-6 shadow' : 'bg-white/60'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Badges - Bottom left of image */}
          <div className="absolute bottom-4 left-4 flex flex-col gap-2">
            {product.discount && product.discount > 0 && (
              <span className="px-3 py-1 bg-[#ff6f61] text-white text-sm font-bold rounded-full shadow">
                -{product.discount}% OFF
              </span>
            )}
            {product.bestseller && (
              <span className="px-3 py-1 bg-orange-500 text-white text-sm font-bold rounded-full shadow">
                🔥 Bestseller
              </span>
            )}
            {product.newArrival && (
              <span className="px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-full shadow">
                ✨ New
              </span>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="px-4 py-4">
          {/* Category */}
          <Link 
            href={`/${locale}/products?category=${product.category}`}
            className="text-xs font-medium text-[#ff6f61] uppercase tracking-wide"
          >
            {typeof product.category === 'string' ? product.category.replace(/-/g, ' ') : ''}
          </Link>

          {/* Title */}
          <h1 className="text-xl font-bold text-gray-900 mt-1 mb-2">
            {product.title}
          </h1>

          {/* Rating & Downloads */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-gray-900">{averageRating.toFixed(1)}</span>
              <span className="text-gray-500">({reviews.length} reviews)</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <Download className="w-4 h-4" />
              <span>{product.downloadCount?.toLocaleString() || 0}</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-2">
            <span className={`text-2xl font-bold ${product.price === 0 ? 'text-green-600' : 'text-gray-900'}`}>
              {product.price === 0 ? 'Free' : `$${product.price}`}
            </span>
            {product.originalPrice && product.price > 0 && (
              <>
                <span className="text-base text-gray-400 line-through">${product.originalPrice}</span>
                <span className="text-sm text-[#ff6f61] font-medium">({product.discount}% off)</span>
              </>
            )}
          </div>

          {/* Short Description */}
          {product.shortDescription && (
            <p className="text-sm text-gray-600 mb-4">{product.shortDescription}</p>
          )}

          {/* Action Buttons - Inline like Etsy */}
          <div className="space-y-3 mb-4">
            <button
              onClick={handleAddToCart}
              className="w-full py-3.5 bg-gray-100 text-gray-900 rounded-full font-semibold text-base active:scale-[0.98] transition-transform"
            >
              Add to cart
            </button>
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-900 text-white rounded-full font-semibold text-base active:scale-[0.98] transition-transform"
            >
              Buy it now
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 my-4" />

          {/* What's Included */}
          <div className="mb-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
              What's Included
            </h3>
            <ul className="space-y-2">
              {product.whatsIncluded?.slice(0, 4).map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Attributes */}
          {product.attributes && product.attributes.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
                Product Details
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {product.attributes.map((attr, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-2.5">
                    <div className="text-xs text-gray-500">{attr.attribute.name}</div>
                    <div className="text-sm font-semibold text-gray-900">{attr.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* File Details */}
          {product.canvaTemplateLink ? (
            <>
              {/* Canva Product Badge */}
              <div className="bg-gradient-to-r from-[#00C4CC]/10 to-[#7B2FF7]/10 border border-[#00C4CC]/20 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#00C4CC] to-[#7B2FF7] rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">Canva Template</div>
                    <div className="text-xs text-gray-500">Opens directly in Canva after purchase</div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mb-4">
                <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
                  <div className="text-xs text-gray-500 mb-0.5">Format</div>
                  <div className="text-sm font-bold text-[#00C4CC]">CANVA</div>
                </div>
                <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
                  <div className="text-xs text-gray-500 mb-0.5">Delivery</div>
                  <div className="text-sm font-bold text-gray-900">Instant</div>
                </div>
                <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
                  <div className="text-xs text-gray-500 mb-0.5">License</div>
                  <div className="text-sm font-bold text-gray-900 capitalize">{product.license}</div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex gap-3 mb-4">
              <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
                <div className="text-xs text-gray-500 mb-0.5">Format</div>
                <div className="text-sm font-bold text-gray-900 uppercase">{product.fileType}</div>
              </div>
              {product.fileSize && (
                <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
                  <div className="text-xs text-gray-500 mb-0.5">Size</div>
                  <div className="text-sm font-bold text-gray-900">{product.fileSize}</div>
                </div>
              )}
              <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
                <div className="text-xs text-gray-500 mb-0.5">License</div>
                <div className="text-sm font-bold text-gray-900 capitalize">{product.license}</div>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-gray-100 my-4" />

          {/* Full Description */}
          <div className="mb-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">
              Description
            </h3>
            <p className={`text-sm text-gray-600 leading-relaxed ${!showFullDescription ? 'line-clamp-3' : ''}`}>
              {product.description}
            </p>
            {product.description && product.description.length > 150 && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-sm font-medium text-[#ff6f61] mt-2"
              >
                {showFullDescription ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>

          {/* YouTube Video - Mobile */}
          {product.youtubeVideoUrl && (
            <>
              <div className="border-t border-gray-100 my-4" />
              <div className="mb-4">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  Product Video
                </h3>
                <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(product.youtubeVideoUrl)}`}
                    title="Product Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>
            </>
          )}

          {/* Canva Instructions - Only show for Canva products */}
          {product.canvaTemplateLink && product.canvaInstructions && (
            <>
              <div className="border-t border-gray-100 my-4" />
              <div className="mb-4">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#00C4CC]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                  How to Use This Template
                </h3>
                <div className="bg-gradient-to-r from-[#00C4CC]/5 to-[#7B2FF7]/5 border border-[#00C4CC]/20 rounded-xl p-4">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {product.canvaInstructions}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Divider */}
          <div className="border-t border-gray-100 my-4" />

          {/* Reviews Summary */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                Reviews ({reviews.length})
              </h3>
              <Link
                href="#reviews"
                className="text-sm font-medium text-[#ff6f61]"
              >
                See all
              </Link>
            </div>

            {/* Rating Summary */}
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
              <div>
                <div className="flex gap-0.5 mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.round(averageRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-xs text-gray-500">{reviews.length} reviews</div>
              </div>
            </div>

            {/* Top Review Preview */}
            {reviews.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white text-sm font-semibold">
                    {reviews[0].userName?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{reviews[0].userName}</div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${
                            star <= reviews[0].rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{reviews[0].comment}</p>
              </div>
            )}
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
                You May Also Like
              </h3>
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
                {relatedProducts.map((rp) => (
                  <Link
                    key={rp.id}
                    href={`/${locale}/products/${rp.slug}`}
                    className="flex-shrink-0 w-32"
                  >
                    <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-2">
                      <img
                        src={rp.thumbnailUrl}
                        alt={rp.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="text-xs font-medium text-gray-900 line-clamp-2 mb-1">
                      {rp.title}
                    </h4>
                    <div className="text-sm font-bold text-gray-900">${rp.price}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== DESKTOP LAYOUT (unchanged) ===== */}
      <div className="hidden lg:block min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-8 flex items-center flex-wrap gap-2">
            <Link href={`/${locale}`} className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href={`/${locale}/products`} className="hover:text-primary transition-colors">
              Products
            </Link>
            <span>/</span>
            <Link
              href={`/${locale}/products?category=${product.category}`}
              className="hover:text-primary transition-colors"
            >
              {typeof product.category === 'string' ? product.category.replace(/-/g, ' ') : ''}
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Product Image */}
            <div>
              <div className="sticky top-24">
                {/* Main Image */}
                <div className="aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden mb-4">
                  <img
                    src={getProductImageUrl(images[currentImageIndex])}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Image Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-2 mb-4">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          idx === currentImageIndex ? 'border-gray-900' : 'border-transparent'
                        }`}
                      >
                        <img src={getThumbnailUrl(img)} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Badges */}
                <div className="flex gap-2 mb-4">
                  {product.bestseller && (
                    <span className="px-4 py-2 bg-orange-100 text-orange-600 text-sm font-bold rounded-full">
                      🔥 Bestseller
                    </span>
                  )}
                  {product.newArrival && (
                    <span className="px-4 py-2 bg-green-100 text-green-600 text-sm font-bold rounded-full">
                      ✨ New Arrival
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-900">{averageRating.toFixed(1)}</span>
                    <span>({reviews.length} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    <span>{product.downloadCount?.toLocaleString() || 0} downloads</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Product Details */}
            <div>
              {/* Category */}
              <div className="text-sm text-[#ff6f61] font-semibold mb-2 uppercase tracking-wide">
                {typeof product.category === 'string' ? product.category.replace(/-/g, ' ') : ''}
              </div>

              {/* Title */}
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {product.title}
              </h1>

              {/* Short Description */}
              {product.shortDescription && (
                <p className="text-xl text-gray-600 mb-6">
                  {product.shortDescription}
                </p>
              )}

              {/* Price */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <div className="flex items-baseline gap-3 mb-4">
                  <span className={`text-4xl font-bold ${product.price === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                    {product.price === 0 ? 'Free' : `$${product.price}`}
                  </span>
                  {product.originalPrice && product.price > 0 && (
                    <>
                      <span className="text-xl text-gray-400 line-through">
                        ${product.originalPrice}
                      </span>
                      <span className="px-3 py-1 bg-[#ff6f61] text-white text-sm font-bold rounded-full">
                        Save {product.discount}%
                      </span>
                    </>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-all"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                  <button
                    onClick={handleToggleWishlist}
                    className={`w-14 h-14 flex items-center justify-center border-2 rounded-full transition-colors ${
                      isWishlisted
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="w-14 h-14 flex items-center justify-center border-2 border-gray-300 rounded-full hover:border-gray-400 transition-colors"
                  >
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* What's Included */}
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4">What's Included</h3>
                <ul className="space-y-3">
                  {product.whatsIncluded?.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Product Attributes */}
              {product.attributes && product.attributes.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold mb-4">Product Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {product.attributes.map((attr, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-4">
                        <div className="text-sm text-gray-500 mb-1">{attr.attribute.name}</div>
                        <div className="font-semibold text-gray-900">{attr.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* File Details */}
              {product.canvaTemplateLink ? (
                <>
                  {/* Canva Product Badge */}
                  <div className="bg-gradient-to-r from-[#00C4CC]/10 to-[#7B2FF7]/10 border border-[#00C4CC]/20 rounded-xl p-5 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#00C4CC] to-[#7B2FF7] rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                        </svg>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">Canva Template</div>
                        <div className="text-sm text-gray-500">Opens directly in Canva after purchase - Edit and customize instantly</div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-[#00C4CC]/5 to-[#7B2FF7]/5 rounded-xl p-4 border border-[#00C4CC]/10">
                      <div className="text-sm text-gray-500 mb-1">Format</div>
                      <div className="font-semibold text-[#00C4CC]">CANVA</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-sm text-gray-500 mb-1">Delivery</div>
                      <div className="font-semibold text-gray-900">Instant Access</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-sm text-gray-500 mb-1">License</div>
                      <div className="font-semibold text-gray-900 capitalize">{product.license}</div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-sm text-gray-500 mb-1">File Type</div>
                    <div className="font-semibold text-gray-900 uppercase">{product.fileType}</div>
                  </div>
                  {product.fileSize && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-sm text-gray-500 mb-1">File Size</div>
                      <div className="font-semibold text-gray-900">{product.fileSize}</div>
                    </div>
                  )}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-sm text-gray-500 mb-1">License</div>
                    <div className="font-semibold text-gray-900 capitalize">{product.license}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description Section */}
          <div className="mt-16 max-w-4xl">
            <h2 className="text-2xl font-bold mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {/* YouTube Video Section */}
          {product.youtubeVideoUrl && (
            <div className="mt-16 max-w-4xl">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                Product Video
              </h2>
              <div className="aspect-video rounded-2xl overflow-hidden bg-gray-100 shadow-lg">
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeVideoId(product.youtubeVideoUrl)}`}
                  title="Product Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
          )}

          {/* Canva Instructions Section - Only show for Canva products */}
          {product.canvaTemplateLink && product.canvaInstructions && (
            <div className="mt-16 max-w-4xl">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-[#00C4CC] to-[#7B2FF7] rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                </div>
                How to Use This Template
              </h2>
              <div className="bg-gradient-to-r from-[#00C4CC]/10 to-[#7B2FF7]/10 border border-[#00C4CC]/20 rounded-2xl p-6">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {product.canvaInstructions}
                </p>
                <div className="mt-6 pt-4 border-t border-[#00C4CC]/20">
                  <p className="text-sm text-gray-500 mb-3">After purchase, you'll receive a link to open this template directly in Canva.</p>
                  <div className="flex items-center gap-2 text-sm text-[#00C4CC] font-medium">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                    Requires a free Canva account
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <div id="reviews" className="mt-16">
            <MobileReviewsSection reviews={reviews} averageRating={averageRating} />
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-20">
              <h2 className="text-2xl font-bold mb-8">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((rp) => (
                  <Link
                    key={rp.id}
                    href={`/${locale}/products/${rp.slug}`}
                    className="group"
                  >
                    <div className="aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden mb-3">
                      <img
                        src={rp.thumbnailUrl}
                        alt={rp.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1 group-hover:text-[#ff6f61] transition-colors">
                      {rp.title}
                    </h4>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">{rp.rating}</span>
                    </div>
                    <div className="text-lg font-bold text-gray-900 mt-1">${rp.price}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end lg:items-center justify-center" onClick={() => setShowShareModal(false)}>
          <div className="bg-white w-full lg:w-96 rounded-t-2xl lg:rounded-2xl p-6 animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Share this product</h3>
              <button onClick={() => setShowShareModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex justify-center gap-4 mb-6">
              <button onClick={() => shareToSocial('facebook')} className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center">
                  <Facebook className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-gray-600">Facebook</span>
              </button>
              <button onClick={() => shareToSocial('twitter')} className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 bg-sky-500 rounded-full flex items-center justify-center">
                  <Twitter className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-gray-600">Twitter</span>
              </button>
              <button onClick={() => shareToSocial('whatsapp')} className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <span className="text-xs text-gray-600">WhatsApp</span>
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                value={typeof window !== 'undefined' ? window.location.href : ''}
                readOnly
                className="w-full px-4 py-3 pr-24 bg-gray-100 rounded-xl text-sm text-gray-600"
              />
              <button
                onClick={copyToClipboard}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-lg flex items-center gap-1"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Reviews section component
function MobileReviewsSection({ reviews, averageRating }: { reviews: Review[], averageRating: number }) {
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = reviews.filter((r) => r.rating === rating).length;
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { rating, count, percentage };
  });

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <div className="bg-white rounded-2xl p-8 border border-gray-200">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Average Rating */}
          <div className="text-center md:text-left">
            <div className="text-5xl font-bold mb-2">{averageRating.toFixed(1)}</div>
            <div className="flex gap-1 justify-center md:justify-start mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 ${
                    star <= Math.round(averageRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <div className="text-gray-600">Based on {reviews.length} reviews</div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-medium">{rating}</span>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="text-sm text-gray-600 w-12 text-right">{count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-2xl p-8 border border-gray-200">
        <h3 className="text-xl font-bold mb-6">All Reviews ({reviews.length})</h3>
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white font-semibold">
                    {review.userName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className="font-semibold">{review.userName}</div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {review.title && <h4 className="font-semibold mb-2">{review.title}</h4>}
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

