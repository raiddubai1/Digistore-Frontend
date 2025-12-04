"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Globe,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ExternalLink,
  RefreshCw,
  TrendingUp,
  Eye,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Facebook,
  Twitter,
} from "lucide-react";
import { productsAPI } from "@/lib/api";
import toast from "react-hot-toast";

interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  thumbnailUrl: string;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
}

interface SEOScore {
  overall: number;
  title: { score: number; message: string; status: "good" | "warning" | "error" };
  description: { score: number; message: string; status: "good" | "warning" | "error" };
  keyword: { score: number; message: string; status: "good" | "warning" | "error" };
  image: { score: number; message: string; status: "good" | "warning" | "error" };
}

// SEO Analysis functions
function analyzeSEO(product: Product): SEOScore {
  const title = product.metaTitle || product.title;
  const description = product.metaDescription || product.shortDescription || product.description?.substring(0, 160);
  const keyword = product.focusKeyword || product.tags?.[0] || "";

  type ScoreStatus = "good" | "warning" | "error";
  type ScoreItem = { score: number; message: string; status: ScoreStatus };

  // Title analysis (optimal: 50-60 chars)
  let titleScore: ScoreItem;
  if (!title) {
    titleScore = { score: 0, message: "Missing title", status: "error" };
  } else if (title.length < 30) {
    titleScore = { score: 50, message: `Title too short (${title.length}/50-60 chars)`, status: "warning" };
  } else if (title.length > 60) {
    titleScore = { score: 70, message: `Title too long (${title.length}/60 chars max)`, status: "warning" };
  } else {
    titleScore = { score: 100, message: `Good length (${title.length} chars)`, status: "good" };
  }

  // Description analysis (optimal: 150-160 chars)
  let descScore: ScoreItem;
  if (!description) {
    descScore = { score: 0, message: "Missing meta description", status: "error" };
  } else if (description.length < 120) {
    descScore = { score: 50, message: `Description too short (${description.length}/150-160 chars)`, status: "warning" };
  } else if (description.length > 160) {
    descScore = { score: 70, message: `Description too long (${description.length}/160 chars max)`, status: "warning" };
  } else {
    descScore = { score: 100, message: `Good length (${description.length} chars)`, status: "good" };
  }

  // Keyword analysis
  let keywordScore: ScoreItem;
  if (!keyword) {
    keywordScore = { score: 0, message: "No focus keyword set", status: "error" };
  } else {
    const titleHasKeyword = title?.toLowerCase().includes(keyword.toLowerCase());
    const descHasKeyword = description?.toLowerCase().includes(keyword.toLowerCase());
    if (titleHasKeyword && descHasKeyword) {
      keywordScore = { score: 100, message: "Keyword in title & description", status: "good" };
    } else if (titleHasKeyword || descHasKeyword) {
      keywordScore = { score: 70, message: "Keyword in " + (titleHasKeyword ? "title" : "description") + " only", status: "warning" };
    } else {
      keywordScore = { score: 30, message: "Keyword not found in title or description", status: "error" };
    }
  }

  // Image analysis
  let imageScore: ScoreItem;
  if (!product.thumbnailUrl) {
    imageScore = { score: 0, message: "No featured image", status: "error" };
  } else {
    imageScore = { score: 100, message: "Featured image set", status: "good" };
  }

  const overall = Math.round((titleScore.score + descScore.score + keywordScore.score + imageScore.score) / 4);

  return {
    overall,
    title: titleScore,
    description: descScore,
    keyword: keywordScore,
    image: imageScore,
  };
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-600";
  if (score >= 50) return "text-yellow-600";
  return "text-red-600";
}

function getScoreBg(score: number): string {
  if (score >= 80) return "bg-green-100";
  if (score >= 50) return "bg-yellow-100";
  return "bg-red-100";
}

