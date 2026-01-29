import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Check, X, DollarSign } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Pricing - Bookkeeping & Tax Services | BookKeeping.business",
  description:
    "Transparent pricing for monthly bookkeeping services starting at $75/mo. Compare our Starter, Growth, and Pro plans. Personal tax prep included with all bookkeeping plans.",
  keywords: [
    "bookkeeping pricing",
    "bookkeeping service cost",
    "monthly bookkeeping fees",
    "affordable bookkeeping",
    "small business bookkeeping pricing",
    "bookkeeping packages",
    "virtual bookkeeping rates",
  ],
  openGraph: {
    title: "Pricing - Bookkeeping & Tax Services | BookKeeping.business",
    description:
      "Transparent pricing for monthly bookkeeping services starting at $75/mo. Personal tax prep included with all plans.",
    url: "https://bookkeeping.business/pricing",
  },
}

export default function PricingPage() {
  const tiers = [
    {
      name: "Starter",
      price: "$75",
      period: "/month",
      description: "Perfect for solopreneurs and small businesses",
      revenue: "Up to $500K annual revenue",
      popular: false,
    },
    {
      name: "Growth",
      price: "$175",
      period: "/month",
      description: "For growing businesses scaling up",
      revenue: "Up to $1M annual revenue",
      popular: true,
    },
    {
      name: "Pro",
      price: "Custom",
      period: "",
      description: "For established businesses with complex needs",
      revenue: "Over $1M annual revenue",
      popular: false,
    },
  ]

  const features = [
    { name: "Monthly bank & credit card reconciliation", starter: true, growth: true, pro: true },
    { name: "Transaction categorization", starter: true, growth: true, pro: true },
    { name: "Profit & Loss statement", starter: true, growth: true, pro: true },
    { name: "Balance Sheet", starter: true, growth: true, pro: true },
    { name: "Dedicated bookkeeper", starter: true, growth: true, pro: true },
    { name: "Secure portal access (24/7)", starter: true, growth: true, pro: true },
    { name: "Tax-ready books", starter: true, growth: true, pro: true },
    { name: "Email support", starter: true, growth: true, pro: true },
    { name: "Quarterly business review", starter: true, growth: true, pro: true },
    { name: "Owner's personal tax prep & filing", starter: true, growth: true, pro: true },
    { name: "Cash flow forecasting", starter: false, growth: true, pro: true },
    { name: "Expense tracking & insights", starter: false, growth: true, pro: true },
    { name: "Monthly business review", starter: false, growth: true, pro: true },
    { name: "Priority support", starter: false, growth: true, pro: true },
    { name: "Married couple tax prep & filing", starter: false, growth: true, pro: true },
    { name: "Multi-entity bookkeeping", starter: false, growth: false, pro: true },
    { name: "Inventory management", starter: false, growth: false, pro: true },
    { name: "Custom reporting", starter: false, growth: false, pro: true },
    { name: "Dedicated account manager", starter: false, growth: false, pro: true },
    { name: "Phone support", starter: false, growth: false, pro: true },
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
                <DollarSign className="h-8 w-8" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
              Choose a plan that fits your business. All plans include personal tax preparation and filing for the business owner.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="container pb-16">
          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {tiers.map((tier) => (
              <Card key={tier.name} className={tier.popular ? "border-primary shadow-lg relative" : ""}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="px-3 py-1">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-6 pt-8">
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    <span className="text-muted-foreground">{tier.period}</span>
                  </div>
                  <CardDescription className="mt-2">{tier.description}</CardDescription>
                  <Badge variant="outline" className="mt-4 w-fit mx-auto">
                    {tier.revenue}
                  </Badge>
                </CardHeader>
                <CardContent className="pt-4">
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

        {/* Feature Comparison Table */}
        <section className="border-t border-border bg-muted/30 py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-balance">Compare Plans</h2>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                See what&apos;s included in each plan
              </p>
            </div>

            <div className="max-w-5xl mx-auto overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 font-semibold">Feature</th>
                    <th className="text-center py-4 px-4 font-semibold">Starter</th>
                    <th className="text-center py-4 px-4 font-semibold bg-primary/5">Growth</th>
                    <th className="text-center py-4 px-4 font-semibold">Pro</th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature, index) => (
                    <tr key={feature.name} className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                      <td className="py-3 px-4 text-sm">{feature.name}</td>
                      <td className="py-3 px-4 text-center">
                        {feature.starter ? (
                          <Check className="h-5 w-5 text-primary mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground/40 mx-auto" />
                        )}
                      </td>
                      <td className="py-3 px-4 text-center bg-primary/5">
                        {feature.growth ? (
                          <Check className="h-5 w-5 text-primary mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground/40 mx-auto" />
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {feature.pro ? (
                          <Check className="h-5 w-5 text-primary mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground/40 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Catchup Bookkeeping */}
        <section className="border-t border-border py-16">
          <div className="container">
            <Card className="max-w-3xl mx-auto">
              <CardHeader className="text-center">
                <Badge variant="outline" className="w-fit mx-auto mb-2">Custom Pricing</Badge>
                <CardTitle className="text-2xl">Catchup Bookkeeping</CardTitle>
                <CardDescription>Behind on your books? We&apos;ll get you caught up.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-center text-muted-foreground">
                  Whether you&apos;re months or years behind, we&apos;ll reconcile your historical transactions, clean up your records, and get you audit-ready. Pricing is based on the volume of transactions and time period.
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

        {/* Tax Prep Add-on */}
        <section className="border-t border-border bg-muted/30 py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center space-y-4 mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-balance">Tax Preparation Services</h2>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                Need tax prep without monthly bookkeeping? We offer standalone tax preparation services.
              </p>
            </div>
            <div className="text-center">
              <Link href="/tax-prep">
                <Button variant="outline" size="lg">
                  View Tax Prep Services
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-border py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-balance">Pricing FAQs</h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              {[
                {
                  question: "What determines which plan I need?",
                  answer: "Plan selection is based on your annual revenue. Starter is for businesses up to $500K, Growth for up to $1M, and Pro for businesses over $1M or with complex multi-entity needs.",
                },
                {
                  question: "Is personal tax preparation really included?",
                  answer: "Yes. All monthly bookkeeping plans include the owner's personal tax preparation and filing. The Growth and Pro plans extend this to include a married couple filing jointly.",
                },
                {
                  question: "Are there any setup fees?",
                  answer: "No setup fees for new clients with clean books. If you need catchup bookkeeping to get your books in order first, that's quoted separately based on the work required.",
                },
                {
                  question: "Can I change plans later?",
                  answer: "Absolutely. As your business grows, you can upgrade to a higher tier. We'll prorate the difference for the remaining billing period.",
                },
                {
                  question: "What if I only need tax prep, not bookkeeping?",
                  answer: "We offer standalone tax preparation services. Visit our Tax Prep page for individual and business tax filing pricing.",
                },
              ].map((faq) => (
                <Card key={faq.question}>
                  <CardHeader>
                    <CardTitle className="text-base">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
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
              <h2 className="text-3xl font-bold tracking-tight text-balance">Ready to Get Started?</h2>
              <p className="text-lg leading-relaxed text-pretty opacity-90">
                Book a free consultation to discuss your bookkeeping needs and find the right plan.
              </p>
              <Link href="/contact">
                <Button size="lg" variant="secondary">
                  Book Free Consultation
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
