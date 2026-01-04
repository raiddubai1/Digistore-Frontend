"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
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
  ];

  return (
    <div className="rich-text-editor">
      <ReactQuill
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

