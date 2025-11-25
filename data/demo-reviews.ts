import { Review } from "@/types";

export const demoReviews: Review[] = [
  // Reviews for Python Programming for Beginners
  {
    id: "rev-1",
    productId: "1",
    userId: "user-1",
    userName: "Sarah Johnson",
    userAvatar: undefined,
    rating: 5,
    title: "Perfect for beginners!",
    comment: "This eBook is exactly what I needed to start my Python journey. The explanations are clear, and the examples are practical. Highly recommended!",
    helpful: 24,
    verified: true,
    createdAt: new Date("2024-03-10"),
  },
  {
    id: "rev-2",
    productId: "1",
    userId: "user-2",
    userName: "Michael Chen",
    userAvatar: undefined,
    rating: 5,
    title: "Excellent resource",
    comment: "Well-structured content with great exercises. I went from zero to building my first Python script in just two weeks!",
    helpful: 18,
    verified: true,
    createdAt: new Date("2024-03-08"),
  },
  {
    id: "rev-3",
    productId: "1",
    userId: "user-3",
    userName: "Emily Rodriguez",
    userAvatar: undefined,
    rating: 4,
    title: "Great but could use more advanced topics",
    comment: "Really good for beginners, but I wish there were more advanced topics covered. Still, definitely worth the price!",
    helpful: 12,
    verified: true,
    createdAt: new Date("2024-03-05"),
  },

  // Reviews for Digital Marketing Guide
  {
    id: "rev-4",
    productId: "2",
    userId: "user-4",
    userName: "David Thompson",
    userAvatar: undefined,
    rating: 5,
    title: "Game changer for my business",
    comment: "This guide helped me triple my online sales in just 3 months. The strategies are actionable and easy to implement.",
    helpful: 31,
    verified: true,
    createdAt: new Date("2024-03-12"),
  },
  {
    id: "rev-5",
    productId: "2",
    userId: "user-5",
    userName: "Lisa Anderson",
    userAvatar: undefined,
    rating: 5,
    title: "Comprehensive and up-to-date",
    comment: "Covers everything from SEO to social media marketing. The templates included are super helpful!",
    helpful: 22,
    verified: true,
    createdAt: new Date("2024-03-09"),
  },

  // Reviews for Social Media Marketing Mastery
  {
    id: "rev-6",
    productId: "3",
    userId: "user-6",
    userName: "James Wilson",
    userAvatar: undefined,
    rating: 4,
    title: "Solid content",
    comment: "Good overview of social media strategies. Would have liked more platform-specific tactics, but overall very useful.",
    helpful: 15,
    verified: true,
    createdAt: new Date("2024-03-11"),
  },
  {
    id: "rev-7",
    productId: "3",
    userId: "user-7",
    userName: "Amanda Martinez",
    userAvatar: undefined,
    rating: 5,
    title: "Boosted my engagement by 200%!",
    comment: "The content calendar template alone is worth the price. My Instagram engagement has skyrocketed!",
    helpful: 28,
    verified: true,
    createdAt: new Date("2024-03-07"),
  },

  // Reviews for Dog Training Essentials
  {
    id: "rev-8",
    productId: "4",
    userId: "user-8",
    userName: "Robert Taylor",
    userAvatar: undefined,
    rating: 5,
    title: "My puppy is so well-behaved now!",
    comment: "These techniques really work! My 6-month-old puppy learned basic commands in just a week. Thank you!",
    helpful: 19,
    verified: true,
    createdAt: new Date("2024-03-13"),
  },

  // Reviews for Home Gardening Guide
  {
    id: "rev-9",
    productId: "5",
    userId: "user-9",
    userName: "Jennifer Lee",
    userAvatar: undefined,
    rating: 5,
    title: "Perfect for beginners",
    comment: "I've never gardened before, but this guide made it so easy. My tomatoes are thriving!",
    helpful: 16,
    verified: true,
    createdAt: new Date("2024-03-06"),
  },

  // Reviews for Mastering Relationships
  {
    id: "rev-10",
    productId: "6",
    userId: "user-10",
    userName: "Christopher Brown",
    userAvatar: undefined,
    rating: 5,
    title: "Life-changing advice",
    comment: "This book helped me understand communication better. My relationship has improved dramatically!",
    helpful: 34,
    verified: true,
    createdAt: new Date("2024-03-14"),
  },

  // Reviews for Affiliate Marketing Success
  {
    id: "rev-11",
    productId: "7",
    userId: "user-11",
    userName: "Michelle Davis",
    userAvatar: undefined,
    rating: 4,
    title: "Good starting point",
    comment: "Solid introduction to affiliate marketing. The niche selection guide was particularly helpful.",
    helpful: 11,
    verified: true,
    createdAt: new Date("2024-03-04"),
  },

  // Reviews for Blogging for Profit
  {
    id: "rev-12",
    productId: "8",
    userId: "user-12",
    userName: "Daniel Garcia",
    userAvatar: undefined,
    rating: 5,
    title: "Made my first $1000 blogging!",
    comment: "Followed the monetization strategies in this guide and finally made my blog profitable. Worth every penny!",
    helpful: 42,
    verified: true,
    createdAt: new Date("2024-03-15"),
  },
];

// Helper function to get reviews for a specific product
export function getProductReviews(productId: string): Review[] {
  return demoReviews.filter((review) => review.productId === productId);
}

// Helper function to calculate average rating
export function calculateAverageRating(productId: string): number {
  const reviews = getProductReviews(productId);
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

