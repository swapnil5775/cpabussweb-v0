import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Check,
  CreditCard,
  FileText,
  TrendingUp,
  Building2,
  Zap,
  BarChart3,
  Clock,
  Shield,
  RefreshCw,
  Send,
  Inbox,
  CircleDollarSign,
  Layers,
  CheckCircle2,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Accounts Payable & Receivable Services — AP/AR Automation for Small Business",
  description:
    "Fully managed AP/AR for small businesses. We handle bill payments, vendor management, invoice delivery, collections follow-up, and cash flow forecasting — all synced to QuickBooks or Xero. Enterprise plan includes QuickBooks at no extra cost.",
  keywords: [
    "accounts payable services small business",
    "accounts receivable management",
    "AP AR outsourcing",
    "bill payment automation",
    "invoice management service",
    "cash flow forecasting service",
    "QuickBooks AP AR integration",
    "vendor payment management",
    "invoice collection service",
    "small business AP AR",
    "outsourced accounts payable",
    "outsourced accounts receivable",
  ],
  openGraph: {
    title: "Accounts Payable & Receivable — Fully Managed AP/AR | BookKeeping.business",
    description:
      "We manage your AP/AR end-to-end — pay vendors, collect from customers, and forecast cash flow. Synced to QuickBooks or Xero. Enterprise plan includes QuickBooks.",
    url: "https://www.bookkeeping.business/ap-ar",
  },
  alternates: { canonical: "https://www.bookkeeping.business/ap-ar" },
}

const apFeatures = [
  {
    icon: Inbox,
    title: "Bill Capture & Processing",
    description:
      "Vendor bills are captured, reviewed, and coded to the right GL account automatically. No more manual data entry or misplaced invoices.",
  },
  {
    icon: CheckCircle2,
    title: "Approval Workflows",
    description:
      "Route bills through your approval chain before payment. Custom thresholds so the right person approves the right spend.",
  },
  {
    icon: CreditCard,
    title: "ACH & Check Payments",
    description:
      "We schedule and execute vendor payments via ACH or mailed check on your behalf. Enterprise includes 15 ACH + 15 mailed checks per month.",
  },
  {
    icon: Building2,
    title: "Vendor Management",
    description:
      "Centralized vendor records with payment terms, W-9 status, and full payment history. Always audit-ready.",
  },
  {
    icon: Clock,
    title: "Payment Scheduling",
    description:
      "Bills are scheduled to pay on time — avoiding late fees while maximizing your cash on hand.",
  },
  {
    icon: RefreshCw,
    title: "Sync to QuickBooks / Xero",
    description:
      "Every bill and payment syncs to your accounting platform in real time. No double entry, no reconciliation headaches.",
  },
]

const arFeatures = [
  {
    icon: FileText,
    title: "Invoice Creation & Delivery",
    description:
      "Professional invoices created and sent to your customers via email — with your branding and payment instructions.",
  },
  {
    icon: CircleDollarSign,
    title: "Online Payment Acceptance",
    description:
      "Customers pay via ACH or credit card through a secure payment link. Faster collection, less chasing.",
  },
  {
    icon: Send,
    title: "Automated Payment Reminders",
    description:
      "Automatic reminder sequences so overdue invoices get chased — without you or your team sending a single email.",
  },
  {
    icon: BarChart3,
    title: "Aging Reports",
    description:
      "Always know what you're owed and who's overdue. Weekly AR aging keeps you on top of every open balance.",
  },
  {
    icon: Zap,
    title: "Cash Application",
    description:
      "Payments received are automatically matched and applied to the right invoice. Zero manual matching.",
  },
  {
    icon: RefreshCw,
    title: "Sync to QuickBooks / Xero",
    description:
      "Every invoice and payment syncs to your accounting platform. AR records always match your books.",
  },
]

const integrations = [
  { name: "QuickBooks Online", note: "Included on Enterprise plan" },
  { name: "Xero", note: "International & preferred alternative" },
  { name: "Gusto", note: "Payroll sync" },
  { name: "Stripe", note: "Payment processing" },
  { name: "Bank feeds", note: "All major US banks" },
  { name: "Email inbox", note: "Bill + receipt forwarding" },
]

