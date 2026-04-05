import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Info } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "AP/AR Transaction Fees — Bill.com Powered Accounts Payable & Receivable",
  description:
    "Full breakdown of Accounts Payable and Receivable transaction fees for Enterprise plan clients. Bill.com-powered AP/AR — 15 ACH + 15 mailed checks included monthly, overages at cost with no markup.",
  keywords: [
    "accounts payable accounts receivable service",
    "AP AR service small business",
    "Bill.com transaction fees",
    "ACH payment fees small business",
    "accounts payable management service",
    "bookkeeping with AP AR included",
  ],
  openGraph: {
    title: "AP/AR Transaction Fees — Bill.com Powered | BookKeeping.business",
    description:
      "Accounts Payable and Receivable transaction fee schedule for Enterprise clients. 15 ACH + 15 checks included monthly.",
    url: "https://www.bookkeeping.business/ap-ar-fees",
  },
  alternates: { canonical: "https://www.bookkeeping.business/ap-ar-fees" },
}

function FeeRow({ label, fee, note }: { label: string; fee: string; note?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-border/50 last:border-0">
      <div className="flex-1">
        <p className="text-sm font-medium">{label}</p>
        {note && <p className="text-xs text-muted-foreground mt-0.5">{note}</p>}
      </div>
      <span className="text-sm font-semibold text-right shrink-0 tabular-nums">{fee}</span>
    </div>
  )
}

function SectionCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export default function APARFeesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="container py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <Badge variant="outline" className="px-4 py-1.5">Enterprise Plan — AP/AR</Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">
              AP/AR Transaction Fees
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
              We use Bill.com to manage Accounts Payable and Receivable on your behalf. The Enterprise plan includes
              15 ACH payments and 15 mailed checks per month at no extra cost. Any transactions beyond those limits
              are billed at cost using the rates below — no markup.
            </p>
          </div>
        </section>

        {/* Included in Enterprise */}
        <section className="container pb-12">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-2xl border border-primary/20 bg-primary/5 px-6 py-5 flex items-start gap-3">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="text-sm leading-relaxed text-muted-foreground">
                <strong className="text-foreground">Included in Enterprise plan (no extra charge):</strong>{" "}
                15 ACH/ePayments + 15 mailed checks per month. Overages and all other transaction types below are
                billed at cost — exactly what Bill.com charges, passed through with zero markup.
              </div>
            </div>
          </div>
        </section>

        {/* Fee Tables */}
        <section className="container pb-24">
          <div className="max-w-3xl mx-auto space-y-8">

            {/* Payor — Bank/BILL Balance */}
            <SectionCard
              title="Payor Fees — Paying from Bank, BILL Balance, or BILL Cash Account"
              description="Fees when you pay vendors or bills from a bank account or BILL balance"
            >
              <FeeRow label="ACH / ePayment" fee="$0.59" />
              <FeeRow label="Mailed Check" fee="$1.99" note="Bill.com prints and mails the check on your behalf" />
              <FeeRow label="Virtual Card" fee="Free" />
              <FeeRow label="International FX Wire / Local Transfer" fee="Free" note="Exchange rate applies" />
              <FeeRow label="International USD Wire" fee="$19.99" note="Fee may be transferred to the receiver" />
              <FeeRow label="Instant Payment" fee="1.0%" note="$9.99 minimum fee, $100 maximum fee" />
              <FeeRow
                label="Pay Faster ACH — Same-Day"
                fee="$11.99"
                note="Schedule by 10:00 am PT. Excludes weekends and bank holidays."
              />
              <FeeRow
                label="Pay Faster ACH — Next-Day"
                fee="$11.99"
                note="Schedule by 6:00 pm PT. Excludes weekends and bank holidays."
              />
              <FeeRow label="Pay Faster Check — Overnight" fee="$24.99" note="Excludes weekends and bank holidays" />
              <FeeRow label="Pay Faster Check — Two-Day" fee="$19.99" note="Excludes weekends and bank holidays" />
              <FeeRow label="Pay Faster Check — Three-Day" fee="$14.99" note="Excludes weekends and bank holidays" />
            </SectionCard>

            {/* Payor — Pay by Card */}
            <SectionCard
              title="Payor Fees — Paying by Credit or Debit Card"
              description="Fees when you pay vendors using a credit or debit card"
            >
              <FeeRow label="ACH / ePayment" fee="2.9%" />
              <FeeRow label="Check" fee="2.9%" />
              <FeeRow label="Virtual Card" fee="2.9%" />
              <FeeRow label="International FX Wire" fee="2.9%" />
              <FeeRow label="International USD Wire" fee="2.9%" />
              <FeeRow label="Pay Faster Check — Overnight" fee="2.9% + $24.99" />
              <FeeRow label="Pay Faster Check — Two-Day" fee="2.9% + $19.99" />
              <FeeRow label="Pay Faster Check — Three-Day" fee="2.9% + $14.99" />
            </SectionCard>

            {/* BILL Divvy Card */}
            <SectionCard title="BILL Divvy Card">
              <FeeRow label="Virtual Card Payment" fee="Free" />
            </SectionCard>

            {/* Other Payor Fees */}
            <SectionCard
              title="Other Payor Fees"
              description="Miscellaneous fees for edge cases and filings"
            >
              <FeeRow label="Exchange Rate" fee="Disclosed at time of transaction" />
              <FeeRow label="Void a Check" fee="$25.00" />
              <FeeRow label="Void a Returned Check" fee="$3.00" />
              <FeeRow label="Failed ACH (after receiver is paid)" fee="$50.00" />
              <FeeRow label="Re-debit after Failed Funding" fee="$25.00" />
              <FeeRow label="1099 E-filing to IRS" fee="$2.99 / form" />
              <FeeRow label="1099 E-filing via Accountant Console" fee="$1.99 / form" />
              <FeeRow label="1099 Direct State Filing" fee="$1.49 / form" />
              <FeeRow label="1099 Mail Delivery to Vendors" fee="$1.99 / form" />
            </SectionCard>

            {/* Receiver Fees */}
            <SectionCard
              title="Receiver Fees — When You Receive Payments"
              description="Fees applied when your clients pay you through Bill.com"
            >
              <FeeRow label="ACH / ePayment" fee="$0.59" />
              <FeeRow label="Credit or Debit Card" fee="2.9%" note="You may pass this fee to your customer" />
              <FeeRow label="International FX Wire / Local Transfer" fee="Free" note="Exchange rate applies" />
              <FeeRow label="International USD Wire" fee="$19.99" />
              <FeeRow label="Instant Transfer" fee="1.0% – 1.49%" note="$1 minimum fee" />
              <FeeRow label="Mailed Invoice" fee="$1.99" />
              <FeeRow label="Exchange Rate" fee="Disclosed at time of transaction" />
            </SectionCard>

            {/* Canada */}
            <SectionCard title="Canada Fees">
              <FeeRow label="CAD balance withdrawal in CAD" fee="Free" />
              <FeeRow label="USD balance withdrawal in CAD" fee="Free" note="Exchange rate applies" />
              <FeeRow label="USD balance withdrawal in USD" fee="$19.99 USD" />
              <FeeRow label="Exchange Rate" fee="Disclosed at time of transaction" />
            </SectionCard>

            {/* UK */}
            <SectionCard title="UK Fees">
              <FeeRow label="EUR/GBP invoice payments received" fee="Free" />
              <FeeRow label="USD invoice payments delivered in USD" fee="$19.99 USD" />
              <FeeRow label="USD invoice payments delivered in GBP" fee="Free" note="Exchange rate applies" />
              <FeeRow label="Exchange Rate" fee="Disclosed at time of transaction" />
            </SectionCard>

            {/* Note */}
            <div className="rounded-xl border border-border bg-muted/30 px-5 py-4 text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Note:</strong> These are Bill.com&apos;s standard published fees.
              We pass them through at cost with no markup. We cover the Bill.com platform subscription — you are
              never billed for the software itself, only for transactions that exceed your plan&apos;s included limits.
              All fees are subject to change by Bill.com; we will notify you of any material changes.
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border bg-muted/30 py-16">
          <div className="container">
            <div className="mx-auto max-w-xl text-center space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Questions about AP/AR?</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                AP/AR management is included in the Enterprise plan. Contact us if you'd like to discuss your
                payment volume or need a custom arrangement.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/contact">
                  <Button>
                    Contact Us
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/bookkeeping#pricing">
                  <Button variant="outline" className="bg-transparent">
                    View Plan Pricing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
