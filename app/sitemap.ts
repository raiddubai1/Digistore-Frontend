import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.digistore1.com";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://digistore1-backend.onrender.com";

// Static pages that don't change often
const staticPages = [
  "",
  "/products",
  "/categories",
  "/deals",
  "/contact",
  "/login",
  "/register",
  "/wishlist",
  "/compare",
  "/gift-cards",
  "/bundles",
  "/terms",
  "/privacy",
];

// Locales supported
const locales = ["en", "ar"];

async function getProducts(): Promise<{ slug: string; updatedAt: string }[]> {
  try {
    const response = await fetch(`${API_URL}/api/products?limit=1000`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.data?.products?.map((p: any) => ({
      slug: p.slug,
      updatedAt: p.updatedAt || new Date().toISOString(),
    })) || [];
  } catch {
    return [];
  }
}

async function getCategories(): Promise<{ slug: string }[]> {
  try {
    const response = await fetch(`${API_URL}/api/categories`, {
      next: { revalidate: 3600 },
    });
    
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.data?.map((c: any) => ({ slug: c.slug })) || [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Add static pages for each locale
  for (const locale of locales) {
    for (const page of staticPages) {
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === "" ? "daily" : "weekly",
        priority: page === "" ? 1 : 0.8,
      });
    }
  }

  // Add product pages for each locale
  for (const locale of locales) {
    for (const product of products) {
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}/products/${product.slug}`,
        lastModified: new Date(product.updatedAt),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  // Add category pages for each locale
  for (const locale of locales) {
    for (const category of categories) {
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}/categories/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  }

  return sitemapEntries;
}

