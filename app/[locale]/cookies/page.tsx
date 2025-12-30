import { Cookie } from "lucide-react";

export const metadata = {
  title: "Cookie Policy | Digistore1",
  description: "Learn about how Digistore1 uses cookies and similar technologies.",
};

export default async function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Cookie className="w-16 h-16 text-[#FF6B35] mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">Cookie Policy</h1>
          <p className="text-xl text-gray-300">
            Last updated: January 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-8 md:p-12 prose prose-gray dark:prose-invert max-w-none">
          <h2>What Are Cookies?</h2>
          <p>
            Cookies are small text files that are placed on your device when you visit a website. 
            They are widely used to make websites work more efficiently and provide information to 
            the website owners.
          </p>

          <h2>How We Use Cookies</h2>
          <p>
            Digistore1 uses cookies and similar technologies for several purposes:
          </p>

          <h3>Essential Cookies</h3>
          <p>
            These cookies are necessary for the website to function properly. They enable core 
            functionality such as:
          </p>
          <ul>
            <li>Keeping you signed in during your session</li>
            <li>Remembering items in your shopping cart</li>
            <li>Processing secure payments</li>
            <li>Ensuring website security</li>
          </ul>

          <h3>Analytics Cookies</h3>
          <p>
            We use analytics cookies to understand how visitors interact with our website. 
            This helps us improve our services and user experience. These cookies collect 
            information such as:
          </p>
          <ul>
            <li>Pages you visit and time spent on each page</li>
            <li>How you arrived at our website</li>
            <li>Any errors you may encounter</li>
          </ul>

          <h3>Preference Cookies</h3>
          <p>
            These cookies remember your preferences and settings, such as:
          </p>
          <ul>
            <li>Your preferred language</li>
            <li>Your location preferences</li>
            <li>Display settings (like dark mode)</li>
          </ul>

          <h3>Marketing Cookies</h3>
          <p>
            We may use marketing cookies to deliver relevant advertisements to you. These cookies 
            track your browsing habits to help us show you ads that are relevant to your interests.
          </p>

          <h2>Managing Cookies</h2>
          <p>
            Most web browsers allow you to control cookies through their settings. You can:
          </p>
          <ul>
            <li>View cookies stored on your device</li>
            <li>Delete some or all cookies</li>
            <li>Block cookies from being set</li>
            <li>Set preferences for certain websites</li>
          </ul>
          <p>
            Please note that blocking or deleting cookies may impact your experience on our website. 
            Some features may not work properly if cookies are disabled.
          </p>

          <h2>Third-Party Cookies</h2>
          <p>
            Some cookies are placed by third-party services that appear on our pages, including:
          </p>
          <ul>
            <li>Payment processors (PayPal, Stripe)</li>
            <li>Analytics services (Google Analytics)</li>
            <li>Social media platforms</li>
          </ul>

          <h2>Updates to This Policy</h2>
          <p>
            We may update this Cookie Policy from time to time. Any changes will be posted on this 
            page with an updated revision date.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about our use of cookies, please contact us at{" "}
            <a href="mailto:info@digistore1.com" className="text-[#FF6B35]">
              info@digistore1.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

