import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Monthly Bookkeeping Services for Small Business — Plans from $249/mo",
  description:
    "Monthly bookkeeping services for restaurants, hotels, childcare centers, realtors, and small businesses across the USA. Payroll included, dedicated bookkeeper, QuickBooks managed for you — plans from $249/mo.",
  keywords: [
    "monthly bookkeeping services",
    "small business bookkeeping services",
    "online bookkeeping for restaurants",
    "hotel bookkeeping service",
    "childcare bookkeeping services",
    "daycare accounting services",
    "realtor bookkeeping services",
    "home-based business bookkeeping",
    "tutoring center accounting",
    "virtual bookkeeper for small business",
    "bookkeeping with payroll included",
    "affordable bookkeeping service USA",
    "QuickBooks managed bookkeeping",
    "monthly bank reconciliation service",
  ],
  openGraph: {
    title: "Monthly Bookkeeping Services for Small Business — Plans from $249/mo | BookKeeping.business",
    description:
      "Monthly bookkeeping for restaurants, hotels, childcare, and small businesses. Payroll included, QuickBooks managed, dedicated bookkeeper — plans from $249/mo.",
    url: "https://www.bookkeeping.business/bookkeeping",
  },
  alternates: { canonical: "https://www.bookkeeping.business/bookkeeping" },
}
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Check, BookOpen, Globe2, Landmark, WalletCards, Inbox, Send, TrendingUp, Layers } from "lucide-react"
import Link from "next/link"

