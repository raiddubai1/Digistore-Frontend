"use client";

import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, Tag, Check, X, ChevronLeft, ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { paymentsAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

// PayPal icon component
const PayPalIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c1.022-4.588-1.018-6.376-4.826-6.376H8.43c-.524 0-.968.382-1.05.9L4.273 20.1c-.083.518.286.977.805.977h4.606l.738-4.672.023-.15c.082-.518.526-.9 1.05-.9h2.19c4.298 0 7.664-1.747 8.647-6.797.03-.149.054-.294.077-.437.328-1.73.192-3.086-.188-4.204z"/>
  </svg>
);

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, total, subtotal, discount, clearCart, coupon, applyCoupon, removeCoupon } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  const [formData, setFormData] = useState({
    email: user?.email || "",
    firstName: user?.name?.split(' ')[0] || "",
    lastName: user?.name?.split(' ').slice(1).join(' ') || "",
    country: "United States",
    paymentMethod: "paypal",
  });

  // Update form when user loads
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || prev.email,
        firstName: user.name?.split(' ')[0] || prev.firstName,
        lastName: user.name?.split(' ').slice(1).join(' ') || prev.lastName,
      }));
    }
  }, [user]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && items.length === 0) {
      router.push("/products");
    }
  }, [mounted, items, router]);

  // Load PayPal script
  useEffect(() => {
    if (mounted && !paypalLoaded && typeof window !== 'undefined') {
      const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
      if (!clientId) {
        console.warn('PayPal client ID not configured');
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture`;
      script.async = true;
      script.onload = () => setPaypalLoaded(true);
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [mounted, paypalLoaded]);

  // Check if order is free
  const isFreeOrder = total() === 0;

  // Initialize PayPal buttons for both desktop and mobile
  const initPayPalButton = useCallback(() => {
    if (!paypalLoaded || !(window as any).paypal || isFreeOrder) return;

    const buttonConfig = {
      style: {
        layout: 'vertical' as const,
        color: 'gold' as const,
        shape: 'rect' as const,
        label: 'paypal' as const,
        height: 50,
      },
      createOrder: async () => {
        try {
          const orderItems = items.map(item => ({
            name: item.product.title,
            price: item.price,
            quantity: item.quantity,
            productId: item.product.id,
            vendorId: (item.product as any).vendorId,
            license: item.license,
          }));

          const response = await paymentsAPI.createPayPalOrder({
            items: orderItems,
            totalAmount: total(),
            currency: 'USD',
            couponCode: coupon?.code,
          });

          return response.data.data.orderId;
        } catch (error: any) {
          toast.error(error.response?.data?.message || 'Failed to create order');
          throw error;
        }
      },
      onApprove: async (data: any) => {
        setIsProcessing(true);
        try {
          const orderItems = items.map(item => ({
            productId: item.product.id,
            vendorId: (item.product as any).vendorId,
            quantity: item.quantity,
            price: item.price,
            license: item.license,
          }));

          const response = await paymentsAPI.capturePayPalOrder({
            paypalOrderId: data.orderID,
            items: orderItems,
            billingInfo: {
              email: formData.email,
              firstName: formData.firstName,
              lastName: formData.lastName,
              country: formData.country,
            },
            couponCode: coupon?.code,
          });

          clearCart();
          toast.success('Payment successful!');
          router.push(`/checkout/success?orderId=${response.data.data.order.id}`);
        } catch (error: any) {
          toast.error(error.response?.data?.message || 'Payment failed');
        } finally {
          setIsProcessing(false);
        }
      },
      onError: (err: any) => {
        console.error('PayPal error:', err);
        toast.error('Payment failed. Please try again.');
        setIsProcessing(false);
      },
      onCancel: () => {
        toast.error('Payment cancelled');
        setIsProcessing(false);
      },
    };

    // Render for desktop
    const desktopContainer = document.getElementById('paypal-button-container');
    if (desktopContainer && !desktopContainer.hasChildNodes()) {
      (window as any).paypal.Buttons(buttonConfig).render('#paypal-button-container');
    }

    // Render for mobile
    const mobileContainer = document.getElementById('paypal-button-container-mobile');
    if (mobileContainer && !mobileContainer.hasChildNodes()) {
      (window as any).paypal.Buttons(buttonConfig).render('#paypal-button-container-mobile');
    }
  }, [paypalLoaded, items, total, coupon, formData, clearCart, router, isFreeOrder]);

  useEffect(() => {
    if (paypalLoaded && !isFreeOrder) {
      initPayPalButton();
    }
  }, [paypalLoaded, initPayPalButton, isFreeOrder]);

  // Handle free order
  const handleFreeOrder = async () => {
    if (!formData.email || !formData.firstName || !formData.lastName) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);
    try {
      const orderItems = items.map(item => ({
        productId: item.product.id,
        vendorId: (item.product as any).vendorId,
        quantity: item.quantity,
        price: item.price,
        license: item.license,
      }));

      const response = await paymentsAPI.createFreeOrder({
        items: orderItems,
        billingInfo: {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          country: formData.country,
        },
      });

      clearCart();
      toast.success('Order completed successfully!');
      router.push(`/checkout/success?orderId=${response.data.data.order.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to complete order');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // PayPal handles payment - this is just for form validation
    if (!formData.email || !formData.firstName || !formData.lastName) {
      toast.error('Please fill in all required fields');
      return;
    }
  };

  if (!mounted) {
    return null;
  }

  if (items.length === 0) {
    return null;
  }

  // Mobile Order Summary Component
  const OrderSummaryContent = () => (
    <>
      {/* Order Items */}
      <div className="space-y-3 mb-4">
        {items.map((item) => (
          <div key={`${item.product.id}-${item.license}`} className="flex gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
              {item.product.thumbnailUrl && (
                <img src={item.product.thumbnailUrl} alt="" className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm line-clamp-1">{item.product.title}</h3>
              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
            </div>
            <div className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</div>
          </div>
        ))}
      </div>

      {/* Coupon */}
      <div className="border-t border-gray-100 pt-3 mb-3">
        {coupon ? (
          <div className="flex items-center justify-between bg-green-50 rounded-lg px-3 py-2">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">{coupon.code}</span>
            </div>
            <button onClick={removeCoupon} className="p-1">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        ) : showCouponInput ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              placeholder="Coupon code"
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
            <button
              type="button"
              onClick={() => {
                const result = applyCoupon(couponInput);
                if (result.success) {
                  toast.success(result.message);
                  setCouponInput("");
                  setShowCouponInput(false);
                } else {
                  toast.error(result.message);
                }
              }}
              className="px-3 py-2 bg-gray-900 text-white text-sm rounded-lg"
            >
              Apply
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowCouponInput(true)}
            className="flex items-center gap-2 text-sm text-gray-500"
          >
            <Tag className="w-4 h-4" />
            Add coupon
          </button>
        )}
      </div>

      {/* Totals */}
      <div className="border-t border-gray-100 pt-3 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Subtotal</span>
          <span>{formatPrice(subtotal())}</span>
        </div>
        {discount() > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount</span>
            <span>-{formatPrice(discount())}</span>
          </div>
        )}
        <div className="flex justify-between font-bold pt-2 border-t border-gray-100">
          <span>Total</span>
          <span>{formatPrice(total())}</span>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* ===== MOBILE LAYOUT ===== */}
      <div className="lg:hidden min-h-screen bg-gray-50 pb-32">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/products" className="p-1">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-lg font-bold">Checkout</h1>
          </div>
        </div>

        {/* Collapsible Order Summary */}
        <div className="bg-white border-b border-gray-100">
          <button
            onClick={() => setShowOrderSummary(!showOrderSummary)}
            className="w-full px-4 py-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Order Summary</span>
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{items.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">{formatPrice(total())}</span>
              {showOrderSummary ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </button>
          {showOrderSummary && (
            <div className="px-4 pb-4">
              <OrderSummaryContent />
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Email */}
          <div className="bg-white rounded-xl p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:outline-none"
              placeholder="you@example.com"
            />
            <p className="text-xs text-gray-500 mt-2">Download links will be sent here</p>
          </div>

          {/* Name */}
          <div className="bg-white rounded-xl p-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Country */}
          <div className="bg-white rounded-xl p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
            <select
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:outline-none bg-white"
            >
              <option>United States</option>
              <option>United Kingdom</option>
              <option>Canada</option>
              <option>Australia</option>
              <option>Germany</option>
              <option>France</option>
              <option>Other</option>
            </select>
          </div>

          {/* Payment */}
          {!isFreeOrder && (
            <div className="bg-white rounded-xl p-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
              <div className="flex items-center gap-3 p-3 border-2 border-blue-600 rounded-lg bg-blue-50">
                <PayPalIcon />
                <div className="flex-1">
                  <p className="font-medium text-sm">PayPal</p>
                  <p className="text-xs text-gray-500">Pay securely with PayPal</p>
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Fixed Bottom Button (PayPal or Free Order) */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 lg:hidden">
          {isProcessing ? (
            <div className="w-full py-4 bg-gray-200 rounded-xl flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-700 font-semibold">Processing...</span>
            </div>
          ) : isFreeOrder ? (
            <button
              onClick={handleFreeOrder}
              className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors"
            >
              Complete Free Order
            </button>
          ) : paypalLoaded ? (
            <div id="paypal-button-container-mobile" className="w-full"></div>
          ) : (
            <div className="w-full py-4 bg-gray-200 rounded-xl flex items-center justify-center">
              <span className="text-gray-500">Loading payment options...</span>
            </div>
          )}
          <p className="text-center text-xs text-gray-500 mt-2">
            🔒 Secure checkout
          </p>
        </div>
      </div>

      {/* ===== DESKTOP LAYOUT ===== */}
      <div className="hidden lg:block min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Information */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary" />
                    Contact Information
                  </h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="you@example.com"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      We'll send your download links to this email
                    </p>
                  </div>
                </div>

              {/* Billing Information */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Billing Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="Doe"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option>United States</option>
                      <option>United Kingdom</option>
                      <option>Canada</option>
                      <option>Australia</option>
                      <option>Germany</option>
                      <option>France</option>
                      <option>Spain</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment Method - Only show for paid orders */}
              {!isFreeOrder && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-primary" />
                    Payment Method
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-4 border-2 border-blue-600 bg-blue-50 rounded-lg">
                      <PayPalIcon />
                      <div className="flex-1">
                        <div className="font-semibold">PayPal</div>
                        <div className="text-sm text-gray-500">Pay securely with PayPal</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Secure</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment/Complete Button */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                {isProcessing ? (
                  <div className="w-full py-4 bg-gray-100 rounded-xl flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-gray-700 font-semibold">Processing...</span>
                  </div>
                ) : isFreeOrder ? (
                  <button
                    onClick={handleFreeOrder}
                    className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors text-lg"
                  >
                    🎉 Complete Free Order
                  </button>
                ) : paypalLoaded ? (
                  <div id="paypal-button-container"></div>
                ) : (
                  <div className="w-full py-4 bg-gray-100 rounded-xl flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2" />
                    <span className="text-gray-500">Loading PayPal...</span>
                  </div>
                )}
                <p className="text-center text-sm text-gray-500 mt-4">
                  🔒 Secure checkout. Your information is protected.
                </p>
              </div>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.license}`} className="flex gap-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm line-clamp-2">{item.product.title}</h3>
                      <p className="text-xs text-gray-500 capitalize">{item.license} License</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</div>
                  </div>
                ))}
              </div>

              {/* Coupon Section */}
              <div className="border-t border-gray-200 pt-4 mb-4">
                {coupon ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700">
                        {coupon.code}
                      </span>
                    </div>
                    <button onClick={removeCoupon} className="p-1 hover:bg-green-100 rounded">
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                ) : showCouponInput ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Coupon code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-200 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const result = applyCoupon(couponInput);
                        if (result.success) {
                          toast.success(result.message);
                          setCouponInput("");
                          setShowCouponInput(false);
                        } else {
                          toast.error(result.message);
                        }
                      }}
                      className="px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800"
                    >
                      Apply
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowCouponInput(true)}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                  >
                    <Tag className="w-4 h-4" />
                    Add coupon code
                  </button>
                )}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">{formatPrice(subtotal())}</span>
                </div>
                {discount() > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({coupon?.code})</span>
                    <span>-{formatPrice(discount())}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">$0.00</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                  <span>Total</span>
                  <span className="text-gray-900">{formatPrice(total())}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

