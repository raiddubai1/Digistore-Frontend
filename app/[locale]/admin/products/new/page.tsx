"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Save, ArrowLeft, Plus, X, Upload, FileText, Loader2, Sparkles, Wand2 } from "lucide-react";
import toast from "react-hot-toast";
import ImageUpload from "@/components/ImageUpload";
import Link from "next/link";
import { categoriesAPI, productsAPI, aiAPI } from "@/lib/api";

interface Attribute {
  id: string;
  name: string;
  slug: string;
  type: string;
  options: string[];
  required: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  children?: Category[];
}

interface FlatCategory {
  id: string;
  name: string;
  level: number;
  displayName: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const pathname = usePathname();
  // Extract locale/basePath from pathname
  const validLocales = ['en', 'ar', 'es', 'fr', 'de'];
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0] || '';
  const basePath = validLocales.includes(firstSegment) ? `/${firstSegment}` : '';

  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [productFiles, setProductFiles] = useState<File[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [flatCategories, setFlatCategories] = useState<FlatCategory[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Build category tree from flat list
  const buildCategoryTree = (cats: Category[]): Category[] => {
    const catMap = new Map<string, Category & { children: Category[] }>();
    const roots: Category[] = [];

    // First pass: create map with children arrays
    cats.forEach(cat => {
      catMap.set(cat.id, { ...cat, children: [] });
    });

    // Second pass: build tree structure
    cats.forEach(cat => {
      const node = catMap.get(cat.id)!;
      if (cat.parentId && catMap.has(cat.parentId)) {
        catMap.get(cat.parentId)!.children.push(node);
      } else if (!cat.parentId) {
        roots.push(node);
      }
    });

    // If no roots found, it means all items have parentId - find orphans
    if (roots.length === 0) {
      cats.forEach(cat => {
        if (cat.parentId && !catMap.has(cat.parentId)) {
          roots.push(catMap.get(cat.id)!);
        }
      });
    }

    return roots;
  };

  // Flatten categories with hierarchy indicators
  const flattenCategories = (cats: Category[]): FlatCategory[] => {
    // First build the tree from flat list
    const tree = buildCategoryTree(cats);

    // Then flatten with proper indentation
    const flattenTree = (nodes: Category[], level: number = 0): FlatCategory[] => {
      const result: FlatCategory[] = [];
      for (const cat of nodes) {
        const prefix = level === 0 ? '' : level === 1 ? '└─ ' : '    └─ ';
        const displayName = level === 0 ? cat.name : `${prefix}${cat.name}`;
        result.push({
          id: cat.id,
          name: cat.name,
          level,
          displayName,
        });
        if (cat.children && cat.children.length > 0) {
          result.push(...flattenTree(cat.children, level + 1));
        }
      }
      return result;
    };

    return flattenTree(tree);
  };

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    shortDescription: "",
    price: "",
    originalPrice: "",
    categoryId: "",
    subcategory: "",
    tags: [] as string[],
    fileType: "",
    fileName: "",
    whatsIncluded: [] as string[],
    requirements: [] as string[],
    featured: false,
    bestseller: false,
    newArrival: true,
    status: "DRAFT" as "DRAFT" | "PENDING" | "APPROVED" | "REJECTED",
  });

  // Temporary inputs for arrays
  const [newTag, setNewTag] = useState("");
  const [newIncluded, setNewIncluded] = useState("");
  const [newRequirement, setNewRequirement] = useState("");

  // AI generation state
  const [aiGenerating, setAiGenerating] = useState<string | null>(null);

  // Get category name by ID
  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || '';
  };

  // AI content generation
  const generateWithAI = async (type: 'title' | 'shortDescription' | 'description' | 'tags' | 'all') => {
    try {
      setAiGenerating(type);
      const response = await aiAPI.generateContent({
        type,
        context: {
          fileName: formData.fileName || productFiles[0]?.name,
          category: getCategoryName(formData.categoryId),
          existingTitle: formData.title,
          existingDescription: formData.description,
        },
      });

      if (response.data?.success && response.data?.data) {
        const data = response.data.data;
        if (type === 'all') {
          setFormData(prev => ({
            ...prev,
            title: data.title || prev.title,
            shortDescription: data.shortDescription || prev.shortDescription,
            description: data.description || prev.description,
            tags: data.tags || prev.tags,
          }));
          toast.success('All fields generated with AI!');
        } else if (type === 'title' && data.title) {
          setFormData(prev => ({ ...prev, title: data.title }));
          toast.success('Title generated!');
        } else if (type === 'shortDescription' && data.shortDescription) {
          setFormData(prev => ({ ...prev, shortDescription: data.shortDescription }));
          toast.success('Short description generated!');
        } else if (type === 'description' && data.description) {
          setFormData(prev => ({ ...prev, description: data.description }));
          toast.success('Description generated!');
        } else if (type === 'tags' && data.tags) {
          setFormData(prev => ({ ...prev, tags: data.tags }));
          toast.success('Tags generated!');
        }
      }
    } catch (error: any) {
      console.error('AI generation failed:', error);
      toast.error(error.response?.data?.message || 'AI generation failed');
    } finally {
      setAiGenerating(null);
    }
  };

  // Load categories and attributes on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const response = await categoriesAPI.getAll();
        let cats: Category[] = [];
        if (response.data?.success && response.data?.data?.categories) {
          cats = response.data.data.categories;
        } else if (response.data?.data) {
          // Handle different response formats
          cats = Array.isArray(response.data.data) ? response.data.data : [];
        }
        setCategories(cats);
        setFlatCategories(flattenCategories(cats));
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        // Fallback to empty - categories should be created via WooCommerce import
        setCategories([]);
        setFlatCategories([]);
        toast.error('Failed to load categories. Please try again.');
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();

    // Default attributes - could also be fetched from API
    setAttributes([
      { id: "1", name: "File Format", slug: "file-format", type: "SELECT", options: ["PDF", "DOCX", "XLSX", "MP4", "ZIP"], required: true },
      { id: "2", name: "Language", slug: "language", type: "MULTISELECT", options: ["English", "Arabic", "Spanish", "French"], required: true },
      { id: "3", name: "License Type", slug: "license-type", type: "SELECT", options: ["Personal", "Commercial"], required: false },
    ]);
  }, []);

  const handleImageUpload = (files: File[]) => {
    setUploadedImages([...uploadedImages, ...files]);
  };

  const handleImageRemove = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setProductFiles(prev => [...prev, ...newFiles]);
      // Update formData with first file info for backward compatibility
      if (productFiles.length === 0 && newFiles.length > 0) {
        setFormData({
          ...formData,
          fileName: newFiles[0].name,
          fileType: newFiles[0].name.split('.').pop() || '',
        });
      }
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const handleFileRemove = (index: number) => {
    setProductFiles(prev => {
      const updated = prev.filter((_, i) => i !== index);
      // Update formData with new first file info
      if (updated.length > 0) {
        setFormData({
          ...formData,
          fileName: updated[0].name,
          fileType: updated[0].name.split('.').pop() || '',
        });
      } else {
        setFormData({
          ...formData,
          fileName: '',
          fileType: '',
        });
      }
      return updated;
    });
  };

  // Array management functions
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] });
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    setFormData({ ...formData, tags: formData.tags.filter((_, i) => i !== index) });
  };

  const addIncluded = () => {
    if (newIncluded.trim()) {
      setFormData({ ...formData, whatsIncluded: [...formData.whatsIncluded, newIncluded.trim()] });
      setNewIncluded("");
    }
  };

  const removeIncluded = (index: number) => {
    setFormData({ ...formData, whatsIncluded: formData.whatsIncluded.filter((_, i) => i !== index) });
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData({ ...formData, requirements: [...formData.requirements, newRequirement.trim()] });
      setNewRequirement("");
    }
  };

  const removeRequirement = (index: number) => {
    setFormData({ ...formData, requirements: formData.requirements.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title || !formData.description || !formData.price || !formData.categoryId) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (uploadedImages.length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }

    if (productFiles.length === 0) {
      toast.error("Please upload at least one product file");
      return;
    }

    // Check required attributes
    const missingAttributes = attributes
      .filter(attr => attr.required && !selectedAttributes[attr.id])
      .map(attr => attr.name);

    if (missingAttributes.length > 0) {
      toast.error(`Please fill in required attributes: ${missingAttributes.join(', ')}`);
      return;
    }

    setIsLoading(true);

    try {
      // For now, use placeholder URLs for files
      // In production, you would first upload files to cloud storage (S3, Cloudinary, etc.)
      // and get back the URLs
      const thumbnailUrl = uploadedImages[0]
        ? URL.createObjectURL(uploadedImages[0])
        : 'https://via.placeholder.com/400x300';

      // Build file info from all product files
      const primaryFile = productFiles[0];
      const fileTypes = [...new Set(productFiles.map(f => f.name.split('.').pop() || ''))].join(', ');
      const fileNames = productFiles.map(f => f.name).join(', ');

      const productData = {
        title: formData.title,
        description: formData.description,
        shortDescription: formData.shortDescription,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        categoryId: formData.categoryId,
        subcategory: formData.subcategory || null,
        tags: formData.tags,
        fileType: fileTypes || primaryFile.name.split('.').pop() || 'pdf',
        fileName: fileNames || primaryFile.name,
        fileUrl: 'pending-upload', // Placeholder - would be real URL after upload
        thumbnailUrl: thumbnailUrl,
        previewImages: [],
        whatsIncluded: formData.whatsIncluded,
        requirements: formData.requirements,
        // Include files metadata for multiple files support
        files: productFiles.map((f, idx) => ({
          fileName: f.name,
          fileType: f.name.split('.').pop() || '',
          fileSize: f.size,
          order: idx,
        })),
      };

      const response = await productsAPI.create(productData);

      if (response.data?.success) {
        toast.success("Product created successfully!");
        router.push(`${basePath}/admin/products`);
      } else {
        throw new Error(response.data?.message || 'Failed to create product');
      }
    } catch (error: any) {
      console.error('Failed to create product:', error);
      const message = error.response?.data?.message || error.message || 'Failed to create product';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`${basePath}/admin/products`}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-sm text-gray-500">Create a new digital product</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Images */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Images *</h2>
              <ImageUpload
                onUpload={handleImageUpload}
                onRemove={handleImageRemove}
                maxFiles={5}
                maxSizeMB={5}
              />
              <p className="text-xs text-gray-500 mt-2">Upload up to 5 images. First image will be the thumbnail.</p>
            </div>

            {/* Basic Information */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
                <button
                  type="button"
                  onClick={() => generateWithAI('all')}
                  disabled={aiGenerating !== null}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
                >
                  {aiGenerating === 'all' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Wand2 className="w-4 h-4" />
                  )}
                  Generate All
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Product Title <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => generateWithAI('title')}
                      disabled={aiGenerating !== null}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-purple-600 hover:bg-purple-50 rounded transition-colors disabled:opacity-50"
                    >
                      {aiGenerating === 'title' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      AI
                    </button>
                  </div>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., The Complete Guide to Digital Marketing"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Short Description
                    </label>
                    <button
                      type="button"
                      onClick={() => generateWithAI('shortDescription')}
                      disabled={aiGenerating !== null}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-purple-600 hover:bg-purple-50 rounded transition-colors disabled:opacity-50"
                    >
                      {aiGenerating === 'shortDescription' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      AI
                    </button>
                  </div>
                  <input
                    type="text"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Brief one-line description (max 160 characters)"
                    maxLength={160}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Full Description <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => generateWithAI('description')}
                      disabled={aiGenerating !== null}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-purple-600 hover:bg-purple-50 rounded transition-colors disabled:opacity-50"
                    >
                      {aiGenerating === 'description' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      AI
                    </button>
                  </div>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={8}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Detailed product description..."
                    required
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price (USD) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Original Price (Optional)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Show discount if higher than price</p>
                </div>
              </div>
            </div>

            {/* Product Files Upload */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Product Files *</h2>
                {productFiles.length > 0 && (
                  <span className="text-sm text-gray-500">{productFiles.length} file(s) selected</span>
                )}
              </div>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                  <input
                    type="file"
                    id="product-file"
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.mp4,.mp3,.psd,.ai,.rar"
                    multiple
                  />
                  <label htmlFor="product-file" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      Click to upload product files
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF, DOCX, XLSX, ZIP, RAR, MP4, MP3, PSD, AI (Max 100MB each)
                    </p>
                    <p className="text-xs text-primary mt-1">
                      You can select multiple files
                    </p>
                  </label>
                </div>
                {productFiles.length > 0 && (
                  <div className="space-y-2">
                    {productFiles.map((file, index) => (
                      <div key={`${file.name}-${index}`} className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <FileText className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-green-900 truncate">{file.name}</p>
                          <p className="text-xs text-green-600">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleFileRemove(index)}
                          className="text-red-600 hover:text-red-700 flex-shrink-0"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Tags</h2>
                <button
                  type="button"
                  onClick={() => generateWithAI('tags')}
                  disabled={aiGenerating !== null}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-purple-600 hover:bg-purple-50 rounded transition-colors disabled:opacity-50"
                >
                  {aiGenerating === 'tags' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  Generate Tags
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Add a tag (press Enter)"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg"
                      >
                        <span className="text-sm font-medium">{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="text-primary hover:text-primary/70 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-500">Add keywords to help customers find your product</p>
              </div>
            </div>

            {/* What's Included */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">What's Included</h2>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newIncluded}
                    onChange={(e) => setNewIncluded(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIncluded())}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., PDF eBook (press Enter)"
                  />
                  <button
                    type="button"
                    onClick={addIncluded}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {formData.whatsIncluded.length > 0 && (
                  <ul className="space-y-2">
                    {formData.whatsIncluded.map((item, index) => (
                      <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">✓ {item}</span>
                        <button
                          type="button"
                          onClick={() => removeIncluded(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="text-xs text-gray-500">List what customers will receive with this product</p>
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h2>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., PDF Reader (press Enter)"
                  />
                  <button
                    type="button"
                    onClick={addRequirement}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {formData.requirements.length > 0 && (
                  <ul className="space-y-2">
                    {formData.requirements.map((item, index) => (
                      <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">• {item}</span>
                        <button
                          type="button"
                          onClick={() => removeRequirement(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="text-xs text-gray-500">List any software or tools needed to use this product</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Category */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Category *</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                    required
                  >
                    <option value="">Select a category</option>
                    {flatCategories.map((cat) => (
                      <option
                        key={cat.id}
                        value={cat.id}
                        className={cat.level === 0 ? 'font-bold' : ''}
                        style={{ paddingLeft: cat.level * 12 }}
                      >
                        {cat.displayName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Attributes */}
            {attributes.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Attributes</h2>
                <div className="space-y-4">
                  {attributes.map((attr) => (
                    <div key={attr.id}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {attr.name} {attr.required && <span className="text-red-500">*</span>}
                      </label>
                      {attr.type === "SELECT" && (
                        <select
                          value={selectedAttributes[attr.id] || ""}
                          onChange={(e) => setSelectedAttributes({ ...selectedAttributes, [attr.id]: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          required={attr.required}
                        >
                          <option value="">Select {attr.name}</option>
                          {attr.options.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      )}
                      {attr.type === "MULTISELECT" && (
                        <select
                          multiple
                          value={selectedAttributes[attr.id]?.split(',') || []}
                          onChange={(e) => {
                            const values = Array.from(e.target.selectedOptions, option => option.value);
                            setSelectedAttributes({ ...selectedAttributes, [attr.id]: values.join(',') });
                          }}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          required={attr.required}
                          size={Math.min(attr.options.length, 4)}
                        >
                          {attr.options.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      )}
                      {attr.type === "TEXT" && (
                        <input
                          type="text"
                          value={selectedAttributes[attr.id] || ""}
                          onChange={(e) => setSelectedAttributes({ ...selectedAttributes, [attr.id]: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          required={attr.required}
                        />
                      )}
                      {attr.type === "NUMBER" && (
                        <input
                          type="number"
                          value={selectedAttributes[attr.id] || ""}
                          onChange={(e) => setSelectedAttributes({ ...selectedAttributes, [attr.id]: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          required={attr.required}
                        />
                      )}
                      {attr.type === "BOOLEAN" && (
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedAttributes[attr.id] === "true"}
                            onChange={(e) => setSelectedAttributes({ ...selectedAttributes, [attr.id]: e.target.checked ? "true" : "false" })}
                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                          />
                          <span className="text-sm text-gray-600">Yes</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Product Status */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Status</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">Featured Product</span>
                    <p className="text-xs text-gray-500">Show on homepage</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.bestseller}
                    onChange={(e) => setFormData({ ...formData, bestseller: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">Bestseller</span>
                    <p className="text-xs text-gray-500">Mark as bestseller</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.newArrival}
                    onChange={(e) => setFormData({ ...formData, newArrival: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">New Arrival</span>
                    <p className="text-xs text-gray-500">Show as new product</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                <Save className="w-5 h-5" />
                Create Product
              </button>
              <p className="text-xs text-gray-500 text-center mt-3">
                Product will be saved as {formData.status}
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

