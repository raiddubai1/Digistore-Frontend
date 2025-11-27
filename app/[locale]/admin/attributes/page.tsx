"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Tag, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  const locale = pathname.split('/')[1] || 'en';

  // Mock data - will be replaced with API calls
  const [attributes, setAttributes] = useState<Attribute[]>([
    {
      id: "1",
      name: "File Format",
      slug: "file-format",
      description: "The format of the digital file",
      type: "SELECT",
      options: ["PDF", "DOCX", "XLSX", "MP4", "MP3", "ZIP"],
      required: true,
      active: true,
      order: 1,
      _count: { productAttributes: 45 },
    },
    {
      id: "2",
      name: "File Size",
      slug: "file-size",
      description: "Size of the file in MB",
      type: "NUMBER",
      options: [],
      required: false,
      active: true,
      order: 2,
      _count: { productAttributes: 38 },
    },
    {
      id: "3",
      name: "Language",
      slug: "language",
      description: "Content language",
      type: "MULTISELECT",
      options: ["English", "Arabic", "Spanish", "French", "German"],
      required: true,
      active: true,
      order: 3,
      _count: { productAttributes: 52 },
    },
    {
      id: "4",
      name: "License Type",
      slug: "license-type",
      description: "Type of usage license",
      type: "SELECT",
      options: ["Personal", "Commercial", "Extended"],
      required: true,
      active: true,
      order: 4,
      _count: { productAttributes: 45 },
    },
    {
      id: "5",
      name: "Includes Source Files",
      slug: "includes-source-files",
      description: "Whether source files are included",
      type: "BOOLEAN",
      options: [],
      required: false,
      active: true,
      order: 5,
      _count: { productAttributes: 28 },
    },
  ]);

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
          href={`/${locale}/admin/attributes/new`}
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
              {attributes.map((attribute) => (
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
                        href={`/${locale}/admin/attributes/${attribute.id}`}
                        className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {attributes.length === 0 && (
          <div className="p-12 text-center">
            <Tag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No attributes found</p>
          </div>
        )}
      </div>
    </div>
  );
}


