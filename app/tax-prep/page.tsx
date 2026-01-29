import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Check, FileText, Users, Building2, Briefcase } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Tax Preparation & E-Filing Services | BookKeeping.business",
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
    title: "Tax Preparation & E-Filing Services | BookKeeping.business",
    description:
      "Professional tax preparation for individuals and businesses. Human-reviewed returns with federal and state e-filing.",
    url: "https://bookkeeping.business/tax-prep",
  },
}

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
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/contact">
                <Button size="lg">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Who We Serve */}
        <section className="border-t border-border bg-muted/30 py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-balance">Who We Serve</h2>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                From simple W-2 returns to complex business filings, we handle it all
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
              <Card>
                <CardHeader className="text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mx-auto mb-3">
                    <Users className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-base">Individuals</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>W-2 employees</li>
                    <li>Married couples</li>
                    <li>Itemized deductions</li>
                    <li>Multiple income sources</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mx-auto mb-3">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-base">Self-Employed</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>Freelancers & contractors</li>
                    <li>Schedule C filers</li>
                    <li>1099 income</li>
                    <li>Business deductions</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mx-auto mb-3">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-base">Real Estate</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>Rental property owners</li>
                    <li>Schedule E filers</li>
                    <li>Depreciation tracking</li>
                    <li>Property sales</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mx-auto mb-3">
                    <FileText className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-base">Businesses</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>S-Corps (Form 1120-S)</li>
                    <li>C-Corps (Form 1120)</li>
                    <li>Partnerships (Form 1065)</li>
                    <li>Multi-state filings</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="container py-24">
          <div className="mx-auto max-w-3xl text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-balance">What&apos;s Included</h2>
            <p className="text-muted-foreground leading-relaxed text-pretty">
              Every tax return includes these core services
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {[
              { title: "Expert Preparation", description: "Experienced tax preparers handle your return with care and attention to detail" },
              { title: "Human Review", description: "Every return is reviewed by a second set of eyes before filing for accuracy" },
              { title: "Federal E-Filing", description: "Electronic filing with the IRS for faster processing and confirmation" },
              { title: "State E-Filing", description: "State returns filed electronically where supported" },
              { title: "Document Storage", description: "Secure portal storage for your tax documents for 7 years" },
              { title: "Amendment Support", description: "If we made an error, we'll fix it and file an amendment at no extra cost" },
            ].map((item) => (
              <Card key={item.title}>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Process */}
        <section className="border-t border-border bg-muted/30 py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-balance">How It Works</h2>
            </div>

            <div className="grid gap-8 md:grid-cols-4 max-w-5xl mx-auto">
              {[
                {
                  step: "1",
                  title: "Upload Documents",
                  description: "Securely upload your W-2s, 1099s, and other tax documents to our portal",
                },
                {
                  step: "2",
                  title: "We Prepare",
                  description: "Our team prepares your return with AI assistance and human expertise",
                },
                {
                  step: "3",
                  title: "Review & Approve",
                  description: "Review your return summary and approve for filing",
                },
                {
                  step: "4",
                  title: "E-File & Done",
                  description: "We e-file your return and you receive confirmation",
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
          </div>
        </section>

        {/* Bookkeeping Clients Note */}
        <section className="border-t border-border py-16">
          <div className="container">
            <Card className="max-w-3xl mx-auto bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-semibold">Already a Bookkeeping Client?</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    If you&apos;re on one of our monthly bookkeeping plans, your personal tax preparation is already included at no additional cost. Your books are tax-ready, making filing fast and painless.
                  </p>
                  <Link href="/bookkeeping">
                    <Button variant="outline">
                      Learn About Bookkeeping Plans
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
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
                    className="border-primary-foreground/20 hover:bg-primary-foreground/10 bg-transparent text-primary-foreground"
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
