import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Bookkeeping, Payroll & Tax Services for Small Business — All-In-One",
  description:
    "Complete bookkeeping, payroll, tax preparation, and business services for restaurants, hotels, childcare centers, realtors, and small businesses across the USA. One team, one platform, all software included.",
  keywords: [
    "bookkeeping and tax services small business",
    "bookkeeping payroll and tax service",
    "restaurant bookkeeping and tax service",
    "hotel accounting and tax service",
    "childcare center bookkeeping service",
    "realtor bookkeeping and tax",
    "home-based business accounting service",
    "tutoring center bookkeeping",
    "LLC formation service",
    "online bookkeeping all inclusive",
    "small business financial services USA",
    "bookkeeping service no software fees",
  ],
  openGraph: {
    title: "Bookkeeping, Payroll & Tax Services for Small Business | BookKeeping.business",
    description:
      "Complete bookkeeping, payroll, and tax services for restaurants, hotels, childcare, and small businesses — one team, all software included.",
    url: "https://www.bookkeeping.business/services",
  },
  alternates: { canonical: "https://www.bookkeeping.business/services" },
}
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  BookOpen,
  FileText,
  Building2,
  TrendingUp,
  Users,
  Shield,
  Calculator,
  BarChart3,
  FileCheck,
  Briefcase,
  HelpCircle,
  Globe2,
  WalletCards,
} from "lucide-react"
import Link from "next/link"

