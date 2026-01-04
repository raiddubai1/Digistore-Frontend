"use client";

import { Product, Review } from "@/types";

interface ProductJsonLdProps {
  product: Product;
  reviews?: Review[];
  averageRating?: number;
  baseUrl?: string;
}

export default function ProductJsonLd({
  product,
  reviews = [],
  averageRating = 0,
  baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.digistore1.com",
}: ProductJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.previewImages?.length > 0 
      ? product.previewImages 
      : [product.thumbnailUrl],
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: "DigiStore",
    },
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/en/products/${product.slug}`,
      priceCurrency: "USD",
      price: product.discount && product.discount > 0
        ? (product.price * (1 - product.discount / 100)).toFixed(2)
        : product.price.toFixed(2),
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "DigiStore",
      },
    },
    ...(reviews.length > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: averageRating.toFixed(1),
        reviewCount: reviews.length,
        bestRating: "5",
        worstRating: "1",
      },
      review: reviews.slice(0, 5).map((review) => ({
        "@type": "Review",
        author: {
          "@type": "Person",
          name: review.userName || "Anonymous",
        },
        datePublished: review.createdAt 
          ? new Date(review.createdAt).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        reviewBody: review.comment,
        reviewRating: {
          "@type": "Rating",
          ratingValue: review.rating.toString(),
          bestRating: "5",
          worstRating: "1",
        },
      })),
    }),
    category: typeof product.category === 'object'
      ? (product.category as any)?.name
      : product.category,
    ...(product.tags && product.tags.length > 0 && {
      keywords: product.tags.join(", "),
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

