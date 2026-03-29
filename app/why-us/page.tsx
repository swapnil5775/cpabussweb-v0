import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Why Choose Us Over Big CPA Firms & TurboTax | BookKeeping.business",
  description:
    "Compare BookKeeping.business to traditional CPA firms and DIY tools like TurboTax. Get CFO-level service, all-in-one, with quarterly check-ins, dedicated support, and business + personal tax prep all under one roof.",
  keywords: [
    "better than TurboTax",
    "affordable CPA alternative",
    "virtual CFO services",
    "flat rate bookkeeping",
    "CPA firm alternative",
    "bookkeeping with tax prep included",
    "small business financial partner",
    "QuickBooks alternative",
  ],
  openGraph: {
    title: "Why Choose Us Over Big CPA Firms & TurboTax | BookKeeping.business",
    description:
      "CFO-level service, all-in-one. Dedicated support with business and personal tax prep included under one roof.",
    url: "https://bookkeeping.business/why-us",
  },
}
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Check,
  X,
  TrendingUp,
  Users,
  Clock,
  DollarSign,
  FileText,
  Calculator,
  CreditCard,
  Receipt,
  Building2,
  Handshake,
} from "lucide-react"
import Link from "next/link"

export default function WhyUsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <Badge variant="outline" className="mb-4">
              Why Choose BookKeeping.business
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">
              Your CFO-Style Partner, Not Just Another Accountant
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed text-pretty">
              We work alongside you as a strategic partner—providing monthly guidance, proactive insights, and
              everything you need in one place. No more juggling multiple tools or waiting until year-end for answers.
            </p>
          </div>
        </section>

        {/* Problem with Big CPA Firms */}
        <section className="border-t border-border bg-muted/30 py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
                The Problem with Traditional CPA Firms
              </h2>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                Big firms charge premium rates but deliver generic, once-a-year service
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
              {/* Traditional CPA */}
              <Card className="border-destructive/20 bg-destructive/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <Building2 className="h-5 w-5" />
                    Traditional Big CPA Firms
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <X className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                      <span className="text-sm">Unpredictable hourly billing rates</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <X className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                      <span className="text-sm">Only see your numbers at year-end</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <X className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                      <span className="text-sm">Ask you to "dump files" and figure it out</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <X className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                      <span className="text-sm">Generic P&L without audit-proof documentation</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <X className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                      <span className="text-sm">No quarterly or monthly check-ins</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <X className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                      <span className="text-sm">Tax prep billed separately at premium rates</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <X className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                      <span className="text-sm">Reactive—only responds when you reach out</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium text-destructive">Fragmented service — multiple bills, multiple contacts</p>
                    <p className="text-xs text-muted-foreground mt-1">Bookkeeping and tax prep billed and handled separately</p>
                  </div>
                </CardContent>
              </Card>

              {/* BookKeeping.business */}
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Handshake className="h-5 w-5" />
                    BookKeeping.business Partner Approach
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">Flat monthly pricing—no hourly surprises</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">Monthly reconciliation & quarterly business reviews</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">We handle everything—no file dumps required</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">Audit-proof books with proper documentation</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">Regular check-ins to see how your year looks</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">Business + personal tax prep INCLUDED</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">Proactive guidance—we reach out to you</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium text-primary">All-inclusive: bookkeeping + tax prep + filing</p>
                    <p className="text-xs text-muted-foreground mt-1">One team, one portal, one place for everything</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* DIY vs Done For You */}
        <section className="container py-24">
          <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
              Stop Doing It Yourself
            </h2>
            <p className="text-muted-foreground leading-relaxed text-pretty">
              TurboTax and QuickBooks put all the work on you. We do it for you—with AI efficiency and human accuracy.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid gap-6 md:grid-cols-3">
              {/* DIY Tools */}
              <Card>
                <CardHeader className="text-center">
                  <Badge variant="outline" className="w-fit mx-auto mb-2">
                    DIY Approach
                  </Badge>
                  <CardTitle className="text-lg">TurboTax / QuickBooks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <X className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      <span>You enter all transactions</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <X className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      <span>You categorize expenses</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <X className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      <span>You reconcile accounts</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <X className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      <span>You figure out deductions</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <X className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      <span>You file your own taxes</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <X className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      <span>No expert review</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t text-center">
                    <p className="text-2xl font-bold">10+ hrs/month</p>
                    <p className="text-xs text-muted-foreground">Your time spent on admin</p>
                  </div>
                </CardContent>
              </Card>

              {/* Multiple Tools */}
              <Card>
                <CardHeader className="text-center">
                  <Badge variant="outline" className="w-fit mx-auto mb-2">
                    Pieced Together
                  </Badge>
                  <CardTitle className="text-lg">Multiple Subscriptions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm">
                    {["QuickBooks (bookkeeping)", "Gusto (payroll)", "TurboTax Business (tax)", "Invoicing software", "Your own time & effort"].map((tool) => (
                      <div key={tool} className="flex items-center gap-2">
                        <X className="h-4 w-4 text-destructive shrink-0" />
                        <span>{tool}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t text-center">
                    <p className="text-lg font-bold">Multiple vendors, multiple logins</p>
                    <p className="text-xs text-muted-foreground">Nothing is connected — you do the coordination</p>
                  </div>
                </CardContent>
              </Card>

              {/* BookKeeping.business */}
              <Card className="border-primary bg-primary/5 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">Best Value</Badge>
                </div>
                <CardHeader className="text-center">
                  <Badge variant="outline" className="w-fit mx-auto mb-2 border-primary text-primary">
                    All-In-One
                  </Badge>
                  <CardTitle className="text-lg">BookKeeping.business</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>We handle bookkeeping</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>We categorize & reconcile</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>We prep & file business taxes</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>We prep & file personal taxes</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>Expert human review</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>Quarterly strategy calls</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t text-center">
                    <p className="text-lg font-bold text-primary">One subscription. Everything included.</p>
                    <p className="text-xs text-muted-foreground">Custom quote based on your needs</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="border-t border-border bg-muted/30 py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
                Complete Feature Comparison
              </h2>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                See exactly what you get with BookKeeping.business vs. the alternatives
              </p>
            </div>

            <div className="max-w-5xl mx-auto overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-4 font-semibold">Feature</th>
                    <th className="text-center py-4 px-4 font-semibold">DIY Tools</th>
                    <th className="text-center py-4 px-4 font-semibold">Big CPA Firm</th>
                    <th className="text-center py-4 px-4 font-semibold bg-primary/10 text-primary rounded-t-lg">
                      BookKeeping.business
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b">
                    <td className="py-4 px-4">Monthly Bookkeeping</td>
                    <td className="text-center py-4 px-4 text-muted-foreground">You do it</td>
                    <td className="text-center py-4 px-4">
                      <Check className="h-4 w-4 mx-auto text-muted-foreground" />
                    </td>
                    <td className="text-center py-4 px-4 bg-primary/5">
                      <Check className="h-4 w-4 mx-auto text-primary" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4">Business Tax Prep & Filing</td>
                    <td className="text-center py-4 px-4 text-muted-foreground">You do it</td>
                    <td className="text-center py-4 px-4 text-muted-foreground">Billed separately</td>
                    <td className="text-center py-4 px-4 bg-primary/5">
                      <Check className="h-4 w-4 mx-auto text-primary" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4">Personal Tax Prep & Filing</td>
                    <td className="text-center py-4 px-4 text-muted-foreground">You do it</td>
                    <td className="text-center py-4 px-4 text-muted-foreground">Billed separately</td>
                    <td className="text-center py-4 px-4 bg-primary/5">
                      <Check className="h-4 w-4 mx-auto text-primary" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4">Quarterly Business Reviews</td>
                    <td className="text-center py-4 px-4">
                      <X className="h-4 w-4 mx-auto text-destructive" />
                    </td>
                    <td className="text-center py-4 px-4">
                      <X className="h-4 w-4 mx-auto text-destructive" />
                    </td>
                    <td className="text-center py-4 px-4 bg-primary/5">
                      <Check className="h-4 w-4 mx-auto text-primary" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4">Dedicated Account Rep</td>
                    <td className="text-center py-4 px-4">
                      <X className="h-4 w-4 mx-auto text-destructive" />
                    </td>
                    <td className="text-center py-4 px-4 text-muted-foreground">Maybe</td>
                    <td className="text-center py-4 px-4 bg-primary/5">
                      <Check className="h-4 w-4 mx-auto text-primary" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4">Audit-Proof Documentation</td>
                    <td className="text-center py-4 px-4">
                      <X className="h-4 w-4 mx-auto text-destructive" />
                    </td>
                    <td className="text-center py-4 px-4 text-muted-foreground">Varies</td>
                    <td className="text-center py-4 px-4 bg-primary/5">
                      <Check className="h-4 w-4 mx-auto text-primary" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4">Proactive Tax Planning</td>
                    <td className="text-center py-4 px-4">
                      <X className="h-4 w-4 mx-auto text-destructive" />
                    </td>
                    <td className="text-center py-4 px-4 text-muted-foreground">Billed separately</td>
                    <td className="text-center py-4 px-4 bg-primary/5">
                      <Check className="h-4 w-4 mx-auto text-primary" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4">AI-Powered Efficiency</td>
                    <td className="text-center py-4 px-4 text-muted-foreground">Basic</td>
                    <td className="text-center py-4 px-4">
                      <X className="h-4 w-4 mx-auto text-destructive" />
                    </td>
                    <td className="text-center py-4 px-4 bg-primary/5">
                      <Check className="h-4 w-4 mx-auto text-primary" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4">Human Expert Review</td>
                    <td className="text-center py-4 px-4">
                      <X className="h-4 w-4 mx-auto text-destructive" />
                    </td>
                    <td className="text-center py-4 px-4">
                      <Check className="h-4 w-4 mx-auto text-muted-foreground" />
                    </td>
                    <td className="text-center py-4 px-4 bg-primary/5">
                      <Check className="h-4 w-4 mx-auto text-primary" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4">Transparent Flat Pricing</td>
                    <td className="text-center py-4 px-4">
                      <Check className="h-4 w-4 mx-auto text-muted-foreground" />
                    </td>
                    <td className="text-center py-4 px-4">
                      <X className="h-4 w-4 mx-auto text-destructive" />
                    </td>
                    <td className="text-center py-4 px-4 bg-primary/5">
                      <Check className="h-4 w-4 mx-auto text-primary" />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-semibold">All Services in One Place</td>
                    <td className="text-center py-4 px-4">
                      <X className="h-4 w-4 mx-auto text-destructive" />
                    </td>
                    <td className="text-center py-4 px-4">
                      <X className="h-4 w-4 mx-auto text-destructive" />
                    </td>
                    <td className="text-center py-4 px-4 bg-primary/5 font-semibold text-primary rounded-b-lg">
                      <Check className="h-4 w-4 mx-auto text-primary" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="container py-24">
          <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
              One Package. Everything Included.
            </h2>
            <p className="text-muted-foreground leading-relaxed text-pretty">
              No more managing multiple tools. BookKeeping.business replaces your entire financial stack.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Bookkeeping</h3>
                    <p className="text-sm text-muted-foreground">Replaces QuickBooks</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Calculator className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Business Tax Filing</h3>
                    <p className="text-sm text-muted-foreground">Replaces TurboTax Business</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Personal Tax Filing</h3>
                    <p className="text-sm text-muted-foreground">Owner + spouse included</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Payroll Support</h3>
                    <p className="text-sm text-muted-foreground">Replaces Gusto complexity</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Receipt className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Invoicing Guidance</h3>
                    <p className="text-sm text-muted-foreground">Best practices setup</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">CFO Guidance</h3>
                    <p className="text-sm text-muted-foreground">Strategic quarterly reviews</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="max-w-2xl mx-auto mt-12 text-center">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <p className="text-lg font-medium">
                  All plans include business tax prep + owner's personal tax prep & filing.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  For married couples, both spouses' personal returns are included at no extra cost.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CFO Partnership */}
        <section className="border-t border-border bg-muted/30 py-24">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <div className="grid gap-12 md:grid-cols-2 items-center">
                <div className="space-y-6">
                  <Badge variant="outline">CFO-Style Partnership</Badge>
                  <h2 className="text-3xl font-bold tracking-tight text-balance">
                    We Work Alongside You as a Strategic Partner
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Think of us as your outsourced CFO—not just someone who files papers once a year. We're invested in
                    your success and provide ongoing guidance to help your business thrive.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-medium">Monthly Check-Ins</h4>
                        <p className="text-sm text-muted-foreground">
                          Regular updates on your financial health, not just year-end surprises
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                        <TrendingUp className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-medium">Quarterly Strategy Sessions</h4>
                        <p className="text-sm text-muted-foreground">
                          Review how your year is tracking and plan for what's ahead
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                        <DollarSign className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-medium">Proactive Tax Planning</h4>
                        <p className="text-sm text-muted-foreground">
                          We identify opportunities throughout the year, not after it's too late
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <Card className="p-8">
                    <div className="space-y-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground uppercase tracking-wide">Your Dedicated Partner</p>
                        <h3 className="text-2xl font-bold mt-2">Always Available</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <span className="text-sm">Email Response</span>
                          <span className="text-sm font-medium">Within 24 hours</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <span className="text-sm">Portal Access</span>
                          <span className="text-sm font-medium">24/7 Secure</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <span className="text-sm">Quarterly Calls</span>
                          <span className="text-sm font-medium">Scheduled</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <span className="text-sm">Tax Season Support</span>
                          <span className="text-sm font-medium">Priority</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container py-24">
          <div className="mx-auto max-w-2xl text-center space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-balance">
              Ready for a Better Way?
            </h2>
            <p className="text-muted-foreground leading-relaxed text-pretty">
              Join business owners who've simplified their finances and gained a true partner in their success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg">
                  Get Started Today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/services">
                <Button size="lg" variant="outline" className="bg-transparent">
                  Explore Services
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
