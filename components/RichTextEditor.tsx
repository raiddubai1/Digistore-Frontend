"use client";

import { useMemo, useRef, useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// Image size presets
const IMAGE_SIZES = {
  small: { width: "300px", label: "S" },
  medium: { width: "500px", label: "M" },
  large: { width: "700px", label: "L" },
  full: { width: "100%", label: "Full" },
};

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["blockquote", "code-block"],
        ["link", "image", "video"],
        [{ color: [] }, { background: [] }],
        ["clean"],
      ],
    }),
    []
  );

  const formats = [
    "header",
    "bold", "italic", "underline", "strike",
    "list", "bullet",
    "align",
    "blockquote", "code-block",
    "link", "image", "video",
    "color", "background",
    "width", "style",
  ];

  // Handle image click to show size toolbar
  const handleImageClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "IMG") {
      const img = target as HTMLImageElement;
      setSelectedImage(img);

      // Position toolbar above the image
      const rect = img.getBoundingClientRect();
      const editorRect = editorRef.current?.getBoundingClientRect();
      if (editorRect) {
        setToolbarPosition({
          top: rect.top - editorRect.top - 45,
          left: rect.left - editorRect.left + (rect.width / 2) - 100,
        });
      }
    }
  }, []);

  // Handle click outside to deselect
  const handleClickOutside = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest(".image-size-toolbar") && target.tagName !== "IMG") {
      setSelectedImage(null);
    }
  }, []);

  // Set up event listeners
  useEffect(() => {
    const editor = editorRef.current?.querySelector(".ql-editor");
    if (editor) {
      editor.addEventListener("click", handleImageClick as EventListener);
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      editor?.removeEventListener("click", handleImageClick as EventListener);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [handleImageClick, handleClickOutside]);

  // Apply size to selected image
  const applyImageSize = (size: keyof typeof IMAGE_SIZES) => {
    if (selectedImage) {
      const sizeConfig = IMAGE_SIZES[size];
      selectedImage.style.width = sizeConfig.width;
      selectedImage.style.maxWidth = sizeConfig.width;
      selectedImage.style.height = "auto";
      selectedImage.style.display = "block";
      selectedImage.style.margin = "1rem auto";

      // Add data attribute for size tracking
      selectedImage.setAttribute("data-size", size);

      // Trigger onChange to save the updated HTML
      const editor = editorRef.current?.querySelector(".ql-editor");
      if (editor) {
        onChange(editor.innerHTML);
      }

      setSelectedImage(null);
    }
  };

  // Get current size of selected image
  const getCurrentSize = () => {
    if (!selectedImage) return null;
    return selectedImage.getAttribute("data-size") || "full";
  };

  return (
    <div className="rich-text-editor relative" ref={editorRef}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="bg-white rounded-lg"
      />

      {/* Image Size Toolbar */}
      {selectedImage && (
        <div
          className="image-size-toolbar absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-1 flex gap-1"
          style={{ top: toolbarPosition.top, left: toolbarPosition.left }}
        >
          <span className="text-xs text-gray-500 px-2 py-1.5">Size:</span>
          {Object.entries(IMAGE_SIZES).map(([key, config]) => (
            <button
              key={key}
              onClick={() => applyImageSize(key as keyof typeof IMAGE_SIZES)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                getCurrentSize() === key
                  ? "bg-primary text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
              title={`${config.width} width`}
            >
              {config.label}
            </button>
          ))}
        </div>
      )}

      <style jsx global>{`
        .rich-text-editor .ql-container { min-height: 300px; font-size: 16px; }
        .rich-text-editor .ql-editor { min-height: 300px; }
        .rich-text-editor .ql-toolbar { border-radius: 0.5rem 0.5rem 0 0; background: #f9fafb; }
        .rich-text-editor .ql-container { border-radius: 0 0 0.5rem 0.5rem; }
        .rich-text-editor .ql-editor img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1rem auto;
          display: block;
          cursor: pointer;
          transition: outline 0.2s;
        }
        .rich-text-editor .ql-editor img:hover {
          outline: 2px solid #FF6B35;
          outline-offset: 2px;
        }
        .rich-text-editor .ql-editor img[data-size="small"] { max-width: 300px; }
        .rich-text-editor .ql-editor img[data-size="medium"] { max-width: 500px; }
        .rich-text-editor .ql-editor img[data-size="large"] { max-width: 700px; }
        .rich-text-editor .ql-editor img[data-size="full"] { max-width: 100%; }
      `}</style>
    </div>
  );
}

