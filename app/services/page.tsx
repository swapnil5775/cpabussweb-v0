import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Bookkeeping & Tax Services for Restaurants, Hotels, Childcare & Small Business | BookKeeping.business",
  description:
    "Full-service bookkeeping and tax preparation for restaurants, hotels, childcare centers, realtors, tutoring centers, home-based businesses, and small businesses — all in one place, no separate software needed.",
  keywords: [
    "restaurant bookkeeping services",
    "hotel accounting services",
    "childcare bookkeeping",
    "daycare accounting",
    "realtor bookkeeping",
    "home-based business accounting",
    "tutoring center bookkeeping",
    "small business tax preparation",
    "LLC formation assistance",
    "monthly bookkeeping services",
    "S-corp tax filing",
    "no QuickBooks subscription",
  ],
  openGraph: {
    title: "Bookkeeping & Tax Services for Restaurants, Hotels, Childcare & Small Business | BookKeeping.business",
    description:
      "All-in-one bookkeeping, tax prep, and business services for restaurants, hotels, childcare centers, realtors, and home-based businesses.",
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
      href: "/bookkeeping",
      features: ["Monthly reconciliation", "Personal tax prep included", "Business tax prep included", "Quarterly check-ins"],
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
                    {["Bookkeeping + tax in one plan", "Business & personal returns included", "No separate vendors to manage", "Single secure portal for all documents"].map((f) => (
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
                  <Badge className="w-fit mb-2">All-Inclusive</Badge>
                  <CardTitle>Complete Service</CardTitle>
                  <CardDescription>No surprises, no add-ons</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3 text-sm">
                    {["Monthly bookkeeping & reconciliation", "Business tax prep & e-filing", "Owner's personal tax prep & filing", "Quarterly strategy check-ins", "Dedicated account rep"].map((f) => (
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
                All plans include: Owner's personal tax prep & filing, business tax prep & filing, and quarterly check-ins. Custom quotes based on your specific needs.
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
