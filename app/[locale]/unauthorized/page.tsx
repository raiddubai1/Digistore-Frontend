"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldAlert, Home, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function UnauthorizedPage() {
  const { user } = useAuth();
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center">
            <ShieldAlert className="w-12 h-12 text-red-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Access Denied
        </h1>

        {/* Message */}
        <p className="text-lg text-gray-600 mb-8">
          {user ? (
            <>
              Sorry, you don't have permission to access this page.
              <br />
              <span className="text-sm text-gray-500 mt-2 block">
                Your role: <span className="font-semibold text-gray-700">{user.role}</span>
              </span>
            </>
          ) : (
            "You need to be logged in with the appropriate permissions to access this page."
          )}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            <Home className="w-5 h-5" />
            Go to Homepage
          </Link>

          {!user && (
            <Link
              href={`/${locale}/login`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Sign In
            </Link>
          )}

          {user && (
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-12 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Need admin access?</strong>
            <br />
            Contact your system administrator to request the appropriate permissions.
          </p>
        </div>
      </div>
    </div>
  );
}

