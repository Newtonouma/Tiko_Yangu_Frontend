"use client";

import NavBar from "../components/navbar/NavBar";
import Footer from "../components/footer/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms and Conditions</h1>
        <p className="text-gray-600 mb-8">
          These Terms and Conditions ("Terms") govern your access to and use of Tikoyangu, including any content, functionality, and services offered on or through our platform. By creating an account, browsing events, organizing events, or purchasing tickets, you agree to be bound by these Terms. If you do not accept these Terms, you must not use the platform.
        </p>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">1. Accounts and Eligibility</h2>
            <p>
              You must provide accurate, current, and complete information when creating an account and keep your credentials secure. You are responsible for all activities that occur under your account. We reserve the right to suspend or terminate accounts for suspected fraud, misuse, or violations of these Terms. If you are an organizer, you affirm that you have the authority to publish event information, use media assets, and sell tickets in accordance with applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">2. Event Listings and Content</h2>
            <p>
              Organizers are solely responsible for the accuracy and legality of event listings, including titles, descriptions, images, schedules, prices, and venue information. You grant us a non-exclusive, worldwide license to host, display, and distribute your event content for the purpose of operating the platform and promoting events. We may moderate or remove content that we reasonably believe violates these Terms or applicable law, including misleading, defamatory, or infringing materials.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">3. Ticket Purchases and Fees</h2>
            <p>
              When you purchase a ticket, you enter into a contract with the event organizer. Prices, fees, and taxes are disclosed at checkout. You are responsible for reviewing event details, seat selections, and refund eligibility before confirming payment. Service fees help maintain the platform and are generally non-refundable unless required by law or explicitly stated otherwise. Delivery of tickets may be electronic, and you must safeguard your tickets to prevent unauthorized use.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">4. Cancellations, Changes, and Refunds</h2>
            <p>
              Event schedules and lineups may change. If an organizer cancels or materially alters an event, refund eligibility will be governed by our Refund Policy and the organizer’s terms. We will use reasonable efforts to notify affected ticket holders and process approved refunds in a timely manner. We are not liable for travel or accommodation expenses incurred in connection with events.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">5. Acceptable Use</h2>
            <p>
              You agree not to misuse the platform, including by attempting to scrape, circumvent security controls, create fraudulent accounts, resell tickets in violation of event rules, or interfere with other users’ experiences. You may not upload malware, engage in harassment, or violate intellectual property rights. We may investigate and take action against prohibited conduct, including account suspension and legal enforcement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">6. Intellectual Property</h2>
            <p>
              Tikoyangu’s trademarks, logos, interfaces, and software are protected by intellectual property laws. Except as expressly permitted, you may not copy, modify, distribute, or create derivative works from the platform. Event content remains the property of its respective owners. You represent that you have the necessary rights to submit any content you upload, and you grant us the limited license necessary to operate the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">7. Disclaimers and Limitation of Liability</h2>
            <p>
              The platform is provided on an “as is” and “as available” basis. To the fullest extent permitted by law, we disclaim warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not guarantee uninterrupted or error-free operation, nor the accuracy of third-party content. To the extent allowed by law, our total liability arising from your use of the platform will not exceed the amounts paid by you to us in the six months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">8. Governing Law and Disputes</h2>
            <p>
              These Terms are governed by the laws of the jurisdiction in which Tikoyangu is established, without regard to conflict-of-laws principles. Disputes will be resolved through good-faith negotiations, and, if necessary, through a competent court or agreed alternative dispute resolution mechanism. Consumers may have additional rights under local laws which are not superseded by these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">9. Changes to Terms</h2>
            <p>
              We may revise these Terms from time to time. Material changes will be posted on the website and, when appropriate, communicated via email. Your continued use of the platform after the effective date constitutes acceptance of the updated Terms. If you do not agree with the changes, you should discontinue use of the services.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
