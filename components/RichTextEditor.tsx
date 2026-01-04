"use client";

import { useMemo, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://digistore1-backend.onrender.com/api";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const quillRef = useRef<any>(null);
  const { token } = useAuth();

  // Image handler - uploads to Cloudinary
  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }

      const loadingToast = toast.loading("Uploading image...");
      try {
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch(`${API_URL}/upload/image`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (!response.ok) throw new Error("Upload failed");

        const result = await response.json();
        if (result.success && result.data?.url) {
          const quill = quillRef.current?.getEditor();
          if (quill) {
            const range = quill.getSelection(true);
            quill.insertEmbed(range.index, "image", result.data.url);
            quill.setSelection(range.index + 1);
          }
          toast.success("Image inserted!", { id: loadingToast });
        }
      } catch (error) {
        toast.error("Failed to upload image", { id: loadingToast });
      }
    };
  }, [token]);

  // Video handler - embeds YouTube videos
  const videoHandler = useCallback(() => {
    const url = prompt("Enter YouTube video URL:");
    if (!url) return;

    // Extract YouTube video ID
    let videoId = "";
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        videoId = match[1];
        break;
      }
    }

    if (!videoId) {
      toast.error("Invalid YouTube URL");
      return;
    }

    const quill = quillRef.current?.getEditor();
    if (quill) {
      const range = quill.getSelection(true);
      // Insert responsive iframe HTML
      const embedHtml = `<div class="video-embed" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;max-width:100%;margin:1rem 0;"><iframe src="https://www.youtube.com/embed/${videoId}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allowfullscreen></iframe></div>`;
      quill.clipboard.dangerouslyPasteHTML(range.index, embedHtml);
      toast.success("Video embedded!");
    }
  }, []);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ align: [] }],
          ["blockquote", "code-block"],
          ["link", "image", "video"],
          [{ color: [] }, { background: [] }],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
          video: videoHandler,
        },
      },
    }),
    [imageHandler, videoHandler]
  );

  const formats = [
    "header",
    "bold", "italic", "underline", "strike",
    "list", "bullet",
    "align",
    "blockquote", "code-block",
    "link", "image", "video",
    "color", "background",
  ];

  return (
    <div className="rich-text-editor">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="bg-white rounded-lg"
      />
      <style jsx global>{`
        .rich-text-editor .ql-container { min-height: 300px; font-size: 16px; }
        .rich-text-editor .ql-editor { min-height: 300px; }
        .rich-text-editor .ql-toolbar { border-radius: 0.5rem 0.5rem 0 0; background: #f9fafb; }
        .rich-text-editor .ql-container { border-radius: 0 0 0.5rem 0.5rem; }
        .rich-text-editor .ql-editor img { max-width: 100%; height: auto; border-radius: 0.5rem; margin: 1rem 0; }
      `}</style>
    </div>
  );
}

