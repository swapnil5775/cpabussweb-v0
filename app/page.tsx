import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Online Bookkeeping & Tax Services for Small Business | BookKeeping.business",
  description:
    "Affordable online bookkeeping and tax preparation services for freelancers and small businesses. AI-assisted workflows with human review. Secure portal, dedicated account rep, transparent pricing starting at $75/month.",
  keywords: [
    "online bookkeeping services",
    "small business bookkeeping",
    "tax preparation services",
    "affordable bookkeeping",
    "virtual bookkeeper",
    "tax filing for small business",
    "AI bookkeeping",
    "freelancer tax prep",
  ],
  openGraph: {
    title: "Online Bookkeeping & Tax Services for Small Business | BookKeeping.business",
    description:
      "Affordable online bookkeeping and tax preparation services for freelancers and small businesses. Starting at $75/month.",
    url: "https://bookkeeping.business",
  },
}
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Upload, FileCheck, CheckCircle, FileText, Shield, Lock } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center space-y-8">
            <Badge variant="outline" className="px-4 py-1.5">
              Human-Prepared + AI-Assisted
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-balance">Tax & Books, handled.</h1>
            <p className="text-lg text-muted-foreground leading-relaxed text-pretty max-w-2xl mx-auto">
              Upload your documents to a secure portal, work with a dedicated account rep, and get human-reviewed tax
              prep and bookkeeping services. Optional quarterly check-ins for business guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Intake
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                  Book a 15-min Call
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="border-t border-border bg-muted/30 py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">How It Works</h2>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                Simple, transparent process from upload to e-file
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-4 max-w-5xl mx-auto">
              <div className="relative flex flex-col items-center text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Upload className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">1. Upload Docs</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Securely upload your documents to your dedicated portal
                  </p>
                </div>
              </div>

              <div className="relative flex flex-col items-center text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <FileCheck className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">2. AI + Human Prep</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We prepare with AI-assisted tools for efficiency
                  </p>
                </div>
              </div>

              <div className="relative flex flex-col items-center text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">3. Human Review</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Every filing is human-reviewed for accuracy
                  </p>
                </div>
              </div>

              <div className="relative flex flex-col items-center text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <FileText className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">4. E-file & Store</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We e-file and store documents in your portal
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Overview */}
        <section className="container py-24">
          <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">All-In-One Solution</h2>
            <p className="text-muted-foreground leading-relaxed text-pretty">
              Unlike big CPA firms that charge separately for everything, our monthly plans include both business and personal tax prep & filing
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow border-primary">
              <CardHeader>
                <Badge className="w-fit mb-2">Most Popular</Badge>
                <CardTitle>Monthly Bookkeeping</CardTitle>
                <CardDescription>Everything you need in one plan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Monthly reconciliation, financial reports, business tax prep & filing, and personal tax prep & filing—all included.
                </p>
                <p className="text-2xl font-bold">From $75/mo</p>
                <p className="text-xs text-muted-foreground">Based on annual revenue</p>
                <Link href="/bookkeeping">
                  <Button className="w-full">
                    View Plans
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Catchup Bookkeeping</CardTitle>
                <CardDescription>Get back on track</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Behind on your books? We'll catch you up with historical reconciliation and get you audit-ready.
                </p>
                <p className="text-2xl font-bold">Custom pricing</p>
                <p className="text-xs text-muted-foreground">Based on scope</p>
                <Link href="/contact">
                  <Button variant="outline" className="w-full bg-transparent">
                    Get a Quote
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Business Services</CardTitle>
                <CardDescription>Grow your business</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  LLC formation assistance, EIN help, registered agent services, and strategic business consultation.
                </p>
                <p className="text-2xl font-bold">Custom pricing</p>
                <p className="text-xs text-muted-foreground">A la carte services</p>
                <Link href="/business-services">
                  <Button variant="outline" className="w-full bg-transparent">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Link href="/why-us">
              <Button variant="link" className="text-primary">
                See how we compare to Big CPA firms and DIY tools
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Trust & Security */}
        <section className="border-t border-border bg-muted/30 py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
                Security & Compliance First
              </h2>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                Your data is protected with enterprise-grade security
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Lock className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">Secure Portal</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Bank-level encryption for all document uploads and storage
                </p>
              </div>

              <div className="flex flex-col items-center text-center space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">Audit Trail</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Complete documentation and audit trail for every transaction
                </p>
              </div>

              <div className="flex flex-col items-center text-center space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileCheck className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">Professional Liability</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Fully insured with professional liability coverage
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Placeholder */}
        <section className="container py-24">
          <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">What Our Clients Say</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="pt-6 space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    "Working with BookKeeping.business has been a game-changer for our business. The combination of technology and
                    personal service is exactly what we needed."
                  </p>
                  <div className="space-y-1">
                    <p className="font-semibold text-sm">Client Name</p>
                    <p className="text-xs text-muted-foreground">Business Owner</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-border bg-primary text-primary-foreground py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center space-y-8">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">Ready to Get Started?</h2>
              <p className="text-lg leading-relaxed text-pretty opacity-90">
                Upload your documents or schedule a consultation to discuss your needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    Start Intake
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-primary-foreground/20 hover:bg-primary-foreground/10 bg-transparent"
                  >
                    Book a Consultation
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
