"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Package, Eye, EyeOff, Loader2, Star, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { bundlesAPI } from "@/lib/api";
import Image from "next/image";

interface BundleProduct {
  id: string;
  productId: string;
  order: number;
  product: {
    id: string;
    title: string;
    slug: string;
    price: number;
    thumbnailUrl: string;
  };
}

interface Bundle {
  id: string;
  name: string;
  slug: string;
  description?: string;
  bundlePrice: number;
  originalPrice: number;
  discount: number;
  image?: string;
  featured: boolean;
  active: boolean;
  startsAt?: string;
  expiresAt?: string;
  products: BundleProduct[];
  _count?: { products: number };
}

export default function BundlesPage() {
  const pathname = usePathname();
  // Supported languages: English, Portuguese, Arabic, Spanish
  const validLocales = ['en', 'pt', 'ar', 'es'];
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0] || '';
  const basePath = validLocales.includes(firstSegment) ? `/${firstSegment}` : '/en';
  
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchBundles();
  }, []);

  const fetchBundles = async () => {
    try {
      setLoading(true);
      const response = await bundlesAPI.getAllAdmin();
      if (response.data?.success && response.data?.data?.bundles) {
        setBundles(response.data.data.bundles);
      }
    } catch (error) {
      console.error('Failed to fetch bundles:', error);
      toast.error('Failed to load bundles');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bundleId: string, bundleName: string) => {
    if (deleteConfirm === bundleId) {
      try {
        await bundlesAPI.delete(bundleId);
        toast.success(`"${bundleName}" deleted successfully!`);
        fetchBundles();
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || "Failed to delete bundle";
        toast.error(errorMessage);
      }
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(bundleId);
      toast("Click again to confirm delete", { icon: "⚠️" });
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bundles</h1>
          <p className="text-sm text-gray-500 mt-1">Create and manage product bundles with special pricing</p>
        </div>
        <Link
          href={`${basePath}/admin/bundles/new`}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Bundle
        </Link>
      </div>

      {/* Bundles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="mt-2 text-gray-500">Loading bundles...</p>
          </div>
        ) : bundles.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-gray-200">
            <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bundles yet</h3>
            <p className="text-gray-500 mb-4">Create your first bundle to offer special deals</p>
            <Link
              href={`${basePath}/admin/bundles/new`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              <Plus className="w-5 h-5" />
              Create Bundle
            </Link>
          </div>
        ) : bundles.map((bundle) => (
          <div key={bundle.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Bundle Image */}
            <div className="relative h-40 bg-gradient-to-br from-primary/10 to-primary/5">
              {bundle.image ? (
                <Image src={bundle.image} alt={bundle.name} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Package className="w-16 h-16 text-primary/30" />
                </div>
              )}
              {/* Badges */}
              <div className="absolute top-3 left-3 flex gap-2">
                {bundle.featured && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-semibold rounded-full">
                    <Star className="w-3 h-3" /> Featured
                  </span>
                )}
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${bundle.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {bundle.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              {/* Discount Badge */}
              {bundle.discount > 0 && (
                <div className="absolute top-3 right-3 px-2 py-1 bg-red-500 text-white text-sm font-bold rounded-lg">
                  -{bundle.discount}%
                </div>
              )}
            </div>

            {/* Bundle Info */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 text-lg mb-1">{bundle.name}</h3>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">{bundle.description || 'No description'}</p>

              {/* Pricing */}
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-xl font-bold text-primary">{formatPrice(Number(bundle.bundlePrice))}</span>
                {Number(bundle.originalPrice) > Number(bundle.bundlePrice) && (
                  <span className="text-sm text-gray-400 line-through">{formatPrice(Number(bundle.originalPrice))}</span>
                )}
              </div>

              {/* Products Count */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <Package className="w-4 h-4" />
                <span>{bundle.products?.length || bundle._count?.products || 0} products included</span>
              </div>

              {/* Product Thumbnails */}
              {bundle.products && bundle.products.length > 0 && (
                <div className="flex -space-x-2 mb-4">
                  {bundle.products.slice(0, 4).map((bp) => (
                    <div key={bp.id} className="relative w-8 h-8 rounded-lg border-2 border-white overflow-hidden bg-gray-100">
                      {bp.product.thumbnailUrl ? (
                        <Image src={bp.product.thumbnailUrl} alt={bp.product.title} fill className="object-cover" />
                      ) : (
                        <ImageIcon className="w-4 h-4 m-2 text-gray-400" />
                      )}
                    </div>
                  ))}
                  {bundle.products.length > 4 && (
                    <div className="w-8 h-8 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                      +{bundle.products.length - 4}
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <Link
                  href={`${basePath}/admin/bundles/${bundle.id}`}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-primary hover:bg-primary/5 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(bundle.id, bundle.name)}
                  className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    deleteConfirm === bundle.id
                      ? 'bg-red-600 text-white'
                      : 'text-red-600 hover:bg-red-50'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                  {deleteConfirm === bundle.id ? 'Confirm' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      {bundles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Total Bundles</div>
            <div className="text-2xl font-bold text-gray-900">{bundles.length}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Active</div>
            <div className="text-2xl font-bold text-green-600">{bundles.filter(b => b.active).length}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Featured</div>
            <div className="text-2xl font-bold text-yellow-600">{bundles.filter(b => b.featured).length}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Avg. Discount</div>
            <div className="text-2xl font-bold text-primary">
              {bundles.length > 0
                ? Math.round(bundles.reduce((sum, b) => sum + b.discount, 0) / bundles.length)
                : 0}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

