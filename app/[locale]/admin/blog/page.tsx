"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2, Star, FileText, Calendar, BarChart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { blogApi } from "@/lib/api";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  featuredImage?: string;
  authorName: string;
  category: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  featured: boolean;
  publishedAt?: string;
  viewCount: number;
  readTime: number;
  createdAt: string;
}

export default function AdminBlogPage() {
  const pathname = usePathname();
  const validLocales = ["en", "ar", "es", "fr", "de"];
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0] || "";
  const basePath = validLocales.includes(firstSegment) ? `/${firstSegment}` : "";

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [statusFilter]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params: any = { limit: 100 };
      if (statusFilter !== "all") {
        params.status = statusFilter;
      }
      const response = await blogApi.getAllAdmin(params);
      if (response.data?.success && response.data?.data?.posts) {
        setPosts(response.data.data.posts);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      toast.error("Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: string, postTitle: string) => {
    if (deleteConfirm === postId) {
      try {
        await blogApi.delete(postId);
        toast.success(`"${postTitle}" deleted successfully!`);
        fetchPosts();
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || "Failed to delete post";
        toast.error(errorMessage);
      }
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(postId);
      toast("Click again to confirm delete", { icon: "⚠️" });
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const toggleFeatured = async (post: BlogPost) => {
    try {
      await blogApi.update(post.id, { featured: !post.featured });
      toast.success(post.featured ? "Removed from featured" : "Added to featured");
      fetchPosts();
    } catch (error) {
      toast.error("Failed to update post");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-100 text-green-800";
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800";
      case "ARCHIVED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-sm text-gray-500 mt-1">Create and manage blog posts for SEO</p>
        </div>
        <Link
          href={`${basePath}/admin/blog/new`}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Post
        </Link>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2">
        {["all", "PUBLISHED", "DRAFT", "ARCHIVED"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === status
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {status === "all" ? "All" : status.charAt(0) + status.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{posts.length}</div>
          <div className="text-sm text-gray-500">Total Posts</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {posts.filter((p) => p.status === "PUBLISHED").length}
          </div>
          <div className="text-sm text-gray-500">Published</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600">
            {posts.filter((p) => p.status === "DRAFT").length}
          </div>
          <div className="text-sm text-gray-500">Drafts</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">
            {posts.reduce((sum, p) => sum + p.viewCount, 0)}
          </div>
          <div className="text-sm text-gray-500">Total Views</div>
        </div>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No blog posts yet</h3>
          <p className="text-gray-500 mb-6">Create your first blog post to improve SEO</p>
          <Link
            href={`${basePath}/admin/blog/new`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            <Plus className="w-5 h-5" />
            Create First Post
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Post</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Category</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Views</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Date</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {post.featuredImage ? (
                          <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 truncate max-w-[250px]">
                            {post.title}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-[250px]">
                            /{post.slug}
                          </div>
                        </div>
                        {post.featured && (
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 shrink-0" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{post.category}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusBadge(post.status)}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <BarChart className="w-4 h-4" />
                        {post.viewCount}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleFeatured(post)}
                          className={`p-2 rounded-lg transition-colors ${
                            post.featured ? "bg-yellow-100 text-yellow-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                          title={post.featured ? "Remove from featured" : "Add to featured"}
                        >
                          <Star className={`w-4 h-4 ${post.featured ? "fill-yellow-500" : ""}`} />
                        </button>
                        <Link
                          href={`${basePath}/blog/${post.slug}`}
                          target="_blank"
                          className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                          title="View post"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`${basePath}/admin/blog/${post.id}`}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                          title="Edit post"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id, post.title)}
                          className={`p-2 rounded-lg transition-colors ${
                            deleteConfirm === post.id
                              ? "bg-red-500 text-white"
                              : "bg-red-100 text-red-600 hover:bg-red-200"
                          }`}
                          title="Delete post"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

