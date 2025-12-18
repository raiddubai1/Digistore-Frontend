"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCartStore } from "@/store/cartStore";
import { productsAPI, paymentsAPI } from "@/lib/api";
import { Lock, Download, Mail, Lightbulb, Zap, Check, ShoppingCart, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

// The specific product ID for the Ultimate Bundle
const ULTIMATE_BUNDLE_ID = "cmj8emy2r0001i82y04t6m0zm";

export default function UltimateBundlePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { addItem, openCart } = useCartStore();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    country: "US",
  });

  // Fetch the product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productsAPI.getById(ULTIMATE_BUNDLE_ID);
        setProduct(response.data.data.product);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, []);

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || "",
        firstName: user.name?.split(" ")[0] || "",
        lastName: user.name?.split(" ").slice(1).join(" ") || "",
      }));
    }
  }, [user]);

  // Load PayPal script
  useEffect(() => {
    if (!paypalLoaded && typeof window !== "undefined") {
      const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
      if (!clientId) {
        console.warn("PayPal client ID not configured");
        return;
      }

      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture`;
      script.async = true;
      script.onload = () => setPaypalLoaded(true);
      document.body.appendChild(script);

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [paypalLoaded]);

  // Initialize PayPal button
  const initPayPalButton = useCallback(() => {
    if (!paypalLoaded || !product || !(window as any).paypal) return;

    const container = document.getElementById("paypal-button-landing");
    if (!container || container.hasChildNodes()) return;

    const buttonConfig = {
      style: {
        layout: "vertical" as const,
        color: "gold" as const,
        shape: "rect" as const,
        label: "paypal" as const,
        height: 50,
      },
      createOrder: async () => {
        if (!formData.email || !formData.firstName || !formData.lastName) {
          toast.error("Please fill in your details above");
          throw new Error("Missing form data");
        }

        try {
          const response = await paymentsAPI.createPayPalOrder({
            items: [{
              name: product.title,
              price: product.price,
              quantity: 1,
              productId: product.id,
              vendorId: product.vendorId,
              license: "personal",
            }],
            totalAmount: product.price,
            currency: "USD",
          });
          return response.data.data.orderId;
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Failed to create order");
          throw error;
        }
      },
      onApprove: async (data: any) => {
        setIsProcessing(true);
        try {
          const response = await paymentsAPI.capturePayPalOrder({
            paypalOrderId: data.orderID,
            items: [{
              productId: product.id,
              vendorId: product.vendorId,
              quantity: 1,
              price: product.price,
              license: "personal",
            }],
            billingInfo: formData,
          });

          toast.success("Payment successful!");
          router.push(`/checkout/success?orderId=${response.data.data.order.id}`);
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Payment failed");
        } finally {
          setIsProcessing(false);
        }
      },
      onError: () => {
        toast.error("Payment failed. Please try again.");
        setIsProcessing(false);
      },
      onCancel: () => {
        toast.error("Payment cancelled");
        setIsProcessing(false);
      },
    };

    (window as any).paypal.Buttons(buttonConfig).render("#paypal-button-landing");
  }, [paypalLoaded, product, formData, router]);

  useEffect(() => {
    if (paypalLoaded && product) {
      initPayPalButton();
    }
  }, [paypalLoaded, product, initPayPalButton]);

  const scrollToCheckout = () => {
    document.getElementById("checkout-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product, "personal");
      openCart();
    }
  };

  const price = product?.price || 29;
  const originalPrice = product?.originalPrice || 99;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ===== HERO SECTION ===== */}
      <section className="relative bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white py-16 md:py-24">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium">Limited Time Offer</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Everything You Need to Start & Scale a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              Digital Business
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Launch faster, sell smarter, and build digital income using proven resources — all in one bundle.
          </p>

          {/* Bullet Points */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-10">
            {[
              "No monthly fees",
              "Instant access after purchase",
              "Beginner → Advanced friendly",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-sm md:text-base">{item}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button
            onClick={scrollToCheckout}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-gray-900 font-bold text-lg md:text-xl px-8 md:px-12 py-4 md:py-5 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            <ShoppingCart className="w-6 h-6" />
            Get Instant Access — ${price}
          </button>

          {/* Price Comparison */}
          <p className="mt-4 text-gray-400">
            <span className="line-through">${originalPrice}</span>
            <span className="ml-2 text-green-400 font-semibold">
              Save {Math.round(((originalPrice - price) / originalPrice) * 100)}%
            </span>
          </p>
        </div>
      </section>

      {/* ===== TRUST / REASSURANCE SECTION ===== */}
      <section className="py-12 bg-gray-50 border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            {[
              { icon: Lock, text: "Secure Checkout" },
              { icon: Download, text: "Instant Digital Access" },
              { icon: Mail, text: "Access from Your Account" },
              { icon: Lightbulb, text: "Beginner Friendly" },
              { icon: Zap, text: "One-Time Payment" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <item.icon className="w-6 h-6 text-gray-600" />
                <span className="text-sm text-gray-700 font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHAT'S INCLUDED SECTION ===== */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-4">
            What You Get Inside the Mega Bundle
          </h2>
          <p className="text-center text-gray-600 mb-10">
            Everything you need to start or grow your digital business
          </p>

          <div className="space-y-4">
            {[
              "Massive eBook & PLR libraries (300,000+ titles)",
              "Editable Canva templates (business, social, planners)",
              "Fonts, graphics & stock assets (100,000+ items)",
              "AI & ChatGPT prompt collections (150,000+ prompts)",
              "Video courses & training materials (1,000+ courses)",
              "Marketing funnels & bonus resources",
              "Tools suitable for resale, branding, or learning",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-800">{item}</span>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-gray-500 bg-gray-100 p-4 rounded-lg">
            📁 All content is delivered digitally and accessible from your account instantly after purchase.
          </p>
        </div>
      </section>

      {/* ===== CHECKOUT SECTION ===== */}
      <section id="checkout-section" className="py-16 md:py-20 bg-gray-900 text-white">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-4">
            One Bundle. Unlimited Possibilities.
          </h2>
          <p className="text-center text-gray-400 mb-10">
            Complete your purchase and get instant access
          </p>

          {/* Price Display */}
          <div className="text-center mb-8">
            <div className="inline-flex items-baseline gap-3">
              <span className="text-5xl font-bold text-white">${price}</span>
              <span className="text-2xl text-gray-500 line-through">${originalPrice}</span>
            </div>
            <p className="text-green-400 font-medium mt-2">One-time payment • Lifetime access</p>
          </div>

          {/* Checkout Form */}
          <div className="bg-white rounded-2xl p-6 md:p-8 text-gray-900">
            <h3 className="font-bold text-lg mb-4">Your Details</h3>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* PayPal Button */}
            {isProcessing ? (
              <div className="w-full py-4 bg-gray-100 rounded-xl flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                <span className="text-gray-700 font-semibold">Processing...</span>
              </div>
            ) : paypalLoaded ? (
              <div id="paypal-button-landing"></div>
            ) : (
              <div className="w-full py-4 bg-gray-100 rounded-xl flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
              </div>
            )}

            {/* Alternative: Add to Cart */}
            <div className="mt-4 text-center">
              <button
                onClick={handleAddToCart}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Or add to cart and continue shopping
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Lock className="w-4 h-4" />
                  Secure
                </span>
                <span>•</span>
                <span>Instant Delivery</span>
                <span>•</span>
                <span>Lifetime Access</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-8 bg-gray-950 text-gray-400 text-center text-sm">
        <div className="max-w-4xl mx-auto px-4">
          <p className="mb-2">© {new Date().getFullYear()} Digistore1. All rights reserved.</p>
          <div className="flex justify-center gap-4">
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
