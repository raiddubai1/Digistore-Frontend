"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Calendar, User, Clock, Loader2 } from "lucide-react";
import { blogApi } from "@/lib/api";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  featuredImage: string;
  authorName: string;
  category: string;
  publishedAt: string;
  readTime: number;
}

// Fallback demo posts (shown when API has no posts)
const demoBlogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "essential-digital-products-entrepreneurs",
    title: "10 Essential Digital Products Every Entrepreneur Needs",
    excerpt: "Discover the must-have digital tools and resources that can help streamline your business operations and boost productivity.",
    featuredImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    authorName: "Sarah Johnson",
    publishedAt: "2025-11-25",
    readTime: 5,
    category: "Business",
  },
  {
    id: "2",
    slug: "create-sell-first-ebook",
    title: "How to Create and Sell Your First eBook",
    excerpt: "A comprehensive guide to writing, designing, and marketing your first digital book to generate passive income.",
    featuredImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=600&fit=crop",
    authorName: "Michael Chen",
    publishedAt: "2025-11-23",
    readTime: 8,
    category: "Guides",
  },
  {
    id: "3",
    slug: "future-digital-marketplaces-2026",
    title: "The Future of Digital Marketplaces in 2026",
    excerpt: "Explore the emerging trends and technologies that will shape the digital products industry in the coming year.",
    featuredImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    authorName: "Emma Davis",
    publishedAt: "2025-11-20",
    readTime: 6,
    category: "Trends",
  },
];

export default function BlogSection() {
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "en";
  const basePath = `/${locale}`;

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await blogApi.getAll({ limit: 3, featured: true });
        if (response.data?.success && response.data.data.posts.length > 0) {
          setPosts(response.data.data.posts);
        } else {
          // Fallback to featured posts if no featured
          const allPosts = await blogApi.getAll({ limit: 3 });
          if (allPosts.data?.success && allPosts.data.data.posts.length > 0) {
            setPosts(allPosts.data.data.posts);
          } else {
            setPosts(demoBlogPosts);
          }
        }
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        setPosts(demoBlogPosts);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const displayPosts = posts.length > 0 ? posts : demoBlogPosts;

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">
              Latest from Our <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Blog</span>
            </h2>
            <p className="text-lg text-gray-600">
              Tips, guides, and insights to help you succeed
            </p>
          </div>
          <Link
            href={`${basePath}/blog`}
            className="hidden md:inline-flex items-center gap-2 text-primary font-semibold hover:text-accent group"
          >
            View All Posts
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayPosts.map((post) => (
              <Link
                key={post.id}
                href={`${basePath}/blog/${post.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-primary hover:shadow-xl transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gray-200">
                  {post.featuredImage ? (
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <span className="text-4xl">📝</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{post.authorName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime} min</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Mobile View All Button */}
        <div className="text-center mt-8 md:hidden">
          <Link
            href={`${basePath}/blog`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-indigo-600 text-white rounded-[15px] font-semibold hover:shadow-xl hover:shadow-primary/25 transition-all hover:scale-105"
          >
            View All Posts
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
