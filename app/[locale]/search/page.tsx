"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, ChevronLeft, X } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { demoProducts } from "@/data/demo-products";
import { Product } from "@/types";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchInput, setSearchInput] = useState(query);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSearchInput(query);
    setLoading(true);
    
    // Simulate search delay
    const timer = setTimeout(() => {
      if (query) {
        const filtered = demoProducts.filter((product) =>
          product.title.toLowerCase().includes(query.toLowerCase()) ||
          product.shortDescription?.toLowerCase().includes(query.toLowerCase()) ||
          product.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
        setResults(filtered);
      } else {
        setResults([]);
      }
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchInput)}`;
    }
  };

  return (
    <>
      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen bg-gray-50 pb-24">
        {/* Search Header */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-1">
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </Link>
            <form onSubmit={handleSearch} className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-10 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                autoFocus
              />
              {searchInput && (
                <button type="button" onClick={() => setSearchInput("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Results */}
        <div className="p-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full" />
            </div>
          ) : query ? (
            <>
              <p className="text-sm text-gray-500 mb-4">
                {results.length} result{results.length !== 1 ? "s" : ""} for "{query}"
              </p>
              {results.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {results.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">No results found</h3>
                  <p className="text-sm text-gray-500">Try different keywords or browse categories</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Enter a search term to find products</p>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block min-h-screen bg-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search for digital products..."
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
            </div>
          </form>

          {/* Results Header */}
          {query && (
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">
                Search results for "{query}"
                <span className="text-gray-400 text-lg font-normal ml-2">({results.length} found)</span>
              </h1>
            </div>
          )}

          {/* Results Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin w-10 h-10 border-2 border-gray-300 border-t-gray-900 rounded-full" />
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : query ? (
            <div className="text-center py-20">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No results found</h2>
              <p className="text-gray-500 mb-6">We couldn't find anything matching "{query}"</p>
              <Link href="/products" className="px-6 py-3 bg-gray-900 text-white rounded-full font-semibold">
                Browse All Products
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