export default function ApArPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">

        {/* Hero */}
        <section className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Layers aria-hidden="true" className="h-8 w-8" />
              </div>
            </div>
            <Badge variant="outline" className="mx-auto">Available on Enterprise Plan</Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">
              Accounts Payable & Receivable — Fully Managed
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
              We handle your entire AP/AR cycle end-to-end. Pay vendors on time, collect from customers faster,
              and always know your real cash position — without you touching a single bill or invoice.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link href="/contact">
                <Button size="lg">
                  Talk to Us About AP/AR
                  <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/bookkeeping#pricing">
                <Button size="lg" variant="outline">
                  View Enterprise Plan
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Game changer callout */}
        <section className="container pb-16">
          <div className="mx-auto max-w-4xl rounded-2xl border border-primary/20 bg-primary/5 px-8 py-7 space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground mt-0.5">
                <Zap aria-hidden="true" className="h-4 w-4" />
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-foreground">Enterprise Plan includes QuickBooks — no extra subscription.</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  QuickBooks Online costs $30–$200/month on your own. On our Enterprise plan, we cover it.
                  The AP/AR workflow tools we use to manage your bills and invoices are also included —
                  no add-on fees, no per-user charges, no surprises. We equip every tool needed to do the job,
                  and we absorb the cost. You just see results.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* AP Section */}
        <section className="border-t border-border py-24">
          <div className="container">
            <div className="mx-auto max-w-6xl">
              <div className="mb-12 space-y-4">
                <Badge variant="outline">Accounts Payable</Badge>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
                  Pay Vendors Without the Manual Work
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                  From the moment a bill lands to the moment payment clears, we manage every step.
                  You approve when needed, we handle the rest.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {apFeatures.map((feature) => (
                  <Card key={feature.title} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <feature.icon aria-hidden="true" className="h-5 w-5" />
                      </div>
                      <CardTitle className="mt-3 text-base">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* AP flow visual */}
              <div className="mt-12 rounded-2xl border border-border bg-muted/30 px-6 py-8">
                <p className="text-sm font-semibold text-center mb-8 text-muted-foreground uppercase tracking-wide">How AP Works</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
                  {[
                    { step: "1", label: "Bill received" },
                    { step: "2", label: "Coded & routed for approval" },
                    { step: "3", label: "You approve" },
                    { step: "4", label: "Payment scheduled" },
                    { step: "5", label: "Synced to QuickBooks" },
                  ].map((s, i) => (
                    <div key={s.step} className="flex flex-col items-center gap-2 text-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                        {s.step}
                      </div>
                      <p className="text-xs text-muted-foreground leading-tight">{s.label}</p>
                      {i < 4 && <ArrowRight aria-hidden="true" className="h-4 w-4 text-muted-foreground hidden md:block absolute translate-x-20 translate-y-[-18px]" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AR Section */}
        <section className="border-t border-border bg-muted/20 py-24">
          <div className="container">
            <div className="mx-auto max-w-6xl">
              <div className="mb-12 space-y-4">
                <Badge variant="outline">Accounts Receivable</Badge>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
                  Get Paid Faster, Chase Less
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                  We create your invoices, deliver them, follow up on overdue balances, and apply payments
                  when they come in. Your AR never falls through the cracks.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {arFeatures.map((feature) => (
                  <Card key={feature.title} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <feature.icon aria-hidden="true" className="h-5 w-5" />
                      </div>
                      <CardTitle className="mt-3 text-base">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* AR flow visual */}
              <div className="mt-12 rounded-2xl border border-border bg-background px-6 py-8">
                <p className="text-sm font-semibold text-center mb-8 text-muted-foreground uppercase tracking-wide">How AR Works</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
                  {[
                    { step: "1", label: "Invoice created & sent" },
                    { step: "2", label: "Customer gets payment link" },
                    { step: "3", label: "Reminders sent if overdue" },
                    { step: "4", label: "Payment received & applied" },
                    { step: "5", label: "Synced to QuickBooks" },
                  ].map((s) => (
                    <div key={s.step} className="flex flex-col items-center gap-2 text-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                        {s.step}
                      </div>
                      <p className="text-xs text-muted-foreground leading-tight">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cash Flow Forecasting */}
        <section className="border-t border-border py-24">
          <div className="container">
            <div className="mx-auto max-w-6xl">
              <div className="grid gap-12 md:grid-cols-2 items-center">
                <div className="space-y-6">
                  <Badge variant="outline">Cash Flow Forecasting</Badge>
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
                    Always Know What's Coming In and Going Out
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    When your AP and AR both run through us, we have a complete picture of your cash position in real time.
                    We build short-term cash flow forecasts that show exactly what you&apos;ll have in the bank — not what
                    your P&L says, but your actual cash.
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Real-time cash position across all accounts",
                      "Scheduled bills vs expected customer payments",
                      "30 / 60 / 90-day cash runway visibility",
                      "Alerts when cash dips below your threshold",
                      "Scenario planning for slow and strong months",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <Check aria-hidden="true" className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <TrendingUp aria-hidden="true" className="h-5 w-5 text-primary" />
                        <CardTitle className="text-base">Cash Position This Month</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        { label: "Opening balance", value: "$42,500", positive: true },
                        { label: "Expected AR collections", value: "+$18,200", positive: true },
                        { label: "Scheduled AP payments", value: "−$9,400", positive: false },
                        { label: "Payroll", value: "−$7,800", positive: false },
                        { label: "Projected closing balance", value: "$43,500", positive: true },
                      ].map((row) => (
                        <div key={row.label} className="flex justify-between items-center text-sm border-b border-border/40 pb-2 last:border-0 last:pb-0">
                          <span className="text-muted-foreground">{row.label}</span>
                          <span className={`font-semibold ${row.positive ? "text-primary" : "text-foreground"}`}>{row.value}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  <p className="text-xs text-muted-foreground text-center">Illustrative example — your dashboard reflects real numbers</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Integrations */}
        <section className="border-t border-border bg-muted/20 py-24">
          <div className="container">
            <div className="mx-auto max-w-4xl text-center space-y-4 mb-12">
              <Badge variant="outline">Integrations</Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
                Works With the Platforms You Already Use
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Our AP/AR workflows connect directly to your accounting platform so everything stays in sync.
                No exports, no imports, no manual reconciliation.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-3xl mx-auto">
              {integrations.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-4 hover:border-primary/30 transition-colors"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Check aria-hidden="true" className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.note}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 px-6 py-5 max-w-3xl mx-auto">
              <p className="text-sm leading-relaxed text-muted-foreground text-center">
                <strong className="text-foreground">Enterprise plan clients get QuickBooks Online included.</strong>{" "}
                Most AP/AR providers charge separately for the accounting platform plus their automation layer.
                We bundle everything — platform license, AP/AR workflow tools, bookkeeping, and payroll — into one flat monthly fee.
                No surprises, no add-on invoices.
              </p>
            </div>
          </div>
        </section>

        {/* What's included summary */}
        <section className="border-t border-border py-24">
          <div className="container">
            <div className="mx-auto max-w-5xl">
              <div className="text-center space-y-4 mb-12">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
                  Everything You Get on the Enterprise Plan
                </h2>
                <p className="text-muted-foreground">One price. Every tool. No extra subscriptions.</p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Inbox aria-hidden="true" className="h-5 w-5 text-primary" />
                      Accounts Payable
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {[
                        "Bill capture and GL coding",
                        "Approval workflow",
                        "15 ACH payments / month",
                        "15 mailed checks / month",
                        "Vendor management",
                        "Payment scheduling",
                        "Full audit trail",
                      ].map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm">
                          <Check aria-hidden="true" className="h-4 w-4 text-primary shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Send aria-hidden="true" className="h-5 w-5 text-primary" />
                      Accounts Receivable
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {[
                        "Invoice creation and delivery",
                        "Online payment links (ACH + card)",
                        "Automated payment reminders",
                        "AR aging reports",
                        "Cash application",
                        "Customer payment portal",
                        "Sync to QuickBooks / Xero",
                      ].map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm">
                          <Check aria-hidden="true" className="h-4 w-4 text-primary shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <TrendingUp aria-hidden="true" className="h-5 w-5 text-primary" />
                      Cash Flow Forecasting
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {[
                        "Real-time cash position",
                        "30 / 60 / 90-day projections",
                        "Scheduled AP vs expected AR view",
                        "Low-cash threshold alerts",
                        "Monthly cash flow review with bookkeeper",
                      ].map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm">
                          <Check aria-hidden="true" className="h-4 w-4 text-primary shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Shield aria-hidden="true" className="h-5 w-5 text-primary" />
                      Included in Enterprise Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {[
                        "QuickBooks Online subscription",
                        "Full-service monthly bookkeeping",
                        "Multi-entity bookkeeping",
                        "Payroll for up to 5 employees",
                        "Receipt capture (AI-powered)",
                        "Dedicated account manager",
                        "Phone + email support",
                      ].map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm">
                          <Check aria-hidden="true" className="h-4 w-4 text-primary shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8 text-center">
                <div className="inline-block rounded-2xl border border-primary/20 bg-primary/5 px-6 py-4">
                  <p className="text-2xl font-black text-primary">$499<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                  <p className="text-sm text-muted-foreground mt-1">All of the above. One invoice. No add-ons.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border bg-primary text-primary-foreground py-16">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-balance">
                Ready to Take AP/AR Off Your Plate?
              </h2>
              <p className="text-lg leading-relaxed opacity-90">
                Let&apos;s talk about your current AP/AR pain points and how we can take over. No setup fees.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/contact">
                  <Button size="lg" variant="secondary">
                    Schedule a Free Consultation
                    <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/bookkeeping#pricing">
                  <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                    See Enterprise Plan
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
