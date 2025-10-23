"use client";

import NavBar from "../components/navbar/NavBar";
import Footer from "../components/footer/Footer";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Cookie Policy</h1>
        <p className="text-gray-600 mb-8">
          This Cookie Policy explains how Tikoyangu uses cookies and similar technologies to provide, protect, and improve our services. It outlines what cookies are, the types we use, how third parties may place cookies, and how you can control them. By continuing to browse or use our platform, you agree to the placement of cookies described here, unless you have adjusted your browser settings to refuse them.
        </p>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">1. What Are Cookies?</h2>
            <p>
              Cookies are small text files placed on your device when you visit websites. They enable core functionality such as keeping you logged in, remembering preferences, and ensuring secure transactions. Related technologies like pixels, local storage, and device identifiers may also be used to achieve similar purposes. Some cookies are session-based and expire when you close your browser; others are persistent and remain until they expire or are deleted.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">2. Types of Cookies We Use</h2>
            <p>
              We categorize cookies as follows: (a) Strictly Necessary cookies that are essential for secure sign-in, account management, and ticket checkout; (b) Performance cookies that help us understand how the site is used so we can improve features and reliability; (c) Functionality cookies that remember your preferences, such as language, region, and saved items; and (d) Advertising/Analytics cookies that help us measure campaign effectiveness or show relevant content. We strive to minimize tracking and use aggregated reporting where possible.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">3. Third-Party Cookies</h2>
            <p>
              Some cookies may be set by third-party providers we rely on for payment processing, analytics, performance monitoring, and customer support tools. These providers process data on our behalf and are required to implement appropriate safeguards. We do not control the use of third-party cookies directly, so we encourage you to review the privacy practices of those providers when applicable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">4. Managing Your Preferences</h2>
            <p>
              You can control cookies through your browser settings by blocking or deleting them. Most browsers allow you to accept or reject cookies and to delete existing ones. Note that disabling strictly necessary cookies may affect site functionality, including login, checkout, and access to secure areas. For analytics and marketing cookies, you may also opt out using industry tools where available.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">5. Data Collected via Cookies</h2>
            <p>
              Cookies may collect device and usage data such as IP address, browser type, referring URLs, pages visited, and time spent on pages. We use this information to improve performance, investigate errors, and enhance security. Aggregated analytics help us identify trends and prioritize product enhancements without directly identifying individual users.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">6. Updates</h2>
            <p>
              We may update this Cookie Policy as our practices evolve or as regulations change. Material updates will be posted on this page, and your continued use of the platform after an update indicates acceptance of the revised policy.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