function StatusIcon({ status }: { status: "good" | "warning" | "error" }) {
  if (status === "good") return <CheckCircle className="w-4 h-4 text-green-600" />;
  if (status === "warning") return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
  return <XCircle className="w-4 h-4 text-red-600" />;
}

export default function SEODashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [seoData, setSeoData] = useState({ metaTitle: "", metaDescription: "", focusKeyword: "" });
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<"all" | "good" | "needs-improvement" | "poor">("all");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll({ limit: 100 });
      if (response.data?.success) {
        setProducts(response.data.data.products || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSEO = async () => {
    if (!selectedProduct) return;
    setSaving(true);
    try {
      const response = await productsAPI.update(selectedProduct.id, seoData);
      if (response.data?.success) {
        toast.success("SEO data saved successfully!");
        setProducts(products.map(p =>
          p.id === selectedProduct.id ? { ...p, ...seoData } : p
        ));
        setSelectedProduct({ ...selectedProduct, ...seoData });
        setEditMode(false);
      } else {
        toast.error("Failed to save SEO data");
      }
    } catch (error) {
      toast.error("Error saving SEO data");
    } finally {
      setSaving(false);
    }
  };

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
    setSeoData({
      metaTitle: product.metaTitle || product.title,
      metaDescription: product.metaDescription || product.shortDescription || product.description?.substring(0, 160) || "",
      focusKeyword: product.focusKeyword || product.tags?.[0] || "",
    });
    setEditMode(false);
  };

  // Filter and search products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === "all") return true;

    const score = analyzeSEO(p).overall;
    if (filter === "good") return score >= 80;
    if (filter === "needs-improvement") return score >= 50 && score < 80;
    if (filter === "poor") return score < 50;
    return true;
  });

  // Calculate overall stats
  const stats = {
    total: products.length,
    good: products.filter(p => analyzeSEO(p).overall >= 80).length,
    needsWork: products.filter(p => analyzeSEO(p).overall >= 50 && analyzeSEO(p).overall < 80).length,
    poor: products.filter(p => analyzeSEO(p).overall < 50).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SEO Dashboard</h1>
          <p className="text-gray-600">Optimize your products for search engines</p>
        </div>
        <button
          onClick={fetchProducts}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-xl font-bold">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Good SEO</p>
              <p className="text-xl font-bold text-green-600">{stats.good}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Needs Work</p>
              <p className="text-xl font-bold text-yellow-600">{stats.needsWork}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Poor SEO</p>
              <p className="text-xl font-bold text-red-600">{stats.poor}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Products</option>
          <option value="good">Good SEO (80+)</option>
          <option value="needs-improvement">Needs Work (50-79)</option>
          <option value="poor">Poor SEO (&lt;50)</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Products List */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold">Products ({filteredProducts.length})</h2>
          </div>
          <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
            {filteredProducts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                {products.length === 0 ? "No products found" : "No products match your search"}
              </div>
            ) : (
              filteredProducts.map((product) => {
                const seoScore = analyzeSEO(product);
                return (
                  <button
                    key={product.id}
                    onClick={() => openProduct(product)}
                    className={`w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left ${
                      selectedProduct?.id === product.id ? "bg-primary/5 border-l-4 border-primary" : ""
                    }`}
                  >
                    <img
                      src={product.thumbnailUrl || "/placeholder.png"}
                      alt={product.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{product.title}</h3>
                      <p className="text-sm text-gray-500 truncate">/{product.slug}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBg(seoScore.overall)} ${getScoreColor(seoScore.overall)}`}>
                      {seoScore.overall}%
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* SEO Editor Panel */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {selectedProduct ? (
            <>
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="font-semibold">SEO Analysis</h2>
                <div className="flex items-center gap-2">
                  {!editMode ? (
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Edit SEO
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditMode(false)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveSEO}
                        disabled={saving}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                      >
                        {saving ? "Saving..." : "Save"}
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="p-4 space-y-6 max-h-[550px] overflow-y-auto">
                {/* Overall Score */}
                <div className="text-center py-4">
                  <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getScoreBg(analyzeSEO(selectedProduct).overall)}`}>
                    <span className={`text-3xl font-bold ${getScoreColor(analyzeSEO(selectedProduct).overall)}`}>
                      {analyzeSEO(selectedProduct).overall}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-600">Overall SEO Score</p>
                </div>

                {/* SEO Fields */}
                {editMode ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Meta Title ({seoData.metaTitle.length}/60)
                      </label>
                      <input
                        type="text"
                        value={seoData.metaTitle}
                        onChange={(e) => setSeoData({ ...seoData, metaTitle: e.target.value })}
                        maxLength={70}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      />
                      <p className="text-xs text-gray-500 mt-1">Optimal: 50-60 characters</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Meta Description ({seoData.metaDescription.length}/160)
                      </label>
                      <textarea
                        value={seoData.metaDescription}
                        onChange={(e) => setSeoData({ ...seoData, metaDescription: e.target.value })}
                        maxLength={170}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      />
                      <p className="text-xs text-gray-500 mt-1">Optimal: 150-160 characters</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Focus Keyword</label>
                      <input
                        type="text"
                        value={seoData.focusKeyword}
                        onChange={(e) => setSeoData({ ...seoData, focusKeyword: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                        placeholder="e.g., digital marketing ebook"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Score Breakdown */}
                    <div className="space-y-3">
                      {Object.entries(analyzeSEO(selectedProduct)).map(([key, value]) => {
                        if (key === "overall") return null;
                        const item = value as { score: number; message: string; status: "good" | "warning" | "error" };
                        return (
                          <div key={key} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <StatusIcon status={item.status} />
                            <div className="flex-1">
                              <p className="font-medium capitalize">{key}</p>
                              <p className="text-sm text-gray-600">{item.message}</p>
                            </div>
                            <span className={`text-sm font-medium ${getScoreColor(item.score)}`}>{item.score}%</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Google Preview */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <Globe className="w-4 h-4" /> Google Preview
                      </h3>
                      <div className="p-4 bg-gray-50 rounded-lg border">
                        <p className="text-blue-600 text-lg hover:underline cursor-pointer truncate">
                          {selectedProduct.metaTitle || selectedProduct.title}
                        </p>
                        <p className="text-green-700 text-sm">
                          digistore1.vercel.app/products/{selectedProduct.slug}
                        </p>
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                          {selectedProduct.metaDescription || selectedProduct.shortDescription || selectedProduct.description?.substring(0, 160)}
                        </p>
                      </div>
                    </div>

                    {/* Social Preview */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <Facebook className="w-4 h-4" /> Social Preview
                      </h3>
                      <div className="border rounded-lg overflow-hidden">
                        <img
                          src={selectedProduct.thumbnailUrl || "/placeholder.png"}
                          alt={selectedProduct.title}
                          className="w-full h-40 object-cover"
                        />
                        <div className="p-3 bg-gray-100">
                          <p className="text-xs text-gray-500 uppercase">digistore1.vercel.app</p>
                          <p className="font-semibold text-gray-900 truncate">
                            {selectedProduct.metaTitle || selectedProduct.title}
                          </p>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {selectedProduct.metaDescription || selectedProduct.shortDescription}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px] text-gray-500">
              <Search className="w-12 h-12 mb-4 text-gray-300" />
              <p>Select a product to view SEO analysis</p>
            </div>
          )}
        </div>
      </div>

      {/* SEO Tips */}
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          SEO Best Practices
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Title Tags</h3>
            <p className="text-sm text-gray-600">Keep titles between 50-60 characters. Include your focus keyword near the beginning.</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Meta Descriptions</h3>
            <p className="text-sm text-gray-600">Write compelling descriptions of 150-160 characters. Include a call-to-action.</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Focus Keywords</h3>
            <p className="text-sm text-gray-600">Use one primary keyword per page. Include it in title, description, and content.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

