"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { Calendar, User, Clock, Tag, ArrowLeft, Eye, Share2, Facebook, Twitter, Linkedin, Copy } from "lucide-react";
import toast from "react-hot-toast";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  authorName: string;
  authorAvatar: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: number;
  viewCount: number;
}

interface BlogDetailClientProps {
  post: BlogPost;
}

export default function BlogDetailClient({ post }: BlogDetailClientProps) {
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "en";
  const basePath = `/${locale}`;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary/10 via-white to-accent/10 py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <Breadcrumb
            items={[
              { label: "Home", href: basePath },
              { label: "Blog", href: `${basePath}/blog` },
              { label: post.title, href: `${basePath}/blog/${post.slug}` },
            ]}
          />

          <Link
            href={`${basePath}/blog`}
            className="inline-flex items-center gap-2 text-primary hover:text-accent mt-6 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-primary text-white text-sm font-semibold rounded-full">
              {post.category}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              {post.authorAvatar ? (
                <img src={post.authorAvatar} alt={post.authorName} className="w-10 h-10 rounded-full" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
              )}
              <span className="font-medium">{post.authorName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readTime} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{post.viewCount} views</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-6 sm:px-8 py-12">
        {/* Featured Image */}
        {post.featuredImage && (
          <div className="mb-10 rounded-2xl overflow-hidden shadow-lg">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Article Content */}
        <div 
          className="prose prose-lg max-w-none prose-headings:text-secondary prose-a:text-primary hover:prose-a:text-accent prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-3 flex-wrap">
              <Tag className="w-5 h-5 text-gray-400" />
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-primary hover:text-white transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Share */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex items-center gap-4">
            <span className="font-medium text-gray-700 flex items-center gap-2">
              <Share2 className="w-5 h-5" /> Share:
            </span>
            <button onClick={handleCopyLink} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" title="Copy link">
              <Copy className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}

