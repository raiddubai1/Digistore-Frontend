"use client";

import { useCompareStore } from "@/store/compareStore";
import { useCartStore } from "@/store/cartStore";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, X, ShoppingCart, Star, Download, Check, Minus } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

export default function ComparePage() {
  const { items, removeItem, clearAll } = useCompareStore();
  const { addItem: addToCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const compareFields = [
    { key: "price", label: "Price", render: (p: any) => formatPrice(p.price) },
    { key: "rating", label: "Rating", render: (p: any) => (
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span>{p.rating?.toFixed(1) || "N/A"}</span>
      </div>
    )},
    { key: "downloads", label: "Downloads", render: (p: any) => (
      <div className="flex items-center gap-1">
        <Download className="w-4 h-4 text-gray-400" />
        <span>{p.downloadCount?.toLocaleString() || 0}</span>
      </div>
    )},
    { key: "category", label: "Category", render: (p: any) => p.category?.replace(/-/g, " ") || "N/A" },
    { key: "fileType", label: "File Type", render: (p: any) => p.fileType || "Digital" },
    { key: "fileSize", label: "File Size", render: (p: any) => p.fileSize || "N/A" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-8">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3 lg:py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/products" className="p-1 lg:hidden">
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </Link>
            <h1 className="text-lg lg:text-2xl font-bold">Compare Products</h1>
            <span className="text-sm text-gray-500">({items.length}/4)</span>
          </div>
          {items.length > 0 && (
            <button onClick={clearAll} className="text-sm text-red-500 hover:text-red-700">
              Clear All
            </button>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Minus className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No products to compare</h2>
          <p className="text-gray-500 text-center mb-6">Add products to compare their features side by side</p>
          <Link href="/products" className="px-6 py-3 bg-gray-900 text-white rounded-full font-semibold">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto p-4">
          {/* Product Cards Row */}
          <div className="overflow-x-auto">
            <div className="inline-flex gap-4 min-w-full pb-4" style={{ minWidth: `${items.length * 200 + 100}px` }}>
              {/* Empty column for labels */}
              <div className="w-32 flex-shrink-0" />
              
              {items.map((product) => (
                <div key={product.id} className="w-48 flex-shrink-0 bg-white rounded-xl p-4 shadow-sm relative">
                  <button
                    onClick={() => removeItem(product.id)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <img
                    src={product.thumbnailUrl}
                    alt={product.title}
                    className="w-full aspect-square object-cover rounded-lg mb-3"
                  />
                  <h3 className="font-semibold text-sm line-clamp-2 mb-2">{product.title}</h3>
                  <button
                    onClick={() => { addToCart(product); toast.success("Added to cart!"); }}
                    className="w-full py-2 bg-gray-900 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-1"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto mt-4">
            <table className="w-full" style={{ minWidth: `${items.length * 200 + 100}px` }}>
              <tbody>
                {compareFields.map((field, idx) => (
                  <tr key={field.key} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="w-32 px-4 py-3 font-medium text-gray-700 text-sm">{field.label}</td>
                    {items.map((product) => (
                      <td key={product.id} className="w-48 px-4 py-3 text-sm text-center">
                        {field.render(product)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

