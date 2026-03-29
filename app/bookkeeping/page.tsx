import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Monthly Bookkeeping Services | BookKeeping.business",
  description:
    "Professional monthly bookkeeping with personal and business tax prep included. Dedicated bookkeeper, monthly reconciliation, P&L reports, and quarterly business reviews — all in one place.",
  keywords: [
    "monthly bookkeeping services",
    "affordable bookkeeping",
    "small business bookkeeping",
    "bookkeeping with tax prep included",
    "virtual bookkeeping services",
    "dedicated bookkeeper",
    "P&L reports",
    "bank reconciliation services",
  ],
  openGraph: {
    title: "Monthly Bookkeeping Services | BookKeeping.business",
    description:
      "Professional monthly bookkeeping with personal and business tax prep included. Dedicated bookkeeper, monthly reconciliation, and quarterly reviews.",
    url: "https://bookkeeping.business/bookkeeping",
  },
}
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Check, BookOpen } from "lucide-react"
import Link from "next/link"

export default function BookkeepingPage() {
  const tiers = [
    {
      name: "Essentials",
      label: "For solopreneurs & small businesses",
      description: "Clean, current books with everything you need to stay compliant and tax-ready.",
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
      label: "For scaling businesses",
      description: "Advanced reporting and more frequent reviews as your business complexity grows.",
      features: [
        "Everything in Essentials",
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
      name: "Enterprise",
      label: "For established & complex businesses",
      description: "Full-service support for businesses with multi-entity structures and complex needs.",
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
          </div>
        </section>

        {/* Pricing Tiers */}
        <section className="container pb-24">
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
                  <CardDescription className="mt-3 leading-relaxed">{tier.description}</CardDescription>
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
                  <ArrowRight className="ml-2 h-4 w-4" />
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
