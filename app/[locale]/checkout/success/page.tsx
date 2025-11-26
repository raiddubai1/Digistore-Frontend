"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Download, Mail, ArrowRight } from "lucide-react";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "N/A";

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-success/10 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-success" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-xl text-gray-600">
            Thank you for your purchase
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-6">
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Order Number</span>
              <span className="font-mono font-semibold">{orderId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Order Date</span>
              <span className="font-semibold">
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* What's Next */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">What's Next?</h2>

            <div className="flex gap-4 p-4 bg-primary/5 rounded-xl">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Check Your Email</h3>
                <p className="text-sm text-gray-600">
                  We've sent your download links and order confirmation to your email address.
                  The download links will be valid for 7 days.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-secondary/5 rounded-xl">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Download className="w-5 h-5 text-secondary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Download Your Products</h3>
                <p className="text-sm text-gray-600">
                  You can download your products immediately from your account dashboard.
                  Your purchases are saved and accessible anytime.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/account"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-semibold hover:shadow-lg transition-all"
          >
            <Download className="w-5 h-5" />
            View My Downloads
          </Link>
          <Link
            href="/products"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:border-primary transition-colors"
          >
            Continue Shopping
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Support Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Need help? Contact our support team
          </p>
          <a
            href="mailto:support@digistore1.com"
            className="text-primary font-semibold hover:text-primary-dark"
          >
            support@digistore1.com
          </a>
        </div>

        {/* Order Summary */}
        <div className="mt-8 bg-gray-100 rounded-2xl p-6">
          <h3 className="font-bold mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Digital Products</span>
              <span className="font-semibold">Instant Download</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Method</span>
              <span className="font-semibold">Email + Account Access</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Download Limit</span>
              <span className="font-semibold">Unlimited (from account)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">License</span>
              <span className="font-semibold">As per product selection</span>
            </div>
          </div>
        </div>

        {/* Thank You Message */}
        <div className="mt-8 text-center p-6 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-2xl">
          <p className="text-lg font-semibold mb-2">
            Thank you for choosing Digistore1! 🎉
          </p>
          <p className="text-gray-600">
            We hope you enjoy your digital products. If you have any questions or need assistance,
            we're here to help!
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}

