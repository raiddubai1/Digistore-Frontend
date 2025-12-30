"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft, Save, Loader2, Search, X, Package, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { bundlesAPI, productsAPI, uploadAPI } from "@/lib/api";
import Image from "next/image";

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  thumbnailUrl: string;
  status: string;
}

export default function NewBundlePage() {
  const router = useRouter();
  const pathname = usePathname();
  const validLocales = ['en', 'ar', 'es', 'fr', 'de'];
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0] || '';
  const basePath = validLocales.includes(firstSegment) ? `/${firstSegment}` : '';

  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    bundlePrice: '',
    image: '',
    featured: false,
    active: true,
    startsAt: '',
    expiresAt: '',
  });

  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const response = await productsAPI.getAll({ limit: 500 });
      if (response.data?.success && response.data?.data?.products) {
        // Only show approved products
        const approved = response.data.data.products.filter((p: Product) => p.status === 'APPROVED');
        setAllProducts(approved);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to load products');
    } finally {
      setProductsLoading(false);
    }
  };

  const filteredProducts = allProducts.filter(p => 
    !selectedProducts.find(sp => sp.id === p.id) &&
    (p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     p.slug.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const calculateOriginalPrice = () => {
    return selectedProducts.reduce((sum, p) => sum + Number(p.price), 0);
  };

  const calculateDiscount = () => {
    const original = calculateOriginalPrice();
    const bundle = parseFloat(formData.bundlePrice) || 0;
    if (original <= 0 || bundle <= 0) return 0;
    return Math.round(((original - bundle) / original) * 100);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const response = await uploadAPI.uploadImage(file);
      if (response.data?.success && response.data?.data?.url) {
        setFormData(prev => ({ ...prev, image: response.data.data.url }));
        toast.success('Image uploaded!');
      } else {
        toast.error('Upload failed - no URL returned');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const addProduct = (product: Product) => {
    setSelectedProducts(prev => [...prev, product]);
    setSearchQuery('');
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Bundle name is required');
      return;
    }
    if (!formData.bundlePrice || parseFloat(formData.bundlePrice) <= 0) {
      toast.error('Bundle price must be greater than 0');
      return;
    }
    if (selectedProducts.length < 2) {
      toast.error('Select at least 2 products for a bundle');
      return;
    }

    try {
      setLoading(true);
      const response = await bundlesAPI.create({
        name: formData.name,
        description: formData.description || undefined,
        bundlePrice: parseFloat(formData.bundlePrice),
        image: formData.image || undefined,
        featured: formData.featured,
        active: formData.active,
        startsAt: formData.startsAt || undefined,
        expiresAt: formData.expiresAt || undefined,
        productIds: selectedProducts.map(p => p.id),
      });

      if (response.data?.success) {
        toast.success('Bundle created successfully!');
        router.push(`${basePath}/admin/bundles`);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create bundle';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`${basePath}/admin/bundles`} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Bundle</h1>
          <p className="text-sm text-gray-500">Create a new product bundle with special pricing</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Bundle Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bundle Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., Ultimate Canva Templates Pack"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Describe what's included in this bundle..."
                />
              </div>
            </div>
          </div>

          {/* Products Selection */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Products</h2>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Search products to add..."
              />
            </div>

            {/* Search Results */}
            {searchQuery && (
              <div className="mb-4 max-h-60 overflow-y-auto border border-gray-200 rounded-lg divide-y">
                {productsLoading ? (
                  <div className="p-4 text-center text-gray-500">Loading products...</div>
                ) : filteredProducts.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No products found</div>
                ) : filteredProducts.slice(0, 10).map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => addProduct(product)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {product.thumbnailUrl ? (
                        <Image src={product.thumbnailUrl} alt={product.title} fill className="object-cover" />
                      ) : (
                        <Package className="w-5 h-5 m-2.5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{product.title}</div>
                      <div className="text-sm text-gray-500">{formatPrice(Number(product.price))}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Selected Products */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700 mb-2">
                Selected Products ({selectedProducts.length})
              </div>
              {selectedProducts.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                  <Package className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-500">Search and add products above</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-400 w-6">{index + 1}.</span>
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white flex-shrink-0">
                        {product.thumbnailUrl ? (
                          <Image src={product.thumbnailUrl} alt={product.title} fill className="object-cover" />
                        ) : (
                          <Package className="w-5 h-5 m-2.5 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">{product.title}</div>
                        <div className="text-sm text-gray-500">{formatPrice(Number(product.price))}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeProduct(product.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bundle Price *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.bundlePrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, bundlePrice: e.target.value }))}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Original Total:</span>
                  <span className="font-medium">{formatPrice(calculateOriginalPrice())}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Bundle Price:</span>
                  <span className="font-medium text-primary">{formatPrice(parseFloat(formData.bundlePrice) || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Savings:</span>
                  <span className="font-bold text-green-600">{calculateDiscount()}% OFF</span>
                </div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Bundle Image</h2>
            <div className="space-y-3">
              {formData.image ? (
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <Image src={formData.image} alt="Bundle" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                    className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                  {uploadingImage ? (
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Click to upload</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Options */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Options</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                  className="w-5 h-5 text-primary rounded focus:ring-primary"
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  className="w-5 h-5 text-primary rounded focus:ring-primary"
                />
                <span className="text-sm font-medium text-gray-700">Featured</span>
              </label>
            </div>
          </div>

          {/* Validity Period */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Validity Period</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Starts At</label>
                <input
                  type="datetime-local"
                  value={formData.startsAt}
                  onChange={(e) => setFormData(prev => ({ ...prev, startsAt: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expires At</label>
                <input
                  type="datetime-local"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Create Bundle
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

