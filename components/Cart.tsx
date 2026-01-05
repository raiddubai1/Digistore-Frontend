"use client";

import { useCartStore } from "@/store/cartStore";
import { X, ShoppingBag, Trash2, Plus, Minus, Tag, Check, Gift } from "lucide-react";
import { formatPrice, getThumbnailUrl } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

export default function Cart() {
  const t = useTranslations("cart");
  const { items, isOpen, closeCart, removeItem, updateQuantity, itemCount, subtotal, discount, total, coupon, applyCouponAsync, isValidatingCoupon, removeCoupon, checkFirstTimeBuyer, isFirstTimeBuyer } =
    useCartStore();
  const [mounted, setMounted] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Prevent hydration mismatch and check first-time buyer status
  useEffect(() => {
    setMounted(true);
    checkFirstTimeBuyer();
  }, [checkFirstTimeBuyer]);

  if (!mounted) return null;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Cart Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">
                {t("title")} ({itemCount()})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{t("empty")}</h3>
                <p className="text-gray-500 mb-6">
                  {t("emptyMessage")}
                </p>
                <button
                  onClick={closeCart}
                  className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-semibold hover:shadow-lg transition-all"
                >
                  {t("continueShopping")}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.license}`}
                    className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                  >
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                      {item.product.thumbnailUrl ? (
                        <img
                          src={getThumbnailUrl(item.product.thumbnailUrl)}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                          <ShoppingBag className="w-8 h-8 text-primary" />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                        {item.product.title}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2 capitalize">
                        {item.license} {t("license")}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-semibold w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="p-1.5 hover:bg-red-50 rounded text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <div className="font-bold text-sm">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 p-6 space-y-4">
              {/* Coupon Section */}
              {coupon ? (
                <div className={`flex items-center justify-between rounded-xl px-4 py-3 ${
                  coupon.isAutoApplied
                    ? 'bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20'
                    : 'bg-green-50 border border-green-200'
                }`}>
                  <div className="flex items-center gap-2">
                    {coupon.isAutoApplied ? (
                      <Gift className="w-4 h-4 text-primary" />
                    ) : (
                      <Check className="w-4 h-4 text-green-600" />
                    )}
                    <div>
                      <span className={`text-sm font-medium ${coupon.isAutoApplied ? 'text-primary' : 'text-green-700'}`}>
                        {coupon.isAutoApplied ? `🎉 ${t("newUserDiscount")}` : coupon.code} ({coupon.type === 'percentage' ? `${coupon.discount}% ${t("off")}` : `$${coupon.discount} ${t("off")}`})
                      </span>
                      {coupon.isAutoApplied && (
                        <p className="text-xs text-gray-500">{t("autoApplied")}</p>
                      )}
                    </div>
                  </div>
                  {!coupon.isAutoApplied && (
                    <button onClick={removeCoupon} className="text-sm text-red-500 hover:text-red-700">
                      {t("remove")}
                    </button>
                  )}
                </div>
              ) : showCouponInput ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder={t("enterCouponCode")}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-gray-200 focus:outline-none"
                    disabled={isApplyingCoupon || isValidatingCoupon}
                  />
                  <button
                    onClick={async () => {
                      setIsApplyingCoupon(true);
                      try {
                        const result = await applyCouponAsync(couponInput);
                        if (result.success) {
                          toast.success(result.message);
                          setCouponInput("");
                          setShowCouponInput(false);
                        } else {
                          toast.error(result.message);
                        }
                      } finally {
                        setIsApplyingCoupon(false);
                      }
                    }}
                    disabled={isApplyingCoupon || isValidatingCoupon || !couponInput.trim()}
                    className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isApplyingCoupon || isValidatingCoupon ? t("validating") : t("apply")}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowCouponInput(true)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  <Tag className="w-4 h-4" />
                  {t("haveCoupon")}
                </button>
              )}

              {/* Subtotal */}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t("subtotal")}:</span>
                <span className="font-medium">{formatPrice(subtotal())}</span>
              </div>

              {/* Discount */}
              {discount() > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>{t("discount")}:</span>
                  <span>-{formatPrice(discount())}</span>
                </div>
              )}

              {/* Total */}
              <div className="flex justify-between text-xl border-t border-gray-200 pt-4">
                <span className="font-bold">{t("total")}:</span>
                <span className="font-bold text-gray-900">{formatPrice(total())}</span>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                onClick={closeCart}
                className="block w-full py-4 bg-gray-900 text-white text-center rounded-full font-semibold hover:bg-gray-800 transition-all"
              >
                {t("proceedToCheckout")}
              </Link>

              <button
                onClick={closeCart}
                className="block w-full py-3 text-gray-600 text-center font-semibold hover:text-gray-900"
              >
                {t("continueShopping")}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