export default function ServicesPage() {
  const services = [
    {
      title: "Monthly Bookkeeping",
      description: "Monthly bookkeeping with payroll included — personal & business tax prep available as an Add-On",
      icon: BookOpen,
      href: "/bookkeeping",
      features: ["Monthly reconciliation", "Payroll included per plan", "Personal tax prep as Add-On", "Quarterly check-ins"],
      highlight: true,
    },
    {
      title: "Catchup Bookkeeping",
      description: "Behind on your books? We'll get you caught up and audit-ready",
      icon: FileText,
      href: "/contact",
      features: ["Historical reconciliation", "Transaction categorization", "Clean financial records", "Smooth transition to monthly"],
    },
    {
      title: "Financial Analysis",
      description: "Business health reviews and actionable insights",
      icon: TrendingUp,
      href: "/business-services",
      features: ["P&L analysis", "Cash flow review", "KPI tracking", "Growth recommendations"],
    },
    {
      title: "LLC Formation Assistance",
      description: "Help with LLC creation and EIN application (not legal advice)",
      icon: Building2,
      href: "/business-services",
      features: ["Formation guidance", "EIN assistance", "Document prep help", "State filing support"],
    },
    {
      title: "Registered Agent Services",
      description: "Assistance with registered agent updates and compliance",
      icon: Shield,
      href: "/business-services",
      features: ["Agent updates", "Compliance reminders", "Document handling", "State coordination"],
    },
    {
      title: "State Filings Support",
      description: "Annual reports and ongoing state compliance",
      icon: Calculator,
      href: "/business-services",
      features: ["Annual reports", "State amendments", "Compliance tracking", "Deadline reminders"],
    },
    {
      title: "Business Consultation",
      description: "1:1 calls for strategic business guidance and planning",
      icon: Users,
      href: "/business-services",
      features: ["Quarterly check-ins", "Strategic planning", "Tax strategy", "Growth planning"],
    },
    {
      title: "Acquisition File Review",
      description: "Financial review for business purchases with risk assessment",
      icon: BarChart3,
      href: "/business-services",
      features: ["Financial review", "Risk flag identification", "Due diligence support", "Report delivery"],
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <Badge variant="outline" className="px-4 py-1.5">
              Full Service Tax & Accounting
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">
              Bookkeeping & Tax Services for Every Type of Small Business
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
              Serving restaurants, hotels, childcare centers, realtors, tutoring centers, home-based businesses, and more.
              One platform — bookkeeping, payroll, tax prep, and filing — no separate software subscriptions.
            </p>
            <p className="text-sm text-muted-foreground">
              US and Canada: QuickBooks or Xero support. International (Australia, India, UK/London): Xero automation onboarding.
            </p>
          </div>
        </section>

        {/* Core service matrix */}
        <section className="container pb-16">
          <Card className="max-w-6xl mx-auto border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>Core Service Coverage</CardTitle>
              <CardDescription>
                Built as recurring monthly service so clients get execution plus visibility, not software overhead.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                "Bi-weekly or monthly bookkeeping",
                "P&L and Balance Sheet creation",
                "Projection cash flow modeling",
                "Expense tracking and insights",
                "Transaction categorization",
                "Quarterly sales tax filing support",
                "Payroll support via Gusto",
                "Invoice and payment workflow in QBO/Xero",
                "Managed software stack included",
              ].map((item) => (
                <div key={item} className="rounded-xl border bg-background px-3 py-3 text-sm text-muted-foreground">
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="container pb-24">
          <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <WalletCards className="h-5 w-5" aria-hidden="true" />
                </div>
                <CardTitle className="mt-3 text-lg">US & Canada</CardTitle>
                <CardDescription>QuickBooks Online + Xero options</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Platform support on either QuickBooks or Xero with payroll, reporting, and filing workflows.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Globe2 className="h-5 w-5" aria-hidden="true" />
                </div>
                <CardTitle className="mt-3 text-lg">International</CardTitle>
                <CardDescription>Australia, India, UK/London</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Xero-first onboarding with automation workflows and recurring monthly close support.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Shield className="h-5 w-5" aria-hidden="true" />
                </div>
                <CardTitle className="mt-3 text-lg">Software Cost Policy</CardTitle>
                <CardDescription>No extra software billing</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">We pay all required tool subscriptions. Clients only pay monthly service charges to us.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Services Grid */}
        <section className="container pb-24">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <Card key={service.title} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon aria-hidden="true" className="h-5 w-5" />
                      </div>
                    </div>
                    <CardTitle className="mt-4">{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm">
                          <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href={service.href} aria-label={`Learn more about ${service.title}`}>
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        Learn More
                        <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Why All-in-One */}
        <section className="border-t border-border bg-muted/30 py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">One Place for Everything</h2>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                Stop juggling multiple tools and vendors. Every service you need is centralized in one place, handled by one dedicated team who knows your business inside out.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Centralized</CardTitle>
                  <CardDescription>Everything under one roof</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3 text-sm">
                    {["Bookkeeping + payroll in every plan", "Tax prep available as Add-On", "No separate vendors to manage", "Single secure portal for all documents"].map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span className="text-muted-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-primary">
                <CardHeader>
                  <Badge className="w-fit mb-2">Flexible</Badge>
                  <CardTitle>Complete Service</CardTitle>
                  <CardDescription>Core included, extras as Add-Ons</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3 text-sm">
                    {["Monthly bookkeeping & reconciliation", "Payroll included per plan (2–5 employees)", "Personal & business tax prep as Add-On", "Quarterly strategy check-ins", "Dedicated account rep"].map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span className="text-muted-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Scalable</CardTitle>
                  <CardDescription>Grows with your business</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3 text-sm">
                    {["Tailored to your business size", "Add services as you grow", "Multi-entity support available", "Enterprise needs handled too"].map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span className="text-muted-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <p className="text-sm text-muted-foreground">
                All plans include: monthly bookkeeping, payroll (2–5 employees depending on plan), and quarterly check-ins. Personal & business tax prep available as an Add-On on any plan. <Link href="/bookkeeping#pricing" className="underline underline-offset-2 hover:text-foreground">See full plan details →</Link>
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container py-24">
          <div className="mx-auto max-w-2xl text-center space-y-6">
            <HelpCircle aria-hidden="true" className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="text-3xl font-bold tracking-tight text-balance">Ready to get started?</h2>
            <p className="text-muted-foreground leading-relaxed text-pretty">
              Sign up free, complete a short onboarding quiz, and pick the plan that fits your business — no waiting for a callback.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg">
                  Create Free Account
                  <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="bg-transparent">
                  Book a Call Instead
                </Button>
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">No credit card required • Cancel anytime</p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
