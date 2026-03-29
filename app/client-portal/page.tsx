import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Upload,
  CreditCard,
  FileText,
  RefreshCw,
  ClipboardList,
  Receipt,
  Send,
  Building2,
  UserCheck,
  Briefcase,
  ArrowRight,
  Check,
  X,
  Shield,
  Smartphone,
  Link2,
  Tag,
  FileBadge,
  AlertCircle,
  Landmark,
} from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "All-in-One Business Financial Platform | BookKeeping.business",
  description:
    "One platform for your entire financial operation. Team access, payroll, W-2 & 1099 issuance, invoice management, bank feeds, bookkeeping, quarterly filings — no QuickBooks, Gusto, or TurboTax subscriptions required.",
  keywords: [
    "all-in-one bookkeeping platform",
    "payroll service small business",
    "W-2 1099 filing service",
    "invoice management",
    "bank feed reconciliation",
    "no QuickBooks needed",
    "team bookkeeping access",
    "quarterly payroll filings",
  ],
  openGraph: {
    title: "All-in-One Business Financial Platform | BookKeeping.business",
    description:
      "One platform replaces QuickBooks, Gusto, TurboTax, and more. Your whole team, all your documents, all your financials — in one place.",
    url: "https://bookkeeping.business/client-portal",
  },
}

