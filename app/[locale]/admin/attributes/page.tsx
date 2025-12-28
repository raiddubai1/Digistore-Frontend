"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Tag, CheckCircle, XCircle, Loader2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { attributesAPI } from "@/lib/api";

type AttributeType = "TEXT" | "NUMBER" | "SELECT" | "MULTISELECT" | "COLOR" | "BOOLEAN";

interface Attribute {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  type: AttributeType;
  options: string[];
  required: boolean;
  active: boolean;
  order: number;
  _count?: {
    productAttributes: number;
  };
}

export default function AttributesPage() {
  const pathname = usePathname();
  // Extract locale/basePath from pathname - validate against known locales
  const validLocales = ['en', 'ar', 'es', 'fr', 'de'];
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0] || '';
  const basePath = validLocales.includes(firstSegment) ? `/${firstSegment}` : '';
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAttributes();
  }, []);

  const fetchAttributes = async () => {
    try {
      setLoading(true);
      const response = await attributesAPI.getAll();
      if (response.data?.success && response.data?.data) {
        setAttributes(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch attributes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeleting(true);
      setError(null);
      await attributesAPI.delete(id);
      setAttributes(prev => prev.filter(a => a.id !== id));
      setDeleteId(null);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to delete attribute';
      setError(message);
    } finally {
      setDeleting(false);
    }
  };

  const getTypeColor = (type: AttributeType) => {
    const colors = {
      TEXT: "bg-blue-100 text-blue-700",
      NUMBER: "bg-green-100 text-green-700",
      SELECT: "bg-purple-100 text-purple-700",
      MULTISELECT: "bg-pink-100 text-pink-700",
      COLOR: "bg-orange-100 text-orange-700",
      BOOLEAN: "bg-gray-100 text-gray-700",
    };
    return colors[type] || "bg-gray-100 text-gray-700";
  };

  const totalAttributes = attributes.length;
  const activeAttributes = attributes.filter(a => a.active).length;
  const totalUsage = attributes.reduce((sum, a) => sum + (a._count?.productAttributes || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attributes</h1>
          <p className="text-sm text-gray-500 mt-1">Manage product attributes and specifications</p>
        </div>
        <Link
          href={`${basePath}/admin/attributes/new`}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
        >
          <Plus className="w-4 h-4" />
          Add Attribute
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-sm text-gray-500 mb-1">Total Attributes</div>
          <div className="text-2xl font-bold text-gray-900">{totalAttributes}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-sm text-gray-500 mb-1">Active Attributes</div>
          <div className="text-2xl font-bold text-green-600">{activeAttributes}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-sm text-gray-500 mb-1">Total Usage</div>
          <div className="text-2xl font-bold text-primary">{totalUsage}</div>
        </div>
      </div>

      {/* Attributes Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Attribute
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Options
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                    <p className="mt-2 text-gray-500">Loading attributes...</p>
                  </td>
                </tr>
              ) : attributes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No attributes found. Create your first attribute to get started.
                  </td>
                </tr>
              ) : attributes.map((attribute) => (
                <tr key={attribute.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-gray-900">{attribute.name}</div>
                      <div className="text-sm text-gray-500 font-mono">{attribute.slug}</div>
                      {attribute.description && (
                        <div className="text-xs text-gray-500 mt-1">{attribute.description}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getTypeColor(attribute.type)}`}>
                      {attribute.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {attribute.options.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {attribute.options.slice(0, 3).map((option, idx) => (
                          <span key={idx} className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                            {option}
                          </span>
                        ))}
                        {attribute.options.length > 3 && (
                          <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">
                            +{attribute.options.length - 3} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {attribute._count?.productAttributes || 0} products
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {attribute.active ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        <CheckCircle className="w-3 h-3" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                        <XCircle className="w-3 h-3" />
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{attribute.order}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`${basePath}/admin/attributes/${attribute.id}/edit`}
                        className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      {deleteId === attribute.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(attribute.id)}
                            disabled={deleting}
                            className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                          >
                            {deleting ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Yes'}
                          </button>
                          <button
                            onClick={() => setDeleteId(null)}
                            className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteId(attribute.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto text-red-600 hover:text-red-800">
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}

        {attributes.length === 0 && !loading && (
          <div className="p-12 text-center">
            <Tag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No attributes found</p>
          </div>
        )}
      </div>
    </div>
  );
}


