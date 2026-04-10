import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Privacy Policy | BookKeeping.business",
  description:
    "Learn how BookKeeping.business protects your personal and financial information with bank-level encryption, secure data handling, and compliance with IRS regulations.",
  openGraph: {
    title: "Privacy Policy | BookKeeping.business",
    description: "How we protect your personal and financial information with bank-level security.",
    url: "https://bookkeeping.business/privacy",
  },
}
import { SiteFooter } from "@/components/site-footer"

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="space-y-4 text-center">
              <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
              <p className="text-sm text-muted-foreground">Last updated: January 2026</p>
            </div>

            <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Introduction</h2>
                <p className="text-muted-foreground leading-relaxed">
                  BookKeeping.business is committed to protecting your privacy and
                  maintaining the confidentiality of your personal and financial information. This Privacy Policy
                  explains how we collect, use, disclose, and safeguard your information when you use our services and
                  client portal.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Information We Collect</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We collect information that you provide directly to us, including:
                </p>
                <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                  <li>Personal identification information (name, email, phone number, address)</li>
                  <li>Social Security numbers and tax identification numbers</li>
                  <li>Financial information (income, expenses, bank account information)</li>
                  <li>Business information (entity details, EINs, financial statements)</li>
                  <li>Documents you upload to our secure portal (W-2s, 1099s, receipts, etc.)</li>
                  <li>Communications with our team through the portal or email</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">How We Use Your Information</h2>
                <p className="text-muted-foreground leading-relaxed">We use your information to:</p>
                <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                  <li>Prepare and file your tax returns</li>
                  <li>Provide bookkeeping and accounting services</li>
                  <li>Communicate with you about your account and services</li>
                  <li>Process payments and manage billing</li>
                  <li>Comply with legal and regulatory obligations</li>
                  <li>Improve our services and develop new features</li>
                  <li>Send service updates and important notices</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Information Sharing and Disclosure</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We do not sell, trade, or rent your personal information to third parties. We may share your
                  information only in the following circumstances:
                </p>
                <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                  <li>
                    <strong>With the IRS and state tax authorities</strong> as required to file your tax returns
                  </li>
                  <li>
                    <strong>With service providers</strong> who assist in operating our platform (cloud hosting, payment
                    processing)
                  </li>
                  <li>
                    <strong>When required by law</strong> in response to legal processes or government requests
                  </li>
                  <li>
                    <strong>With your consent</strong> when you authorize us to share information with third parties
                  </li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Data Security</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We implement industry-standard security measures to protect your information:
                </p>
                <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                  <li>256-bit SSL encryption for all data transmission</li>
                  <li>Encrypted data storage with restricted access</li>
                  <li>Multi-factor authentication options for portal access</li>
                  <li>Regular security audits and updates</li>
                  <li>Employee training on data privacy and security</li>
                  <li>Professional liability insurance coverage</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Data Retention</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We retain your information for as long as necessary to provide services and comply with legal
                  obligations. Tax documents and related records are maintained for a minimum of 7 years as required by
                  IRS regulations. You may request deletion of your data after the required retention period, subject to
                  our legal and regulatory obligations.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Your Rights</h2>
                <p className="text-muted-foreground leading-relaxed">You have the right to:</p>
                <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                  <li>Access and review your personal information</li>
                  <li>Request corrections to inaccurate information</li>
                  <li>Request deletion of your information (subject to retention requirements)</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Withdraw consent for data processing where applicable</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Cookies and Tracking</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We use cookies and similar tracking technologies to improve your experience on our website. These
                  technologies help us understand how you use our site, maintain your session, and provide personalized
                  content. You can control cookies through your browser settings.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Changes to This Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by
                  posting the new policy on this page and updating the "Last updated" date. We encourage you to review
                  this policy periodically.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have questions or concerns about this Privacy Policy or our data practices, please contact us
                  at:
                </p>
                <div className="text-muted-foreground">
                  <p>Email: hello@bookkeeping.business</p>
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
