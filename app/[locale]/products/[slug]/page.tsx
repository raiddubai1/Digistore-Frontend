import { Metadata } from "next";
import { notFound } from "next/navigation";
import { demoProducts } from "@/data/demo-products";
import { getProductReviews as getDemoReviews } from "@/data/demo-reviews";
import { getProductBySlug, getProducts } from "@/lib/api/products";
import { getProductReviews } from "@/lib/api/reviews";
import ProductDetailClient from "./ProductDetailClient";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://digistore1.vercel.app";

interface ProductPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  let product = demoProducts.find((p) => p.slug === slug);

  if (process.env.NEXT_PUBLIC_API_URL) {
    try {
      const apiProduct = await getProductBySlug(slug);
      if (apiProduct) product = apiProduct;
    } catch {
      // Use demo data
    }
  }

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: `${product.title} | Digistore1`,
    description: product.description?.slice(0, 160) || `Buy ${product.title} - Premium digital product`,
    alternates: {
      canonical: `/${locale}/products/${slug}`,
      languages: {
        "en": `/en/products/${slug}`,
        "ar": `/ar/products/${slug}`,
      },
    },
    openGraph: {
      title: product.title,
      description: product.description?.slice(0, 160),
      url: `${BASE_URL}/${locale}/products/${slug}`,
      images: [product.thumbnailUrl],
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug, locale } = await params;

  // Use demo data by default (API integration can be enabled when backend is ready)
  let product = demoProducts.find((p) => p.slug === slug);

  // Try to fetch from API if available
  if (process.env.NEXT_PUBLIC_API_URL) {
    try {
      const apiProduct = await getProductBySlug(slug);
      if (apiProduct) product = apiProduct;
    } catch (error) {
      console.error("Error fetching product, using demo data:", error);
    }
  }

  if (!product) {
    notFound();
  }

  // Get related products (same category)
  let relatedProducts = demoProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  if (process.env.NEXT_PUBLIC_API_URL) {
    try {
      let categorySlug: string | undefined;
      if (typeof product.category === 'string') {
        categorySlug = product.category;
      } else if (product.category && typeof product.category === 'object') {
        categorySlug = (product.category as any).slug;
      }

      const response = await getProducts({
        category: categorySlug,
        limit: 5
      });
      if (response.products && response.products.length > 0) {
        relatedProducts = response.products.filter((p: any) => p.id !== product.id).slice(0, 4);
      }
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  }

  // Get reviews for this product
  let reviews = getDemoReviews(product.id);

  if (process.env.NEXT_PUBLIC_API_URL) {
    try {
      const apiReviews = await getProductReviews(product.id);
      if (apiReviews && apiReviews.length > 0) {
        // Map API reviews to match Review type
        reviews = apiReviews.map(review => ({
          ...review,
          userName: review.user.name,
          userAvatar: review.user.avatar,
          createdAt: new Date(review.createdAt),
        }));
      }
    } catch (error) {
      console.error("Error fetching reviews, using demo data:", error);
    }
  }

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length
    : product.rating || 0;

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
      reviews={reviews}
      averageRating={averageRating}
      locale={locale}
    />
  );
}

