import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Check, BookOpen, FileSpreadsheet, Calculator, FolderSync, BarChart3, Shield } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Monthly Bookkeeping Services Starting at $75/mo | BookKeeping.business",
  description:
    "Professional monthly bookkeeping services with personal tax prep included. We collect your ledgers, reconcile bank statements, categorize expenses, track income, and deliver clean financial reports. Plans for businesses up to $500K, $1M, and custom enterprise.",
  keywords: [
    "monthly bookkeeping services",
    "affordable bookkeeping",
    "small business bookkeeping",
    "bookkeeping with tax prep included",
    "virtual bookkeeping services",
    "dedicated bookkeeper",
    "P&L reports",
    "bank reconciliation services",
    "expense categorization",
    "financial record keeping",
  ],
  openGraph: {
    title: "Monthly Bookkeeping Services Starting at $75/mo | BookKeeping.business",
    description:
      "Professional monthly bookkeeping with personal tax prep included. Dedicated bookkeeper and monthly reconciliation starting at $75/month.",
    url: "https://bookkeeping.business/bookkeeping",
  },
}

export default function BookkeepingPage() {
  const tiers = [
    {
      name: "Starter",
      price: "$75",
      period: "/month",
      description: "Perfect for solopreneurs and small businesses",
      revenue: "Up to $500K annual revenue",
      features: [
        "Monthly reconciliation",
        "Transaction categorization",
        "Basic financial reports (P&L, Balance Sheet)",
        "Dedicated bookkeeper",
        "Email support",
        "Quarterly business review",
        "Owner's personal tax prep & filing included",
      ],
    },
    {
      name: "Growth",
      price: "$175",
      period: "/month",
      description: "For growing businesses scaling up",
      revenue: "Up to $1M annual revenue",
      features: [
        "Everything in Starter",
        "Advanced financial reports",
        "Cash flow forecasting",
        "Expense tracking & insights",
        "Priority email support",
        "Monthly business review",
        "Owner's (or married couple) tax prep & filing included",
      ],
      popular: true,
    },
    {
      name: "Pro",
      price: "Custom",
      period: "",
      description: "For established businesses with complex needs",
      revenue: "Over $1M annual revenue",
      features: [
        "Everything in Growth",
        "Multi-entity bookkeeping",
        "Inventory management",
        "Custom reporting",
        "Dedicated account manager",
        "Phone + email support",
        "Owner's (or married couple) tax prep & filing included",
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
                <BookOpen className="h-8 w-8" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">Monthly Bookkeeping Services</h1>
            <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
              Keep your books clean and compliant with monthly reconciliation, categorization, and financial reports.
              AI-assisted for efficiency, human-reviewed for accuracy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/contact">
                <Button size="lg">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline">
                  View All Plans
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* How We Do Bookkeeping */}
        <section className="border-t border-border bg-muted/30 py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
                How We Handle Your Books
              </h2>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                Our comprehensive bookkeeping process ensures your financial records are accurate, organized, and always tax-ready.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              <Card className="border-primary/20">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
                    <FolderSync className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">Document Collection</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    We gather all your financial documents securely through our portal:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Bank statements (checking, savings, lines of credit)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Credit card statements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Receipts and invoices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Payroll records</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Loan and lease documents</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
                    <FileSpreadsheet className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">Bank Reconciliation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    We match every transaction in your accounting software to your bank records:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Compare ledger entries to bank statements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Identify and resolve discrepancies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Track outstanding checks and deposits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Reconcile credit cards and payment processors</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Flag suspicious or duplicate transactions</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
                    <Calculator className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">Income & Expense Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    Every dollar in and out is properly categorized and recorded:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Revenue recognition by source and type</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Expense categorization (tax-optimized)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Accounts payable tracking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Accounts receivable monitoring</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Mileage and reimbursement tracking</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">Financial Reporting</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    Clear, actionable reports delivered monthly so you know where you stand:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Profit & Loss (Income Statement)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Balance Sheet</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Cash Flow Statement (Growth & Pro)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Expense breakdowns by category</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Year-over-year comparisons</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
                    <Shield className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">Compliance & Accuracy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    Your books stay audit-ready and compliant with best practices:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>GAAP-compliant record keeping</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Audit trail for all transactions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Human review of AI-assisted entries</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Sales tax tracking (where applicable)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>1099 contractor payment tracking</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">General Ledger Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    We maintain your complete financial ledger with precision:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Chart of accounts setup and maintenance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Journal entry recording</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Adjusting entries (accruals, prepayments)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Month-end close procedures</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Year-end close preparation</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Tiers */}
        <section className="container py-24">
          <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
              Choose Your Plan
            </h2>
            <p className="text-muted-foreground leading-relaxed text-pretty">
              All plans include personal tax prep for the business owner
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            {tiers.map((tier) => (
              <Card key={tier.name} className={tier.popular ? "border-primary shadow-lg relative" : ""}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="px-3 py-1">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-8 pt-8">
                  <CardTitle className="text-lg">{tier.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    <span className="text-muted-foreground">{tier.period}</span>
                  </div>
                  <CardDescription className="mt-2">{tier.description}</CardDescription>
                  <Badge variant="outline" className="mt-4 w-fit mx-auto">
                    {tier.revenue}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/contact">
                    <Button className="w-full" variant={tier.popular ? "default" : "outline"}>
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/pricing">
              <Button variant="link" className="text-primary">
                Compare all plan features
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Catchup Bookkeeping */}
        <section className="border-t border-border bg-muted/30 py-16">
          <div className="container">
            <Card className="max-w-3xl mx-auto">
              <CardHeader className="text-center">
                <Badge variant="outline" className="w-fit mx-auto mb-2">Custom Pricing</Badge>
                <CardTitle className="text-2xl">Catchup Bookkeeping</CardTitle>
                <CardDescription>Behind on your books? We&apos;ll get you caught up.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-center text-muted-foreground">
                  Whether you&apos;re months or years behind, we&apos;ll reconcile your historical transactions, clean up your records, and get you audit-ready. Then seamlessly transition to a monthly plan.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Historical transaction reconciliation</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Expense categorization cleanup</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Audit-ready financial records</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Smooth transition to monthly service</span>
                  </div>
                </div>
                <div className="text-center pt-4">
                  <Link href="/contact">
                    <Button>
                      Get a Catchup Quote
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Process */}
        <section className="border-t border-border py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">Getting Started Is Easy</h2>
            </div>

            <div className="grid gap-8 md:grid-cols-4 max-w-5xl mx-auto">
              {[
                {
                  step: "1",
                  title: "Book a Call",
                  description: "Schedule a free consultation to discuss your bookkeeping needs",
                },
                {
                  step: "2",
                  title: "Connect Accounts",
                  description: "Securely link your bank and credit card accounts to our portal",
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
          </div>
        </section>

        {/* What's Included */}
        <section className="border-t border-border bg-muted/30 py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
                What&apos;s Included in Every Plan
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
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg" variant="secondary">
                    Get Started Today
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary-foreground/20 hover:bg-primary-foreground/10 bg-transparent text-primary-foreground"
                  >
                    View All Pricing
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
