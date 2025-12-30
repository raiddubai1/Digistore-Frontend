"use client";

import { useState, useEffect, use, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Save, ArrowLeft, Loader2, Upload, X, Plus, Image as ImageIcon, FileDown, Trash2, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import { productsAPI, categoriesAPI, attributesAPI, uploadAPI } from "@/lib/api";

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

interface Attribute {
  id: string;
  name: string;
  slug: string;
  type: string;
  options: string[];
  required: boolean;
}

interface ProductAttribute {
  attributeId: string;
  value: string;
  attribute: Attribute;
}

interface ProductFile {
  id?: string;
  fileName: string;
  fileUrl: string;
  fileSize?: number;
  fileType: string;
  order?: number;
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
  categoryIds?: string[];
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
  hotDeal?: boolean;
  files?: ProductFile[];
  canvaTemplateLink?: string;
  canvaTemplateLinks?: Array<{ name: string; url: string }>;
  canvaInstructions?: string;
  youtubeVideoUrl?: string;
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
  const [flatCategories, setFlatCategories] = useState<FlatCategory[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [newTag, setNewTag] = useState("");
  const [newIncluded, setNewIncluded] = useState("");
  const [newRequirement, setNewRequirement] = useState("");

  // Suggestions from existing products
  const [suggestions, setSuggestions] = useState<{
    tags: string[];
    whatsIncluded: string[];
    requirements: string[];
  }>({ tags: [], whatsIncluded: [], requirements: [] });
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [showIncludedSuggestions, setShowIncludedSuggestions] = useState(false);
  const [showRequirementSuggestions, setShowRequirementSuggestions] = useState(false);
  const [productFiles, setProductFiles] = useState<ProductFile[]>([]);
  const [newFileUrl, setNewFileUrl] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const [newFileType, setNewFileType] = useState("");

  // New file upload states
  const [newFilesToUpload, setNewFilesToUpload] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Image upload states
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImagesToUpload, setNewImagesToUpload] = useState<File[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

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
    price: 0,
    originalPrice: 0,
    categoryIds: [] as string[], // Multiple categories (up to 3)
    subcategory: "",
    tags: [] as string[],
    fileType: "",
    fileUrl: "",
    fileName: "",
    thumbnailUrl: "",
    previewImages: [] as string[],
    whatsIncluded: [] as string[],
    requirements: [] as string[],
    canvaTemplateLink: "",
    canvaTemplateLinks: [] as Array<{ name: string; url: string }>,
    canvaInstructions: "",
    youtubeVideoUrl: "",
    featured: false,
    bestseller: false,
    newArrival: false,
    hotDeal: false,
  });

  const [newCanvaLink, setNewCanvaLink] = useState({ name: "", url: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch categories
        const catResponse = await categoriesAPI.getAll();
        if (catResponse.data?.success) {
          const cats = catResponse.data.data?.categories || [];
          setCategories(cats);
          setFlatCategories(flattenCategories(cats));
        }

        // Fetch attributes
        const attrResponse = await attributesAPI.getAll();
        if (attrResponse.data?.success) {
          setAttributes(attrResponse.data.data || []);
        }

        // Fetch product
        const response = await productsAPI.getById(id);
        if (response.data?.success && response.data?.data) {
          const p = response.data.data.product || response.data.data;
          setProduct(p);
          // Build categoryIds from existing data
          const primaryCatId = p.categoryId || (typeof p.category === 'object' ? p.category?.id : "") || "";
          const existingCategoryIds = p.categoryIds && p.categoryIds.length > 0
            ? p.categoryIds
            : (primaryCatId ? [primaryCatId] : []);
          setFormData({
            title: p.title || "",
            description: p.description || "",
            shortDescription: p.shortDescription || "",
            price: p.price || 0,
            originalPrice: p.originalPrice || 0,
            categoryIds: existingCategoryIds,
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
            hotDeal: p.hotDeal || false,
            canvaTemplateLink: p.canvaTemplateLink || "",
            canvaTemplateLinks: (p.canvaTemplateLinks as Array<{ name: string; url: string }>) || [],
            canvaInstructions: p.canvaInstructions || "",
            youtubeVideoUrl: p.youtubeVideoUrl || "",
          });

          // Initialize product files from product data or legacy single file
          if (p.files && p.files.length > 0) {
            setProductFiles(p.files);
          } else if (p.fileUrl) {
            // Convert legacy single file to array format
            setProductFiles([{
              fileName: p.fileName || 'Product File',
              fileUrl: p.fileUrl,
              fileType: p.fileType || '',
              order: 0,
            }]);
          }

          // Initialize existing images
          const allImages: string[] = [];
          if (p.thumbnailUrl) allImages.push(p.thumbnailUrl);
          if (p.previewImages && p.previewImages.length > 0) {
            allImages.push(...p.previewImages);
          }
          setExistingImages(allImages);

          // Fetch product's current attributes
          const prodAttrResponse = await attributesAPI.getProductAttributes(p.id);
          if (prodAttrResponse.data?.success && prodAttrResponse.data?.data) {
            const attrMap: Record<string, string> = {};
            prodAttrResponse.data.data.forEach((pa: ProductAttribute) => {
              attrMap[pa.attributeId] = pa.value;
            });
            setSelectedAttributes(attrMap);
          }
        } else {
          toast.error("Product not found");
        }

        // Fetch suggestions
        const suggestionsResponse = await productsAPI.getSuggestions();
        if (suggestionsResponse.data?.success && suggestionsResponse.data?.data) {
          setSuggestions(suggestionsResponse.data.data);
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

  // Array management functions - support comma-separated input
  const addTag = (tagInput?: string) => {
    const input = tagInput || newTag;
    if (!input.trim()) return;
    const newTags = input.split(',').map(t => t.trim()).filter(t => t && !formData.tags.includes(t));
    if (newTags.length > 0) {
      setFormData({ ...formData, tags: [...formData.tags, ...newTags] });
    }
    setNewTag("");
    setShowTagSuggestions(false);
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const addIncluded = (includedInput?: string) => {
    const input = includedInput || newIncluded;
    if (!input.trim()) return;
    const newItems = input.split(',').map(t => t.trim()).filter(t => t && !formData.whatsIncluded.includes(t));
    if (newItems.length > 0) {
      setFormData({ ...formData, whatsIncluded: [...formData.whatsIncluded, ...newItems] });
    }
    setNewIncluded("");
    setShowIncludedSuggestions(false);
  };

  const removeIncluded = (item: string) => {
    setFormData({ ...formData, whatsIncluded: formData.whatsIncluded.filter(i => i !== item) });
  };

  const addRequirement = (reqInput?: string) => {
    const input = reqInput || newRequirement;
    if (!input.trim()) return;
    const newReqs = input.split(',').map(t => t.trim()).filter(t => t && !formData.requirements.includes(t));
    if (newReqs.length > 0) {
      setFormData({ ...formData, requirements: [...formData.requirements, ...newReqs] });
    }
    setNewRequirement("");
    setShowRequirementSuggestions(false);
  };

  const removeRequirement = (item: string) => {
    setFormData({ ...formData, requirements: formData.requirements.filter(r => r !== item) });
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

  const addProductFile = () => {
    if (newFileUrl.trim() && newFileName.trim()) {
      const newFile: ProductFile = {
        fileName: newFileName.trim(),
        fileUrl: newFileUrl.trim(),
        fileType: newFileType.trim() || newFileName.split('.').pop() || '',
        order: productFiles.length,
      };
      setProductFiles([...productFiles, newFile]);
      setNewFileUrl("");
      setNewFileName("");
      setNewFileType("");
    }
  };

  const removeProductFile = (index: number) => {
    setProductFiles(productFiles.filter((_, i) => i !== index));
  };

  // New image upload functions
  const handleImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
      if (newFiles.length !== files.length) {
        toast.error('Only image files are allowed');
      }
      setNewImagesToUpload(prev => [...prev, ...newFiles]);
    }
    e.target.value = '';
  };

  const removeNewImage = (index: number) => {
    setNewImagesToUpload(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  // New file upload functions
  const handleProductFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setNewFilesToUpload(prev => [...prev, ...Array.from(files)]);
    }
    e.target.value = '';
  };

  const removeNewFile = (index: number) => {
    setNewFilesToUpload(prev => prev.filter((_, i) => i !== index));
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

      // Step 1: Upload new images if any
      let allImageUrls = [...existingImages];
      if (newImagesToUpload.length > 0) {
        setUploadingImages(true);
        try {
          const imageResponse = await uploadAPI.uploadImages(newImagesToUpload);
          if (imageResponse.data?.success && imageResponse.data?.data?.images) {
            const newUrls = imageResponse.data.data.images.map((img: { url: string }) => img.url);
            allImageUrls = [...allImageUrls, ...newUrls];
          }
        } catch (imgError: any) {
          toast.error(imgError.response?.data?.message || 'Failed to upload new images');
          setSaving(false);
          setUploadingImages(false);
          return;
        }
        setUploadingImages(false);
      }

      // Step 2: Upload new files if any
      let allFiles = [...productFiles];
      if (newFilesToUpload.length > 0) {
        setUploadingFiles(true);
        try {
          const fileResponse = await uploadAPI.uploadProductFiles(newFilesToUpload);
          if (fileResponse.data?.success && fileResponse.data?.data?.files) {
            const newFiles = fileResponse.data.data.files.map((f: any, idx: number) => ({
              fileName: f.fileName,
              fileUrl: f.url,
              fileType: f.fileType?.split('/').pop() || '',
              fileSize: f.fileSize,
              order: allFiles.length + idx,
            }));
            allFiles = [...allFiles, ...newFiles];
          }
        } catch (fileError: any) {
          toast.error(fileError.response?.data?.message || 'Failed to upload new files');
          setSaving(false);
          setUploadingFiles(false);
          return;
        }
        setUploadingFiles(false);
      }

      // Build file info from all files
      const primaryFile = allFiles[0];
      const fileTypes = [...new Set(allFiles.map(f => f.fileType).filter(Boolean))].join(', ');
      const fileNames = allFiles.map(f => f.fileName).filter(Boolean).join(', ');

      // Build clean update payload - only include fields that have values
      const updatedFormData: Record<string, any> = {
        title: formData.title,
        description: formData.description,
        shortDescription: formData.shortDescription || null,
        price: formData.price,
        originalPrice: formData.originalPrice || null,
        categoryId: formData.categoryIds[0], // Primary category
        categoryIds: formData.categoryIds, // All selected categories
        subcategory: formData.subcategory || null,
        tags: formData.tags || [],
        featured: formData.featured || false,
        bestseller: formData.bestseller || false,
        newArrival: formData.newArrival || false,
        hotDeal: formData.hotDeal || false,
        whatsIncluded: formData.whatsIncluded || [],
        requirements: formData.requirements || [],
        // Canva template fields
        canvaTemplateLink: formData.canvaTemplateLinks.length > 0 ? formData.canvaTemplateLinks[0].url : (formData.canvaTemplateLink || null),
        canvaTemplateLinks: formData.canvaTemplateLinks.length > 0 ? formData.canvaTemplateLinks : null,
        canvaInstructions: formData.canvaInstructions || null,
        // YouTube video
        youtubeVideoUrl: formData.youtubeVideoUrl || null,
        // Images
        thumbnailUrl: allImageUrls[0] || formData.thumbnailUrl,
        previewImages: allImageUrls.length > 1 ? allImageUrls.slice(1) : (formData.previewImages || []),
      };

      // Only include file fields if we have files
      if (allFiles.length > 0) {
        updatedFormData.fileUrl = primaryFile?.fileUrl;
        updatedFormData.fileName = fileNames || primaryFile?.fileName;
        updatedFormData.fileType = fileTypes || primaryFile?.fileType;
        updatedFormData.files = allFiles.map((f, idx) => ({
          fileName: f.fileName,
          fileUrl: f.fileUrl,
          fileType: f.fileType || '',
          fileSize: f.fileSize || null,
          order: idx,
        }));
      }

      console.log('Updating product with:', updatedFormData);
      await productsAPI.update(id, updatedFormData);

      // Save attributes
      const attributesToSave = Object.entries(selectedAttributes)
        .filter(([_, value]) => value)
        .map(([attributeId, value]) => ({ attributeId, value }));

      if (attributesToSave.length > 0) {
        await attributesAPI.setProductAttributes(id, attributesToSave);
      }

      toast.success("Product updated successfully!");
      router.push(`${basePath}/admin/products`);
    } catch (error: any) {
      console.error("Error updating product:", error);
      toast.error(error.response?.data?.message || "Failed to update product");
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
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Product Images</h2>
                <span className="text-sm text-gray-500">
                  {existingImages.length + newImagesToUpload.length} image(s)
                </span>
              </div>

              {/* Upload new images button */}
              <div className="mb-4">
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageFileSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg w-full hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <Upload className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">Click to upload new images</span>
                </button>
              </div>

              {/* Existing images */}
              {existingImages.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Images</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {existingImages.map((img, index) => (
                      <div key={`existing-${index}`} className="relative group">
                        <div className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                          <Image src={img} alt={`Image ${index + 1}`} fill className="object-cover" />
                          {index === 0 && (
                            <div className="absolute bottom-1 left-1 px-2 py-0.5 bg-primary text-white text-xs font-semibold rounded">
                              Main
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New images to upload */}
              {newImagesToUpload.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Images to Upload <span className="text-green-600">({newImagesToUpload.length} pending)</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {newImagesToUpload.map((file, index) => (
                      <div key={`new-${index}`} className="relative group">
                        <div className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-green-400 bg-green-50">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-green-600 text-white text-xs truncate">
                            {file.name}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-500 mt-3">
                First image will be the main thumbnail. Hover over images to delete.
              </p>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold mb-4">Tags</h2>
              <div className="relative mb-3">
                <div className="flex gap-2">
                  <input type="text" value={newTag}
                    onChange={(e) => { setNewTag(e.target.value); setShowTagSuggestions(true); }}
                    onFocus={() => setShowTagSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowTagSuggestions(false), 200)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="Add tags (comma-separated)" />
                  <button type="button" onClick={() => addTag()}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"><Plus className="w-5 h-5" /></button>
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
              <div className="relative mb-3">
                <div className="flex gap-2">
                  <input type="text" value={newIncluded}
                    onChange={(e) => { setNewIncluded(e.target.value); setShowIncludedSuggestions(true); }}
                    onFocus={() => setShowIncludedSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowIncludedSuggestions(false), 200)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addIncluded())}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="Add items (comma-separated)" />
                  <button type="button" onClick={() => addIncluded()}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"><Plus className="w-5 h-5" /></button>
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
              <div className="relative mb-3">
                <div className="flex gap-2">
                  <input type="text" value={newRequirement}
                    onChange={(e) => { setNewRequirement(e.target.value); setShowRequirementSuggestions(true); }}
                    onFocus={() => setShowRequirementSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowRequirementSuggestions(false), 200)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="Add requirements (comma-separated)" />
                  <button type="button" onClick={() => addRequirement()}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"><Plus className="w-5 h-5" /></button>
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
              <h2 className="text-lg font-bold mb-4">Categories <span className="text-sm font-normal text-gray-500">(up to 3)</span></h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Categories</label>
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary font-mono text-sm"
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

            {/* Downloadable Files */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Downloadable Files</h2>
                <span className="text-sm text-gray-500">
                  {productFiles.length + newFilesToUpload.length} file(s)
                </span>
              </div>
              <div className="space-y-4">
                {/* Upload new files button */}
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.mp4,.mp3,.psd,.ai,.rar"
                    onChange={handleProductFileSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg w-full hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    <Upload className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">Click to upload new files</span>
                  </button>
                  <p className="text-xs text-gray-500 mt-1">PDF, DOCX, XLSX, ZIP, RAR, MP4, MP3, PSD, AI</p>
                </div>

                {/* Existing files list */}
                {productFiles.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Files</label>
                    <div className="space-y-2">
                      {productFiles.map((file, index) => (
                        <div key={`existing-${index}`} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg group">
                          <FileDown className="w-5 h-5 text-gray-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{file.fileName}</p>
                            <a href={file.fileUrl} target="_blank" rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline truncate block">
                              View file ↗
                            </a>
                          </div>
                          <span className="text-xs text-gray-500 uppercase bg-gray-200 px-2 py-1 rounded">{file.fileType}</span>
                          <button
                            type="button"
                            onClick={() => removeProductFile(index)}
                            className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove file"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New files to upload */}
                {newFilesToUpload.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Files to Upload <span className="text-green-600">({newFilesToUpload.length} pending)</span>
                    </label>
                    <div className="space-y-2">
                      {newFilesToUpload.map((file, index) => (
                        <div key={`new-${index}`} className="flex items-center gap-3 p-3 bg-green-50 border border-green-300 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-green-900 truncate">{file.name}</p>
                            <p className="text-xs text-green-600">
                              {(file.size / 1024 / 1024).toFixed(2)} MB • Ready to upload
                            </p>
                          </div>
                          <span className="text-xs text-green-700 uppercase bg-green-200 px-2 py-1 rounded">
                            {file.name.split('.').pop()}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeNewFile(index)}
                            className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg"
                            title="Remove file"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Legacy single file fields (hidden but kept for backward compatibility) */}
                <input type="hidden" value={formData.fileUrl} />
                <input type="hidden" value={formData.fileName} />
                <input type="hidden" value={formData.fileType} />
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

            {/* Attributes */}
            {attributes.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold mb-4">Product Attributes</h2>
                <div className="space-y-4">
                  {attributes.map((attr) => (
                    <div key={attr.id}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {attr.name} {attr.required && <span className="text-red-500">*</span>}
                      </label>
                      {attr.type === "SELECT" && (
                        <select value={selectedAttributes[attr.id] || ""}
                          onChange={(e) => setSelectedAttributes({ ...selectedAttributes, [attr.id]: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                          <option value="">Select {attr.name}</option>
                          {attr.options?.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      )}
                      {attr.type === "MULTISELECT" && (
                        <select multiple value={selectedAttributes[attr.id]?.split(',') || []}
                          onChange={(e) => {
                            const values = Array.from(e.target.selectedOptions, option => option.value);
                            setSelectedAttributes({ ...selectedAttributes, [attr.id]: values.join(',') });
                          }}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                          size={Math.min(attr.options?.length || 4, 4)}>
                          {attr.options?.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      )}
                      {(attr.type === "TEXT" || !attr.type) && (
                        <input type="text" value={selectedAttributes[attr.id] || ""}
                          onChange={(e) => setSelectedAttributes({ ...selectedAttributes, [attr.id]: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary" />
                      )}
                      {attr.type === "NUMBER" && (
                        <input type="number" value={selectedAttributes[attr.id] || ""}
                          onChange={(e) => setSelectedAttributes({ ...selectedAttributes, [attr.id]: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.hotDeal}
                    onChange={(e) => setFormData({ ...formData, hotDeal: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                  <span className="text-sm">🔥 Hot Deal</span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <button type="submit" disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {saving
                  ? uploadingImages
                    ? "Uploading images..."
                    : uploadingFiles
                      ? "Uploading files..."
                      : "Saving..."
                  : "Save Changes"}
              </button>
              {(newImagesToUpload.length > 0 || newFilesToUpload.length > 0) && (
                <p className="text-xs text-center text-gray-500 mt-2">
                  {newImagesToUpload.length > 0 && `${newImagesToUpload.length} new image(s)`}
                  {newImagesToUpload.length > 0 && newFilesToUpload.length > 0 && ' and '}
                  {newFilesToUpload.length > 0 && `${newFilesToUpload.length} new file(s)`}
                  {' '}will be uploaded
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

