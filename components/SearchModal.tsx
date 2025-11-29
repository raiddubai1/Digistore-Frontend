"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const trendingSearches = [
    "eBooks",
    "Templates",
    "Graphics",
    "Courses",
    "Software",
    "Music",
  ];

  useEffect(() => {
    if (isOpen) {
      // Focus input when modal opens
      setTimeout(() => inputRef.current?.focus(), 100);
      // Prevent body scroll
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setSearchQuery("");
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white h-full flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">Search Products</h2>
        </div>

        {/* Search Input */}
        <div className="p-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search for digital products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-12 pr-4 rounded-2xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all text-base bg-gray-50 focus:bg-white"
              />
            </div>
          </form>
        </div>

        {/* Trending Searches */}
        <div className="flex-1 overflow-y-auto px-4 pb-20">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-semibold text-gray-900">Trending Searches</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((term) => (
                <Link
                  key={term}
                  href={`/products?search=${encodeURIComponent(term)}`}
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-100 hover:bg-primary/10 hover:text-primary rounded-full text-sm font-medium text-gray-700 transition-colors"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Links</h3>
            <div className="space-y-2">
              <Link
                href="/products"
                onClick={onClose}
                className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <p className="font-medium text-gray-900">All Products</p>
                <p className="text-xs text-gray-500 mt-0.5">Browse our entire catalog</p>
              </Link>
              <Link
                href="/categories"
                onClick={onClose}
                className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <p className="font-medium text-gray-900">Categories</p>
                <p className="text-xs text-gray-500 mt-0.5">Explore by category</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

