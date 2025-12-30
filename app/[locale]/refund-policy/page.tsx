import { RefreshCw } from "lucide-react";

export const metadata = {
  title: "Refund Policy | Digistore1",
  description: "Learn about Digistore1's refund and return policy for digital products.",
};

export default async function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <RefreshCw className="w-16 h-16 text-[#FF6B35] mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">Refund Policy</h1>
          <p className="text-xl text-gray-300">
            Last updated: January 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-8 md:p-12 prose prose-gray dark:prose-invert max-w-none">
          <h2>Digital Products - No Refund Policy</h2>
          <p>
            Due to the digital nature of our products, <strong>all sales are final</strong>. 
            Once a digital product has been purchased and the download link has been provided, 
            we cannot offer refunds.
          </p>
          <p>
            This policy exists because digital products can be instantly downloaded and used, 
            making it impossible to verify whether the product has been accessed or copied.
          </p>

          <h2>Before You Purchase</h2>
          <p>
            We strongly encourage you to:
          </p>
          <ul>
            <li>Carefully read the product description and specifications</li>
            <li>Check the file formats and compatibility requirements</li>
            <li>Review sample images or previews when available</li>
            <li>Contact us with any questions before making a purchase</li>
          </ul>

          <h2>Exceptions</h2>
          <p>
            While we maintain a no-refund policy, we will consider exceptions in the following cases:
          </p>

          <h3>Technical Issues</h3>
          <p>
            If you experience technical problems with your download that we cannot resolve, 
            we may offer a refund or store credit. Please contact us within 48 hours of purchase.
          </p>

          <h3>Duplicate Purchases</h3>
          <p>
            If you accidentally purchase the same product twice, please contact us immediately. 
            We will review your order history and issue a refund for the duplicate purchase.
          </p>

          <h3>Product Not As Described</h3>
          <p>
            If a product significantly differs from its description or is missing essential 
            components as advertised, please contact us with details and we will investigate.
          </p>

          <h2>How to Request Assistance</h2>
          <p>
            If you believe you qualify for an exception, please email us at{" "}
            <a href="mailto:info@digistore1.com" className="text-[#FF6B35]">
              info@digistore1.com
            </a>{" "}
            with:
          </p>
          <ul>
            <li>Your order number</li>
            <li>The email address used for the purchase</li>
            <li>A detailed description of the issue</li>
            <li>Any relevant screenshots or documentation</li>
          </ul>
          <p>
            We aim to respond to all inquiries within 24-48 hours.
          </p>

          <h2>Chargebacks</h2>
          <p>
            If you file a chargeback or payment dispute without first contacting us, your account 
            may be suspended and you may be denied future purchases. We encourage you to reach out 
            to us first so we can work together to resolve any issues.
          </p>

          <h2>Questions?</h2>
          <p>
            If you have any questions about our refund policy, please don't hesitate to contact 
            us at{" "}
            <a href="mailto:info@digistore1.com" className="text-[#FF6B35]">
              info@digistore1.com
            </a>
            . We're here to help!
          </p>
        </div>
      </div>
    </div>
  );
}

