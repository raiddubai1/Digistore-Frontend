"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Save, ArrowLeft, Plus, X, Upload, FileText, Loader2, Sparkles, Wand2, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import ImageUpload from "@/components/ImageUpload";
import Link from "next/link";
import { categoriesAPI, productsAPI, aiAPI, uploadAPI, attributesAPI } from "@/lib/api";

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
  const [imageAltTexts, setImageAltTexts] = useState<string[]>([]);
  const [productFiles, setProductFiles] = useState<File[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [flatCategories, setFlatCategories] = useState<FlatCategory[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const isSubmittingRef = useRef(false); // Prevent duplicate submissions

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
    categoryIds: [] as string[], // Multiple categories (up to 3)
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
    canvaTemplateLink: "", // Legacy: kept for backward compatibility
    canvaTemplateLinks: [] as Array<{ name: string; url: string }>, // Multiple Canva links
    canvaInstructions: "", // Optional: Custom instructions for using the Canva template
    youtubeVideoUrl: "", // Optional: YouTube video URL to display on product page
  });

  // Temporary inputs for arrays
  const [newTag, setNewTag] = useState("");
  const [newIncluded, setNewIncluded] = useState("");
  const [newRequirement, setNewRequirement] = useState("");
  const [newCanvaLink, setNewCanvaLink] = useState({ name: "", url: "" });

  // Suggestions from existing products
  const [suggestions, setSuggestions] = useState<{
    tags: string[];
    whatsIncluded: string[];
    requirements: string[];
  }>({ tags: [], whatsIncluded: [], requirements: [] });
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [showIncludedSuggestions, setShowIncludedSuggestions] = useState(false);
  const [showRequirementSuggestions, setShowRequirementSuggestions] = useState(false);

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
          category: getCategoryName(formData.categoryIds[0] || ''),
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

    const fetchAttributes = async () => {
      try {
        const response = await attributesAPI.getAll();
        if (response.data?.success && response.data?.data) {
          setAttributes(response.data.data);
        } else {
          setAttributes([]);
        }
      } catch (error) {
        console.error('Failed to fetch attributes:', error);
        setAttributes([]);
      }
    };

    const fetchSuggestions = async () => {
      try {
        const response = await productsAPI.getSuggestions();
        if (response.data?.success && response.data?.data) {
          setSuggestions(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
      }
    };

    fetchCategories();
    fetchAttributes();
    fetchSuggestions();
  }, []);

  const handleImageUpload = (files: File[]) => {
    setUploadedImages([...uploadedImages, ...files]);
    // Add empty alt texts for new images
    setImageAltTexts([...imageAltTexts, ...files.map(() => "")]);
  };

  const handleImageRemove = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
    setImageAltTexts(imageAltTexts.filter((_, i) => i !== index));
  };

  const handleAltTextChange = (index: number, altText: string) => {
    const newAltTexts = [...imageAltTexts];
    newAltTexts[index] = altText;
    setImageAltTexts(newAltTexts);
  };

  // Get selected category name for AI generation
  const getSelectedCategoryName = () => {
    const category = flatCategories.find(c => c.id === formData.categoryIds[0]);
    return category?.name || "";
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

  // Array management functions - support comma-separated input
  const addTag = (tagInput?: string) => {
    const input = tagInput || newTag;
    if (!input.trim()) return;
    // Split by comma and add each unique tag
    const newTags = input.split(',').map(t => t.trim()).filter(t => t && !formData.tags.includes(t));
    if (newTags.length > 0) {
      setFormData({ ...formData, tags: [...formData.tags, ...newTags] });
    }
    setNewTag("");
    setShowTagSuggestions(false);
  };

  const removeTag = (index: number) => {
    setFormData({ ...formData, tags: formData.tags.filter((_, i) => i !== index) });
  };

  const addIncluded = (includedInput?: string) => {
    const input = includedInput || newIncluded;
    if (!input.trim()) return;
    // Split by comma and add each unique item
    const newItems = input.split(',').map(t => t.trim()).filter(t => t && !formData.whatsIncluded.includes(t));
    if (newItems.length > 0) {
      setFormData({ ...formData, whatsIncluded: [...formData.whatsIncluded, ...newItems] });
    }
    setNewIncluded("");
    setShowIncludedSuggestions(false);
  };

  const removeIncluded = (index: number) => {
    setFormData({ ...formData, whatsIncluded: formData.whatsIncluded.filter((_, i) => i !== index) });
  };

  const addRequirement = (reqInput?: string) => {
    const input = reqInput || newRequirement;
    if (!input.trim()) return;
    // Split by comma and add each unique requirement
    const newReqs = input.split(',').map(t => t.trim()).filter(t => t && !formData.requirements.includes(t));
    if (newReqs.length > 0) {
      setFormData({ ...formData, requirements: [...formData.requirements, ...newReqs] });
    }
    setNewRequirement("");
    setShowRequirementSuggestions(false);
  };

  const removeRequirement = (index: number) => {
    setFormData({ ...formData, requirements: formData.requirements.filter((_, i) => i !== index) });
  };

  // Filter suggestions based on input
  const filteredTagSuggestions = suggestions.tags.filter(
    t => t.toLowerCase().includes(newTag.toLowerCase()) && !formData.tags.includes(t)
  ).slice(0, 10);

  const filteredIncludedSuggestions = suggestions.whatsIncluded.filter(
    t => t.toLowerCase().includes(newIncluded.toLowerCase()) && !formData.whatsIncluded.includes(t)
  ).slice(0, 10);

  const filteredRequirementSuggestions = suggestions.requirements.filter(
    t => t.toLowerCase().includes(newRequirement.toLowerCase()) && !formData.requirements.includes(t)
  ).slice(0, 10);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent duplicate submissions
    if (isSubmittingRef.current || isLoading) {
      toast.error("Please wait, product is being created...");
      return;
    }

    // Validation
    if (!formData.title || !formData.description || !formData.price || formData.categoryIds.length === 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (uploadedImages.length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }

    // Require either product files OR Canva template links
    const hasCanvaLinks = formData.canvaTemplateLinks.length > 0 || (formData.canvaTemplateLink && formData.canvaTemplateLink.trim() !== "");
    if (productFiles.length === 0 && !hasCanvaLinks) {
      toast.error("Please upload product files OR provide Canva template links");
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

    isSubmittingRef.current = true;
    setIsLoading(true);

    try {
      // Step 1: Upload images to Cloudinary
      setUploadProgress("Uploading images...");
      let imageUrls: string[] = [];
      try {
        const imageResponse = await uploadAPI.uploadImages(uploadedImages);
        if (imageResponse.data?.success && imageResponse.data?.data?.images) {
          imageUrls = imageResponse.data.data.images.map((img: { url: string }) => img.url);
        } else {
          throw new Error('Failed to upload images');
        }
      } catch (imgError: any) {
        console.error('Image upload error:', imgError);
        throw new Error(imgError.response?.data?.message || 'Failed to upload images to cloud storage');
      }

      // Step 2: Upload product files to S3 (skip if Canva-only product)
      let uploadedFileData: Array<{ url: string; key: string; fileName: string; fileSize: number; fileType: string }> = [];
      const isCanvaProduct = formData.canvaTemplateLinks.length > 0 || (formData.canvaTemplateLink && formData.canvaTemplateLink.trim() !== "");

      if (productFiles.length > 0) {
        setUploadProgress("Uploading product files...");
        try {
          const fileResponse = await uploadAPI.uploadProductFiles(productFiles);
          if (fileResponse.data?.success && fileResponse.data?.data?.files) {
            uploadedFileData = fileResponse.data.data.files;
          } else {
            throw new Error('Failed to upload product files');
          }
        } catch (fileError: any) {
          console.error('File upload error:', fileError);
          throw new Error(fileError.response?.data?.message || 'Failed to upload product files to cloud storage');
        }
      }

      // Step 3: Create product with uploaded URLs
      setUploadProgress("Creating product...");
      const primaryFile = uploadedFileData[0];
      const fileTypes = uploadedFileData.length > 0
        ? [...new Set(uploadedFileData.map(f => f.fileType.split('/').pop() || ''))].join(', ')
        : (isCanvaProduct ? 'canva' : 'pdf');
      const fileNames = uploadedFileData.length > 0
        ? uploadedFileData.map(f => f.fileName).join(', ')
        : (isCanvaProduct ? 'Canva Template' : '');

      const productData = {
        title: formData.title,
        description: formData.description,
        shortDescription: formData.shortDescription,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        categoryId: formData.categoryIds[0], // Primary category
        categoryIds: formData.categoryIds, // All selected categories
        subcategory: formData.subcategory || null,
        tags: formData.tags,
        fileType: fileTypes,
        fileName: fileNames || primaryFile?.fileName || 'Canva Template',
        fileUrl: primaryFile?.url || formData.canvaTemplateLink || '',
        thumbnailUrl: imageUrls[0] || 'https://via.placeholder.com/400x300',
        thumbnailAlt: imageAltTexts[0] || formData.title,
        previewImages: imageUrls.slice(1),
        previewImageAlts: imageAltTexts.slice(1),
        whatsIncluded: formData.whatsIncluded,
        requirements: formData.requirements,
        // Canva template fields
        canvaTemplateLink: formData.canvaTemplateLinks.length > 0 ? formData.canvaTemplateLinks[0].url : (formData.canvaTemplateLink || null),
        canvaTemplateLinks: formData.canvaTemplateLinks.length > 0 ? formData.canvaTemplateLinks : null,
        canvaInstructions: formData.canvaInstructions || null,
        // YouTube video
        youtubeVideoUrl: formData.youtubeVideoUrl || null,
        // Include files metadata for multiple files support
        files: uploadedFileData.map((f, idx) => ({
          fileName: f.fileName,
          fileType: f.fileType,
          fileSize: f.fileSize,
          fileUrl: f.url,
          order: idx,
        })),
      };

      const response = await productsAPI.create(productData);
      console.log('Create product response:', response);

      // Handle different response structures
      if (response.data?.success || response.status === 201 || response.status === 200) {
        // Get the created product ID
        const createdProductId = response.data?.data?.product?.id;

        // Save attributes if any were selected
        if (createdProductId) {
          const attributesToSave = Object.entries(selectedAttributes)
            .filter(([_, value]) => value)
            .map(([attributeId, value]) => ({ attributeId, value }));

          if (attributesToSave.length > 0) {
            try {
              await attributesAPI.setProductAttributes(createdProductId, attributesToSave);
            } catch (attrError) {
              console.error('Failed to save attributes:', attrError);
              // Don't fail the whole creation, just log the error
            }
          }
        }

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
      isSubmittingRef.current = false;
      setIsLoading(false);
      setUploadProgress(null);
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
                onAltTextChange={handleAltTextChange}
                maxFiles={5}
                maxSizeMB={5}
                showAltText={true}
                productTitle={formData.title}
                productCategory={getSelectedCategoryName()}
              />
              <p className="text-xs text-gray-500 mt-2">Upload up to 5 images. First image will be the thumbnail. Alt text helps with SEO.</p>
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
                  <span className="text-sm text-green-600 font-medium">{productFiles.length} file(s) selected ✓</span>
                )}
              </div>
              <div className="space-y-4">
                <label
                  htmlFor="product-file"
                  className={`block border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                    productFiles.length > 0
                      ? "border-green-400 bg-green-50 hover:border-green-500 hover:bg-green-100"
                      : "border-gray-300 hover:border-primary hover:bg-primary/5"
                  } active:scale-[0.98] active:border-primary active:bg-primary/10`}
                >
                  <input
                    type="file"
                    id="product-file"
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.mp4,.mp3,.psd,.ai,.rar"
                    multiple
                  />
                  <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${
                    productFiles.length > 0 ? "bg-green-100" : "bg-gray-100"
                  }`}>
                    {productFiles.length > 0 ? (
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    ) : (
                      <Upload className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <p className="text-sm font-semibold mb-1">
                    {productFiles.length > 0 ? (
                      <span className="text-green-700">Files selected - Click to add more</span>
                    ) : (
                      <span className="text-gray-700">Click to upload product files</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF, DOCX, XLSX, ZIP, RAR, MP4, MP3, PSD, AI (Max 100MB each)
                  </p>
                  <p className="text-xs text-primary mt-1">
                    You can select multiple files
                  </p>
                </label>
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

            {/* Canva Template (Alternative Delivery) */}
            <div className="bg-gradient-to-br from-[#00C4CC]/5 to-[#7B2FF7]/5 rounded-2xl p-6 shadow-sm border border-[#00C4CC]/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#00C4CC] to-[#7B2FF7] rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Canva Templates (Optional)</h2>
                  <p className="text-xs text-gray-500">Add multiple Canva links for products with multiple templates</p>
                </div>
              </div>
              <div className="space-y-4">
                {/* Add new Canva link */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 block">
                    Add Canva Template Link
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCanvaLink.name}
                      onChange={(e) => setNewCanvaLink({ ...newCanvaLink, name: e.target.value })}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00C4CC] focus:border-transparent"
                      placeholder="Link name (e.g., Instagram Post)"
                    />
                    <input
                      type="url"
                      value={newCanvaLink.url}
                      onChange={(e) => setNewCanvaLink({ ...newCanvaLink, url: e.target.value })}
                      className="flex-[2] px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00C4CC] focus:border-transparent"
                      placeholder="https://www.canva.com/design/..."
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newCanvaLink.name.trim() && newCanvaLink.url.trim()) {
                          setFormData({
                            ...formData,
                            canvaTemplateLinks: [...formData.canvaTemplateLinks, { name: newCanvaLink.name.trim(), url: newCanvaLink.url.trim() }]
                          });
                          setNewCanvaLink({ name: "", url: "" });
                        }
                      }}
                      className="px-4 py-2.5 bg-gradient-to-r from-[#00C4CC] to-[#7B2FF7] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                    >
                      Add
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Add multiple Canva template links. Each link can have a name to help buyers identify which template to use.
                  </p>
                </div>

                {/* List of added Canva links */}
                {formData.canvaTemplateLinks.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 block">
                      Added Templates ({formData.canvaTemplateLinks.length})
                    </label>
                    {formData.canvaTemplateLinks.map((link, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-white border border-[#00C4CC]/30 rounded-lg">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#00C4CC] to-[#7B2FF7] rounded-lg flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{link.name}</p>
                          <p className="text-xs text-gray-500 truncate">{link.url}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              canvaTemplateLinks: formData.canvaTemplateLinks.filter((_, i) => i !== index)
                            });
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Instructions */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Instructions (Optional)
                  </label>
                  <textarea
                    value={formData.canvaInstructions}
                    onChange={(e) => setFormData({ ...formData, canvaInstructions: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00C4CC] focus:border-transparent resize-none"
                    placeholder="1. Click the Canva link after purchase&#10;2. Log in to your Canva account&#10;3. Click 'Use Template'&#10;4. Edit and customize as needed&#10;5. Download or share your design"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Custom instructions shown to buyers on how to use the Canva templates.
                  </p>
                </div>

                {formData.canvaTemplateLinks.length > 0 && (
                  <div className="flex items-center gap-2 p-3 bg-[#00C4CC]/10 border border-[#00C4CC]/20 rounded-lg">
                    <svg className="w-5 h-5 text-[#00C4CC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-[#00C4CC] font-medium">
                      This product includes {formData.canvaTemplateLinks.length} Canva template{formData.canvaTemplateLinks.length > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* YouTube Video */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">YouTube Video (Optional)</h2>
                  <p className="text-xs text-gray-500">Add a product video to showcase on the product page</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  YouTube Video URL
                </label>
                <input
                  type="url"
                  value={formData.youtubeVideoUrl}
                  onChange={(e) => setFormData({ ...formData, youtubeVideoUrl: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Paste a YouTube video link. The video will be embedded on the product page.
                </p>
                {formData.youtubeVideoUrl && (
                  <div className="mt-3 flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-lg">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-red-700 font-medium">
                      Video will be displayed on the product page
                    </span>
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
                <div className="relative">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => { setNewTag(e.target.value); setShowTagSuggestions(true); }}
                      onFocus={() => setShowTagSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowTagSuggestions(false), 200)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Add tags (comma-separated)"
                    />
                    <button type="button" onClick={() => addTag()} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {showTagSuggestions && filteredTagSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {filteredTagSuggestions.map((tag, idx) => (
                        <button key={idx} type="button" onClick={() => addTag(tag)} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors">
                          {tag}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <div key={index} className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg">
                        <span className="text-sm font-medium">{tag}</span>
                        <button type="button" onClick={() => removeTag(index)} className="text-primary hover:text-primary/70 transition-colors">
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
                <div className="relative">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newIncluded}
                      onChange={(e) => { setNewIncluded(e.target.value); setShowIncludedSuggestions(true); }}
                      onFocus={() => setShowIncludedSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowIncludedSuggestions(false), 200)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIncluded())}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., PDF eBook (comma-separated)"
                    />
                    <button type="button" onClick={() => addIncluded()} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {showIncludedSuggestions && filteredIncludedSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {filteredIncludedSuggestions.map((item, idx) => (
                        <button key={idx} type="button" onClick={() => addIncluded(item)} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors">
                          {item}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {formData.whatsIncluded.length > 0 && (
                  <ul className="space-y-2">
                    {formData.whatsIncluded.map((item, index) => (
                      <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">✓ {item}</span>
                        <button type="button" onClick={() => removeIncluded(index)} className="text-red-600 hover:text-red-700">
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
                <div className="relative">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newRequirement}
                      onChange={(e) => { setNewRequirement(e.target.value); setShowRequirementSuggestions(true); }}
                      onFocus={() => setShowRequirementSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowRequirementSuggestions(false), 200)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., PDF Reader (comma-separated)"
                    />
                    <button type="button" onClick={() => addRequirement()} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {showRequirementSuggestions && filteredRequirementSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {filteredRequirementSuggestions.map((item, idx) => (
                        <button key={idx} type="button" onClick={() => addRequirement(item)} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors">
                          {item}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {formData.requirements.length > 0 && (
                  <ul className="space-y-2">
                    {formData.requirements.map((item, index) => (
                      <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">• {item}</span>
                        <button type="button" onClick={() => removeRequirement(index)} className="text-red-600 hover:text-red-700">
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
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories * <span className="text-sm font-normal text-gray-500">(up to 3)</span></h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Categories
                  </label>
                  {/* Selected categories display */}
                  {formData.categoryIds.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.categoryIds.map((catId, index) => {
                        const cat = flatCategories.find(c => c.id === catId);
                        return (
                          <span
                            key={catId}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm"
                          >
                            {index === 0 && <span className="text-xs bg-primary text-white px-1.5 py-0.5 rounded mr-1">Primary</span>}
                            {cat?.name || catId}
                            <button
                              type="button"
                              onClick={() => setFormData({
                                ...formData,
                                categoryIds: formData.categoryIds.filter(id => id !== catId)
                              })}
                              className="ml-1 text-primary hover:text-primary/70"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}
                  {/* Category selector */}
                  {formData.categoryIds.length < 3 && (
                    <select
                      value=""
                      onChange={(e) => {
                        if (e.target.value && !formData.categoryIds.includes(e.target.value)) {
                          setFormData({
                            ...formData,
                            categoryIds: [...formData.categoryIds, e.target.value]
                          });
                        }
                      }}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                    >
                      <option value="">{formData.categoryIds.length === 0 ? 'Select a category' : 'Add another category...'}</option>
                      {flatCategories
                        .filter(cat => !formData.categoryIds.includes(cat.id))
                        .map((cat) => (
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
                  )}
                  {formData.categoryIds.length === 0 && (
                    <p className="text-xs text-red-500 mt-1">At least one category is required</p>
                  )}
                  {formData.categoryIds.length === 3 && (
                    <p className="text-xs text-gray-500 mt-1">Maximum 3 categories reached</p>
                  )}
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
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {uploadProgress || "Processing..."}
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Create Product
                  </>
                )}
              </button>
              {isLoading && uploadProgress && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {uploadProgress.includes("images") && (
                      <span className="flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Uploading to Cloudinary...
                      </span>
                    )}
                    {uploadProgress.includes("files") && (
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        Images uploaded
                      </span>
                    )}
                    {uploadProgress.includes("Creating") && (
                      <>
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        Files uploaded
                      </>
                    )}
                  </div>
                </div>
              )}
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

