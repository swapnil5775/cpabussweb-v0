import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Small Business Tax Preparation Services — Federal & State E-Filing",
  description:
    "Professional tax preparation for small businesses, restaurants, hotels, childcare centers, realtors, and self-employed individuals across the USA. S-Corp, LLC, partnership, and 1040 returns — human-reviewed with federal and all-state e-filing.",
  keywords: [
    "small business tax preparation",
    "online tax preparation service",
    "restaurant tax preparation service",
    "hotel business tax filing",
    "childcare center tax prep",
    "realtor tax preparation",
    "self-employed tax service",
    "S-corp tax filing service",
    "LLC tax return preparation",
    "partnership tax filing",
    "federal and state tax e-filing",
    "1099 tax preparation",
    "Schedule C tax prep",
    "small business tax accountant online",
  ],
  openGraph: {
    title: "Small Business Tax Preparation — Federal & State E-Filing | BookKeeping.business",
    description:
      "Professional tax prep for restaurants, hotels, childcare, realtors, and small businesses — human-reviewed with federal and all-state e-filing.",
    url: "https://www.bookkeeping.business/tax-prep",
  },
  alternates: { canonical: "https://www.bookkeeping.business/tax-prep" },
}
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Check, FileText, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function TaxPrepPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <FileText aria-hidden="true" className="h-8 w-8" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">
              Tax Preparation for Restaurants, Realtors, Childcare & Small Business
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
              Business and personal tax prep for every type of small business — restaurants, hotels, childcare centers,
              realtors, tutoring centers, and home-based businesses. AI-assisted, human-reviewed, federal and state e-filing included.
            </p>
          </div>
        </section>

        {/* Individual Tax Services */}
        <section className="container pb-16">
          <div className="mx-auto max-w-3xl text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-balance">Individual Tax Returns</h2>
            <p className="text-muted-foreground leading-relaxed text-pretty">We handle all individual filing situations — from simple W-2s to complex investment and self-employment returns.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Simple W-2</CardTitle>
                <CardDescription className="mt-1">Standard employment income</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Check aria-hidden="true" className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Standard deduction</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check aria-hidden="true" className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>W-2 income</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check aria-hidden="true" className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Federal + state e-filing</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-primary">
              <CardHeader>
                <Badge className="w-fit mb-2">Popular</Badge>
                <CardTitle>Married / Itemized</CardTitle>
                <CardDescription className="mt-1">Joint filing with deductions</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Check aria-hidden="true" className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Itemized deductions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check aria-hidden="true" className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Married filing jointly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check aria-hidden="true" className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Multiple W-2s</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Self-Employed</CardTitle>
                <CardDescription className="mt-1">1099 & freelance income</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Check aria-hidden="true" className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Schedule C</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check aria-hidden="true" className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Business expenses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check aria-hidden="true" className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Quarterly estimates</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rental / Investments</CardTitle>
                <CardDescription className="mt-1">Complex income situations</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Check aria-hidden="true" className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Schedule E</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check aria-hidden="true" className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Capital gains</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check aria-hidden="true" className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Cryptocurrency</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <Card className="max-w-2xl mx-auto bg-muted/50">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Multi-state filings, amended returns, and complex situations are all handled. Book a consultation for a custom quote.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Business Tax Services */}
        <section className="border-t border-border bg-muted/30 py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-balance">Business Tax Returns</h2>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                We handle all entity types — from single-member LLCs to C-Corps and multi-partner structures.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>LLC / S-Corp</CardTitle>
                  <CardDescription>Form 1120-S</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Check aria-hidden="true" className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>S-Corporation return</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check aria-hidden="true" className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>K-1 schedules</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check aria-hidden="true" className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Federal + state e-filing</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>C-Corporation</CardTitle>
                  <CardDescription>Form 1120</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Check aria-hidden="true" className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Corporate return</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check aria-hidden="true" className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Complex deductions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check aria-hidden="true" className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Federal + state e-filing</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Partnership</CardTitle>
                  <CardDescription>Form 1065</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Check aria-hidden="true" className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Partnership return</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check aria-hidden="true" className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Partner K-1s</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check aria-hidden="true" className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Federal + state e-filing</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8">
              <Card className="max-w-2xl mx-auto border-muted-foreground/20 bg-card">
                <CardContent className="pt-6 flex gap-4">
                  <AlertCircle aria-hidden="true" className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Multi-entity structures, holding companies, and complex situations are all handled. Book a free consultation to discuss your specific needs.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="container py-24">
          <div className="mx-auto max-w-3xl text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-balance">What's Included</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {[
              { title: "Human Preparation", description: "Expert tax preparers handle your return" },
              { title: "Human Review", description: "Second review before filing for accuracy" },
              { title: "Federal E-Filing", description: "Electronic filing with the IRS" },
              { title: "State E-Filing", description: "State returns filed electronically" },
              { title: "Document Storage", description: "Secure portal storage for 7 years" },
              { title: "Amendment Support", description: "Help with amendments if needed" },
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
        </section>

        {/* CTA */}
        <section className="border-t border-border bg-primary text-primary-foreground py-16">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-balance">Ready to File Your Taxes?</h2>
              <p className="text-lg leading-relaxed text-pretty opacity-90">
                Start your intake or book a call to discuss your tax situation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg" variant="secondary">
                    Start Intake
                    <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary-foreground/20 hover:bg-primary-foreground/10 bg-transparent"
                  >
                    Book a Call
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