export default function PlatformPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="mx-auto max-w-4xl text-center space-y-6">
            <Badge variant="outline" className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider">
              The Platform
            </Badge>
            <h1 className="text-4xl font-black tracking-tight sm:text-6xl text-primary dark:text-foreground leading-[1.08]">
              Your entire financial operation.<br className="hidden sm:block" />
              <span className="text-primary/75 dark:text-foreground/60"> One platform.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Sign up, invite your team, connect your accounts, and hand off everything — payroll, bookkeeping,
              tax filings, invoices, W-2s, 1099s — to us. No QuickBooks. No Gusto. No Xero. No TurboTax.
              We cover the software so you don&apos;t have to.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-base hover:-translate-y-0.5 transition-all shadow-lg shadow-primary/20"
              >
                Get Started
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <a
                href="#capabilities"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl border-2 border-primary/20 text-primary dark:text-foreground font-bold text-base hover:bg-primary/5 transition-all"
              >
                See All Capabilities
              </a>
            </div>
          </div>
        </section>

        {/* ── Replace Your Stack ── */}
        <section className="bg-primary px-6 lg:px-8 py-16">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground">
                Cancel these. We pay for what we need — you don&apos;t.
              </h2>
              <p className="text-primary-foreground/70 mt-3 max-w-2xl mx-auto text-sm leading-relaxed">
                Traditional bookkeepers and CPAs have always passed software subscription costs to their clients.
                We don&apos;t. If our team needs any tool or platform to do your work, that&apos;s our operating expense — not yours.
                You hire us for expertise and results. Everything we need to deliver is already covered.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { name: "QuickBooks", what: "Bookkeeping" },
                { name: "Gusto", what: "Payroll" },
                { name: "Xero", what: "Accounting" },
                { name: "TurboTax", what: "Tax Filing" },
              ].map(({ name, what }) => (
                <div key={name} className="rounded-2xl bg-primary-foreground/10 border border-primary-foreground/10 p-5 text-center space-y-2">
                  <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-red-500/20 text-red-400 mx-auto">
                    <X aria-hidden="true" className="h-4 w-4" />
                  </div>
                  <p className="text-primary-foreground font-bold text-sm line-through opacity-80">{name}</p>
                  <p className="text-primary-foreground/60 text-xs">{what}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-primary-foreground/50 text-sm mt-8">
              You pay us for service, labor, and expertise — that&apos;s it. All software we use to support your account is our expense.
            </p>
          </div>
        </section>

        {/* ── Capabilities ── */}
        <section id="capabilities" className="px-6 lg:px-8 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16 space-y-3">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary dark:text-foreground">
                Everything your business needs
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                One place. One team. One monthly engagement that replaces your entire financial software stack.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

              {/* Team Access */}
              <Card className="border-border hover:border-primary/30 hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-2">
                    <Users aria-hidden="true" className="h-6 w-6" />
                  </div>
                  <CardTitle>Team & Company Access</CardTitle>
                  <CardDescription>Your whole team, one shared workspace</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {[
                      "Business signs up with one account",
                      "Invite unlimited team members",
                      "Role-based access (owner, admin, staff)",
                      "Everyone works from the same portal",
                      "No per-seat fees or user limits",
                    ].map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check aria-hidden="true" className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Payroll & People */}
              <Card className="border-border hover:border-primary/30 hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-2">
                    <Briefcase aria-hidden="true" className="h-6 w-6" />
                  </div>
                  <CardTitle>Payroll & People</CardTitle>
                  <CardDescription>Every worker type, fully handled</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {[
                      "Full-time & part-time employees",
                      "1099 contractors & freelancers",
                      "Temporary & one-off labor hires",
                      "Payroll processing & distribution",
                      "Quarterly payroll tax deposits",
                    ].map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check aria-hidden="true" className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* W-2 & 1099 */}
              <Card className="border-border hover:border-primary/30 hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-2">
                    <FileBadge aria-hidden="true" className="h-6 w-6" />
                  </div>
                  <CardTitle>W-2 & 1099 Issuance</CardTitle>
                  <CardDescription>Year-end forms filed and distributed</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {[
                      "W-2s for all full-time employees",
                      "1099-NEC for contractors & freelancers",
                      "1099-MISC for other payments",
                      "IRS & SSA e-filing included",
                      "Recipient copies distributed",
                    ].map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check aria-hidden="true" className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Invoices */}
              <Card className="border-border hover:border-primary/30 hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-2">
                    <Receipt aria-hidden="true" className="h-6 w-6" />
                  </div>
                  <CardTitle>Invoice Management</CardTitle>
                  <CardDescription>Send, receive, and track — all in one place</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {[
                      "Upload invoices you sent to vendors",
                      "Upload bills received from vendors",
                      "We send invoices on your behalf",
                      "Track outstanding & paid invoices",
                      "Reconciled against your books automatically",
                    ].map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check aria-hidden="true" className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Bank Feeds & Bookkeeping */}
              <Card className="border-primary/30 shadow-md hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-2">
                      <Landmark aria-hidden="true" className="h-6 w-6" />
                    </div>
                    <Badge className="text-xs mb-2">Core Service</Badge>
                  </div>
                  <CardTitle>Bank Feeds & Bookkeeping</CardTitle>
                  <CardDescription>Connect once, we handle the rest</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {[
                      "Connect multiple bank accounts directly",
                      "Connect credit cards directly",
                      "Or manually upload statements (CSV/PDF)",
                      "Automated transaction fetching",
                      "Full reconciliation of all accounts",
                      "Smart tagging & categorization",
                      "Monthly P&L and Balance Sheet",
                    ].map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check aria-hidden="true" className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Quarterly Filings */}
              <Card className="border-border hover:border-primary/30 hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-2">
                    <ClipboardList aria-hidden="true" className="h-6 w-6" />
                  </div>
                  <CardTitle>Quarterly & Annual Filings</CardTitle>
                  <CardDescription>Never miss a deadline</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {[
                      "Quarterly payroll tax filings (941)",
                      "State employment tax filings",
                      "Unemployment insurance filings (FUTA/SUTA)",
                      "Annual W-2 & 1099 filing deadlines",
                      "Deadline tracking & proactive reminders",
                    ].map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check aria-hidden="true" className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

            </div>
          </div>
        </section>

        {/* ── How bank feeds work ── */}
        <section className="bg-card px-6 lg:px-8 py-24 border-t border-border">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-16 space-y-3">
              <h2 className="text-3xl font-bold text-primary dark:text-foreground">How bank & account feeds work</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Two ways to get your financial data in — whichever works for your business.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <Link2 aria-hidden="true" className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Direct Connection</h3>
                    <p className="text-xs text-muted-foreground">Recommended — fully automated</p>
                  </div>
                </div>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {[
                    "Securely link your bank accounts",
                    "Link credit cards and lines of credit",
                    "We fetch transactions automatically",
                    "New transactions pulled on a regular schedule",
                    "Nothing for you to export or upload",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check aria-hidden="true" className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </Card>
              <Card className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <Upload aria-hidden="true" className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Manual Upload</h3>
                    <p className="text-xs text-muted-foreground">For banks that don&apos;t support direct feeds</p>
                  </div>
                </div>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {[
                    "Upload bank statements (PDF or CSV)",
                    "Upload credit card statements",
                    "Drag & drop through your portal",
                    "Upload via mobile app photo",
                    "We process and reconcile everything",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check aria-hidden="true" className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
            <div className="mt-10 max-w-4xl mx-auto">
              <Card className="bg-primary/5 border-primary/20 p-6">
                <div className="flex items-start gap-4">
                  <Tag aria-hidden="true" className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-sm mb-1">Reconciliation & Smart Tagging</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Once transactions are in, our team reconciles every account and applies the correct
                      categories, expense tags, and tax codes. You get clean, audit-ready books every month — not a raw
                      data dump that you have to figure out yourself.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* ── Worker Types ── */}
        <section className="px-6 lg:px-8 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-16 space-y-3">
              <h2 className="text-3xl font-bold text-primary dark:text-foreground">Every worker type, handled</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Tell us who works for your business — we handle the right payroll treatment, filings, and forms for each.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: UserCheck,
                  title: "Full-Time Employees",
                  items: ["Regular payroll runs", "Benefits deductions", "W-2 at year-end", "Federal & state withholding"],
                },
                {
                  icon: Users,
                  title: "Part-Time Employees",
                  items: ["Flexible pay schedules", "Hourly or salaried", "W-2 at year-end", "Proper tax withholding"],
                },
                {
                  icon: Briefcase,
                  title: "Contractors & Freelancers",
                  items: ["No payroll taxes owed", "1099-NEC at year-end", "Track payments per vendor", "Multi-contractor support"],
                },
                {
                  icon: RefreshCw,
                  title: "Temporary & One-Off Hires",
                  items: ["One-time or short-term labor", "Correct W-2 or 1099 determination", "Seasonal workforce support", "No long-term commitment needed"],
                },
              ].map(({ icon: Icon, title, items }) => (
                <Card key={title} className="hover:border-primary/30 hover:shadow-md transition-all">
                  <CardHeader className="pb-3">
                    <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-3">
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-base">{title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1.5 text-sm text-muted-foreground">
                      {items.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── No Subscriptions ── */}
        <section className="bg-card border-t border-border px-6 lg:px-8 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider">We Cover the Software</Badge>
                <h2 className="text-3xl lg:text-4xl font-bold text-primary dark:text-foreground leading-tight">
                  We pay for the software. You pay for the work.
                </h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  For decades, bookkeepers and CPAs have outsourced their software costs to clients — billing QuickBooks,
                  Gusto, and other subscriptions as client expenses. We think that&apos;s wrong.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  If our team needs any software or platform to complete your work, <strong className="text-foreground">we pay for it</strong>.
                  That&apos;s our cost of doing business. You hired us to get the job done — not to fund our toolbox.
                  Our team is fully equipped with everything required to support you. No pass-through. No surprises.
                </p>
                <div className="space-y-3">
                  {[
                    "We absorb all software subscriptions our team uses for your account",
                    "One engagement with us replaces 4–6 separate monthly subscriptions",
                    "No QuickBooks, Gusto, Xero, or TurboTax fees ever billed to you",
                    "No software setup charges or onboarding fees",
                    "Cancel every tool you've been paying for on your own",
                  ].map((f) => (
                    <div key={f} className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check aria-hidden="true" className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-sm font-medium">{f}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-all"
                >
                  Get a Custom Quote
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">What you currently pay vs. working with us</p>
                <div className="space-y-3">
                  {[
                    { label: "QuickBooks Online", included: false },
                    { label: "Gusto Payroll", included: false },
                    { label: "Xero or Wave", included: false },
                    { label: "TurboTax Business", included: false },
                    { label: "Separate invoicing software", included: false },
                    { label: "Your own time managing it all", included: false },
                  ].map(({ label, included }) => (
                    <div key={label} className="flex items-center justify-between p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                      <span className="text-sm text-muted-foreground line-through">{label}</span>
                      <X aria-hidden="true" className="h-4 w-4 text-red-400 flex-shrink-0" />
                    </div>
                  ))}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border-2 border-primary/20 mt-2">
                    <span className="text-sm font-bold text-primary">BookKeeping.business — all of the above</span>
                    <Check aria-hidden="true" className="h-5 w-5 text-primary flex-shrink-0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Onboarding steps ── */}
        <section className="px-6 lg:px-8 py-24">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-16 space-y-3">
              <h2 className="text-3xl font-bold text-primary dark:text-foreground">How onboarding works</h2>
              <p className="text-muted-foreground">From signup to fully running — your team is set up fast.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: "1",
                  title: "Business Signs Up",
                  desc: "Complete the intake form with your business details, worker types, and services needed.",
                },
                {
                  step: "2",
                  title: "Invite Your Team",
                  desc: "Add owners, accountants, office managers, or any staff who need access to the portal.",
                },
                {
                  step: "3",
                  title: "Connect & Upload",
                  desc: "Link bank accounts, upload statements, add employees, and share existing documents.",
                },
                {
                  step: "4",
                  title: "We Take It From Here",
                  desc: "Your dedicated team handles bookkeeping, payroll, filings, and taxes — every month.",
                },
              ].map(({ step, title, desc }) => (
                <div key={step} className="text-center space-y-4">
                  <div className="h-14 w-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-xl font-black mx-auto">
                    {step}
                  </div>
                  <h3 className="font-bold">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Security ── */}
        <section className="bg-card border-t border-border px-6 lg:px-8 py-12">
          <div className="mx-auto max-w-4xl">
            <div className="flex items-start gap-4">
              <Shield aria-hidden="true" className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="font-semibold text-sm">Bank-level security throughout</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  All documents and financial data are encrypted end-to-end with 256-bit SSL. We never request sensitive
                  documents via email. Every action is logged with a full audit trail. Mobile access available on iOS and Android.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="px-6 lg:px-8 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="relative bg-primary rounded-[3rem] p-12 lg:p-20 overflow-hidden text-center space-y-6">
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-80 w-80 bg-primary-foreground/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 h-80 w-80 bg-primary-foreground/5 rounded-full blur-3xl" />
              <h2 className="relative text-3xl lg:text-5xl font-bold text-primary-foreground max-w-3xl mx-auto leading-tight">
                Ready to replace your entire financial stack?
              </h2>
              <p className="relative text-primary-foreground/70 max-w-xl mx-auto">
                One intake form. One team. One platform. Everything your business needs — handled.
              </p>
              <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Link
                  href="/contact"
                  className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-primary-foreground text-primary font-bold text-base hover:opacity-90 transition-all"
                >
                  Start Your Intake
                </Link>
                <Link
                  href="/services"
                  className="w-full sm:w-auto px-10 py-4 rounded-2xl border-2 border-primary-foreground/20 text-primary-foreground font-bold text-base hover:bg-primary-foreground/10 transition-all"
                >
                  View All Services
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
