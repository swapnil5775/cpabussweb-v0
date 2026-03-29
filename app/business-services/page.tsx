import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Business Formation, Compliance & Advisory Services | BookKeeping.business",
  description:
    "LLC formation assistance, registered agent services, state filings, financial analysis, and strategic business consulting. Quarterly check-ins included with all business services.",
  keywords: [
    "LLC formation assistance",
    "EIN application help",
    "business compliance services",
    "registered agent services",
    "state filing support",
    "business financial analysis",
    "small business consulting",
    "acquisition due diligence",
  ],
  openGraph: {
    title: "Business Formation, Compliance & Advisory Services | BookKeeping.business",
    description:
      "LLC formation, compliance services, and strategic business consulting with quarterly check-ins included.",
    url: "https://bookkeeping.business/business-services",
  },
}
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Building2, TrendingUp, Users, Shield, Calculator, Briefcase, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function BusinessServicesPage() {
  const services = [
    {
      icon: Building2,
      title: "LLC Formation Assistance",
      description: "Help with LLC creation and EIN application (not legal advice)",
      features: [
        "Formation guidance and documentation",
        "EIN application assistance",
        "State-specific requirements help",
        "Operating agreement templates",
      ],
    },
    {
      icon: Shield,
      title: "Registered Agent Services",
      description: "Assistance with registered agent updates and compliance",
      features: [
        "Registered agent update help",
        "Compliance deadline reminders",
        "Document handling assistance",
        "State coordination support",
      ],
    },
    {
      icon: Calculator,
      title: "State Filings Support",
      description: "Annual reports and ongoing state compliance",
      features: [
        "Annual report preparation",
        "State amendment filings",
        "Compliance tracking",
        "Multi-state coordination",
      ],
    },
    {
      icon: Briefcase,
      title: "Federal Filing & Prep Work",
      description: "Complex federal filings and preparation",
      features: [
        "Multi-entity return prep",
        "Partnership tax filings",
        "Corporate tax returns",
        "Extension management",
      ],
    },
    {
      icon: TrendingUp,
      title: "Financial Analysis",
      description: "Business health reviews and actionable insights",
      features: ["Profit & Loss analysis", "Cash flow review", "KPI tracking & reporting", "Growth recommendations"],
    },
    {
      icon: Users,
      title: "Business Consultation Calls",
      description: "1:1 strategic guidance and planning",
      features: [
        "Quarterly check-ins included",
        "Tax strategy planning",
        "Business growth planning",
        "Compliance guidance",
      ],
    },
    {
      icon: BarChart3,
      title: "Acquisition File Review",
      description: "Financial review for business purchases",
      features: [
        "Comprehensive financial review",
        "Risk flag identification",
        "Due diligence support",
        "Detailed report delivery",
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
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">Business Services</h1>
            <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
              Comprehensive support for growing businesses, from formation to acquisition. We provide process
              assistance, strategic guidance, and financial analysis to help your business thrive.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="container pb-24">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <Card key={service.title} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                      <Icon aria-hidden="true" className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm">
                          <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Process Help Notice */}
        <section className="border-t border-border bg-muted/30 py-16">
          <div className="container">
            <Card className="max-w-4xl mx-auto border-primary/20">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Process Assistance, Not Legal Advice</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Our business services focus on helping you navigate administrative and financial processes. We
                    provide guidance on forms, filings, and procedures but do not offer legal advice. For legal
                    questions related to business formation, contracts, or compliance matters, please consult with a
                    licensed attorney.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Quarterly Check-Ins */}
        <section className="container py-24">
          <div className="mx-auto max-w-3xl text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-balance">Quarterly Business Check-Ins</h2>
            <p className="text-muted-foreground leading-relaxed text-pretty">
              Included for bookkeeping and business service clients
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Financial Review</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span className="text-muted-foreground">Review quarterly financials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span className="text-muted-foreground">Discuss trends and insights</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span className="text-muted-foreground">Identify opportunities</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Strategic Planning</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span className="text-muted-foreground">Tax planning strategies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span className="text-muted-foreground">Growth planning guidance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span className="text-muted-foreground">Compliance reminders</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border bg-primary text-primary-foreground py-16">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-balance">Let's Discuss Your Business Needs</h2>
              <p className="text-lg leading-relaxed text-pretty opacity-90">
                Book a consultation to talk about your specific situation and get a custom service plan.
              </p>
              <Link href="/contact">
                <Button size="lg" variant="secondary">
                  Book a Consultation
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
