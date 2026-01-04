import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function BlogNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="text-center">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileQuestion className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-secondary mb-4">Blog Post Not Found</h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Sorry, the blog post you're looking for doesn't exist or may have been removed.
        </p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Blog
        </Link>
      </div>
    </div>
  );
}

