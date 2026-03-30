import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowRight, 
  CheckCircle2, 
  Upload, 
  Calendar, 
  UserCheck, 
  Rocket,
  X,
  Check,
  Clock,
  Shield,
  Users,
  FileText
} from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "How It Works - Professional Tax Prep with First Month Free | BookKeeping.business",
  description:
    "Join our service with a free first month. Upload documents, get dedicated onboarding, and experience professional tax preparation. See how we compare to TurboTax.",
  keywords: [
    "how tax preparation works",
    "first month free bookkeeping",
    "professional tax onboarding",
    "vs TurboTax",
    "dedicated accountant",
    "document checklist",
    "tax prep process",
  ],
  openGraph: {
    title: "How It Works - Professional Tax Prep with First Month Free",
    description:
      "Get started with a free first month. Professional onboarding, dedicated support, and expert tax preparation.",
    url: "https://bookkeeping.business/how-it-works",
  },
}

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <Badge className="mb-4" variant="secondary">
              First Month Free
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">
              How Our Process Works
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed text-pretty">
              Join, upload your documents, and get fully onboarded with a dedicated call—all in your first free month.
            </p>
          </div>
        </section>

        {/* Process Steps */}
        <section className="border-t border-border bg-muted/30 py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
                Your Journey with Us
              </h2>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                Simple, transparent, and designed to get you up and running quickly
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
              {/* Step 1 */}
              <Card className="relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
                      1
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Create Your Account & Onboard</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">Fully self-service — under 5 minutes</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    Sign up free at <strong>bookkeeping.business</strong>, complete a short onboarding quiz about your business, then pick a plan and pay — all without waiting for a call. Your dashboard is ready instantly.
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>No credit card required to create an account</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>Pick Essentials, Growth, or Enterprise — or stay free</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>Cancel anytime, no long-term contracts</span>
                  </div>
                  <div className="pt-2">
                    <Link href="/signup">
                      <Button size="sm">
                        Create Free Account
                        <ArrowRight className="ml-2 h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Step 2 */}
              <Card className="relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
                      2
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Upload Your Documents</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">Secure portal with checklist</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    Access your secure client portal and upload documents from our comprehensive checklist. We'll guide you through exactly what we need.
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                    <p className="font-semibold text-sm">Required Documents Include:</p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <FileText className="h-3 w-3 flex-shrink-0" />
                        Prior year tax returns
                      </li>
                      <li className="flex items-center gap-2">
                        <FileText className="h-3 w-3 flex-shrink-0" />
                        Income statements (W-2, 1099, etc.)
                      </li>
                      <li className="flex items-center gap-2">
                        <FileText className="h-3 w-3 flex-shrink-0" />
                        Business records (if applicable)
                      </li>
                      <li className="flex items-center gap-2">
                        <FileText className="h-3 w-3 flex-shrink-0" />
                        Bank statements and receipts
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Step 3 */}
              <Card className="relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
                      3
                    </div>
                    <div>
                      <CardTitle className="text-2xl">We Prep Your Backend</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">Professional setup & review</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    Our team reviews your documents, sets up your account structure, and prepares everything for your dedicated onboarding call.
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    <span>Typically completed within 3-5 business days</span>
                  </div>
                </CardContent>
              </Card>

              {/* Step 4 */}
              <Card className="relative overflow-hidden border-2 border-primary">
                <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
                      4
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Dedicated Onboarding Call</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">Meet your account rep</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    Once all documents are submitted, we schedule a personalized onboarding call with your dedicated account representative.
                  </p>
                  <div className="bg-primary/5 p-4 rounded-lg space-y-3">
                    <p className="font-semibold text-sm">During Your Call:</p>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Review your business structure and tax situation</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Answer all your questions about our process</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Set up your ongoing service schedule</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Establish communication preferences</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Step 5 */}
              <Card className="relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
                      5
                    </div>
                    <div>
                      <CardTitle className="text-2xl">You're All Set!</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">Ongoing support begins</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    After onboarding, you're fully set up and ready to go. Your first month is free, and billing only starts after you confirm you're happy with our service.
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <Rocket className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="font-semibold">Start receiving professional tax and bookkeeping services</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="container mx-auto px-4 py-24">
          <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
              Why Choose Us Over TurboTax?
            </h2>
            <p className="text-muted-foreground leading-relaxed text-pretty">
              See how professional service compares to DIY software
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="text-left p-4 font-semibold">Feature</th>
                    <th className="text-center p-4 font-semibold bg-primary/5">
                      <div className="flex flex-col items-center gap-1">
                        <span>BookKeeping.business</span>
                        <Badge variant="default" className="text-xs">Professional Service</Badge>
                      </div>
                    </th>
                    <th className="text-center p-4 font-semibold">TurboTax</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="p-4">Dedicated Account Rep</td>
                    <td className="text-center p-4 bg-primary/5">
                      <Check className="h-5 w-5 text-green-600 mx-auto" />
                    </td>
                    <td className="text-center p-4">
                      <X className="h-5 w-5 text-red-600 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-4">Human Review of Every Return</td>
                    <td className="text-center p-4 bg-primary/5">
                      <Check className="h-5 w-5 text-green-600 mx-auto" />
                    </td>
                    <td className="text-center p-4">
                      <span className="text-sm text-muted-foreground">Extra fee</span>
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-4">Personalized Onboarding Call</td>
                    <td className="text-center p-4 bg-primary/5">
                      <Check className="h-5 w-5 text-green-600 mx-auto" />
                    </td>
                    <td className="text-center p-4">
                      <X className="h-5 w-5 text-red-600 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-4">Year-Round Support</td>
                    <td className="text-center p-4 bg-primary/5">
                      <Check className="h-5 w-5 text-green-600 mx-auto" />
                    </td>
                    <td className="text-center p-4">
                      <span className="text-sm text-muted-foreground">Limited</span>
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-4">Proactive Tax Planning</td>
                    <td className="text-center p-4 bg-primary/5">
                      <Check className="h-5 w-5 text-green-600 mx-auto" />
                    </td>
                    <td className="text-center p-4">
                      <X className="h-5 w-5 text-red-600 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-4">Complex Business Returns</td>
                    <td className="text-center p-4 bg-primary/5">
                      <Check className="h-5 w-5 text-green-600 mx-auto" />
                    </td>
                    <td className="text-center p-4">
                      <span className="text-sm text-muted-foreground">Limited</span>
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-4">Audit Support</td>
                    <td className="text-center p-4 bg-primary/5">
                      <Check className="h-5 w-5 text-green-600 mx-auto" />
                    </td>
                    <td className="text-center p-4">
                      <span className="text-sm text-muted-foreground">Extra fee</span>
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-4">First Month Free</td>
                    <td className="text-center p-4 bg-primary/5">
                      <Check className="h-5 w-5 text-green-600 mx-auto" />
                    </td>
                    <td className="text-center p-4">
                      <X className="h-5 w-5 text-red-600 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-4">You Do the Work</td>
                    <td className="text-center p-4 bg-primary/5">
                      <X className="h-5 w-5 text-red-600 mx-auto" />
                    </td>
                    <td className="text-center p-4">
                      <Check className="h-5 w-5 text-green-600 mx-auto" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Document Checklist Preview */}
        <section className="border-t border-border bg-muted/30 py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
                Document Checklist
              </h2>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                Here's what you'll need to get started with your free first month
              </p>
            </div>

            <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-primary flex-shrink-0" />
                    Personal Tax Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Prior year tax returns (last 2 years)</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>W-2 forms from all employers</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>1099 forms (interest, dividends, contract work)</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Investment statements</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Mortgage interest statements</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-primary flex-shrink-0" />
                    Business Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Business bank statements (last 12 months)</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Profit & loss statements</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Business expense receipts</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Payroll records (if applicable)</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Asset purchase documentation</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have everything? No problem! We'll work with you to gather what's needed during your free month.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 py-24">
          <div className="mx-auto max-w-2xl text-center space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-balance">
              Ready to Get Started?
            </h2>
            <p className="text-muted-foreground leading-relaxed text-pretty">
              Join today and get your first month completely free. No credit card required to start.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg">
                  Create Free Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/services">
                <Button size="lg" variant="outline" className="bg-transparent">
                  View Services & Pricing
                </Button>
              </Link>
            </div>
            <p className="text-xs text-muted-foreground pt-4">
              Prefer to talk first? <Link href="/contact" className="underline hover:text-primary">Schedule a call</Link> — or <Link href="/faqs" className="underline hover:text-primary">check our FAQs</Link>
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}


