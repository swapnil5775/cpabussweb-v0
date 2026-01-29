import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Tax Preparation & E-Filing Services from $149 | BookKeeping.business",
  description:
    "Professional tax preparation and e-filing for individuals and businesses. W-2, self-employed, rental income, S-Corp, C-Corp, and partnership returns. Human-reviewed for accuracy with secure document storage.",
  keywords: [
    "tax preparation services",
    "tax filing services",
    "self-employed tax prep",
    "S-corp tax filing",
    "small business tax returns",
    "e-file taxes",
    "federal tax filing",
    "state tax filing",
    "1099 tax prep",
  ],
  openGraph: {
    title: "Tax Preparation & E-Filing Services from $149 | BookKeeping.business",
    description:
      "Professional tax preparation for individuals and businesses. Human-reviewed returns with e-filing starting at $149.",
    url: "https://bookkeeping.business/tax-prep",
  },
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
                <FileText className="h-8 w-8" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">
              Tax Preparation & Filing Services
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
              Individual and business tax preparation with federal and state e-filing. AI-assisted prep with mandatory
              human review for accuracy and compliance.
            </p>
          </div>
        </section>

        {/* Individual Tax Pricing */}
        <section className="container pb-16">
          <div className="mx-auto max-w-3xl text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-balance">Individual Tax Returns</h2>
            <p className="text-muted-foreground leading-relaxed text-pretty">Transparent pricing based on complexity</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Simple W-2</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold">$149</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Standard deduction</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>W-2 income</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Federal + 1 state</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-primary">
              <CardHeader>
                <Badge className="w-fit mb-2">Popular</Badge>
                <CardTitle>Married/Itemized</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold">$249</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Itemized deductions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Married filing jointly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Multiple W-2s</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Self-Employed</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold">$349</span>
                  <span className="text-muted-foreground text-base">+</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Schedule C</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Business expenses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Quarterly estimates</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rental/Investments</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold">$449</span>
                  <span className="text-muted-foreground text-base">+</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Schedule E</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Capital gains</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
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
                  <span className="font-semibold text-foreground">Multi-state add-on:</span> +$100 per additional state
                  return
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Business Tax Pricing */}
        <section className="border-t border-border bg-muted/30 py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-balance">Business Tax Returns</h2>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                Pricing varies based on entity type and complexity
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>LLC / S-Corp</CardTitle>
                  <CardDescription>Form 1120-S</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">$800</span>
                    <span className="text-muted-foreground text-base">+</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>S-Corporation return</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>K-1 schedules</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>State filing</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>C-Corporation</CardTitle>
                  <CardDescription>Form 1120</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">$1,000</span>
                    <span className="text-muted-foreground text-base">+</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Corporate return</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Complex deductions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>State filing</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Partnership</CardTitle>
                  <CardDescription>Form 1065</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">$900</span>
                    <span className="text-muted-foreground text-base">+</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Partnership return</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Partner K-1s</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>State filing</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8">
              <Card className="max-w-2xl mx-auto border-muted-foreground/20 bg-card">
                <CardContent className="pt-6 flex gap-4">
                  <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Multi-entity structures and complex situations require custom pricing. Book a consultation for an
                    accurate quote.
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
                    <ArrowRight className="ml-2 h-4 w-4" />
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
