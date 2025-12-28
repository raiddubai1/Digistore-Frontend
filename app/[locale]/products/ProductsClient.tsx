"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import Breadcrumb from "@/components/Breadcrumb";
import { demoProducts, demoCategories } from "@/data/demo-products";
import { Filter, Grid, List, X, Search, Star, Heart, ShoppingCart, Download, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useFilterStore } from "@/store/filterStore";
import toast from "react-hot-toast";
import { Product } from "@/types";
import SortBottomSheet from "@/components/SortBottomSheet";
import FilterBottomSheet from "@/components/FilterBottomSheet";
import CategoryFilter from "@/components/shop/CategoryFilter";
import { productsAPI, categoriesAPI } from "@/lib/api";

// Category icon mapping
const categoryConfig: { [key: string]: { emoji: string; bgColor: string } } = {
  // Legacy demo categories
  "business-and-marketing": { emoji: "💼", bgColor: "bg-blue-100" },
  "personal-development": { emoji: "🧠", bgColor: "bg-purple-100" },
  "animals-and-pets": { emoji: "🐾", bgColor: "bg-orange-100" },
  "home-and-lifestyle": { emoji: "🏠", bgColor: "bg-green-100" },
  "technology": { emoji: "💻", bgColor: "bg-cyan-100" },
  "society-and-politics": { emoji: "🌍", bgColor: "bg-red-100" },
  // Top-level API categories
  "ebooks": { emoji: "📚", bgColor: "bg-indigo-100" },
  "digital-marketing-business": { emoji: "📱", bgColor: "bg-purple-100" },
  "canva-templates": { emoji: "🎨", bgColor: "bg-cyan-100" },
  "lightroom-presets": { emoji: "📷", bgColor: "bg-amber-100" },
  "ebooks-guides": { emoji: "📖", bgColor: "bg-emerald-100" },
  "stock-media": { emoji: "🎬", bgColor: "bg-red-100" },
  "planners-printables": { emoji: "📅", bgColor: "bg-pink-100" },
  "courses-training": { emoji: "🎓", bgColor: "bg-violet-100" },
  "business-cards-templates": { emoji: "💳", bgColor: "bg-slate-100" },
  "games-educational": { emoji: "🎮", bgColor: "bg-lime-100" },
  // Sub-categories
  "marketing": { emoji: "📣", bgColor: "bg-pink-100" },
  "business": { emoji: "💼", bgColor: "bg-blue-100" },
  "affiliate-marketing": { emoji: "🤝", bgColor: "bg-green-100" },
  "marketing-templates": { emoji: "📝", bgColor: "bg-yellow-100" },
  "business-resources": { emoji: "📊", bgColor: "bg-teal-100" },
  "instagram-templates": { emoji: "📸", bgColor: "bg-pink-100" },
  "business-planners": { emoji: "📅", bgColor: "bg-blue-100" },
  "portrait-presets": { emoji: "🖼️", bgColor: "bg-amber-100" },
  "stock-videos": { emoji: "🎬", bgColor: "bg-red-100" },
  "marketing-courses": { emoji: "🎓", bgColor: "bg-violet-100" },
  "pet-animal-guides": { emoji: "🐕", bgColor: "bg-orange-100" },
  "facebook-templates": { emoji: "👍", bgColor: "bg-blue-100" },
  "business-branding": { emoji: "✨", bgColor: "bg-rose-100" },
  "how-to-guides": { emoji: "📘", bgColor: "bg-sky-100" },
  "nature-landscape-presets": { emoji: "🏞️", bgColor: "bg-green-100" },
  "lifestyle-presets": { emoji: "🌟", bgColor: "bg-yellow-100" },
  "personal-planners": { emoji: "📓", bgColor: "bg-purple-100" },
  "coloring-books": { emoji: "🖍️", bgColor: "bg-pink-100" },
  "icons-graphics": { emoji: "🎯", bgColor: "bg-indigo-100" },
  "mockups": { emoji: "📐", bgColor: "bg-gray-100" },
  "tech-development": { emoji: "💻", bgColor: "bg-cyan-100" },
};

