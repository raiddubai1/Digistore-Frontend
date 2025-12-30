"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

const faqs = [
  {
    category: "Orders & Purchases",
    id: "orders",
    questions: [
      {
        q: "How do I place an order?",
        a: "Simply browse our products, add items to your cart, and proceed to checkout. You can pay securely using PayPal or credit card.",
      },
      {
        q: "Can I purchase without creating an account?",
        a: "Yes! You can checkout as a guest. However, creating an account allows you to access your order history and downloads anytime.",
      },
      {
        q: "How can I view my order history?",
        a: "Log into your account and go to 'My Orders' to view all your past purchases and download links.",
      },
    ],
  },
  {
    category: "Downloads",
    id: "downloads",
    questions: [
      {
        q: "How do I download my purchased products?",
        a: "After completing your purchase, you'll receive an email with download links. You can also access downloads from your account dashboard.",
      },
      {
        q: "How long are download links valid?",
        a: "Download links are valid indefinitely for registered users. Guest checkout links are valid for 30 days.",
      },
      {
        q: "What file formats are available?",
        a: "File formats vary by product. Common formats include PDF, ZIP, PSD, AI, and Canva template links. Check the product description for specific formats.",
      },
    ],
  },
  {
    category: "Payments",
    id: "payments",
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept PayPal and all major credit cards (Visa, MasterCard, American Express) through our secure payment processor.",
      },
      {
        q: "Is my payment information secure?",
        a: "Absolutely. All payments are processed through secure, encrypted connections. We never store your credit card information.",
      },
      {
        q: "Do you offer any discounts?",
        a: "Yes! New customers get 30% off their first purchase. We also offer bundle deals and seasonal promotions.",
      },
    ],
  },
  {
    category: "Refunds",
    id: "refunds",
    questions: [
      {
        q: "What is your refund policy?",
        a: "Due to the digital nature of our products, all sales are final. However, if you experience technical issues, please contact us and we'll help resolve them.",
      },
      {
        q: "What if I have trouble with my download?",
        a: "Contact our support team at info@digistore1.com and we'll assist you with any download or access issues.",
      },
    ],
  },
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <HelpCircle className="w-16 h-16 text-[#FF6B35] mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-300">
            Find quick answers to common questions about our products and services.
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        {faqs.map((category) => (
          <div key={category.id} id={category.id} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {category.category}
            </h2>
            <div className="space-y-4">
              {category.questions.map((faq, index) => {
                const key = `${category.id}-${index}`;
                const isOpen = openItems[key];
                return (
                  <div
                    key={index}
                    className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden"
                  >
                    <button
                      onClick={() => toggleItem(key)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left"
                    >
                      <span className="font-semibold text-gray-900 dark:text-white">{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-4">
                        <p className="text-gray-600 dark:text-gray-400">{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Contact CTA */}
        <div className="bg-[#FF6B35]/10 rounded-2xl p-8 text-center mt-12">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Still have questions?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Contact us at{" "}
            <a href="mailto:info@digistore1.com" className="text-[#FF6B35] font-medium hover:underline">
              info@digistore1.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

