"use client";

import { useState, useEffect } from "react";
import { Plus, X, Tag, Loader2, Search, Edit2, Trash2, Check, CheckSquare, Square } from "lucide-react";
import { usePathname } from "next/navigation";
import { productsAPI, tagsAPI } from "@/lib/api";
import toast from "react-hot-toast";

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
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

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

  const toggleTagSelection = (tagName: string) => {
    setSelectedTags(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tagName)) {
        newSet.delete(tagName);
      } else {
        newSet.add(tagName);
      }
      return newSet;
    });
  };

  const selectAllFiltered = () => {
    const allFilteredNames = filteredTags.map(t => t.name);
    const allSelected = allFilteredNames.every(name => selectedTags.has(name));
    if (allSelected) {
      // Deselect all
      setSelectedTags(new Set());
    } else {
      // Select all filtered
      setSelectedTags(new Set(allFilteredNames));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedTags.size === 0) return;

    const confirmed = confirm(`Are you sure you want to delete ${selectedTags.size} tag(s)? This will remove them from all products.`);
    if (!confirmed) return;

    setDeleting(true);
    try {
      const tagsArray = Array.from(selectedTags);
      await tagsAPI.bulkDelete(tagsArray);
      toast.success(`Deleted ${tagsArray.length} tag(s) successfully`);
      setSelectedTags(new Set());
      fetchTags(); // Refresh the list
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete tags');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteSingle = async (tagName: string) => {
    const confirmed = confirm(`Are you sure you want to delete "${tagName}"? This will remove it from all products.`);
    if (!confirmed) return;

    setDeleting(true);
    try {
      await tagsAPI.bulkDelete([tagName]);
      toast.success(`Deleted "${tagName}" successfully`);
      fetchTags(); // Refresh the list
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete tag');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tags</h1>
          <p className="text-sm text-gray-500 mt-1">Manage product tags for better organization</p>
        </div>
        {selectedTags.size > 0 && (
          <button
            onClick={handleDeleteSelected}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {deleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            Delete {selectedTags.size} Selected
          </button>
        )}
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
        {/* Select All */}
        {filteredTags.length > 0 && !loading && (
          <div className="flex items-center gap-2 mb-4 pb-4 border-b">
            <button
              onClick={selectAllFiltered}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              {filteredTags.every(t => selectedTags.has(t.name)) ? (
                <CheckSquare className="w-5 h-5 text-primary" />
              ) : (
                <Square className="w-5 h-5" />
              )}
              Select All ({filteredTags.length})
            </button>
            {selectedTags.size > 0 && (
              <span className="text-sm text-gray-500">
                • {selectedTags.size} selected
              </span>
            )}
          </div>
        )}

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
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full group transition-colors cursor-pointer ${
                  selectedTags.has(tag.name)
                    ? 'bg-primary/10 ring-2 ring-primary'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => toggleTagSelection(tag.name)}
              >
                {selectedTags.has(tag.name) ? (
                  <CheckSquare className="w-4 h-4 text-primary" />
                ) : (
                  <Square className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                )}
                <Tag className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-800">{tag.name}</span>
                <span className="text-xs bg-white px-2 py-0.5 rounded-full text-gray-600">
                  {tag.count}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSingle(tag.name);
                  }}
                  disabled={deleting}
                  className="opacity-0 group-hover:opacity-100 ml-1 p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-opacity"
                  title={`Delete "${tag.name}"`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

