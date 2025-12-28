"use client";

import { useState, useEffect, use } from "react";
import { ArrowLeft, Save, Plus, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { attributesAPI } from "@/lib/api";

type AttributeType = "TEXT" | "NUMBER" | "SELECT" | "MULTISELECT" | "COLOR" | "BOOLEAN";

interface EditAttributePageProps {
  params: Promise<{ id: string }>;
}

export default function EditAttributePage({ params }: EditAttributePageProps) {
  const { id } = use(params);
  const pathname = usePathname();
  const router = useRouter();
  const validLocales = ['en', 'ar', 'es', 'fr', 'de'];
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0] || '';
  const basePath = validLocales.includes(firstSegment) ? `/${firstSegment}` : '';

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    type: "TEXT" as AttributeType,
    options: [] as string[],
    required: false,
    active: true,
    order: 0,
  });

  const [newOption, setNewOption] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchAttribute = async () => {
      try {
        const response = await attributesAPI.getById(id);
        if (response.data?.success && response.data?.data) {
          const attr = response.data.data;
          setFormData({
            name: attr.name || "",
            slug: attr.slug || "",
            description: attr.description || "",
            type: attr.type || "TEXT",
            options: attr.options || [],
            required: attr.required || false,
            active: attr.active !== false,
            order: attr.order || 0,
          });
        } else {
          toast.error("Attribute not found");
          router.push(`${basePath}/admin/attributes`);
        }
      } catch (error) {
        console.error("Failed to fetch attribute:", error);
        toast.error("Failed to load attribute");
        router.push(`${basePath}/admin/attributes`);
      } finally {
        setIsFetching(false);
      }
    };
    fetchAttribute();
  }, [id, basePath, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) {
      toast.error("Please fill in all required fields");
      return;
    }
    const needsOptions = formData.type === "SELECT" || formData.type === "MULTISELECT";
    if (needsOptions && formData.options.length === 0) {
      toast.error("Please add at least one option for this attribute type");
      return;
    }
    setIsLoading(true);
    try {
      const response = await attributesAPI.update(id, formData);
      if (response.data?.success || response.status === 200) {
        toast.success("Attribute updated successfully!");
        router.push(`${basePath}/admin/attributes`);
      } else {
        throw new Error(response.data?.message || 'Failed to update attribute');
      }
    } catch (error: any) {
      console.error('Failed to update attribute:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to update attribute');
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (name: string) => {
    setFormData({ ...formData, name, slug: generateSlug(name) });
  };

  const addOption = () => {
    if (newOption.trim() && !formData.options.includes(newOption.trim())) {
      setFormData({ ...formData, options: [...formData.options, newOption.trim()] });
      setNewOption("");
    }
  };

  const removeOption = (index: number) => {
    setFormData({ ...formData, options: formData.options.filter((_, i) => i !== index) });
  };

  const needsOptions = formData.type === "SELECT" || formData.type === "MULTISELECT";

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`${basePath}/admin/attributes`} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Attribute</h1>
          <p className="text-sm text-gray-500 mt-1">Update attribute: {formData.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Attribute Name *</label>
            <input type="text" value={formData.name} onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., File Format" required />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Slug *</label>
            <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
              placeholder="e.g., file-format" required />
            <p className="text-xs text-gray-500 mt-1">URL-friendly version of the name</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={3} placeholder="Brief description of this attribute" />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Attribute Type *</label>
            <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as AttributeType, options: [] })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" required>
              <option value="TEXT">Text</option>
              <option value="NUMBER">Number</option>
              <option value="SELECT">Select (Single Choice)</option>
              <option value="MULTISELECT">Multi-Select (Multiple Choices)</option>
              <option value="COLOR">Color</option>
              <option value="BOOLEAN">Boolean (Yes/No)</option>
            </select>
          </div>

          {/* Options (for SELECT and MULTISELECT) */}
          {needsOptions && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Options *</label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input type="text" value={newOption} onChange={(e) => setNewOption(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addOption())}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter an option" />
                  <button type="button" onClick={addOption} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {formData.options.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.options.map((option, index) => (
                      <div key={index} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg">
                        <span className="text-sm">{option}</span>
                        <button type="button" onClick={() => removeOption(index)} className="text-gray-500 hover:text-red-600 transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {formData.options.length === 0 && <p className="text-xs text-gray-500">Add at least one option for this attribute type</p>}
              </div>
            </div>
          )}

          {/* Order */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Display Order</label>
            <input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" min="0" />
            <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
          </div>

          {/* Required */}
          <div className="flex items-center gap-3">
            <input type="checkbox" id="required" checked={formData.required} onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" />
            <label htmlFor="required" className="text-sm font-medium text-gray-700">Required (must be filled when adding products)</label>
          </div>

          {/* Active */}
          <div className="flex items-center gap-3">
            <input type="checkbox" id="active" checked={formData.active} onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" />
            <label htmlFor="active" className="text-sm font-medium text-gray-700">Active (visible to vendors when adding products)</label>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button type="submit" disabled={isLoading || (needsOptions && formData.options.length === 0)}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? (<><Loader2 className="w-4 h-4 animate-spin" />Saving...</>) : (<><Save className="w-4 h-4" />Save Changes</>)}
            </button>
            <Link href={`${basePath}/admin/attributes`} className="px-6 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

