"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Download, Mail, ArrowRight, ExternalLink } from "lucide-react";
import { Suspense, useEffect, useState } from "react";

interface OrderItem {
  id: string;
  product: {
    id: string;
    title: string;
    thumbnailUrl?: string;
    canvaTemplateLink?: string;
    canvaTemplateLinks?: Array<{ name: string; url: string }>;
    canvaInstructions?: string;
  };
}

interface OrderData {
  id: string;
  orderNumber: string;
  orderItems: OrderItem[];
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "N/A";
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${API_URL}/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setOrderData(data.data?.order || null);
        }
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };
    if (orderId !== 'N/A') {
      fetchOrderData();
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const canvaItems = orderData?.orderItems?.filter(item =>
    item.product?.canvaTemplateLink || (item.product?.canvaTemplateLinks && item.product.canvaTemplateLinks.length > 0)
  ) || [];
  const downloadableItems = orderData?.orderItems?.filter(item =>
    !item.product?.canvaTemplateLink && (!item.product?.canvaTemplateLinks || item.product.canvaTemplateLinks.length === 0)
  ) || [];
  const hasCanvaProducts = canvaItems.length > 0;

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
              <span className="font-mono font-semibold">{orderData?.orderNumber || orderId}</span>
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

          {/* Canva Products Section */}
          {hasCanvaProducts && (
            <div className="mb-6 p-4 bg-gradient-to-r from-[#00C4CC]/10 to-[#7B2FF7]/10 border border-[#00C4CC]/20 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#00C4CC] to-[#7B2FF7] rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Canva Templates Ready!</h3>
                  <p className="text-sm text-gray-600">Open directly in Canva to start editing</p>
                </div>
              </div>
              <div className="space-y-3">
                {canvaItems.map((item) => {
                  const links = item.product.canvaTemplateLinks || (item.product.canvaTemplateLink ? [{ name: 'Open Template', url: item.product.canvaTemplateLink }] : []);
                  return (
                    <div key={item.id} className="p-3 bg-white rounded-lg">
                      <p className="font-medium text-gray-900 mb-2">{item.product.title}</p>
                      <div className="flex flex-wrap gap-2">
                        {links.map((link, idx) => (
                          <a
                            key={idx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#00C4CC] to-[#7B2FF7] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                          >
                            {link.name}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

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
                  We've sent your {hasCanvaProducts ? 'Canva template links and ' : ''}order confirmation to your email address.
                  {downloadableItems.length > 0 && ' Download links will be valid for 7 days.'}
                </p>
              </div>
            </div>

            {downloadableItems.length > 0 && (
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
            )}

            {hasCanvaProducts && (
              <div className="flex gap-4 p-4 bg-gradient-to-r from-[#00C4CC]/5 to-[#7B2FF7]/5 rounded-xl border border-[#00C4CC]/10">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#00C4CC]/20 to-[#7B2FF7]/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#00C4CC]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Edit in Canva</h3>
                  <p className="text-sm text-gray-600">
                    Your Canva templates are ready! Click the links above to open them directly in Canva.
                    You'll need a free Canva account to edit the templates.
                  </p>
                </div>
              </div>
            )}
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
              <span className="font-semibold">
                {hasCanvaProducts && downloadableItems.length > 0
                  ? 'Canva Templates + Downloads'
                  : hasCanvaProducts
                    ? 'Canva Templates'
                    : 'Instant Download'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Method</span>
              <span className="font-semibold">
                {hasCanvaProducts ? 'Canva Link + ' : ''}Email + Account Access
              </span>
            </div>
            {downloadableItems.length > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Download Limit</span>
                <span className="font-semibold">Unlimited (from account)</span>
              </div>
            )}
            {hasCanvaProducts && (
              <div className="flex justify-between">
                <span className="text-gray-600">Canva Access</span>
                <span className="font-semibold text-[#00C4CC]">Never Expires</span>
              </div>
            )}
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

