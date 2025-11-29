'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface TermsPageProps {
  params: Promise<{ locale: string }>;
}

export default function TermsPage({ params }: TermsPageProps) {
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
            Terms & Conditions
          </h1>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Welcome to www.digistore1.com (&quot;Site&quot;). (&quot;we&quot;, &quot;our&quot; or &quot;us&quot;).
            </p>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              These Terms of Use and all policies and additional terms (if applicable) posted on the Site set out the terms on which we offer you access to and use of our Site, services, and applications.
            </p>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              By accessing, registering, and/or continuing to use or access our Services, you are agreeing to be bound by these Terms of Use and the Legal Documents with immediate effect. These Terms of Use are subject to change by us at any time. Your continued use of the Site following any such change constitutes your agreement to these Terms of Use and Legal Documents as so modified.
            </p>

            <p className="text-gray-600 dark:text-gray-300 mb-8">
              References in these Terms of Use to &quot;you&quot; (or similar) are references to you as an individual or legal entity, as the case may be.
            </p>

            {/* Section 1 */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">
              1. About Our Site
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              The Site is an e-commerce platform that allows individuals and enterprise entities to buy products.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We reserve the right to introduce new Services and update or withdraw any of the Services, in our sole discretion, and we will not be liable to you for exercising this discretion.
            </p>

            {/* Section 2 */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">
              2. Eligibility and Registration Requirements
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You are eligible to register as a buyer and benefit from the Services if you meet the following eligibility criteria:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-4 space-y-2">
              <li>You are above the legal age for purchasing products in your country of residence; and</li>
              <li>You are able to provide an address.</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              In order to register to the Site, you will need to provide us with certain information. Your registration to the Site may not be accepted if you do not provide us with the required information. We reserve the right to decline any registration without further explanation. We reserve the right to undertake such checks as are necessary to verify your identity.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Once you have successfully completed registration, your registration shall continue for an indefinite period, subject to suspension or termination in accordance with Section 6 of these Terms of Use.
            </p>

            {/* Section 3 */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">
              3. Your Obligations
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              When using or accessing the Services, you agree that you:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-4 space-y-2">
              <li>Are responsible for maintaining the confidentiality of, and restricting access to and use of your account and password, and accept responsibility for all activities that occur under your account and password;</li>
              <li>Agree to immediately notify us of any unauthorised use of your password or account or any other breach of security;</li>
              <li>Will provide true, accurate, current and complete information about yourself and your use of the Services as required by us;</li>
              <li>Will not disclose to any third party (except as required or requested by us) a user&apos;s information provided to you; and</li>
              <li>Will cooperate with our requests for additional information with respect to your eligibility and usage of our Services.</li>
            </ul>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
              When using or accessing the Services, you agree that you will not:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-4 space-y-2">
              <li>Post, list or upload in any manner any information which is blasphemous, defamatory, obscene, libellous, invasive of another&apos;s privacy, hateful, or racially, ethnically objectionable, disparaging, relating or encouraging money laundering or gambling, or otherwise unlawful in any manner whatsoever;</li>
              <li>Post, list or upload content or items in inappropriate or prohibited categories or areas on our Site;</li>
              <li>Post items you do not have a right to link to or include;</li>
              <li>Post counterfeit or stolen items;</li>
              <li>Breach or circumvent any laws, third party rights or our systems, policies or determinations of your account status;</li>
              <li>Use our Services if you no longer fulfil the eligibility criteria or are not able to form legally binding contracts;</li>
              <li>Fail to pay for items purchased by you, unless you have a valid reason as set out in any of our policies;</li>
              <li>Use contact information provided to you during the course of a transaction on the Site to solicit additional sales offline or on another website;</li>
              <li>Manipulate the price of any item;</li>
              <li>Interfere with any other user&apos;s listings;</li>
              <li>Take any action that may undermine the Site&apos;s feedback and ratings systems;</li>
              <li>Post false, inaccurate, misleading, deceptive, defamatory or similar content;</li>
              <li>Transfer your account to another party without our prior written consent;</li>
              <li>Distribute or post spam, unsolicited or bulk electronic communications or similar;</li>
              <li>Distribute viruses or any other technologies that may harm our Services or the interests or property of other users;</li>
              <li>Infringe any Intellectual Property Rights that belong to or are licensed to us or third parties;</li>
              <li>Harvest or otherwise collect information about users without their consent; or</li>
              <li>Circumvent any technical measures we use to provide the Services.</li>
            </ul>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
              <strong>Prohibited Content:</strong> The following items are prohibited on our platform:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6 space-y-2">
              <li>Content or items that may be considered culturally or religiously offensive;</li>
              <li>Content or items which may not be in compliance with general local law, Islamic law, rules, morals, values, ethics and traditions;</li>
              <li>Content or items that may threaten national security;</li>
              <li>Content or items which may promote gambling;</li>
              <li>Securities, including shares, bonds, debentures, or any other financial instruments;</li>
              <li>Living or dead creatures and/or preserved animals;</li>
              <li>Weapons of any description;</li>
              <li>Liquor, tobacco products, drugs, psychotropic substances, narcotics, intoxicants and medicines;</li>
              <li>Items that are defective, fake, damaged, false or misleading;</li>
              <li>Non-transferable vouchers; and</li>
              <li>Chemicals.</li>
            </ul>

            {/* Section 4 */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">
              4. Intellectual Property Rights
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Except for the rights expressly granted under these Terms of Use:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-4 space-y-2">
              <li>All content included on the Site, including but not limited to text, graphics, logos, images, audio clips, digital downloads and software is our property or the property of our licensors. We (or our licensors, as the case may be) retain all right, title and interest in and to the Site and the Services, including, without limitation, all Intellectual Property Rights therein; and</li>
              <li>All rights, title and interest in and to any information, materials or other content that you provide in connection with your use of the Services, including all Intellectual Property Rights therein, will become our property.</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              You agree that you have no right to use any of our trademarks without our prior written consent. All rights not expressly granted to you in these Terms of Use are reserved and retained by us or our licensors.
            </p>

            {/* Section 5 */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">
              5. Warranties, Representations & Undertakings
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You warrant, represent and undertake that:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-4 space-y-2">
              <li>You shall fully comply and will at all times continue to fully comply with all applicable laws, statutes and regulations, including, without limitation, all privacy laws and content regulation;</li>
              <li>You have full power and authority to enter into these Terms of Use and the execution and performance of your obligations does not conflict with any laws, rules, regulations or governmental guidelines, or any other agreements to which you are a party;</li>
              <li>If you create or use an account on behalf of a business entity, you represent that you are authorised to act on behalf of such business and bind the business to these Terms of Use;</li>
              <li>You own or have the authority to grant the rights and licences granted to us by you under these Terms of Use; and</li>
              <li>Any content you submit as part of your use of the Services and any products that you list do not violate the rights of any third party anywhere in the world.</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              The Services are provided to you on an &quot;as is&quot; basis without representations, warranties or conditions of any kind. We disclaim all warranties, conditions and representations of any kind, whether express, implied or collateral, including, but not limited to, all conditions, representations or warranties of merchantability, of fitness for a particular or general purpose, of non-infringement, of compatibility or that the Services are secure or error free or will operate without interruption.
            </p>

            {/* Section 6 */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">
              6. Liability & Indemnities
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Nothing in these Terms of Use shall limit or exclude a party&apos;s liability:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-4 space-y-2">
              <li>For fraud, including fraudulent misrepresentation, perpetrated by that party;</li>
              <li>For death or personal injury caused by the negligence of that party; or</li>
              <li>For any other liability that cannot be limited or excluded under applicable law.</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              In no event will we, our parent company, subsidiaries and affiliates, and our directors, officers, agents, employees, suppliers, subcontractors or licensors be liable for loss of profits, loss of data or information, business interruption or for any special, indirect, incidental or consequential damages.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We are not liable, and you agree not to hold us responsible, for any damages or losses resulting directly or indirectly from:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-4 space-y-2">
              <li>The content or other information you provide when using the Services;</li>
              <li>Your use of or your inability to use our Services;</li>
              <li>Pricing, shipping, format or other guidance provided by us;</li>
              <li>Delays or disruptions in our Services;</li>
              <li>Viruses or other malicious software obtained by accessing or linking to our Services;</li>
              <li>Bugs, errors or inaccuracies of any kind in our Services;</li>
              <li>Damage to your hardware device from the use of products sold on the Site;</li>
              <li>The content, actions or inactions of third parties using our Services;</li>
              <li>A suspension or other action taken by us with respect to your use of the Services;</li>
              <li>The duration or manner in which your listings appear in search results; or</li>
              <li>Your need to modify practices, content or behaviour as a result of changes to these Terms of Use.</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              You agree to indemnify and hold us, our parent company, subsidiaries and affiliates harmless from and against any losses, damages and expenses (including legal fees) arising out of or relating to your use of the Services, your violation of any provisions of these Terms of Use, or any applicable laws.
            </p>

            {/* Section 7 */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">
              7. Suspension, Termination & Cancellation
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We may, at our sole discretion and without any liability to you, limit, suspend or permanently withdraw your access of our Services, cancel any product(s) order and/or remove hosted content submitted by you for any reason including:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-4 space-y-2">
              <li>If we believe that you have infringed, breached, violated, abused, or unethically manipulated or exploited any term of these Terms of Use;</li>
              <li>If you use our Platform or Services for any unlawful and fraudulent purposes or in connection with a criminal offence;</li>
              <li>You are suspected of inventory abuse or placing bulk orders.</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              <strong>Inventory Abuse:</strong> The following shall constitute inventory abuse or placing bulk order:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-4 space-y-2">
              <li>Products ordered are not for self-consumption but for commercial resale;</li>
              <li>Multiple orders placed for same product at the same address;</li>
              <li>Bulk quantity of the same product ordered;</li>
              <li>Invalid address given in order details;</li>
              <li>Any abuse or fraud used to place the order; or</li>
              <li>Any order placed using a technological glitch/loophole.</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              <strong>Fraudulent Activities:</strong> You may be considered to be engaging in fraudulent activities if:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-4 space-y-2">
              <li>You don&apos;t reply to the payment verification mail sent by us;</li>
              <li>You fail to produce adequate documents during the payment details verification;</li>
              <li>You misuse credentials not belonging to you;</li>
              <li>You use invalid address, email and phone number;</li>
              <li>You attempt to overuse a voucher code;</li>
              <li>You refuse to pay for an order;</li>
              <li>For COD items, you use fake currency notes to make the payment;</li>
              <li>You abuse or harass the delivery staff;</li>
              <li>Activities conducted with the sole intention to cause loss to business/revenue;</li>
              <li>Your return/undeliverable rate is very high with missing, fake or damaged products; or</li>
              <li>Repeated requests for monetary compensation.</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              If your access to our Services is terminated, we may delete any content or other materials relating to your use of the Service and we will have no liability to you or any third party for doing so. Any amounts paid in relation to a cancelled order will be refunded.
            </p>

            {/* Section 8 */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">
              8. Reporting Violations
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We are committed to ensuring that listed items and content on our Site comply with these Terms of Use. If you believe that a listed item or content breaches these Terms of Use, please notify us and we will investigate.
            </p>

            {/* Section 9 */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">
              9. General Provisions
            </h2>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-2">9.1 Governing Law</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              These Terms of Use shall be governed by and construed in accordance with the laws of the United Arab Emirates, as applied in the Emirate of Dubai.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-2">9.2 Dispute Resolution</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              If you have an issue with our Services, please contact us. We will endeavour to resolve your issue as soon as possible. Any disputes arising out of or in connection with these Terms of Use shall be referred to and finally resolved by arbitration under the Arbitration Rules of the DIFC – LCIA Arbitration Centre. The number of arbitrators shall be one. The seat of arbitration shall be the Dubai International Financial Centre. The language shall be English.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-2">9.3 Third Party Rights</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              A person who is not a party to these Terms of Use has no right to enforce any of its terms.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-2">9.4 Relationship of the Parties</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Nothing contained in these Terms of Use will be deemed to create the relationship of partnership, joint venture or agency between the parties.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-2">9.5 Assignment</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              These Terms of Use will be binding upon and enure to the benefit of the parties and their respective successors and permitted assigns. You agree that you will not assign or transfer these Terms of Use without first obtaining our prior written consent.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-2">9.6 Entire Agreement</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              These Terms of Use and the documents referred to herein contain the entire agreement between the parties with respect to the subject matter and supersede all prior agreements, negotiations and representations.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-2">9.7 Severability</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              If any provision of these Terms of Use is determined to be invalid, illegal or unenforceable, that provision will be severed and the remaining provisions will continue in full force and effect.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-2">9.8 Force Majeure</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Neither party will be liable for any loss or damage or for any delay or failure in performance due to acts beyond the control of such party (including acts of God, legislative or regulatory acts, court or regulatory authority decisions, labour disruptions, blackouts, embargoes).
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-2">9.9 No Waiver</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Any waiver by us of any of the provisions of these Terms of Use will not constitute a waiver of any other provision, nor will any such waiver constitute a continuing waiver of that particular provision.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-2">9.10 Communications</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You may contact us through email, social media or live chat on the Site.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-2">9.11 Survival</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              All provisions that either expressly or by their nature survive, will survive suspension or termination of your membership of the Site.
            </p>

            {/* Section 10 */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">
              10. Digital Products Policy
            </h2>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-8">
              <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                All digital products sold on Digistore1 are for personal use only.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                You are not permitted to resell, redistribute, share, or modify any product purchased from our store. No commercial, resale, or private label rights are granted.
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

