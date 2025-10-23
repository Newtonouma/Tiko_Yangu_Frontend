"use client";

import NavBar from "../components/navbar/NavBar";
import Footer from "../components/footer/Footer";

export default function RefundsPage() {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Refund Policy</h1>
        <p className="text-gray-600 mb-8">
          This Refund Policy explains the circumstances under which refunds may be issued for tickets purchased through Tikoyangu, your responsibilities as a buyer, and the obligations of event organizers. Because we facilitate transactions between organizers and attendees, many refund determinations are governed by the organizer’s policy and applicable consumer laws. Please read this policy carefully before completing your purchase.
        </p>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">1. Eligibility for Refunds</h2>
            <p>
              Refund eligibility depends on the event’s status (scheduled, postponed, or canceled), the organizer’s stated policy, and any mandatory rights granted by law in your jurisdiction. Generally, tickets for successfully delivered events are non-refundable. If an event is canceled and not rescheduled, you may be entitled to a refund of the ticket price and applicable taxes. Service fees may be non-refundable unless required by law or where we explicitly indicate otherwise. For rescheduled events, your ticket is typically valid for the new date; if you cannot attend, eligibility may be determined by the organizer.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">2. How to Request a Refund</h2>
            <p>
              To request a refund, contact our support team with your order number, the email used at checkout, and a brief explanation. We may ask for additional details to verify the purchase and assess eligibility. Requests should be submitted within the timeframe specified by the organizer or, if none is specified, within a reasonable period after the trigger event (cancellation, material change, or failure to deliver the core event experience). Submitting a request does not guarantee approval; each request is reviewed on a case-by-case basis in alignment with this policy and the organizer’s rules.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">3. Processing and Timelines</h2>
            <p>
              Approved refunds are typically initiated promptly. The time it takes for funds to appear depends on your payment method and financial institution, usually within 5–10 business days after approval. Where partial refunds apply (for example, when only certain items in an order are eligible), we will clearly indicate the refunded amount. If a payment fails or a chargeback is initiated, we may suspend associated tickets pending resolution to prevent misuse or duplicate entry.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">4. Non-Refundable Situations</h2>
            <p>
              Except where required by law or explicitly stated otherwise, we do not offer refunds for user error (such as incorrect email entry), change of mind, missed events, or dissatisfaction with subjective aspects of an event (e.g., lineup changes that do not materially alter the event). Tickets obtained through unauthorized channels or in violation of the Terms may be canceled without refund. We are not responsible for incidental costs such as travel or accommodation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">5. Event Changes and Cancellations</h2>
            <p>
              Organizers may change venues, performers, or schedules. Material changes are those that fundamentally alter the event’s nature. In cases of cancellation or material change, we will work with the organizer to communicate updates and, where applicable, facilitate refunds or exchanges. Your statutory rights, if any, remain unaffected.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">6. Contact and Escalation</h2>
            <p>
              If you believe your refund request was incorrectly denied, you may reply to the support thread for further review. Provide any supporting evidence (such as official cancellation notices). We aim to handle escalations promptly and fairly, prioritizing transparency and adherence to applicable regulations.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
