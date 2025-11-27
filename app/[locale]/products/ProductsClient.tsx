"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import { demoProducts, demoCategories } from "@/data/demo-products";
import { getProducts } from "@/lib/api/products";
import { getCategories, Category } from "@/lib/api/categories";
import { Filter, Grid, List, X } from "lucide-react";
import { Product } from "@/types";
import toast from "react-hot-toast";

export default function ProductsClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("popular");
  const [showFilters, setShowFilters] = useState(true);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      // Check if API URL is configured
      if (!process.env.NEXT_PUBLIC_API_URL) {
        console.log("API URL not configured, using demo categories");
        setCategories(demoCategories as any);
        return;
      }

      try {
        const fetchedCategories = await getCategories();
        // Filter only parent categories
        const parentCategories = fetchedCategories.filter(cat => !cat.parentId);
        setCategories(parentCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Fallback to demo categories
        setCategories(demoCategories as any);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      // Check if API URL is configured
      if (!process.env.NEXT_PUBLIC_API_URL) {
        console.log("API URL not configured, using demo products");
        setProducts(demoProducts);
        setTotal(demoProducts.length);
        setLoading(false);
        return;
      }

      try {
        // Build filters
        const filters: any = {
          page,
          limit: 12,
          sort: sortBy,
        };

        // Add category filter
        if (selectedCategories.length > 0) {
          filters.category = selectedCategories[0]; // API supports single category for now
        }

        // Add price range filter
        if (selectedPriceRanges.length > 0) {
          selectedPriceRanges.forEach((range) => {
            if (range === "under-20") {
              filters.priceMax = 20;
            } else if (range === "20-50") {
              filters.priceMin = 20;
              filters.priceMax = 50;
            } else if (range === "over-50") {
              filters.priceMin = 50;
            }
          });
        }

        // Add rating filter
        if (selectedRatings.length > 0) {
          const minRating = selectedRatings.includes("5") ? 5 : 4;
          filters.rating = minRating;
        }

        const response = await getProducts(filters);
        setProducts(response.products);
        setTotal(response.total);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products. Using demo data.");
        // Fallback to demo data
        setProducts(demoProducts);
        setTotal(demoProducts.length);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, selectedCategories, selectedPriceRanges, selectedRatings, sortBy]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const togglePriceRange = (range: string) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]
    );
  };

  const toggleRating = (rating: string) => {
    setSelectedRatings((prev) =>
      prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedPriceRanges([]);
    setSelectedRatings([]);
  };

  const hasActiveFilters =
    selectedCategories.length > 0 || selectedPriceRanges.length > 0 || selectedRatings.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">All Products</h1>
          <p className="text-gray-600">
            Browse our collection of {demoProducts.length} premium digital products
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Categories & Filters */}
          <aside className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <Filter className="w-5 h-5 text-primary" />
                  Filters
                </h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-primary hover:text-primary-dark font-semibold"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-semibold text-sm text-gray-700 mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.length > 0 ? (
                    categories.map((category) => {
                      // Handle both API format (_count.products) and demo format (productCount)
                      const productCount = (category as any)._count?.products || (category as any).productCount || 0;
                      return (
                        <label
                          key={category.id}
                          className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category.slug)}
                            onChange={() => toggleCategory(category.slug)}
                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span className="text-sm flex-1">{category.name}</span>
                          <span className="text-xs text-gray-400">
                            {productCount}
                          </span>
                        </label>
                      );
                    })
                  ) : (
                    <p className="text-sm text-gray-500">Loading categories...</p>
                  )}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-semibold text-sm text-gray-700 mb-3">Price Range</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedPriceRanges.includes("under-20")}
                      onChange={() => togglePriceRange("under-20")}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm">Under $20</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedPriceRanges.includes("20-50")}
                      onChange={() => togglePriceRange("20-50")}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm">$20 - $50</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedPriceRanges.includes("over-50")}
                      onChange={() => togglePriceRange("over-50")}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm">Over $50</span>
                  </label>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <h3 className="font-semibold text-sm text-gray-700 mb-3">Rating</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedRatings.includes("4+")}
                      onChange={() => toggleRating("4+")}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm">4+ Stars</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedRatings.includes("5")}
                      onChange={() => toggleRating("5")}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm">5 Stars</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
                <div className="text-sm text-gray-600">
                  {loading ? (
                    <span>Loading products...</span>
                  ) : (
                    <>
                      Showing <span className="font-semibold">{products.length}</span> of{" "}
                      <span className="font-semibold">{total}</span> products
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>

                {/* View Toggle */}
                <div className="hidden sm:flex gap-1 border border-gray-200 rounded-lg p-1">
                  <button className="p-2 rounded bg-primary text-white">
                    <Grid className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded hover:bg-gray-100">
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="mb-6 flex flex-wrap gap-2">
                {selectedCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20"
                  >
                    {cat}
                    <X className="w-3 h-3" />
                  </button>
                ))}
                {selectedPriceRanges.map((range) => (
                  <button
                    key={range}
                    onClick={() => togglePriceRange(range)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20"
                  >
                    {range === "under-20" && "Under $20"}
                    {range === "20-50" && "$20-$50"}
                    {range === "over-50" && "Over $50"}
                    <X className="w-3 h-3" />
                  </button>
                ))}
                {selectedRatings.map((rating) => (
                  <button
                    key={rating}
                    onClick={() => toggleRating(rating)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20"
                  >
                    {rating} Stars
                    <X className="w-3 h-3" />
                  </button>
                ))}
              </div>
            )}

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(12)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No products found matching your filters.</p>
                <button
                  onClick={clearAllFilters}
                  className="text-primary font-semibold hover:text-primary-dark"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {!loading && products.length > 0 && (
              <div className="mt-12 flex justify-center">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border border-gray-200 rounded-lg hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {[...Array(Math.ceil(total / 12))].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        page === i + 1
                          ? 'bg-primary text-white'
                          : 'border border-gray-200 hover:border-primary'
                      }`}
                    >
                      {i + 1}
                    </button>
                  )).slice(0, 5)}
                  <button
                    onClick={() => setPage(Math.min(Math.ceil(total / 12), page + 1))}
                    disabled={page === Math.ceil(total / 12)}
                    className="px-4 py-2 border border-gray-200 rounded-lg hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

