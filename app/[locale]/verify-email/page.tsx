"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error" | "no-token">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("no-token");
      setMessage("No verification token provided");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await api.get(`/auth/verify-email?token=${token}`);
        setStatus("success");
        setMessage(response.data.message || "Email verified successfully!");
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } catch (error: any) {
        setStatus("error");
        setMessage(error.response?.data?.message || "Failed to verify email. The link may have expired.");
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
        {status === "loading" && (
          <>
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verifying Your Email</h1>
            <p className="text-gray-600 dark:text-gray-400">Please wait while we verify your email address...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Email Verified!</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">Redirecting to login...</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verification Failed</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
            <div className="space-y-3">
              <Link
                href="/login"
                className="block w-full py-3 bg-[#FF6B35] text-white font-semibold rounded-xl hover:bg-[#E55A2B] transition-colors"
              >
                Go to Login
              </Link>
              <Link
                href="/register"
                className="block w-full py-3 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                Create New Account
              </Link>
            </div>
          </>
        )}

        {status === "no-token" && (
          <>
            <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Verification Token</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Please check your email for the verification link or request a new one.
            </p>
            <Link
              href="/login"
              className="block w-full py-3 bg-[#FF6B35] text-white font-semibold rounded-xl hover:bg-[#E55A2B] transition-colors"
            >
              Go to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

