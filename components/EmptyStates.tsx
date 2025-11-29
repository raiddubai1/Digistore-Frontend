"use client";

import Link from "next/link";
import { ShoppingCart, Heart, Package, Search, AlertCircle, WifiOff, FileX } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && (
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-sm mb-6">{description}</p>
      {action && (
        action.href ? (
          <Link
            href={action.href}
            className="px-6 py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors"
          >
            {action.label}
          </Link>
        ) : (
          <button
            onClick={action.onClick}
            className="px-6 py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors"
          >
            {action.label}
          </button>
        )
      )}
    </div>
  );
}

// Pre-built empty states for common use cases
export function EmptyCart() {
  return (
    <EmptyState
      icon={<ShoppingCart className="w-10 h-10 text-gray-400" />}
      title="Your cart is empty"
      description="Looks like you haven't added any items to your cart yet."
      action={{ label: "Browse Products", href: "/products" }}
    />
  );
}

export function EmptyWishlist() {
  return (
    <EmptyState
      icon={<Heart className="w-10 h-10 text-gray-400" />}
      title="Your wishlist is empty"
      description="Save items you love by tapping the heart icon on products."
      action={{ label: "Discover Products", href: "/products" }}
    />
  );
}

export function EmptyOrders() {
  return (
    <EmptyState
      icon={<Package className="w-10 h-10 text-gray-400" />}
      title="No orders yet"
      description="When you make your first purchase, it will appear here."
      action={{ label: "Start Shopping", href: "/products" }}
    />
  );
}

export function NoSearchResults({ query }: { query: string }) {
  return (
    <EmptyState
      icon={<Search className="w-10 h-10 text-gray-400" />}
      title="No results found"
      description={`We couldn't find anything matching "${query}". Try different keywords.`}
      action={{ label: "Clear Search", href: "/products" }}
    />
  );
}

export function NoProducts() {
  return (
    <EmptyState
      icon={<Package className="w-10 h-10 text-gray-400" />}
      title="No products available"
      description="Check back soon for new digital products."
    />
  );
}

// Error States
export function ErrorState({ 
  title = "Something went wrong",
  description = "We're having trouble loading this content. Please try again.",
  onRetry
}: { 
  title?: string; 
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-10 h-10 text-red-500" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-sm mb-6">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export function OfflineState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mb-4">
        <WifiOff className="w-10 h-10 text-yellow-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">You're offline</h3>
      <p className="text-gray-500 max-w-sm mb-6">
        Please check your internet connection and try again.
      </p>
    </div>
  );
}

export function NotFoundState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <FileX className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Page not found</h3>
      <p className="text-gray-500 max-w-sm mb-6">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
}

