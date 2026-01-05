import { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryPageClient from "./CategoryPageClient";
import { getCategorySEO, getAllCategorySlugs } from "@/data/category-seo";
import { demoCategories, demoProducts } from "@/data/demo-products";
import { getCategories } from "@/lib/api/categories";

interface CategoryPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

// Generate static params for all categories
export async function generateStaticParams() {
  const slugs = getAllCategorySlugs();
  const locales = ["en", "ar", "pt", "es"];
  
  return locales.flatMap(locale => 
    slugs.map(slug => ({ locale, slug }))
  );
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const seoContent = getCategorySEO(slug);
  
  if (!seoContent) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: seoContent.metaTitle,
    description: seoContent.metaDescription,
    openGraph: {
      title: seoContent.metaTitle,
      description: seoContent.metaDescription,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seoContent.metaTitle,
      description: seoContent.metaDescription,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug, locale } = await params;
  
  // Get SEO content
  const seoContent = getCategorySEO(slug);
  if (!seoContent) {
    notFound();
  }

  // Get category data
  let category = demoCategories.find(c => c.slug === slug);
  let categories = demoCategories;
  
  // Try to fetch from API if available
  if (process.env.NEXT_PUBLIC_API_URL) {
    try {
      const allCategories = await getCategories();
      categories = allCategories;
      category = allCategories.find(c => c.slug === slug);
    } catch (error) {
      console.error("Error fetching categories, using demo data:", error);
    }
  }

  if (!category) {
    notFound();
  }

  // Get products for this category (for initial load count)
  const categoryProducts = demoProducts.filter(p => 
    p.category === slug || 
    (typeof p.category === 'object' && p.category?.slug === slug)
  );
  
  const productCount = categoryProducts.length || category._count?.products || category.productCount || 0;

  return (
    <CategoryPageClient
      slug={slug}
      locale={locale}
      seoContent={seoContent}
      category={category}
      categories={categories}
      productCount={productCount}
    />
  );
}

