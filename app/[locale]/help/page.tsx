import Link from "next/link";
import { HelpCircle, Mail, MessageCircle, FileText, ShoppingBag, Download, CreditCard, RefreshCw } from "lucide-react";

export const metadata = {
  title: "Help Center | Digistore1",
  description: "Get help with your orders, downloads, payments, and more.",
};

const helpTopics = [
  {
    icon: ShoppingBag,
    title: "Orders & Purchases",
    description: "Learn about placing orders, order history, and tracking your purchases.",
    link: "/faq#orders",
  },
  {
    icon: Download,
    title: "Downloads",
    description: "How to download your digital products and access your files.",
    link: "/faq#downloads",
  },
  {
    icon: CreditCard,
    title: "Payments",
    description: "Payment methods, billing questions, and transaction issues.",
    link: "/faq#payments",
  },
  {
    icon: RefreshCw,
    title: "Refunds",
    description: "Understand our refund policy and how to request a refund.",
    link: "/refund-policy",
  },
];

export default async function HelpCenterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#FF6B35] to-[#ff8a5c] py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <HelpCircle className="w-16 h-16 text-white mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">How can we help you?</h1>
          <p className="text-xl text-white/90">
            Find answers to common questions or get in touch with our support team.
          </p>
        </div>
      </div>

      {/* Help Topics */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Browse Help Topics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {helpTopics.map((topic, index) => (
            <Link
              key={index}
              href={`/${locale}${topic.link}`}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FF6B35]/10 flex items-center justify-center group-hover:bg-[#FF6B35] transition-colors">
                  <topic.icon className="w-6 h-6 text-[#FF6B35] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {topic.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{topic.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Contact Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 md:p-12 text-center shadow-sm">
          <MessageCircle className="w-12 h-12 text-[#FF6B35] mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Still need help?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
            Our support team is here to help. Send us a message and we'll get back to you within 24-48 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#FF6B35] text-white rounded-full font-bold hover:bg-[#e55a2b] transition-colors"
            >
              <Mail className="w-5 h-5" />
              Contact Us
            </Link>
            <Link
              href={`/${locale}/faq`}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white rounded-full font-bold hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
            >
              <FileText className="w-5 h-5" />
              View FAQ
            </Link>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-6">
            Email us directly at{" "}
            <a href="mailto:info@digistore1.com" className="text-[#FF6B35] hover:underline font-medium">
              info@digistore1.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

