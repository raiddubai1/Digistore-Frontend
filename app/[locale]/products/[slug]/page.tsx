import { notFound } from "next/navigation";
import Link from "next/link";
import { demoProducts } from "@/data/demo-products";
import { getProductReviews, calculateAverageRating } from "@/data/demo-reviews";
import { Star, Download, ShoppingCart, Heart, Share2, Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import ProductCard from "@/components/ProductCard";
import AddToCartButton from "@/components/AddToCartButton";
import ProductReviews from "@/components/ProductReviews";

interface ProductPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug, locale } = await params;
  const product = demoProducts.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  // Get related products (same category)
  const relatedProducts = demoProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  // Get reviews for this product
  const reviews = getProductReviews(product.id);
  const averageRating = calculateAverageRating(product.id);

  return (
    <div className="min-h-screen bg-white">
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
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Product Image */}
          <div>
            <div className="sticky top-24">
              {/* Main Image */}
              <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center mb-4">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <Download className="w-16 h-16 text-primary" />
                </div>
              </div>

              {/* Badges */}
              <div className="flex gap-2 mb-4">
                {product.bestseller && (
                  <span className="px-4 py-2 bg-accent/10 text-accent text-sm font-bold rounded-full">
                    🔥 Bestseller
                  </span>
                )}
                {product.newArrival && (
                  <span className="px-4 py-2 bg-secondary/10 text-secondary text-sm font-bold rounded-full">
                    ✨ New Arrival
                  </span>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-accent text-accent" />
                  <span className="font-semibold text-gray-900">{product.rating}</span>
                  <span>({product.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  <span>{product.downloadCount.toLocaleString()} downloads</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div>
            {/* Category */}
            <div className="text-sm text-primary font-semibold mb-2 uppercase tracking-wide">
              {product.category}
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
                <span className="text-4xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="px-3 py-1 bg-accent text-white text-sm font-bold rounded-full">
                      Save {product.discount}%
                    </span>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <AddToCartButton product={product} />
            </div>

            {/* What's Included */}
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4">What's Included</h3>
              <ul className="space-y-3">
                {product.whatsIncluded.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* File Details */}
            <div className="grid grid-cols-2 gap-4 mb-8">
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
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-16 max-w-4xl">
          <h2 className="text-2xl font-bold mb-4">Description</h2>
          <p className="text-gray-700 leading-relaxed">{product.description}</p>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <ProductReviews
            reviews={reviews}
            averageRating={averageRating}
            totalReviews={reviews.length}
          />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

