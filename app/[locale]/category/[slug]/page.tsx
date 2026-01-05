import { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryPageClient from "./CategoryPageClient";
import { getCategorySEO, CategorySEO } from "@/data/category-seo";
import { demoCategories, demoProducts } from "@/data/demo-products";
import { getCategories } from "@/lib/api/categories";

interface CategoryPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

// Helper to generate default SEO from category data
function generateDefaultSEO(category: any): CategorySEO {
  const name = category.name || category.slug.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
  return {
    slug: category.slug,
    title: name,
    metaTitle: `${name} | Premium Digital Products | Digistore1`,
    metaDescription: `Browse our collection of ${name.toLowerCase()}. High-quality digital products ready for instant download. Professional templates, presets, and more.`,
    introText: `Discover our curated collection of ${name.toLowerCase()}. Each product is carefully selected to help you achieve professional results with ease.`,
    bottomContent: `Our ${name.toLowerCase()} collection features premium digital products created by professional designers. All products come with instant download access and are compatible with popular software. Whether you're a professional or just getting started, our products help you save time and achieve stunning results.`,
  };
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;

  // Try to get custom SEO content first
  let seoContent = getCategorySEO(slug);

  // If no custom SEO, try to get category from API for name
  if (!seoContent) {
    try {
      const categories = await getCategories();
      const category = categories.find((c: any) => c.slug === slug);
      if (category) {
        seoContent = generateDefaultSEO(category);
      }
    } catch {
      // Generate from slug
      seoContent = generateDefaultSEO({ slug });
    }
  }

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

  // Get category data from API first
  let category: any = null;
  let categories: any[] = demoCategories;

  try {
    const allCategories = await getCategories();
    if (allCategories && allCategories.length > 0) {
      categories = allCategories;
      // Search in parent categories and their children
      for (const cat of allCategories) {
        if (cat.slug === slug) {
          category = cat;
          break;
        }
        // Check children (subcategories)
        if (cat.children) {
          const child = cat.children.find((c: any) => c.slug === slug);
          if (child) {
            category = child;
            break;
          }
          // Check grandchildren
          for (const subcat of cat.children) {
            if (subcat.children) {
              const grandchild = subcat.children.find((c: any) => c.slug === slug);
              if (grandchild) {
                category = grandchild;
                break;
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
  }

  // Fallback to demo categories
  if (!category) {
    category = demoCategories.find(c => c.slug === slug);
  }

  if (!category) {
    notFound();
  }

  // Get SEO content - use custom if available, otherwise generate from category
  const seoContent = getCategorySEO(slug) || generateDefaultSEO(category);

  // Get products for this category (for initial load count)
  const categoryProducts = demoProducts.filter(p =>
    p.category === slug ||
    (typeof p.category === 'object' && (p.category as any)?.slug === slug)
  );

  const productCount = categoryProducts.length || (category as any)._count?.products || (category as any).productCount || 0;

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

