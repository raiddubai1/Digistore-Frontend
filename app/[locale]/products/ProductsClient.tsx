"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import { demoProducts, demoCategories } from "@/data/demo-products";
import { Filter, Grid, List, X } from "lucide-react";
import { Product } from "@/types";
import FloatingSortFilter from "@/components/FloatingSortFilter";
import SortBottomSheet from "@/components/SortBottomSheet";
import FilterBottomSheet from "@/components/FilterBottomSheet";

export default function ProductsClient() {
  const [products, setProducts] = useState<Product[]>(demoProducts || []);
  const [categories, setCategories] = useState<any[]>(demoCategories || []);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState((demoProducts || []).length);
  const [page, setPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("popular");
  const [showFilters, setShowFilters] = useState(true);

  // Mobile bottom sheet states
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter products based on selected filters
  useEffect(() => {
    let filtered = [...(demoProducts || [])];

    // Filter by category
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product =>
        selectedCategories.includes(product.category)
      );
    }

    // Filter by price range
    if (selectedPriceRanges.length > 0) {
      filtered = filtered.filter(product => {
        const price = product.price;
        return selectedPriceRanges.some(range => {
          if (range === "under-20") return price < 20;
          if (range === "20-50") return price >= 20 && price <= 50;
          if (range === "over-50") return price > 50;
          return false;
        });
      });
    }

    // Filter by rating
    if (selectedRatings.length > 0) {
      filtered = filtered.filter(product => {
        const rating = product.rating || 0;
        return selectedRatings.some(r => {
          if (r === "5") return rating >= 4.5;
          if (r === "4") return rating >= 4 && rating < 4.5;
          return false;
        });
      });
    }

    // Sort products
    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }

    // Pagination
    const startIndex = (page - 1) * 12;
    const endIndex = startIndex + 12;
    const paginatedProducts = filtered.slice(startIndex, endIndex);

    setProducts(paginatedProducts);
    setTotal(filtered.length);
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
          {/* Sidebar - Categories & Filters (Hidden on mobile - use bottom sheets instead) */}
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
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
                  {categories && categories.length > 0 ? (
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
                            checked={selectedCategories.includes(category.slug || '')}
                            onChange={() => toggleCategory(category.slug || '')}
                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span className="text-sm flex-1">{category.name || 'Unknown'}</span>
                          <span className="text-xs text-gray-400">
                            {productCount}
                          </span>
                        </label>
                      );
                    })
                  ) : (
                    <p className="text-sm text-gray-500">No categories available</p>
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
                {/* Sort - Hidden on mobile (use bottom sheet instead) */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="hidden lg:block px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>

                {/* View Toggle */}
                <div className="hidden lg:flex gap-1 border border-gray-200 rounded-lg p-1">
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
            ) : products && products.length > 0 ? (
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
            {!loading && products && products.length > 0 && total > 12 && (
              <div className="mt-12 flex justify-center">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border border-gray-200 rounded-lg hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {total > 0 && [...Array(Math.ceil(total / 12))].map((_, i) => (
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

      {/* Mobile Floating Sort/Filter Buttons */}
      <FloatingSortFilter
        onSortClick={() => setIsSortOpen(true)}
        onFilterClick={() => setIsFilterOpen(true)}
        activeFiltersCount={selectedCategories.length + selectedPriceRanges.length + selectedRatings.length}
      />

      {/* Sort Bottom Sheet */}
      <SortBottomSheet
        isOpen={isSortOpen}
        onClose={() => setIsSortOpen(false)}
        currentSort={sortBy}
        onSortChange={setSortBy}
      />

      {/* Filter Bottom Sheet */}
      <FilterBottomSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        categories={categories.map(cat => ({ id: cat.id, name: cat.name, slug: cat.slug || cat.name }))}
        selectedCategories={selectedCategories}
        selectedPriceRanges={selectedPriceRanges}
        selectedRatings={selectedRatings}
        onToggleCategory={toggleCategory}
        onTogglePriceRange={togglePriceRange}
        onToggleRating={toggleRating}
        onClearAll={clearAllFilters}
      />
    </div>
  );
}

