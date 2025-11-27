"use client";

import { useState } from "react";
import { Star, Trash2, Eye, CheckCircle, XCircle, MessageSquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ReviewsPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';

  // Mock data - will be replaced with API calls
  const [reviews, setReviews] = useState([
    {
      id: "1",
      productTitle: "Python Programming for Beginners",
      productSlug: "python-programming-beginners",
      userName: "John Doe",
      userEmail: "john@example.com",
      rating: 5,
      title: "Excellent resource!",
      comment: "This guide helped me learn Python from scratch. Highly recommended for beginners!",
      verified: true,
      helpful: 12,
      createdAt: "2024-11-20",
    },
    {
      id: "2",
      productTitle: "Digital Marketing Guide",
      productSlug: "complete-guide-digital-marketing",
      userName: "Jane Smith",
      userEmail: "jane@example.com",
      rating: 4,
      title: "Very informative",
      comment: "Great content, but could use more examples on social media marketing.",
      verified: true,
      helpful: 8,
      createdAt: "2024-11-19",
    },
    {
      id: "3",
      productTitle: "Dog Training Essentials",
      productSlug: "dog-training-essentials",
      userName: "Bob Johnson",
      userEmail: "bob@example.com",
      rating: 5,
      title: "Life-changing!",
      comment: "My dog's behavior improved dramatically after following this guide. Worth every penny!",
      verified: false,
      helpful: 15,
      createdAt: "2024-11-18",
    },
    {
      id: "4",
      productTitle: "Home Gardening Guide",
      productSlug: "home-gardening",
      userName: "Alice Brown",
      userEmail: "alice@example.com",
      rating: 3,
      title: "Good but basic",
      comment: "Covers the basics well, but I was hoping for more advanced techniques.",
      verified: true,
      helpful: 5,
      createdAt: "2024-11-17",
    },
  ]);

  const [filter, setFilter] = useState<"all" | "verified" | "unverified">("all");

  const filteredReviews = reviews.filter((review) => {
    if (filter === "verified") return review.verified;
    if (filter === "unverified") return !review.verified;
    return true;
  });

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

  const averageRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);

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
          <div className="text-2xl font-bold text-gray-900">{reviews.length}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-sm text-gray-500 mb-1">Average Rating</div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-gray-900">{averageRating}</div>
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-sm text-gray-500 mb-1">Verified Purchases</div>
          <div className="text-2xl font-bold text-green-600">
            {reviews.filter(r => r.verified).length}
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-sm text-gray-500 mb-1">Unverified</div>
          <div className="text-2xl font-bold text-orange-600">
            {reviews.filter(r => !r.verified).length}
          </div>
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
        <div className="divide-y divide-gray-200">
          {filteredReviews.map((review) => (
            <div key={review.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
                      {review.userName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{review.userName}</div>
                      <div className="text-xs text-gray-500">{review.userEmail}</div>
                    </div>
                    {review.verified && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        <CheckCircle className="w-3 h-3" />
                        Verified Purchase
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/${locale}/products/${review.productSlug}`}
                    className="text-sm text-primary hover:underline mb-2 inline-block"
                  >
                    {review.productTitle}
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
                      {review.helpful} found helpful
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Link
                    href={`/${locale}/admin/reviews/${review.id}`}
                    className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <button
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredReviews.length === 0 && (
            <div className="p-12 text-center">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No reviews found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


