"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import { demoProducts, demoCategories } from "@/data/demo-products";
import { Filter, Grid, List, X, Search, Star, Heart, ShoppingCart, Download } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";
import { Product } from "@/types";
import SortBottomSheet from "@/components/SortBottomSheet";
import FilterBottomSheet from "@/components/FilterBottomSheet";

// Category icon mapping
const categoryConfig: { [key: string]: { emoji: string; bgColor: string } } = {
  "business-and-marketing": { emoji: "💼", bgColor: "bg-blue-100" },
  "personal-development": { emoji: "🧠", bgColor: "bg-purple-100" },
  "animals-and-pets": { emoji: "🐾", bgColor: "bg-orange-100" },
  "home-and-lifestyle": { emoji: "🏠", bgColor: "bg-green-100" },
  "technology": { emoji: "💻", bgColor: "bg-cyan-100" },
  "society-and-politics": { emoji: "🌍", bgColor: "bg-red-100" },
};

export default function ProductsClient() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(demoProducts || []);
  const [categories, setCategories] = useState<any[]>(demoCategories || []);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState((demoProducts || []).length);
  const [page, setPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
  const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("popular");

  // File type options
  const fileTypeOptions = [
    { value: "pdf", label: "PDF", icon: "📄" },
    { value: "zip", label: "ZIP", icon: "📦" },
    { value: "mp4", label: "Video", icon: "🎬" },
    { value: "mp3", label: "Audio", icon: "🎵" },
    { value: "psd", label: "PSD", icon: "🎨" },
  ];
  const [showFilters, setShowFilters] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Mobile bottom sheet states
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // View mode state (grid or list)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just filter locally - can be enhanced to use URL params
    if (searchQuery.trim()) {
      const filtered = demoProducts.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setProducts(filtered);
      setTotal(filtered.length);
    } else {
      setProducts(demoProducts);
      setTotal(demoProducts.length);
    }
  };

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

    // Filter by file type
    if (selectedFileTypes.length > 0) {
      filtered = filtered.filter(product => {
        const fileType = product.fileType?.toLowerCase() || '';
        return selectedFileTypes.some(type => fileType.includes(type));
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
    } else if (sortBy === "downloads") {
      filtered.sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0));
    }

    // Pagination
    const startIndex = (page - 1) * 12;
    const endIndex = startIndex + 12;
    const paginatedProducts = filtered.slice(startIndex, endIndex);

    setProducts(paginatedProducts);
    setTotal(filtered.length);
  }, [page, selectedCategories, selectedPriceRanges, selectedRatings, selectedFileTypes, sortBy]);

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

  const toggleFileType = (fileType: string) => {
    setSelectedFileTypes((prev) =>
      prev.includes(fileType) ? prev.filter((f) => f !== fileType) : [...prev, fileType]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedPriceRanges([]);
    setSelectedRatings([]);
    setSelectedFileTypes([]);
  };

  const hasActiveFilters =
    selectedCategories.length > 0 || selectedPriceRanges.length > 0 || selectedRatings.length > 0 || selectedFileTypes.length > 0;

  // Mini product card for mobile
  const MiniProductCard = ({ product }: { product: Product }) => (
    <Link href={`/products/${product.slug}`} className="block">
      <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm active:scale-[0.98] transition-transform">
        <div className="relative aspect-square bg-gray-100">
          {/* Product Image */}
          <img
            src={product.thumbnailUrl}
            alt={product.title}
            className="w-full h-full object-cover"
          />
          {/* Badges */}
          {product.discount && product.discount > 0 && (
            <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-[#ff6f61] text-white text-[10px] font-bold rounded">
              -{product.discount}%
            </span>
          )}
          {product.bestseller && !product.discount && (
            <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-orange-500 text-white text-[10px] font-bold rounded">
              🔥 HOT
            </span>
          )}
          {product.newArrival && !product.discount && !product.bestseller && (
            <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded">
              ✨ NEW
            </span>
          )}
        </div>
        <div className="p-2.5">
          <h3 className="text-xs font-medium text-gray-900 line-clamp-2 leading-tight mb-1.5">
            {product.title}
          </h3>
          <div className="flex items-center gap-1 mb-1.5">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-[10px] font-medium text-gray-700">{product.rating}</span>
            <span className="text-[10px] text-gray-400">({product.reviewCount})</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-bold text-gray-900">${product.price}</span>
            {product.originalPrice && (
              <span className="text-[10px] text-gray-400 line-through">${product.originalPrice}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <>
      {/* ===== MOBILE LAYOUT ===== */}
      <div className="lg:hidden min-h-screen bg-gray-50 pb-24">
        {/* Sticky Search Bar */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-gray-400 focus:ring-2 focus:ring-gray-100 focus:outline-none transition-all text-sm"
              />
            </div>
          </form>
        </div>

        {/* Category Grid - 2 rows */}
        <div className="bg-white py-4 px-4 border-b border-gray-100">
          <div className="grid grid-cols-3 gap-2">
            {categories.slice(0, 6).map((category) => {
              const config = categoryConfig[category.slug] || { emoji: "📦", bgColor: "bg-gray-100" };
              const isSelected = selectedCategories.includes(category.slug);
              return (
                <button
                  key={category.id}
                  onClick={() => toggleCategory(category.slug)}
                  className={`flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-xl active:scale-95 transition-all ${
                    isSelected
                      ? "bg-gray-900 text-white"
                      : `${config.bgColor} text-gray-800`
                  }`}
                >
                  <span className="text-2xl">{config.emoji}</span>
                  <span className="text-xs font-medium truncate w-full text-center">
                    {category.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Inline Toolbar: Results + Sort/Filter */}
        <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-gray-900">
              {total} products
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs font-medium text-[#ff6f61]"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSortOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-sm font-medium text-gray-700 active:bg-gray-50"
            >
              Sort
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button
              onClick={() => setIsFilterOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium active:bg-gray-50 ${
                hasActiveFilters
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 text-gray-700"
              }`}
            >
              Filter
              {hasActiveFilters && (
                <span className="w-4 h-4 rounded-full bg-white text-gray-900 text-xs flex items-center justify-center">
                  {selectedCategories.length + selectedPriceRanges.length + selectedRatings.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Active Filters Row */}
        <div className="px-4 py-2">

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              {selectedPriceRanges.map((range) => (
                <button
                  key={range}
                  onClick={() => togglePriceRange(range)}
                  className="flex items-center gap-1 px-2.5 py-1 bg-gray-900 text-white rounded-full text-xs font-medium"
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
                  className="flex items-center gap-1 px-2.5 py-1 bg-gray-900 text-white rounded-full text-xs font-medium"
                >
                  {rating}+ ⭐
                  <X className="w-3 h-3" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Products Grid - 2 columns */}
        <div className="px-4">
          {loading ? (
            <div className="grid grid-cols-2 gap-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-xl aspect-[3/4] animate-pulse" />
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {products.map((product) => (
                <MiniProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No products found.</p>
              <button
                onClick={clearAllFilters}
                className="text-[#ff6f61] font-semibold"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Load More (Mobile) */}
        {!loading && products.length > 0 && products.length < total && (
          <div className="px-4 py-6">
            <button
              onClick={() => setPage(page + 1)}
              className="w-full py-3 border border-gray-300 rounded-full text-sm font-medium text-gray-700 active:bg-gray-50"
            >
              Load more products
            </button>
          </div>
        )}
      </div>

      {/* ===== DESKTOP LAYOUT ===== */}
      <div className="hidden lg:block min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">All Products</h1>
            <p className="text-gray-600">
              Browse our collection of {demoProducts.length} premium digital products
            </p>
          </div>

          <div className="flex gap-8">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0">
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
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded transition-colors ${viewMode === "grid" ? "bg-gray-900 text-white" : "hover:bg-gray-100 text-gray-600"}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded transition-colors ${viewMode === "list" ? "bg-gray-900 text-white" : "hover:bg-gray-100 text-gray-600"}`}
                  >
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

            {/* Products Grid/List */}
            {loading ? (
              <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
                {[...Array(12)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : products && products.length > 0 ? (
              viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {products.map((product) => (
                    <ProductListCard key={product.id} product={product} />
                  ))}
                </div>
              )
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
      </div>

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
        selectedFileTypes={selectedFileTypes}
        onToggleCategory={toggleCategory}
        onTogglePriceRange={togglePriceRange}
        onToggleRating={toggleRating}
        onToggleFileType={toggleFileType}
        onClearAll={clearAllFilters}
      />
    </>
  );
}

// List view card component for desktop
function ProductListCard({ product }: { product: Product }) {
  const { addItem } = useCartStore();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    toast.success("Added to cart!");
  };

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all overflow-hidden flex">
        {/* Image */}
        <div className="relative w-48 h-48 flex-shrink-0 bg-gray-100">
          {product.thumbnailUrl ? (
            <img
              src={product.thumbnailUrl}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Download className="w-12 h-12 text-gray-400" />
            </div>
          )}
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.bestseller && (
              <span className="px-2 py-0.5 bg-orange-500 text-white text-xs font-bold rounded-full">
                🔥 Bestseller
              </span>
            )}
            {product.newArrival && (
              <span className="px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded-full">
                ✨ New
              </span>
            )}
            {product.discount && product.discount > 0 && (
              <span className="px-2 py-0.5 bg-[#ff6f61] text-white text-xs font-bold rounded-full">
                -{product.discount}%
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col">
          {/* Category */}
          <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
            {typeof product.category === 'string' ? product.category.replace(/-/g, ' ') : ''}
          </div>

          {/* Title */}
          <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-[#ff6f61] transition-colors line-clamp-2">
            {product.title}
          </h3>

          {/* Description */}
          {product.shortDescription && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.shortDescription}</p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold text-gray-900">{product.rating}</span>
            </div>
            <span className="text-xs text-gray-500">({product.reviewCount} reviews)</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500">{product.downloadCount?.toLocaleString()} downloads</span>
          </div>

          {/* Price & Actions */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">${product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsWishlisted(!isWishlisted);
                }}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isWishlisted ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
              </button>
              <button
                onClick={handleAddToCart}
                className="px-4 py-2 bg-gray-900 text-white rounded-full font-semibold text-sm hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