export default function BookkeepingPage() {
  const tiers = [
    {
      name: "Essentials",
      price: "$249",
      label: "For solopreneurs & small businesses",
      description: "Clean, current books with everything you need to stay compliant and tax-ready.",
      features: [
        "Monthly reconciliation",
        "Transaction categorization",
        "Basic financial reports (P&L, Balance Sheet)",
        "Dedicated bookkeeper",
        "Email support",
        "Quarterly business review",
        "Payroll for Owner + 1 Employee included",
        "Personal tax prep & filing available as Add-On",
      ],
    },
    {
      name: "Growth",
      price: "$349",
      label: "For scaling businesses",
      description: "Advanced reporting and more frequent reviews as your business complexity grows.",
      features: [
        "Everything in Essentials",
        "Advanced financial reports",
        "Cash flow forecasting",
        "Expense tracking & insights",
        "Priority email support",
        "Monthly business review",
        "Payroll for up to 3 Employees included",
        "Personal & couple tax prep available as Add-On",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$499",
      label: "For established & complex businesses",
      description: "Full-service support for businesses with multi-entity structures and complex needs.",
      features: [
        "Everything in Growth",
        "Multi-entity bookkeeping",
        "Inventory management",
        "Custom reporting",
        "Dedicated account manager",
        "Phone + email support",
        "Payroll for up to 5 Employees included",
        "Accounts Payable & Receivable (AP/AR)",
        "15 ACH + 15 Mailed Checks/month included",
        "Additional employees: +$10/mo each",
        "Personal & couple tax prep available as Add-On",
      ],
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <BookOpen aria-hidden="true" className="h-8 w-8" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">Monthly Bookkeeping for Restaurants, Law Firms, Startups, Property Management & Small Business</h1>
            <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
              Dedicated bookkeeping for every type of business — restaurants, hotels, law firms, startups, property management companies,
              childcare centers, realtors, tutoring centers, and home-based businesses. AI-assisted for efficiency, human-reviewed for accuracy.
            </p>
            <p className="text-sm text-muted-foreground">
              US and Canada clients are supported on QuickBooks Online or Xero. International clients in Australia, India, and the UK (including London) are onboarded on Xero. Enterprise plan includes AP/AR automation and QuickBooks subscription at no extra cost.
            </p>
          </div>
        </section>

        {/* Core service scope */}
        <section className="container pb-16">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-xl">Core Bookkeeping Scope</CardTitle>
              <CardDescription>
                What your monthly service can cover with our managed software stack and team-led workflows.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                "Bi-weekly or monthly bookkeeping cycles",
                "Transaction categorization and reconciliation",
                "P&L and Balance Sheet creation",
                "Cash flow projections and insights",
                "Expense tracking and spend analysis",
                "Quarterly sales tax filing support by state",
                "Payroll support through Gusto",
                "Invoice and payment workflows in QuickBooks or Xero",
                "Books kept tax-ready year-round",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 rounded-xl border bg-background px-3 py-3 text-sm">
                  <Check aria-hidden="true" className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Industries served */}
        <section className="container pb-16">
          <div className="mx-auto max-w-4xl text-center space-y-4 mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Industries We Serve</h2>
            <p className="text-muted-foreground text-sm">Specialists in your industry — not generic bookkeepers who learn as they go.</p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
            {[
              "Restaurants & Food Service",
              "Hotels & Hospitality",
              "Law Firms",
              "Startups & Tech Companies",
              "Property Management Firms",
              "Childcare & Daycares",
              "Realtors & Real Estate Agents",
              "Tutoring & Education Centers",
              "Home-Based Businesses",
              "Retail Shops",
              "Freelancers & Consultants",
              "Medical & Dental Practices",
              "Construction & Trades",
              "E-commerce Businesses",
            ].map((industry) => (
              <span key={industry} className="px-4 py-2 rounded-full border border-border bg-background text-sm text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors">
                {industry}
              </span>
            ))}
          </div>
        </section>

        {/* Region + platform */}
        <section className="container pb-24">
          <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Landmark className="h-5 w-5" aria-hidden="true" />
                </div>
                <CardTitle className="mt-3 text-lg">US</CardTitle>
                <CardDescription>QuickBooks Online or Xero support</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Full monthly bookkeeping, payroll via Gusto, quarterly sales tax filing support, and invoice/payment workflows.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Globe2 className="h-5 w-5" aria-hidden="true" />
                </div>
                <CardTitle className="mt-3 text-lg">Canada</CardTitle>
                <CardDescription>QuickBooks Online or Xero support</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Ongoing bookkeeping, reporting, categorization, and owner-facing financial insights with managed platform onboarding.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <WalletCards className="h-5 w-5" aria-hidden="true" />
                </div>
                <CardTitle className="mt-3 text-lg">International</CardTitle>
                <CardDescription>Australia, India, UK/London via Xero</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Xero automation onboarding with monthly bookkeeping, reporting, expense tracking, and cash flow visibility.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Pricing Tiers */}
        <section id="pricing" className="container pb-24">
          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            {tiers.map((tier) => (
              <Card key={tier.name} className={tier.popular ? "border-primary shadow-lg" : ""}>
                {tier.popular && (
                  <div className="flex justify-center -mt-3">
                    <Badge className="px-3 py-1">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-lg">{tier.name}</CardTitle>
                  <Badge variant="outline" className="mt-2 w-fit mx-auto text-xs">{tier.label}</Badge>
                  <div className="mt-4">
                    <span className="text-4xl font-black text-primary">{tier.price}</span>
                    <span className="text-sm text-muted-foreground">/month</span>
                  </div>
                  <CardDescription className="mt-2 leading-relaxed">{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check aria-hidden="true" className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/contact">
                    <Button className="w-full" variant={tier.popular ? "default" : "outline"}>
                      Get Started
                      <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* AP/AR Section */}
        <section className="container pb-16">
          <div className="mx-auto max-w-5xl rounded-2xl border border-primary/20 bg-primary/5 overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="p-8 space-y-5">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Layers aria-hidden="true" className="h-5 w-5" />
                  </div>
                  <Badge variant="outline" className="border-primary/30 text-primary text-xs">Enterprise Plan</Badge>
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Accounts Payable & Receivable — Fully Managed</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  On Enterprise, we take over your entire AP/AR cycle. Vendor bills processed, approved, and paid.
                  Customer invoices created, delivered, and followed up automatically. Cash flow forecasted week-by-week.
                  All synced to QuickBooks in real time — no double entry, no manual matching.
                </p>
                <ul className="space-y-2">
                  {[
                    "Bill capture, GL coding, and approval workflow",
                    "15 ACH + 15 mailed check payments per month",
                    "Invoice creation, delivery, and payment links",
                    "Automated AR reminders — no chasing from you",
                    "30/60/90-day cash flow forecasting",
                    "QuickBooks Online subscription included",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check aria-hidden="true" className="h-4 w-4 text-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/ap-ar">
                  <Button variant="outline" className="border-primary/30">
                    See Full AP/AR Details
                    <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="p-8 border-t md:border-t-0 md:border-l border-primary/10 space-y-4">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Tech Stack — Automation First</p>
                <div className="space-y-3">
                  {[
                    { icon: Inbox, label: "AP Automation", desc: "Bills captured, coded, and routed — zero manual entry" },
                    { icon: Send, label: "AR Automation", desc: "Invoices sent, tracked, and followed up automatically" },
                    { icon: TrendingUp, label: "Cash Flow Engine", desc: "Real-time position + scheduled AP/AR visibility" },
                  ].map(({ icon: Icon, label, desc }) => (
                    <div key={label} className="flex items-start gap-3 p-3 rounded-xl bg-background border border-border">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon aria-hidden="true" className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{label}</p>
                        <p className="text-xs text-muted-foreground">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-primary/20 bg-background p-4 text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground block mb-1">No add-on cost.</strong>
                  AP/AR workflow tools typically cost $49–$199/month separately. On Enterprise, they&apos;re included — along with your QuickBooks subscription. One flat monthly fee covers everything.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Catchup Bookkeeping */}
        <section className="border-t border-border bg-muted/30 py-16">
          <div className="container">
            <Card className="max-w-3xl mx-auto">
              <CardHeader className="text-center">
                <Badge variant="outline" className="w-fit mx-auto mb-2">Quote-Based</Badge>
                <CardTitle className="text-2xl">Catchup Bookkeeping</CardTitle>
                <CardDescription>Behind on your books? We'll get you caught up.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-center text-muted-foreground">
                  Whether you're months or years behind, we'll reconcile your historical transactions, clean up your records, and get you audit-ready. Then seamlessly transition to a monthly plan.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <Check aria-hidden="true" className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Historical transaction reconciliation</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check aria-hidden="true" className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Expense categorization cleanup</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check aria-hidden="true" className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Audit-ready financial records</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check aria-hidden="true" className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Smooth transition to monthly service</span>
                  </div>
                </div>
                <div className="text-center pt-4">
                  <Link href="/contact">
                    <Button>
                      Get a Catchup Quote
                      <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* What's Included */}
        <section className="border-t border-border py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
                What's Included in Every Plan
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {[
                {
                  title: "Monthly Reconciliation",
                  description: "Bank and credit card accounts reconciled monthly to ensure accuracy",
                },
                {
                  title: "Transaction Categorization",
                  description: "Every transaction properly categorized for tax deductions and reporting",
                },
                {
                  title: "Financial Reports",
                  description: "Profit & Loss and Balance Sheet reports delivered monthly",
                },
                {
                  title: "Dedicated Bookkeeper",
                  description: "Work with the same bookkeeper who knows your business",
                },
                {
                  title: "Secure Portal Access",
                  description: "24/7 access to your books and documents through our secure portal",
                },
                {
                  title: "Tax-Ready Books",
                  description: "Books kept tax-ready so filing season is stress-free",
                },
                {
                  title: "Receipt Capture — Included",
                  description: "Upload receipts, email them in, or snap a photo. AI extracts vendor, date, amount and category automatically. No Dext or QBO add-on needed.",
                },
              ].map((item) => (
                <Card key={item.title}>
                  <CardHeader>
                    <CardTitle className="text-base">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 px-6 py-5 max-w-4xl mx-auto space-y-3">
              <p className="text-sm leading-relaxed text-muted-foreground">
                <strong className="text-foreground">Software is included in our service.</strong> We pay for the accounting and workflow tools our team uses (QuickBooks, Xero, payroll stack, and related ops tools). Clients are billed only for service charges, not extra software subscriptions.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                <strong className="text-foreground">Receipt capture is built right in.</strong> Tools like Dext, Hubdoc, and the QBO receipt add-on cost $25–$50/month extra elsewhere. With us, it&apos;s already included — upload through the portal, email to your dedicated address, or forward from your phone. AI reads the receipt and categorizes it automatically. Same plan, no new subscription, no surprise charges.
              </p>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="container py-24">
          <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">How It Works</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-4 max-w-5xl mx-auto">
            {[
              {
                step: "1",
                title: "Connect Accounts",
                description: "Securely link your bank and credit card accounts to our portal",
              },
              {
                step: "2",
                title: "Upload Documents",
                description: "Upload receipts and supporting documents as needed",
              },
              {
                step: "3",
                title: "We Process",
                description: "AI-assisted categorization with human review and reconciliation",
              },
              {
                step: "4",
                title: "Review Reports",
                description: "Access your monthly financial reports and insights",
              },
            ].map((item) => (
              <div key={item.step} className="text-center space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground mx-auto text-lg font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border bg-primary text-primary-foreground py-16">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-balance">Ready to Clean Up Your Books?</h2>
              <p className="text-lg leading-relaxed text-pretty opacity-90">
                Start with a free consultation to discuss your bookkeeping needs.
              </p>
              <Link href="/contact">
                <Button size="lg" variant="secondary">
                  Get Started Today
                  <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
