"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, Trash2, Eye, CheckCircle, XCircle, MessageSquare, Loader2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string;
  verified: boolean;
  helpful: number;
  createdAt: string;
  user: { id: string; name: string | null; email: string };
  product: { id: string; title: string; slug: string };
}

interface Stats {
  total: number;
  verified: number;
  unverified: number;
  avgRating: number;
}

export default function ReviewsPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';

  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, verified: 0, unverified: 0, avgRating: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "verified" | "unverified">("all");

  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("accessToken");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

      const params = new URLSearchParams();
      if (filter === "verified") params.append("verified", "true");
      if (filter === "unverified") params.append("verified", "false");

      const res = await fetch(`${API_URL}/admin/reviews?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setReviews(data.data.reviews);
        setStats(data.data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const token = localStorage.getItem("accessToken");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

      const res = await fetch(`${API_URL}/admin/reviews/${reviewId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        fetchReviews();
      }
    } catch (error) {
      console.error("Failed to delete review:", error);
    }
  };

  const handleToggleVerified = async (reviewId: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

      const res = await fetch(`${API_URL}/admin/reviews/${reviewId}/toggle-verified`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        fetchReviews();
      }
    } catch (error) {
      console.error("Failed to toggle verified:", error);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
          <p className="text-sm text-gray-500 mt-1">Manage product reviews and ratings</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-sm text-gray-500 mb-1">Total Reviews</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-sm text-gray-500 mb-1">Average Rating</div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-gray-900">{stats.avgRating.toFixed(1)}</div>
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-sm text-gray-500 mb-1">Verified Purchases</div>
          <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-sm text-gray-500 mb-1">Unverified</div>
          <div className="text-2xl font-bold text-orange-600">{stats.unverified}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === "all"
              ? "bg-primary text-white"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          All Reviews
        </button>
        <button
          onClick={() => setFilter("verified")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === "verified"
              ? "bg-primary text-white"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Verified Only
        </button>
        <button
          onClick={() => setFilter("unverified")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === "unverified"
              ? "bg-primary text-white"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Unverified Only
        </button>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No reviews found</p>
            <p className="text-sm text-gray-400">Reviews will appear here when customers leave feedback</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {reviews.map((review) => (
              <div key={review.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
                        {(review.user?.name || review.user?.email || "U").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{review.user?.name || "Anonymous"}</div>
                        <div className="text-xs text-gray-500">{review.user?.email}</div>
                      </div>
                      <button
                        onClick={() => handleToggleVerified(review.id)}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                          review.verified
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                        }`}
                      >
                        {review.verified ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            Verified
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            Unverified
                          </>
                        )}
                      </button>
                    </div>

                    <Link
                      href={`/${locale}/products/${review.product?.slug}`}
                      className="text-sm text-primary hover:underline mb-2 inline-block"
                    >
                      {review.product?.title}
                    </Link>

                    <div className="flex items-center gap-2 mb-3">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {review.title && (
                      <h3 className="font-semibold text-gray-900 mb-2">{review.title}</h3>
                    )}

                    <p className="text-gray-700 text-sm mb-3">{review.comment}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {review.helpful || 0} found helpful
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
