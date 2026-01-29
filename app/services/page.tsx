import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Tax & Accounting Services for Small Business | BookKeeping.business",
  description:
    "Full-service tax preparation, monthly bookkeeping, LLC formation, and business consulting. Transparent pricing with no hidden fees. Serving freelancers, solopreneurs, and SMBs across the US.",
  keywords: [
    "small business accounting services",
    "tax preparation services",
    "LLC formation assistance",
    "business consulting",
    "monthly bookkeeping",
    "S-corp tax filing",
    "partnership tax returns",
    "business tax services",
  ],
  openGraph: {
    title: "Tax & Accounting Services for Small Business | BookKeeping.business",
    description:
      "Full-service tax preparation, monthly bookkeeping, LLC formation, and business consulting with transparent pricing.",
    url: "https://bookkeeping.business/services",
  },
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
} from "lucide-react"
import Link from "next/link"

export default function ServicesPage() {
  const services = [
    {
      title: "Monthly Bookkeeping",
      description: "All-in-one bookkeeping with tax prep & filing included for you and your business",
      icon: BookOpen,
      pricing: "From $75/mo",
      href: "/bookkeeping",
      features: ["Monthly reconciliation", "Personal tax prep included", "Business tax prep included", "Quarterly check-ins"],
      highlight: true,
    },
    {
      title: "Catchup Bookkeeping",
      description: "Behind on your books? We'll get you caught up and audit-ready",
      icon: FileText,
      pricing: "Custom",
      href: "/contact",
      features: ["Historical reconciliation", "Transaction categorization", "Clean financial records", "Smooth transition to monthly"],
    },
    {
      title: "Financial Analysis",
      description: "Business health reviews and actionable insights",
      icon: TrendingUp,
      pricing: "Included in plans",
      href: "/business-services",
      features: ["P&L analysis", "Cash flow review", "KPI tracking", "Growth recommendations"],
    },
    {
      title: "LLC Formation Assistance",
      description: "Help with LLC creation and EIN application (not legal advice)",
      icon: Building2,
      pricing: "Custom",
      href: "/business-services",
      features: ["Formation guidance", "EIN assistance", "Document prep help", "State filing support"],
    },
    {
      title: "Registered Agent Services",
      description: "Assistance with registered agent updates and compliance",
      icon: Shield,
      pricing: "Custom",
      href: "/business-services",
      features: ["Agent updates", "Compliance reminders", "Document handling", "State coordination"],
    },
    {
      title: "State Filings Support",
      description: "Annual reports and ongoing state compliance",
      icon: Calculator,
      pricing: "Custom",
      href: "/business-services",
      features: ["Annual reports", "State amendments", "Compliance tracking", "Deadline reminders"],
    },
    {
      title: "Business Consultation",
      description: "1:1 calls for strategic business guidance and planning",
      icon: Users,
      pricing: "Included quarterly",
      href: "/business-services",
      features: ["Quarterly check-ins", "Strategic planning", "Tax strategy", "Growth planning"],
    },
    {
      title: "Acquisition File Review",
      description: "Financial review for business purchases with risk assessment",
      icon: BarChart3,
      pricing: "Custom",
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
              Comprehensive Services for Every Need
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
              From monthly bookkeeping to complex business acquisitions, we combine technology with expert human review
              to deliver accurate, compliant results.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="container pb-24">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <Card key={service.title} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <Badge variant="secondary">{service.pricing}</Badge>
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
                    <Link href={service.href}>
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Pricing Overview */}
        <section className="border-t border-border bg-muted/30 py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">Transparent Pricing</h2>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                Flat monthly pricing based on your annual revenue. Tax prep and filing included—no surprise bills at year-end.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Starter</CardTitle>
                  <CardDescription>Up to $500K annual revenue</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-4">
                    <span className="text-4xl font-bold">$75</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span className="text-muted-foreground">Monthly bookkeeping</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span className="text-muted-foreground">Business tax prep & filing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span className="text-muted-foreground">Personal tax prep & filing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span className="text-muted-foreground">Quarterly business reviews</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-primary">
                <CardHeader>
                  <Badge className="w-fit mb-2">Most Popular</Badge>
                  <CardTitle>Growth</CardTitle>
                  <CardDescription>Up to $1M annual revenue</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-4">
                    <span className="text-4xl font-bold">$175</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span className="text-muted-foreground">Everything in Starter</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span className="text-muted-foreground">Advanced financial reports</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span className="text-muted-foreground">Cash flow forecasting</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span className="text-muted-foreground">Monthly business reviews</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pro</CardTitle>
                  <CardDescription>Over $1M annual revenue</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-4">
                    <span className="text-4xl font-bold">Custom</span>
                  </div>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span className="text-muted-foreground">Everything in Growth</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span className="text-muted-foreground">Multi-entity support</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span className="text-muted-foreground">Dedicated account manager</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span className="text-muted-foreground">Phone + email support</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <p className="text-sm text-muted-foreground">
                All plans include: Owner's personal tax prep & filing (or married couple), business tax prep & filing, and quarterly check-ins.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container py-24">
          <div className="mx-auto max-w-2xl text-center space-y-6">
            <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="text-3xl font-bold tracking-tight text-balance">Not sure what you need?</h2>
            <p className="text-muted-foreground leading-relaxed text-pretty">
              Book a free 15-minute consultation to discuss your specific situation and get a custom quote.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg">
                  Book a Call
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/faqs">
                <Button size="lg" variant="outline" className="bg-transparent">
                  View FAQs
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