export default function ProductsClient() {
  const router = useRouter();
  const [allProducts, setAllProducts] = useState<Product[]>(demoProducts || []);
  const [products, setProducts] = useState<Product[]>(demoProducts || []);
  const [categories, setCategories] = useState<any[]>(demoCategories || []);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState((demoProducts || []).length);
  const [page, setPage] = useState(1);
  const [isLoadMore, setIsLoadMore] = useState(false); // Track if "Load More" was clicked
  const [isLoadingMore, setIsLoadingMore] = useState(false); // Track loading state for infinite scroll
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);  // Level 1
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);  // Level 2
  const [selectedLevel3, setSelectedLevel3] = useState<string[]>([]);  // Level 3
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
  const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("popular");
  const hasFetched = useRef(false);

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
  const { isFilterOpen, openFilter, closeFilter, setFilterCount } = useFilterStore();

  // View mode state (grid or list)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fetch products from API on mount
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          productsAPI.getAll({ limit: 500 }),
          categoriesAPI.getAll(),
        ]);

        if (productsRes.data?.success && productsRes.data?.data?.products?.length > 0) {
          // Map API products to frontend Product type
          const apiProducts = productsRes.data.data.products.map((p: any) => ({
            ...p,
            // Handle category object from API
            category: typeof p.category === 'object' ? p.category?.slug : p.category,
            categoryName: typeof p.category === 'object' ? p.category?.name : p.category,
            // Ensure required fields have defaults
            license: p.license || 'personal',
            createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
            updatedAt: p.updatedAt ? new Date(p.updatedAt) : new Date(),
          }));
          setAllProducts(apiProducts);
          setProducts(apiProducts);
          setTotal(productsRes.data.data.pagination?.total || apiProducts.length);
        } else {
          // Fallback to demo data
          setAllProducts(demoProducts);
          setProducts(demoProducts);
          setTotal(demoProducts.length);
        }

        if (categoriesRes.data?.success && categoriesRes.data?.data?.categories?.length > 0) {
          setCategories(categoriesRes.data.data.categories);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
        // Fallback to demo data
        setAllProducts(demoProducts);
        setProducts(demoProducts);
        setTotal(demoProducts.length);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just filter locally - can be enhanced to use URL params
    if (searchQuery.trim()) {
      const filtered = allProducts.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setProducts(filtered);
      setTotal(filtered.length);
    } else {
      setProducts(allProducts);
      setTotal(allProducts.length);
    }
  };

  // Filter products based on selected filters
  useEffect(() => {
    let filtered = [...(allProducts || [])];

    // Filter by parent category (using slug)
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => {
        const productCatSlug = product.category;
        // Check if product is in selected category or its subcategory
        const productCategory = categories.find(c => c.slug === productCatSlug);
        if (!productCategory) return selectedCategories.includes(productCatSlug);

        // Check if parent category is selected
        if (productCategory.parentId) {
          const parentCategory = categories.find(c => c.id === productCategory.parentId);
          return parentCategory && selectedCategories.includes(parentCategory.slug);
        }
        return selectedCategories.includes(productCatSlug);
      });
    }

    // Filter by subcategory (Level 2) if any selected
    if (selectedSubcategories.length > 0) {
      filtered = filtered.filter(product =>
        selectedSubcategories.includes(product.category)
      );
    }

    // Filter by Level 3 category if any selected
    if (selectedLevel3.length > 0) {
      filtered = filtered.filter(product =>
        selectedLevel3.includes(product.category)
      );
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(product => {
        const productTags = product.tags || [];
        return selectedTags.some(tag => productTags.includes(tag));
      });
    }

    // Filter by price range
    if (selectedPriceRanges.length > 0) {
      filtered = filtered.filter(product => {
        const price = product.price;
        return selectedPriceRanges.some(range => {
          if (range === "free") return price === 0;
          if (range === "0-2.99") return price > 0 && price <= 2.99;
          if (range === "3-4.99") return price >= 3 && price <= 4.99;
          if (range === "5-6.99") return price >= 5 && price <= 6.99;
          if (range === "7-9.99") return price >= 7 && price <= 9.99;
          if (range === "10+") return price >= 10;
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
          if (r === "3") return rating >= 3 && rating < 4;
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

    // Pagination - for "Load More" on mobile, show all products up to current page
    // For desktop pagination, show only the current page
    const endIndex = page * 12;

    if (isLoadMore) {
      // Mobile "Load More" - show all products from page 1 to current page
      const accumulatedProducts = filtered.slice(0, endIndex);
      setProducts(accumulatedProducts);
    } else {
      // Desktop pagination - show only current page
      const startIndex = (page - 1) * 12;
      const paginatedProducts = filtered.slice(startIndex, endIndex);
      setProducts(paginatedProducts);
    }

    setTotal(filtered.length);
  }, [page, isLoadMore, selectedCategories, selectedSubcategories, selectedLevel3, selectedTags, selectedPriceRanges, selectedRatings, selectedFileTypes, sortBy, allProducts, categories]);

  const toggleCategory = (categorySlug: string) => {
    setSelectedCategories((prev) => {
      const isSelected = prev.includes(categorySlug);
      if (isSelected) {
        // When deselecting a category, also clear its subcategories and level 3
        const category = categories.find(c => c.slug === categorySlug);
        if (category) {
          const subcategorySlugs = categories
            .filter(c => c.parentId === category.id)
            .map(c => c.slug);
          // Clear level 2
          setSelectedSubcategories(prevSub =>
            prevSub.filter(s => !subcategorySlugs.includes(s))
          );
          // Clear level 3 (children of the subcategories)
          const level3Slugs = subcategorySlugs.flatMap(subSlug => {
            const sub = categories.find(c => c.slug === subSlug);
            return sub ? categories.filter(c => c.parentId === sub.id).map(c => c.slug) : [];
          });
          setSelectedLevel3(prevL3 => prevL3.filter(s => !level3Slugs.includes(s)));
        }
        return prev.filter((c) => c !== categorySlug);
      }
      return [...prev, categorySlug];
    });
    setPage(1);
    setIsLoadMore(false);
  };

  const toggleSubcategory = (subcategorySlug: string) => {
    setSelectedSubcategories((prev) => {
      const isSelected = prev.includes(subcategorySlug);
      if (isSelected) {
        // When deselecting a subcategory, also clear its level 3 children
        const subcategory = categories.find(c => c.slug === subcategorySlug);
        if (subcategory) {
          const level3Slugs = categories
            .filter(c => c.parentId === subcategory.id)
            .map(c => c.slug);
          setSelectedLevel3(prevL3 => prevL3.filter(s => !level3Slugs.includes(s)));
        }
        return prev.filter((c) => c !== subcategorySlug);
      }
      return [...prev, subcategorySlug];
    });
    setPage(1);
    setIsLoadMore(false);
  };

  const toggleLevel3 = (level3Slug: string) => {
    setSelectedLevel3((prev) =>
      prev.includes(level3Slug) ? prev.filter((c) => c !== level3Slug) : [...prev, level3Slug]
    );
    setPage(1);
    setIsLoadMore(false);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setPage(1);
    setIsLoadMore(false);
  };

  const togglePriceRange = (range: string) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]
    );
    setPage(1);
    setIsLoadMore(false);
  };

  const toggleRating = (rating: string) => {
    setSelectedRatings((prev) =>
      prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating]
    );
    setPage(1);
    setIsLoadMore(false);
  };

  const toggleFileType = (fileType: string) => {
    setSelectedFileTypes((prev) =>
      prev.includes(fileType) ? prev.filter((f) => f !== fileType) : [...prev, fileType]
    );
    setPage(1);
    setIsLoadMore(false);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    setSelectedLevel3([]);
    setSelectedTags([]);
    setSelectedPriceRanges([]);
    setSelectedRatings([]);
    setSelectedFileTypes([]);
    setPage(1);
    setIsLoadMore(false);
  };

  const clearCategories = () => {
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    setSelectedLevel3([]);
    setPage(1);
    setIsLoadMore(false);
  };

  const hasActiveFilters =
    selectedCategories.length > 0 || selectedSubcategories.length > 0 || selectedLevel3.length > 0 || selectedTags.length > 0 || selectedPriceRanges.length > 0 || selectedRatings.length > 0 || selectedFileTypes.length > 0;

  // Infinite scroll handler
  const loadMoreProducts = useCallback(() => {
    if (isLoadingMore || products.length >= total) return;

    setIsLoadingMore(true);
    setIsLoadMore(true);
    setPage(prev => prev + 1);

    // Simulate loading delay for smooth UX
    setTimeout(() => {
      setIsLoadingMore(false);
    }, 300);
  }, [isLoadingMore, products.length, total]);

  // Intersection Observer for infinite scroll on mobile
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && products.length < total) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [loading, products.length, total, loadMoreProducts]);

  // Update filter count in store for bottom nav badge
  useEffect(() => {
    const count = selectedCategories.length + selectedSubcategories.length + selectedLevel3.length + selectedTags.length + selectedPriceRanges.length + selectedRatings.length + selectedFileTypes.length;
    setFilterCount(count);
  }, [selectedCategories, selectedSubcategories, selectedLevel3, selectedTags, selectedPriceRanges, selectedRatings, selectedFileTypes, setFilterCount]);

  // Compute categories with product counts (only categories that have products)
  const categoriesWithCounts = categories.map(cat => {
    // Count products in this category
    const count = allProducts.filter(p => {
      if (cat.parentId) {
        // This is a subcategory - direct match
        return p.category === cat.slug;
      } else {
        // This is a parent category - count products in this category or its subcategories
        const subcategorySlugs = categories
          .filter(c => c.parentId === cat.id)
          .map(c => c.slug);
        return p.category === cat.slug || subcategorySlugs.includes(p.category);
      }
    }).length;
    return { ...cat, productCount: count };
  });

  // Get available tags based on selected categories (only tags from products in those categories)
  const availableTags = (() => {
    let relevantProducts = allProducts;

    // Filter by selected categories if any
    if (selectedCategories.length > 0) {
      relevantProducts = allProducts.filter(p => {
        const productCategory = categories.find(c => c.slug === p.category);
        if (!productCategory) return selectedCategories.includes(p.category);
        if (productCategory.parentId) {
          const parentCategory = categories.find(c => c.id === productCategory.parentId);
          return parentCategory && selectedCategories.includes(parentCategory.slug);
        }
        return selectedCategories.includes(p.category);
      });
    }

    // Further filter by subcategories if any
    if (selectedSubcategories.length > 0) {
      relevantProducts = relevantProducts.filter(p =>
        selectedSubcategories.includes(p.category)
      );
    }

    // Collect all tags from relevant products
    const tagCounts: { [key: string]: number } = {};
    relevantProducts.forEach(p => {
      (p.tags || []).forEach((tag: string) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    return Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20); // Limit to top 20 tags
  })();

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
            <span className={`text-sm font-bold ${product.price === 0 ? 'text-green-600' : 'text-gray-900'}`}>
              {product.price === 0 ? 'Free' : `$${product.price}`}
            </span>
            {product.originalPrice && product.price > 0 && (
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

        {/* Category Pills - Horizontal Scroll */}
        <div className="bg-white dark:bg-slate-800 py-3 px-4 border-b border-gray-100 dark:border-slate-700">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-2">
              {categories.slice(0, 8).map((category) => {
                const isSelected = selectedCategories.includes(category.slug);
                return (
                  <button
                    key={category.id}
                    onClick={() => toggleCategory(category.slug)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap flex-shrink-0 active:scale-95 transition-all text-sm font-medium ${
                      isSelected
                        ? "bg-gray-900 text-white dark:bg-[#FF6B35]"
                        : "bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-white"
                    }`}
                  >
                    {category.name}
                  </button>
                );
              })}
            </div>
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
              onClick={openFilter}
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
                  {range === "free" && "Free"}
                  {range === "0-2.99" && "$0 - $2.99"}
                  {range === "3-4.99" && "$3 - $4.99"}
                  {range === "5-6.99" && "$5 - $6.99"}
                  {range === "7-9.99" && "$7 - $9.99"}
                  {range === "10+" && "$10+"}
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

        {/* Infinite Scroll Trigger (Mobile) */}
        {!loading && products.length > 0 && products.length < total && (
          <div ref={loadMoreRef} className="px-4 py-6 flex justify-center">
            {isLoadingMore ? (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Loading more...</span>
              </div>
            ) : (
              <button
                onClick={loadMoreProducts}
                className="w-full py-3 border border-gray-300 rounded-full text-sm font-medium text-gray-700 active:bg-gray-50"
              >
                Load more products ({products.length} of {total})
              </button>
            )}
          </div>
        )}

        {/* End of products indicator */}
        {!loading && products.length > 0 && products.length >= total && (
          <div className="px-4 py-6 text-center text-gray-400 text-sm">
            You&apos;ve seen all {total} products
          </div>
        )}
      </div>

      {/* ===== DESKTOP LAYOUT ===== */}
      <div className="hidden lg:block min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-4" />

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">All Products</h1>
            <p className="text-gray-600">
              Browse our collection of {total} premium digital products
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

              {/* Categories - 3-Level Drill-Down */}
              <CategoryFilter
                categories={categoriesWithCounts}
                selectedCategories={selectedCategories}
                selectedSubcategories={selectedSubcategories}
                selectedLevel3={selectedLevel3}
                onToggleCategory={toggleCategory}
                onToggleSubcategory={toggleSubcategory}
                onToggleLevel3={toggleLevel3}
                onClearCategories={clearCategories}
              />

              {/* Tags - Only show when we have available tags */}
              {availableTags.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-sm text-gray-700 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto">
                    {availableTags.slice(0, 10).map((tagItem) => (
                      <button
                        key={tagItem.tag}
                        onClick={() => toggleTag(tagItem.tag)}
                        className={`px-2 py-1 text-xs rounded-full transition-colors ${
                          selectedTags.includes(tagItem.tag)
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {tagItem.tag} ({tagItem.count})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-semibold text-sm text-gray-700 mb-3">Price Range</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedPriceRanges.includes("free")}
                      onChange={() => togglePriceRange("free")}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm">Free</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedPriceRanges.includes("0-2.99")}
                      onChange={() => togglePriceRange("0-2.99")}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm">$0 - $2.99</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedPriceRanges.includes("3-4.99")}
                      onChange={() => togglePriceRange("3-4.99")}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm">$3 - $4.99</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedPriceRanges.includes("5-6.99")}
                      onChange={() => togglePriceRange("5-6.99")}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm">$5 - $6.99</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedPriceRanges.includes("7-9.99")}
                      onChange={() => togglePriceRange("7-9.99")}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm">$7 - $9.99</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedPriceRanges.includes("10+")}
                      onChange={() => togglePriceRange("10+")}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm">$10+</span>
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
                    {range === "free" && "Free"}
                    {range === "0-2.99" && "$0 - $2.99"}
                    {range === "3-4.99" && "$3 - $4.99"}
                    {range === "5-6.99" && "$5 - $6.99"}
                    {range === "7-9.99" && "$7 - $9.99"}
                    {range === "10+" && "$10+"}
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
                    onClick={() => { setIsLoadMore(false); setPage(Math.max(1, page - 1)); }}
                    disabled={page === 1}
                    className="px-4 py-2 border border-gray-200 rounded-lg hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {total > 0 && [...Array(Math.ceil(total / 12))].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setIsLoadMore(false); setPage(i + 1); }}
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
                    onClick={() => { setIsLoadMore(false); setPage(Math.min(Math.ceil(total / 12), page + 1)); }}
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
        onClose={closeFilter}
        categories={categoriesWithCounts}
        selectedCategories={selectedCategories}
        selectedSubcategories={selectedSubcategories}
        selectedPriceRanges={selectedPriceRanges}
        selectedRatings={selectedRatings}
        selectedFileTypes={selectedFileTypes}
        availableTags={availableTags}
        selectedTags={selectedTags}
        onToggleCategory={toggleCategory}
        onToggleSubcategory={toggleSubcategory}
        onTogglePriceRange={togglePriceRange}
        onToggleRating={toggleRating}
        onToggleFileType={toggleFileType}
        onToggleTag={toggleTag}
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
              <span className={`text-2xl font-bold ${product.price === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                {product.price === 0 ? 'Free' : `$${product.price}`}
              </span>
              {product.originalPrice && product.price > 0 && (
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
