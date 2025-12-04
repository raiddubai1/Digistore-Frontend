"use client";

import { useState, useEffect } from "react";
import { Plus, X, Tag, Loader2, Search, Edit2, Trash2, Check } from "lucide-react";
import { usePathname } from "next/navigation";
import { productsAPI } from "@/lib/api";

interface TagData {
  name: string;
  count: number;
}

export default function TagsPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const [tags, setTags] = useState<TagData[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTag, setNewTag] = useState("");
  const [adding, setAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      // Fetch all products to extract tags
      const response = await productsAPI.getAll({ limit: 1000 });
      if (response.data?.success && response.data?.data?.products) {
        const tagCounts: Record<string, number> = {};
        response.data.data.products.forEach((product: any) => {
          (product.tags || []).forEach((tag: string) => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          });
        });
        const tagsArray = Object.entries(tagCounts).map(([name, count]) => ({ name, count }));
        tagsArray.sort((a, b) => b.count - a.count);
        setTags(tagsArray);
      }
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    const tagName = newTag.trim().toLowerCase();
    if (tags.some(t => t.name.toLowerCase() === tagName)) {
      alert('Tag already exists');
      return;
    }
    // Tags are stored with products, so just add to local state
    // In a real implementation, you'd have a tags API endpoint
    setTags(prev => [...prev, { name: tagName, count: 0 }]);
    setNewTag("");
  };

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalProducts = tags.reduce((sum, tag) => sum + tag.count, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tags</h1>
          <p className="text-sm text-gray-500 mt-1">Manage product tags for better organization</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-sm text-gray-500 mb-1">Total Tags</div>
          <div className="text-2xl font-bold text-gray-900">{tags.length}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-sm text-gray-500 mb-1">Tags in Use</div>
          <div className="text-2xl font-bold text-green-600">{tags.filter(t => t.count > 0).length}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-sm text-gray-500 mb-1">Product Assignments</div>
          <div className="text-2xl font-bold text-primary">{totalProducts}</div>
        </div>
      </div>

      {/* Add Tag & Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="New tag name..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button
              onClick={handleAddTag}
              disabled={!newTag.trim() || adding}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              Add Tag
            </button>
          </div>
        </div>
      </div>

      {/* Tags Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredTags.length === 0 ? (
          <div className="text-center py-12">
            <Tag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">{searchQuery ? 'No tags match your search' : 'No tags found'}</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {filteredTags.map((tag) => (
              <div
                key={tag.name}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full group hover:bg-gray-200 transition-colors"
              >
                <Tag className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-800">{tag.name}</span>
                <span className="text-xs bg-white px-2 py-0.5 rounded-full text-gray-600">
                  {tag.count}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

