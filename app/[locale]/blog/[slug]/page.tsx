import { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogDetailClient from "./BlogDetailClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://digistore1-backend.onrender.com/api";
const BASE_URL = "https://digistore1.vercel.app";

interface BlogPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

async function getBlogPost(slug: string) {
  try {
    const response = await fetch(`${API_URL}/blog/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data?.data?.post || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return { title: "Blog Post Not Found" };
  }

  return {
    title: post.metaTitle || `${post.title} | Digistore1 Blog`,
    description: post.metaDescription || post.excerpt?.slice(0, 160),
    keywords: post.metaKeywords || post.tags || [],
    authors: [{ name: post.authorName }],
    alternates: {
      canonical: `/${locale}/blog/${slug}`,
      languages: {
        "en": `/en/blog/${slug}`,
        "pt": `/pt/blog/${slug}`,
        "ar": `/ar/blog/${slug}`,
        "es": `/es/blog/${slug}`,
        "x-default": `/en/blog/${slug}`,
      },
    },
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt?.slice(0, 160),
      url: `${BASE_URL}/${locale}/blog/${slug}`,
      images: post.featuredImage ? [post.featuredImage] : [],
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.authorName],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt?.slice(0, 160),
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return <BlogDetailClient post={post} />;
}

