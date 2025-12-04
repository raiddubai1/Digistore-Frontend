"use client";

import { useState, useEffect, use } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Save, ArrowLeft, Loader2, Upload, X, Plus, Image as ImageIcon, FileDown } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import { productsAPI, categoriesAPI } from "@/lib/api";

interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
}

interface Product {
  id: string;
  title: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  categoryId?: string;
  category?: { id: string; name: string; slug: string } | string;
  subcategory?: string;
  tags?: string[];
  fileType?: string;
  fileSize?: string;
  fileUrl?: string;
  fileName?: string;
  thumbnailUrl?: string;
  previewImages?: string[];
  whatsIncluded?: string[];
  requirements?: string[];
  featured?: boolean;
  bestseller?: boolean;
  newArrival?: boolean;
}

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const pathname = usePathname();
  const validLocales = ['en', 'ar', 'es', 'fr', 'de'];
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0] || '';
  const basePath = validLocales.includes(firstSegment) ? `/${firstSegment}` : '';

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newTag, setNewTag] = useState("");
  const [newIncluded, setNewIncluded] = useState("");
  const [newRequirement, setNewRequirement] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    shortDescription: "",
    price: 0,
    originalPrice: 0,
    categoryId: "",
    subcategory: "",
    tags: [] as string[],
    fileType: "",
    fileUrl: "",
    fileName: "",
    thumbnailUrl: "",
    previewImages: [] as string[],
    whatsIncluded: [] as string[],
    requirements: [] as string[],
    featured: false,
    bestseller: false,
    newArrival: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch categories
        const catResponse = await categoriesAPI.getAll();
        if (catResponse.data?.success) {
          setCategories(catResponse.data.data?.categories || []);
        }

        // Fetch product
        const response = await productsAPI.getById(id);
        if (response.data?.success && response.data?.data) {
          const p = response.data.data.product || response.data.data;
          setProduct(p);
          setFormData({
            title: p.title || "",
            description: p.description || "",
            shortDescription: p.shortDescription || "",
            price: p.price || 0,
            originalPrice: p.originalPrice || 0,
            categoryId: p.categoryId || (typeof p.category === 'object' ? p.category?.id : "") || "",
            subcategory: p.subcategory || "",
            tags: p.tags || [],
            fileType: p.fileType || "",
            fileUrl: p.fileUrl || "",
            fileName: p.fileName || "",
            thumbnailUrl: p.thumbnailUrl || "",
            previewImages: p.previewImages || [],
            whatsIncluded: p.whatsIncluded || [],
            requirements: p.requirements || [],
            featured: p.featured || false,
            bestseller: p.bestseller || false,
            newArrival: p.newArrival || false,
          });
        } else {
          toast.error("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] });
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const addIncluded = () => {
    if (newIncluded.trim()) {
      setFormData({ ...formData, whatsIncluded: [...formData.whatsIncluded, newIncluded.trim()] });
      setNewIncluded("");
    }
  };

  const removeIncluded = (item: string) => {
    setFormData({ ...formData, whatsIncluded: formData.whatsIncluded.filter(i => i !== item) });
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData({ ...formData, requirements: [...formData.requirements, newRequirement.trim()] });
      setNewRequirement("");
    }
  };

  const removeRequirement = (item: string) => {
    setFormData({ ...formData, requirements: formData.requirements.filter(r => r !== item) });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <button
          onClick={() => router.push(`${basePath}/admin/products`)}
          className="text-primary font-semibold hover:text-primary-dark"
        >
          Back to Products
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await productsAPI.update(id, formData);
      toast.success("Product updated successfully!");
      router.push(`${basePath}/admin/products`);
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push(`${basePath}/admin/products`)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Edit Product</h1>
          <p className="text-gray-600">Update product information</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Description
                  </label>
                  <input
                    type="text"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold mb-4">Pricing</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (USD)</label>
                  <input type="number" step="0.01" value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Original Price</label>
                  <input type="number" step="0.01" value={formData.originalPrice || ""}
                    onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary" />
                </div>
              </div>
            </div>

            {/* Product Images */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold mb-4">Product Images</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail URL</label>
                  <input type="text" value={formData.thumbnailUrl}
                    onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="https://..." />
                  {formData.thumbnailUrl && (
                    <div className="mt-2 relative w-32 h-32 rounded-lg overflow-hidden border">
                      <Image src={formData.thumbnailUrl} alt="Thumbnail" fill className="object-cover" />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preview Images (comma-separated URLs)</label>
                  <textarea value={formData.previewImages.join(", ")}
                    onChange={(e) => setFormData({ ...formData, previewImages: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary" rows={2}
                    placeholder="https://img1.jpg, https://img2.jpg" />
                  {formData.previewImages.length > 0 && (
                    <div className="mt-2 flex gap-2 flex-wrap">
                      {formData.previewImages.map((img, i) => (
                        <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border">
                          <Image src={img} alt={`Preview ${i+1}`} fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold mb-4">Tags</h2>
              <div className="flex gap-2 mb-3">
                <input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="Add a tag..." />
                <button type="button" onClick={addTag}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"><Plus className="w-5 h-5" /></button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="text-gray-500 hover:text-red-500"><X className="w-4 h-4" /></button>
                  </span>
                ))}
              </div>
            </div>

            {/* What's Included */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold mb-4">What&apos;s Included</h2>
              <div className="flex gap-2 mb-3">
                <input type="text" value={newIncluded} onChange={(e) => setNewIncluded(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addIncluded())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="Add item..." />
                <button type="button" onClick={addIncluded}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"><Plus className="w-5 h-5" /></button>
              </div>
              <ul className="space-y-2">
                {formData.whatsIncluded.map((item, i) => (
                  <li key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span>{item}</span>
                    <button type="button" onClick={() => removeIncluded(item)} className="text-gray-500 hover:text-red-500"><X className="w-4 h-4" /></button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold mb-4">Requirements</h2>
              <div className="flex gap-2 mb-3">
                <input type="text" value={newRequirement} onChange={(e) => setNewRequirement(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="Add requirement..." />
                <button type="button" onClick={addRequirement}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"><Plus className="w-5 h-5" /></button>
              </div>
              <ul className="space-y-2">
                {formData.requirements.map((item, i) => (
                  <li key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span>{item}</span>
                    <button type="button" onClick={() => removeRequirement(item)} className="text-gray-500 hover:text-red-500"><X className="w-4 h-4" /></button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Category */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold mb-4">Category</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                    <option value="">Select category...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
                  <input type="text" value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="Optional subcategory" />
                </div>
              </div>
            </div>

            {/* Downloadable File */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold mb-4">Downloadable File</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">File URL</label>
                  <input type="text" value={formData.fileUrl}
                    onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="https://cloudinary.com/..." />
                  {formData.fileUrl && (
                    <a href={formData.fileUrl} target="_blank" rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-2 text-primary hover:underline text-sm">
                      <FileDown className="w-4 h-4" /> Test download link
                    </a>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">File Name</label>
                  <input type="text" value={formData.fileName}
                    onChange={(e) => setFormData({ ...formData, fileName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="product-file.pdf" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">File Type</label>
                  <input type="text" value={formData.fileType}
                    onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="pdf, xlsx, zip" />
                </div>
              </div>
            </div>

            {/* Status Flags */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold mb-4">Status</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                  <span className="text-sm">Featured Product</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.bestseller}
                    onChange={(e) => setFormData({ ...formData, bestseller: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                  <span className="text-sm">Bestseller</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.newArrival}
                    onChange={(e) => setFormData({ ...formData, newArrival: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                  <span className="text-sm">New Arrival</span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <button type="submit" disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

