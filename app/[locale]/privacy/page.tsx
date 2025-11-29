'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface PrivacyPageProps {
  params: Promise<{ locale: string }>;
}

export default function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = use(params);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Content Container */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Privacy Policy
          </h1>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Welcome to Digistore1
            </p>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              This Privacy Policy sets out the basis on which any personal data, including but not limited to payment details and other information we collect from you or other sources or that you provide to us (&quot;Information&quot;) will be handled by us in connection with your access and use of www.digistore1.com. We understand the importance you place on the Information, and we are committed to protecting and respecting your privacy.
            </p>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Please read the following carefully to understand our practices regarding your Information. By using our Services, you agree to the handling of your Information in accordance with this Privacy Policy.
            </p>

            <p className="text-gray-600 dark:text-gray-300 mb-8">
              References in this Privacy Policy to &quot;we&quot;, &quot;our&quot; or &quot;us&quot; (or similar) are references to Digistore1. References to &quot;user&quot; or &quot;you&quot; (or similar) are references to you as an individual or legal entity as the case may be.
            </p>

            {/* Section 1 */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">
              1. What Information We May Collect From You
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We may collect and process the following Information about you:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6 space-y-2">
              <li>Information that you provide by filling in forms on our Platform, including information provided at the time of registering to use our Platform and other co-registrations (e.g., social media logins), subscribing to our Services, posting material, or requesting further services;</li>
              <li>The information you provide when you enter a competition or promotion via our Platform, provide reviews, testimonials, or feedback on our Platform;</li>
              <li>Information you provide us, or that we may collect from you, when you report a problem with our Platform;</li>
              <li>A record of correspondence if you contact us;</li>
              <li>General, aggregated, demographic, and non-personal Information;</li>
              <li>Details of transactions you carry out through our Platform and of the fulfilment of your orders;</li>
              <li>Details about your computer, including but not limited to your IP address, operating system and browser type, as well as information about your general internet usage (e.g. by using technology that stores information on or gains access to your device, such as cookies, tracking pixels, web beacons, etc.);</li>
              <li>Your email address from a third party if you indicate that you have consented to that third party sharing your Information with us; and</li>
              <li>Any other Information we consider necessary to enhance your experience on the Platform.</li>
            </ul>

            {/* Section 2 */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">
              2. How We Will Use Your Information
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We may use Information held about you in the following ways:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6 space-y-2">
              <li>To provide you with information, products or services that you request from us or which we feel may interest you, where you have consented to be contacted for such purposes;</li>
              <li>To provide you with location-based services, such as advertising, search results and other personalised content;</li>
              <li>To carry out our obligations arising from any contracts entered into between you and another entity using our Platform or between you and us;</li>
              <li>To improve our Services and to deliver a better and more personalised service to you;</li>
              <li>To ensure that content from our Platform is presented in the most effective manner for you and the device you use to access our Platform;</li>
              <li>To notify you about changes to our Services;</li>
              <li>For any other reason which we deem necessary to enhance your experience of the Platform;</li>
              <li>To administer and manage our incentives programs and fulfil your requests for incentives, and/or to allow you to participate in sweepstakes, and to notify you if you are a sweepstakes winner.</li>
            </ul>

            {/* Section 3 */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">
              3. To Whom We May Disclose Your Information
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Information about our customers is an important part of our business. We share your Information only as described below and with businesses that follow practices at least as protective as those described in this Privacy Policy:
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-2">3.1 Other Businesses</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              To offer you our Services, we may engage with businesses that are affiliates of us and/or non-affiliated service providers (e.g., logistics businesses used to deliver products to you, marketing companies, payment processors to process online transactions, etc.). We may involve other businesses in your transactions, who may store your Information in a digital wallet to make your use of our Services more efficient.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We will ensure that these businesses do not use your Information for other purposes. By using our Platform, you hereby freely and specifically consent to the transfer, storage, use, and disclosure of your Information among businesses that are affiliates of us and/or non-affiliated service providers, wherever located.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-2">3.2 Marketing and Promotional Offers</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We may also use your Information to provide you with information about goods and services which may be of interest to you and enhance your Platform experience, service messages, new features, enhancements, special offers, and events of interest. We may contact you via various channels, including emails, push notifications, web notifications, post, telephone, in-app messages, and news feed cards.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-2">3.3 Business Transfers</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              In the event that we or substantially all of our assets are acquired, customer information will be one of the transferred assets.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-2">3.4 Protection of Our Platform and Others</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We release account and other Information when we believe such a release is appropriate to comply with the law and law enforcement investigations and to protect the rights, property or safety of our users or others. This includes exchanging information with other companies and organisations for various reasons, such as fraud protection and credit risk reduction.
            </p>

            {/* Section 4 */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">
              4. How We Store Your Information
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              The Information that we collect from you may be transferred to, and stored at, a destination outside of the UAE. It may also be processed by staff operating outside the UAE who work for us or for one of our suppliers.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We will store your Information for as long as necessary to fulfil the purposes indicated in this Privacy Policy or as otherwise permitted or required by law. Your Information may be transferred, stored, processed and used by our affiliated companies and/or non-affiliated service providers in one or more countries outside your originating country.
            </p>

            {/* Section 5 */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">
              5. What Security Measures We Apply
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We maintain commercially reasonable technical, administrative, and physical safeguards to ensure your Information is treated securely and in accordance with this Privacy Policy, and to protect against unauthorized access or alteration to, disclosure, or destruction of your Information.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We may, for example, use encryption technology to secure your Information during transmission to our Platform as well as external firewall and on-host firewall technology to prevent network level attacks. Only those authorized employees, contractors, and agents who need to know your Information in connection with the performance of their services are allowed to access this Information.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              It is important for you to protect yourself against unauthorised access to your password and to your devices used to access our Services. You are responsible for keeping your password confidential. Unfortunately, the transmission of information via the internet is not completely secure. Although we will do our best to protect your Information, we cannot guarantee the security of your Information transmitted to our Platform and any transmission is at your own risk.
            </p>

            {/* Section 6 */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">
              6. How Can You Access and Amend Your Information?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You are able to access a broad range of information about your account and your interactions with the Platform for the purpose of viewing and, in certain cases, updating your Information. Examples of information you can access easily at the Platform include:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-4 space-y-2">
              <li>Up-to-date information regarding recent orders;</li>
              <li>Personally identifiable information (including name, e-mail, password, communications and personalised advertising preferences);</li>
              <li>Payment settings (including credit card information); and</li>
              <li>E-mail notification settings.</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You can opt-out of receiving future marketing communications from us at any time by adjusting your customer communication preferences, through the unsubscribe link within the email communication.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Our system will place cookies when you log on to our Platform to ensure you have an enjoyable user experience. You may disable Cookies by changing the settings on your browser. If you disable Cookies, it will affect how our Platform works and you may not be able to access or use certain areas of our Platform or full functionality.
            </p>

            {/* Section 7 */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">
              7. What If We Change Our Privacy Policy?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Our business changes constantly, and our Privacy Policy may therefore also need to change. We will post the current version of this Privacy Policy on the Platform and each such change will be effective upon posting on the Platform or upon the date designated by us as the &quot;effective date&quot;.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We may e-mail periodic reminders of our notices and conditions, but you should check our Platform frequently to see recent changes. It is your obligation to regularly check the Privacy Policy. Your continued use of the Platform following any such change constitutes your agreement to this Privacy Policy as so modified.
            </p>

            {/* Section 8 */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">
              8. How You Can Contact Us
            </h2>
            <div className="bg-blue-50 dark:bg-slate-700 border border-blue-200 dark:border-slate-600 rounded-xl p-6 mb-8">
              <p className="text-gray-700 dark:text-gray-300">
                If you have any concerns about your Information on the Platform, please contact us at{' '}
                <a href="mailto:info@digistore1.com" className="text-[#FF6B35] hover:underline font-medium">
                  info@digistore1.com
                </a>
                {' '}with a thorough description, and we will try to resolve it.
              </p>
            </div>

            {/* Last Updated */}
            <div className="border-t border-gray-200 dark:border-slate-700 pt-8 mt-12">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last updated: November 2024
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

