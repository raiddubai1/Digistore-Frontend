"use client";

import Link from "next/link";
import { ArrowRight, Calendar, User, Clock } from "lucide-react";
import Image from "next/image";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  slug: string;
}

const demoBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "10 Essential Digital Products Every Entrepreneur Needs",
    excerpt: "Discover the must-have digital tools and resources that can help streamline your business operations and boost productivity.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    author: "Sarah Johnson",
    date: "Nov 25, 2025",
    readTime: "5 min read",
    category: "Business",
    slug: "essential-digital-products-entrepreneurs",
  },
  {
    id: "2",
    title: "How to Create and Sell Your First eBook",
    excerpt: "A comprehensive guide to writing, designing, and marketing your first digital book to generate passive income.",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=600&fit=crop",
    author: "Michael Chen",
    date: "Nov 23, 2025",
    readTime: "8 min read",
    category: "Guides",
    slug: "create-sell-first-ebook",
  },
  {
    id: "3",
    title: "The Future of Digital Marketplaces in 2026",
    excerpt: "Explore the emerging trends and technologies that will shape the digital products industry in the coming year.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    author: "Emma Davis",
    date: "Nov 20, 2025",
    readTime: "6 min read",
    category: "Trends",
    slug: "future-digital-marketplaces-2026",
  },
];

export default function BlogSection() {
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
            href="/blog"
            className="hidden md:inline-flex items-center gap-2 text-primary font-semibold hover:text-accent group"
          >
            View All Posts
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {demoBlogPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-primary hover:shadow-xl transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-gray-200">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
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
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="text-center mt-8 md:hidden">
          <Link
            href="/blog"
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

