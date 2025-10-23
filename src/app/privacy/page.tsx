"use client";

import NavBar from "../components/navbar/NavBar";
import Footer from "../components/footer/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">
          This Privacy Policy explains how Tikoyangu ("we", "us", or "our") collects, uses, discloses, and safeguards your information when you access our website, create an account, organize an event, or purchase tickets. We respect your privacy and are committed to protecting your personal data. Please read this policy carefully. By using our services, you consent to the practices described here. If you do not agree, please discontinue use of the platform.
        </p>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">1. Information We Collect</h2>
            <p>
              We collect information to deliver reliable ticketing and event services. This includes identifiers you provide directly (such as name, email address, phone number, billing address, and account credentials) as well as information automatically collected through your use of the site (including device identifiers, IP addresses, browser type, referring URLs, and pages visited). If you purchase tickets, we may collect limited payment information necessary to facilitate the transaction through our payment partners. Organizers may upload event content (images, descriptions, schedules, and venue information) that could contain personal information; organizers are responsible for ensuring such content complies with applicable laws and that they have obtained relevant permissions.
            </p>
            <p className="mt-4">
              We also collect usage analytics to help us understand feature adoption, diagnose performance issues, and improve the customer experience. Cookies and similar technologies enable session continuity, authentication, fraud prevention, and preference storage. You can configure your browser to refuse non-essential cookies; however, essential cookies are required for secure access and basic functionality.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">2. How We Use Your Information</h2>
            <p>
              We use your information to operate and improve our platform, process orders, provide customer support, personalize content, and communicate important service updates (such as purchase confirmations, event changes, and security notifications). We may use aggregated and de-identified data for analytics, reporting, and product development. Where legally permitted, we may send you promotional communications about events that may be of interest to you; you can opt out of marketing at any time via the unsubscribe link or your account settings while still receiving transactional messages.
            </p>
            <p className="mt-4">
              We process personal data on several legal bases, including performance of a contract (ticket purchases and service delivery), legitimate interests (platform security, fraud detection, and product improvement), compliance with legal obligations, and your consent where required (for example, certain cookies or direct marketing in specific jurisdictions).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">3. Sharing and Disclosure</h2>
            <p>
              We may share necessary information with service providers who assist in payment processing, hosting, analytics, customer support, and email delivery. Where you purchase tickets, relevant order details may be shared with the event organizer to fulfill your purchase and manage entry. We require third parties to implement appropriate security measures and to process data only as instructed by us. We may also disclose information if required by law, to protect our rights, investigate suspected fraud or abuse, or in connection with a business transaction such as a merger, acquisition, or asset sale.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">4. Data Retention and Security</h2>
            <p>
              We retain personal data only for as long as necessary to provide the services, comply with legal obligations, resolve disputes, and enforce agreements. We employ administrative, technical, and physical safeguards to protect data, including encryption in transit, restricted access controls, and continuous monitoring. While no system can be guaranteed 100% secure, we regularly review our controls and train staff to reduce risk. If we suspect a security incident affecting your data, we will investigate and comply with applicable notification laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">5. Your Rights and Choices</h2>
            <p>
              Depending on your location, you may have rights to access, correct, delete, or restrict processing of your personal data, to object to certain processing, and to data portability. You can exercise many of these rights via your account settings or by contacting us. We will verify requests and respond within the timeframes required by law. You may also manage cookie preferences through your browser and opt out of marketing communications at any time without affecting important transactional emails.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">6. International Transfers</h2>
            <p>
              Our services may be provided using infrastructure and providers located in multiple countries. Where personal data is transferred internationally, we implement appropriate safeguards such as standard contractual clauses or equivalent mechanisms to ensure adequate protection consistent with applicable privacy laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">7. Updates and Contact</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes to our practices or legal requirements. Material changes will be communicated through the website or by email when appropriate. Your continued use of the platform after an update constitutes acceptance of the revised policy. If you have questions or wish to exercise your privacy rights, please contact our support team using the Support page.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
