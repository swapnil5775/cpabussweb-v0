import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "About BookKeeping.business — Online Bookkeeping & Tax Service for Small Business",
  description:
    "BookKeeping.business provides professional online bookkeeping, payroll, and tax services for small businesses across the USA. Dedicated bookkeepers, all software included — one team for everything.",
  keywords: [
    "bookkeeping company for small business",
    "online bookkeeping firm USA",
    "professional bookkeeping service",
    "virtual bookkeeping company",
    "small business accounting firm online",
    "restaurant bookkeeping company",
    "hotel accounting firm",
    "childcare accounting service",
    "bookkeeping service with payroll",
    "all-in-one bookkeeping and tax service",
  ],
  openGraph: {
    title: "About BookKeeping.business — Online Bookkeeping & Tax for Small Business",
    description:
      "Professional bookkeeping, payroll, and tax for small businesses — dedicated bookkeepers, all software included, one flat monthly fee.",
    url: "https://www.bookkeeping.business/about",
  },
  alternates: { canonical: "https://www.bookkeeping.business/about" },
}
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Target, Shield, Users, Zap } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">About BookKeeping.business</h1>
            <p className="text-xl text-muted-foreground leading-relaxed text-pretty">
              We combine AI-assisted workflows with human expertise to deliver accurate, compliant tax and bookkeeping
              services.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="border-t border-border bg-muted/30 py-24">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="grid gap-12 md:grid-cols-2 items-center">
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold tracking-tight text-balance">Our Mission</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We believe modern technology should enhance, not replace, professional service. That's why we've
                    built a practice that leverages AI for efficiency while maintaining the human touch that complex
                    financial work demands.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Every document is prepared with AI-assisted tools, then reviewed by experienced professionals before
                    delivery. You get the speed of technology with the confidence of human expertise.
                  </p>
                </div>
                <div className="space-y-4">
                  <Card>
                    <CardContent className="pt-6 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Zap aria-hidden="true" className="h-5 w-5" />
                        </div>
                        <h3 className="font-semibold">AI-Assisted</h3>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Efficient workflows powered by modern technology
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Users aria-hidden="true" className="h-5 w-5" />
                        </div>
                        <h3 className="font-semibold">Human Reviewed</h3>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Every filing verified by experienced professionals
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="container py-24">
          <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">Our Values</h2>
            <p className="text-muted-foreground leading-relaxed text-pretty">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            <div className="space-y-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mx-auto">
                <Shield aria-hidden="true" className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">Compliance First</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We never compromise on accuracy or regulatory compliance
              </p>
            </div>

            <div className="space-y-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mx-auto">
                <Target aria-hidden="true" className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">Clear Scope</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                No surprises—we define scope upfront and stick to it
              </p>
            </div>

            <div className="space-y-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mx-auto">
                <Users aria-hidden="true" className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">Dedicated Service</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Work with the same account rep who knows your business
              </p>
            </div>

            <div className="space-y-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mx-auto">
                <Zap aria-hidden="true" className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">All-in-One Service</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                One place for bookkeeping, tax prep, and business services — no juggling vendors
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container py-24">
          <div className="mx-auto max-w-2xl text-center space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-balance">Ready to Work Together?</h2>
            <p className="text-muted-foreground leading-relaxed text-pretty">
              Start your intake or book a call to learn more about how we can help your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg">
                  Get Started
                  <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
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
