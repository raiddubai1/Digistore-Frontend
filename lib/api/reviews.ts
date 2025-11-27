const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title?: string;
  comment: string;
  helpful: number;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface ReviewsResponse {
  success: boolean;
  data: {
    reviews: Review[];
  };
}

export interface CreateReviewData {
  productId: string;
  rating: number;
  title?: string;
  comment: string;
}

export async function getProductReviews(productId: string): Promise<Review[]> {
  try {
    const response = await fetch(`${API_URL}/reviews/product/${productId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch reviews: ${response.statusText}`);
    }

    const result: ReviewsResponse = await response.json();
    return result.data.reviews;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
}

export async function createReview(
  reviewData: CreateReviewData,
  token: string
): Promise<Review> {
  try {
    const response = await fetch(`${API_URL}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create review");
    }

    const result = await response.json();
    return result.data.review;
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
}

export async function updateReview(
  reviewId: string,
  reviewData: Partial<CreateReviewData>,
  token: string
): Promise<Review> {
  try {
    const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update review");
    }

    const result = await response.json();
    return result.data.review;
  } catch (error) {
    console.error("Error updating review:", error);
    throw error;
  }
}

export async function deleteReview(reviewId: string, token: string): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete review");
    }
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
}

