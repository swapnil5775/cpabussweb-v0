import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Terms of Service | BookKeeping.business",
  description:
    "Terms of Service for BookKeeping.business tax preparation, bookkeeping, and business advisory services. Learn about client responsibilities, fees, and professional standards.",
  openGraph: {
    title: "Terms of Service | BookKeeping.business",
    description: "Terms and conditions for our tax preparation, bookkeeping, and business advisory services.",
    url: "https://bookkeeping.business/terms",
  },
}
import { SiteFooter } from "@/components/site-footer"

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="space-y-4 text-center">
              <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
              <p className="text-sm text-muted-foreground">Last updated: January 2026</p>
            </div>

            <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Agreement to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing or using BookKeeping.business services, you agree to be
                  bound by these Terms of Service. If you do not agree to these terms, you may not use our services.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Services Provided</h2>
                <p className="text-muted-foreground leading-relaxed">
                  BookKeeping.business provides professional tax preparation, bookkeeping, and business advisory services. Our
                  services include:
                </p>
                <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                  <li>Individual and business tax preparation and filing</li>
                  <li>Monthly bookkeeping and financial reporting</li>
                  <li>Business formation assistance and compliance support</li>
                  <li>Financial analysis and consultation services</li>
                  <li>Secure document portal access</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Client Responsibilities</h2>
                <p className="text-muted-foreground leading-relaxed">As a client, you agree to:</p>
                <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                  <li>Provide accurate, complete, and timely information and documentation</li>
                  <li>Respond to our requests for additional information within reasonable timeframes</li>
                  <li>Maintain the confidentiality of your portal login credentials</li>
                  <li>Pay all fees according to the agreed-upon terms</li>
                  <li>Notify us immediately of any errors or omissions in our work product</li>
                  <li>Comply with all applicable tax laws and regulations</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Fees and Payment</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Service fees are quoted upfront based on the scope and complexity of work. Payment terms include:
                </p>
                <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                  <li>
                    Tax preparation fees are due before filing unless other arrangements have been made in writing
                  </li>
                  <li>Bookkeeping services are billed monthly in advance</li>
                  <li>Business services are billed according to the agreed-upon project scope</li>
                  <li>Late payments may incur interest charges as permitted by law</li>
                  <li>We reserve the right to suspend services for non-payment</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Scope of Work and Changes</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We will define the scope of work at the start of each engagement. If additional work is required
                  beyond the agreed scope, we will notify you and provide a revised quote. You will have the opportunity
                  to approve or decline additional services before we proceed.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Professional Standards</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our work is performed in accordance with professional standards and applicable regulations. However,
                  we make no guarantee of specific tax outcomes or savings. Tax preparation involves interpretation of
                  complex laws, and positions taken on returns may be subject to IRS review or challenge.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To the maximum extent permitted by law, our liability for any claims arising from our services is
                  limited to the fees paid for the specific service giving rise to the claim. We maintain professional
                  liability insurance as an additional layer of protection.
                </p>
                <p className="text-muted-foreground leading-relaxed">We are not liable for:</p>
                <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                  <li>Errors resulting from inaccurate or incomplete information provided by you</li>
                  <li>Penalties or interest resulting from late filing caused by delays in receiving your documents</li>
                  <li>Indirect, consequential, or punitive damages</li>
                  <li>Issues arising from services not specifically agreed upon in writing</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Confidentiality</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We maintain strict confidentiality of all client information in accordance with professional standards
                  and applicable laws. Information may only be disclosed with your consent or as required by law. See
                  our Privacy Policy for detailed information on data handling.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Not Legal Advice</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our business services include assistance with administrative processes and compliance matters, but do
                  not constitute legal advice. For legal questions related to business formation, contracts, or other
                  legal matters, you should consult with a licensed attorney.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Records Retention</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We retain client documents and records for a minimum of 7 years as required by IRS regulations. You
                  are responsible for maintaining your own copies of all documents and should not rely solely on our
                  records.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Termination</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Either party may terminate the service relationship at any time with written notice. Upon termination:
                </p>
                <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                  <li>You are responsible for payment of all services rendered through the termination date</li>
                  <li>We will provide you with copies of your documents and work product</li>
                  <li>We will continue to maintain confidentiality of your information</li>
                  <li>
                    Ongoing obligations (such as tax representation) will be handled according to professional standards
                  </li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Dispute Resolution</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Any disputes arising from these Terms or our services shall be resolved through binding arbitration in
                  accordance with the rules of the American Arbitration Association. Each party shall bear their own
                  costs of arbitration.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Changes to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update these Terms from time to time. Continued use of our services after changes constitutes
                  acceptance of the new terms. Material changes will be communicated to active clients.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Contact Information</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For questions about these Terms of Service, please contact:
                </p>
                <div className="text-muted-foreground">
                  <p>Email: legal@bookkeeping.business</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
