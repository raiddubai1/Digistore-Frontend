"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, CheckCircle, Sparkles, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { aiAPI } from "@/lib/api";

export interface ImageWithAlt {
  file: File;
  preview: string;
  altText: string;
}

interface ImageUploadProps {
  onUpload: (files: File[], altTexts?: string[]) => void;
  onAltTextChange?: (index: number, altText: string) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  existingImages?: string[];
  onRemove?: (index: number) => void;
  showAltText?: boolean;
  productTitle?: string;
  productCategory?: string;
}

export default function ImageUpload({
  onUpload,
  onAltTextChange,
  maxFiles = 5,
  maxSizeMB = 5,
  existingImages = [],
  onRemove,
  showAltText = true,
  productTitle = "",
  productCategory = "",
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [previews, setPreviews] = useState<string[]>(existingImages);
  const [altTexts, setAltTexts] = useState<string[]>(existingImages.map(() => ""));
  const [generatingAlt, setGeneratingAlt] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFiles = (files: FileList): File[] => {
    const validFiles: File[] = [];
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    Array.from(files).forEach((file) => {
      // Check file type
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file`);
        return;
      }

      // Check file size
      if (file.size > maxSizeBytes) {
        toast.error(`${file.name} is larger than ${maxSizeMB}MB`);
        return;
      }

      validFiles.push(file);
    });

    // Check total number of files
    if (previews.length + validFiles.length > maxFiles) {
      toast.error(`You can only upload up to ${maxFiles} images`);
      return validFiles.slice(0, maxFiles - previews.length);
    }

    return validFiles;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const validFiles = validateFiles(e.dataTransfer.files);
      if (validFiles.length > 0) {
        handleFiles(validFiles);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      const validFiles = validateFiles(e.target.files);
      if (validFiles.length > 0) {
        handleFiles(validFiles);
      }
    }
  };

  const handleFiles = (files: File[]) => {
    // Create preview URLs
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);

    // Add empty alt texts for new files
    setAltTexts([...altTexts, ...files.map(() => "")]);

    // Call parent callback
    onUpload(files);

    toast.success(`${files.length} image(s) uploaded successfully`);
  };

  const handleRemove = (index: number) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    const newAltTexts = altTexts.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    setAltTexts(newAltTexts);
    if (onRemove) {
      onRemove(index);
    }
  };

  const handleAltTextChange = (index: number, value: string) => {
    const newAltTexts = [...altTexts];
    newAltTexts[index] = value;
    setAltTexts(newAltTexts);
    if (onAltTextChange) {
      onAltTextChange(index, value);
    }
  };

  const generateAltText = async (index: number) => {
    if (!productTitle && !productCategory) {
      toast.error("Please add a product title first to generate alt text");
      return;
    }

    setGeneratingAlt(index);
    try {
      const response = await aiAPI.generateImageAlt({
        productTitle,
        categoryName: productCategory,
        imageIndex: index,
        isMainImage: index === 0,
      });

      if (response.data?.success && response.data?.data?.imageAlt) {
        handleAltTextChange(index, response.data.data.imageAlt);
        toast.success("Alt text generated!");
      } else {
        throw new Error('Failed to generate alt text');
      }
    } catch (error: any) {
      console.error('Alt text generation error:', error);
      toast.error(error.response?.data?.message || "Failed to generate alt text");
    } finally {
      setGeneratingAlt(null);
    }
  };

  const generateAllAltTexts = async () => {
    if (!productTitle && !productCategory) {
      toast.error("Please add a product title first to generate alt text");
      return;
    }

    for (let i = 0; i < previews.length; i++) {
      await generateAltText(i);
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
          dragActive
            ? "border-primary bg-primary/10 scale-[1.02]"
            : previews.length > 0
            ? "border-green-400 bg-green-50 hover:border-green-500 hover:bg-green-100"
            : "border-gray-300 hover:border-primary hover:bg-primary/5"
        } active:scale-[0.98] active:border-primary active:bg-primary/10`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-3">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
            previews.length > 0 ? "bg-green-100" : "bg-primary/10"
          }`}>
            {previews.length > 0 ? (
              <CheckCircle className="w-8 h-8 text-green-600" />
            ) : (
              <Upload className="w-8 h-8 text-primary" />
            )}
          </div>

          <div>
            <p className="text-lg font-semibold mb-1">
              {previews.length > 0 ? (
                <span className="text-green-700">
                  {previews.length} image(s) selected - Click to add more
                </span>
              ) : (
                <>
                  Drop images here or{" "}
                  <span className="text-primary underline">browse</span>
                </>
              )}
            </p>
            <p className="text-sm text-gray-500">
              Upload up to {maxFiles} images (max {maxSizeMB}MB each)
            </p>
          </div>

          <div className="flex gap-2 text-xs text-gray-400">
            <span>JPG</span>
            <span>•</span>
            <span>PNG</span>
            <span>•</span>
            <span>GIF</span>
            <span>•</span>
            <span>WEBP</span>
          </div>
        </div>
      </div>

      {/* Preview Grid with Alt Text */}
      {previews.length > 0 && (
        <>
          {showAltText && (
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">
                Image Alt Text (for SEO)
              </p>
              <button
                type="button"
                onClick={generateAllAltTexts}
                disabled={generatingAlt !== null}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                AI Generate All
              </button>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="flex gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                {/* Image Preview */}
                <div className="relative w-24 h-24 flex-shrink-0">
                  <img
                    src={preview}
                    alt={altTexts[index] || `Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-primary text-white text-[10px] font-semibold rounded">
                      Main
                    </div>
                  )}
                </div>

                {/* Alt Text Input */}
                {showAltText && (
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-gray-600">
                        Alt Text {index === 0 ? "(Main Image)" : `(Image ${index + 1})`}
                      </label>
                      <button
                        type="button"
                        onClick={() => generateAltText(index)}
                        disabled={generatingAlt === index}
                        className="flex items-center gap-1 px-2 py-1 text-xs text-primary hover:bg-primary/10 rounded transition-colors disabled:opacity-50"
                      >
                        {generatingAlt === index ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Sparkles className="w-3 h-3" />
                        )}
                        AI
                      </button>
                    </div>
                    <input
                      type="text"
                      value={altTexts[index] || ""}
                      onChange={(e) => handleAltTextChange(index, e.target.value)}
                      placeholder="Describe this image for SEO..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <p className="text-[10px] text-gray-400">
                      {altTexts[index]?.length || 0}/125 characters
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

