import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import {
  Upload,
  Cpu,
  ShieldCheck,
  Send,
  Headphones,
  Zap,
  Eye,
  Shield,
  Lock,
  ClipboardCheck,
  ClipboardList,
  Star,
  Check,
  X,
  BarChart2,
  CloudUpload,
  ArrowRight,
  Users,
  Landmark,
  FileBadge,
  Receipt,
  ScanLine,
  Mail,
  Smartphone,
  AlertCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { CALENDLY_URL, CONTACT_EMAIL } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Online Bookkeeping & Tax Services for Small Business | BookKeeping.business",
  description:
    "Dedicated online bookkeeping, payroll, and tax services for restaurants, hotels, childcare centers, realtors, and small businesses across the USA. QuickBooks, Gusto, and Bill.com included — one flat monthly fee.",
  keywords: [
    "online bookkeeping services",
    "small business bookkeeping service",
    "bookkeeping and payroll service",
    "virtual bookkeeper USA",
    "monthly bookkeeping service small business",
    "restaurant bookkeeping services",
    "hotel bookkeeping services",
    "childcare bookkeeping services",
    "realtor bookkeeping services",
    "home-based business bookkeeping",
    "Pilot bookkeeping alternative",
    "Collective bookkeeping alternative",
    "bookkeeping service QuickBooks included",
    "affordable online bookkeeper",
  ],
  openGraph: {
    title: "Online Bookkeeping & Tax Services for Small Business | BookKeeping.business",
    description:
      "Dedicated bookkeeping, payroll, and tax for restaurants, hotels, childcare, and small businesses — all software included, one flat monthly fee.",
    url: "https://www.bookkeeping.business",
  },
  alternates: { canonical: "https://www.bookkeeping.business" },
}

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect("/dashboard")
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="relative overflow-hidden pt-16 pb-24 lg:pt-28 lg:pb-36 px-6 lg:px-8">
          <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <div className="flex flex-col gap-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/8 text-primary text-xs font-bold uppercase tracking-wider w-fit border border-primary/15">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                Now accepting new clients
              </div>

              <h1 className="text-5xl lg:text-7xl font-black text-primary dark:text-foreground leading-[1.08] tracking-tight">
                Tax &amp; Books,{" "}
                <span className="text-primary/75 dark:text-foreground/60">handled.</span>
              </h1>

              <p className="text-lg lg:text-xl text-muted-foreground max-w-xl leading-relaxed">
                Secure uploads, dedicated reps, and human-reviewed prep for your peace of mind.
                We combine modern automation with expert human oversight.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-base shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all"
                >
                  Create Free Account
                </Link>
                <Link
                  href="/bookkeeping#pricing"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl border-2 border-primary/20 text-primary dark:text-foreground font-bold text-base hover:bg-primary/5 transition-all"
                >
                  Pricing
                </Link>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <div className="flex -space-x-3">
                  {["bg-slate-300", "bg-slate-400", "bg-slate-500"].map((bg, i) => (
                    <div key={i} className={`h-10 w-10 rounded-full ${bg} border-2 border-background`} />
                  ))}
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  Trusted by <span className="text-foreground font-semibold">2,000+</span> businesses
                </p>
              </div>
            </div>

            {/* Right — mock dashboard */}
            <div className="relative">
              <div className="absolute inset-0 bg-primary/5 rounded-[2rem] blur-3xl -z-10 translate-x-8 translate-y-8" />
              <div className="rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
                {/* Browser chrome */}
                <div className="h-11 border-b border-border bg-muted/50 flex items-center px-4 gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                  <div className="ml-3 h-6 w-56 bg-background border border-border rounded flex items-center px-2 text-[10px] text-muted-foreground">
                    portal.bookkeeping.business/dashboard
                  </div>
                </div>
                {/* Dashboard body */}
                <div className="p-6 space-y-5">
                  <div className="h-6 w-36 bg-muted rounded" />
                  <div className="grid grid-cols-3 gap-3">
                    <div className="h-20 bg-primary/8 border border-primary/12 rounded-xl" />
                    <div className="h-20 bg-muted rounded-xl" />
                    <div className="h-20 bg-muted rounded-xl" />
                  </div>
                  <div className="h-40 bg-muted/60 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2">
                    <CloudUpload aria-hidden="true" className="h-8 w-8 text-muted-foreground/50" />
                    <div className="h-2.5 w-28 bg-muted-foreground/20 rounded" />
                    <div className="h-2 w-20 bg-muted-foreground/10 rounded" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-2.5 w-full bg-muted rounded" />
                    <div className="h-2.5 w-4/5 bg-muted rounded" />
                    <div className="h-2.5 w-3/5 bg-muted rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section className="py-24 px-6 lg:px-8 bg-card">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16 space-y-3">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary dark:text-foreground">Get Started in 4 Steps</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Fully self-service — sign up, answer a few questions, pick your plan, and your dashboard guides the rest. No waiting for a call.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Upload, step: "01", title: "Create Your Account", desc: "Sign up free in under 2 minutes. No credit card required to get started." },
                { icon: ClipboardList, step: "02", title: "Complete Onboarding", desc: "Answer a short quiz about your business — entity type, revenue, team, and banking. Takes about 3 minutes." },
                { icon: BarChart2, step: "03", title: "Choose a Plan & Pay", desc: "Pick Essentials, Growth, or Enterprise. Pay monthly, cancel anytime. Or stay on the free tier and upgrade later." },
                { icon: Send, step: "04", title: "Your Dashboard Guides You", desc: "Upload documents, track deadlines, message your bookkeeper, and see your account status — all in one place." },
              ].map(({ icon: Icon, step, title, desc }) => (
                <div key={title} className="group p-8 rounded-2xl border border-border hover:border-primary/30 hover:shadow-xl transition-all">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-14 w-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon aria-hidden="true" className="h-6 w-6" />
                    </div>
                    <span className="text-3xl font-black text-muted-foreground/20">{step}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-base shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all"
              >
                Start Free — No Credit Card Needed
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Platform Teaser ── */}
        <section className="py-24 px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="bg-primary/5 border border-primary/15 rounded-[2.5rem] p-10 lg:p-16 grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider border-primary/30 text-primary">
                  The Platform
                </Badge>
                <h2 className="text-3xl lg:text-4xl font-bold text-primary dark:text-foreground leading-tight">
                  One platform replaces your entire financial software stack
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Sign up your business, invite your team, connect your bank accounts — and hand off everything.
                  We handle payroll, W-2s, 1099s, invoices, bookkeeping, quarterly filings, and tax prep.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  And unlike traditional bookkeepers and CPAs who pass software subscription costs to clients —
                  we don&apos;t. Whatever tools our team needs to support your account, <strong className="text-foreground">we pay for them</strong>.
                  No QuickBooks bill. No Gusto fee. No Xero charge. Our software is our expense, not yours.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Multi-user team access",
                    "Bank & credit card feeds",
                    "Payroll all worker types",
                    "W-2 & 1099 issuance",
                    "AP/AR automation (Enterprise)",
                    "Receipt capture — upload or email",
                    "Monthly bookkeeping",
                    "We cover all software costs",
                  ].map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm">
                      <Check aria-hidden="true" className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{f}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href="/client-portal"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-all"
                >
                  Explore the Platform
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Users, label: "Team Access", sub: "Invite your whole company" },
                  { icon: Landmark, label: "Bank Feeds", sub: "Auto-fetch & reconcile" },
                  { icon: FileBadge, label: "W-2 & 1099s", sub: "All worker types covered" },
                  { icon: ScanLine, label: "Receipt Capture", sub: "Upload, email or snap a photo" },
                  { icon: ClipboardList, label: "AP/AR Automation", sub: "Bills paid, invoices collected" },
                  { icon: X, label: "No QuickBooks Bill", sub: "We cover the software" },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="p-4 rounded-2xl bg-background border border-border space-y-2">
                    <div className="h-9 w-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      <Icon aria-hidden="true" className="h-4 w-4" />
                    </div>
                    <p className="text-sm font-semibold">{label}</p>
                    <p className="text-xs text-muted-foreground">{sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Why Choose Us ── */}
        <section className="py-24 px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="bg-primary rounded-[2.5rem] p-10 lg:p-20 text-primary-foreground grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <h2 className="text-4xl lg:text-5xl font-bold leading-tight">Why Choose Us</h2>
                <p className="text-primary-foreground/70 leading-relaxed text-lg">
                  Combining human expertise with AI efficiency for a transparent financial process that scales with your business.
                </p>
                <div className="space-y-6">
                  {[
                    { icon: Headphones, title: "Dedicated Human Support", desc: "Account managers who know your business by name, not just by ID number." },
                    { icon: Zap, title: "AI Efficiency", desc: "Real-time data processing means your books are always up to date, not weeks behind." },
                    { icon: Eye, title: "Transparent Process", desc: "See exactly where your taxes and books stand at any time through your dashboard." },
                  ].map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="flex gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary-foreground/10 flex items-center justify-center flex-shrink-0">
                        <Icon aria-hidden="true" className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold mb-1">{title}</h3>
                        <p className="text-primary-foreground/60 text-sm leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative aspect-square lg:aspect-auto min-h-[360px] rounded-3xl bg-primary-foreground/5 border border-primary-foreground/10 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-slate-900 opacity-40" />
                <BarChart2 aria-hidden="true" className="relative h-40 w-40 text-primary-foreground/15" />
              </div>
            </div>
          </div>
        </section>

        {/* ── Solutions ── */}
        <section className="py-24 px-6 lg:px-8 bg-card">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16 space-y-3">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary dark:text-foreground">All-in-One Solutions</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">One place for everything your business needs — bookkeeping, tax filing, and strategic guidance, all under one roof.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 items-start">

              {/* Plan 1 */}
              <div className="p-8 rounded-3xl border border-border hover:border-primary/40 transition-all flex flex-col h-full bg-background">
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-primary dark:text-foreground mb-2">Monthly Bookkeeping</h3>
                  <p className="text-sm text-muted-foreground">Ongoing monthly service with everything kept clean, current, and tax-ready.</p>
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  {["Monthly reconciliation & reports", "Transaction categorization", "Tax-ready year-end books", "Dedicated account rep"].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check aria-hidden="true" className="h-4 w-4 text-primary flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/bookkeeping" className="w-full py-3.5 rounded-xl border border-primary text-primary font-bold text-sm text-center hover:bg-primary hover:text-primary-foreground transition-all">
                  Learn More
                </Link>
              </div>

              {/* Plan 2 — highlighted */}
              <div className="p-8 rounded-3xl bg-primary text-primary-foreground shadow-2xl shadow-primary/25 scale-105 relative flex flex-col h-full">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-background text-primary text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-primary/20 whitespace-nowrap">
                  Most Requested
                </div>
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-2">Catchup Bookkeeping</h3>
                  <p className="text-sm text-primary-foreground/70">Behind on your books? We get you fully caught up and audit-ready.</p>
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  {["Historical reconciliation & cleanup", "Audit-ready documentation", "Prior-year tax filing support", "Dedicated clean-up expert", "Smooth handoff to monthly service"].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-primary-foreground/80">
                      <Check aria-hidden="true" className="h-4 w-4 text-primary-foreground flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/contact" className="w-full py-3.5 rounded-xl bg-primary-foreground text-primary font-bold text-sm text-center hover:opacity-90 transition-all">
                  Get a Quote
                </Link>
              </div>

              {/* Plan 3 */}
              <div className="p-8 rounded-3xl border border-border hover:border-primary/40 transition-all flex flex-col h-full bg-background">
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-primary dark:text-foreground mb-2">Business Services</h3>
                  <p className="text-sm text-muted-foreground">Full-service support for formation, compliance, and strategic growth.</p>
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  {["LLC formation assistance", "EIN application support", "Registered agent services", "Payroll management", "CFO-level financial advice"].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check aria-hidden="true" className="h-4 w-4 text-primary flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/business-services" className="w-full py-3.5 rounded-xl border border-primary text-primary font-bold text-sm text-center hover:bg-primary hover:text-primary-foreground transition-all">
                  Learn More
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* ── Receipt Capture Feature Highlight ── */}
        <section className="py-24 px-6 lg:px-8 bg-card border-t border-border">
          <div className="mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-16 items-center">

              {/* Left: copy */}
              <div className="space-y-6">
                <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider border-primary/30 text-primary">
                  New — Receipt Capture
                </Badge>
                <h2 className="text-3xl lg:text-4xl font-bold text-primary dark:text-foreground leading-tight">
                  No more &ldquo;can you send me that receipt?&rdquo; emails.
                </h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Tools like Dext and Hubdoc charge $30–$65/month extra just to capture receipts. QBO charges extra too.
                  We built it in. No new subscription. No separate login. Already in your plan.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Drop receipts in the portal, forward them by email, or snap a photo on your phone. Our AI reads every one — vendor, date, total, tax, category — and your bookkeeper sees it instantly. The loop of chasing missing receipts by email is over.
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { icon: Upload, text: "Upload in portal" },
                    { icon: Mail, text: "Forward by email" },
                    { icon: Smartphone, text: "Snap on mobile" },
                    { icon: Zap, text: "AI reads it instantly" },
                    { icon: Shield, text: "12-month audit trail" },
                    { icon: X, text: "No Dext subscription" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2 text-sm">
                      {text.startsWith("No") ? (
                        <div className="h-5 w-5 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center flex-shrink-0">
                          <Icon aria-hidden="true" className="h-3 w-3 text-red-500" />
                        </div>
                      ) : (
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon aria-hidden="true" className="h-3 w-3 text-primary" />
                        </div>
                      )}
                      <span className={text.startsWith("No") ? "text-muted-foreground line-through" : "text-muted-foreground"}>{text}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href="/receipt-capture"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-all"
                >
                  See How Receipt Capture Works
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </div>

              {/* Right: visual flow */}
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-5">How a receipt flows through</p>

                {[
                  { step: "1", icon: Upload, label: "Receipt comes in", detail: "Upload, email forward, or phone photo", color: "bg-primary/10 text-primary" },
                  { step: "2", icon: ScanLine, label: "AI reads it", detail: "Vendor · Date · Total · Tax · Category extracted in seconds", color: "bg-primary/10 text-primary" },
                  { step: "3", icon: Shield, label: "Bookkeeper sees it instantly", detail: "Logged, timestamped, and matched to your books", color: "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400" },
                  { step: "4", icon: Check, label: "Audit-ready — forever", detail: "Original file stored for 12 months on paid plans", color: "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400" },
                ].map(({ step, icon: Icon, label, detail, color }) => (
                  <div key={step} className="flex items-start gap-4 p-4 rounded-2xl bg-background border border-border">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{detail}</p>
                    </div>
                    <span className="ml-auto text-xs font-black text-muted-foreground/30 self-center">{step}</span>
                  </div>
                ))}

                <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900/30 p-4 flex items-start gap-3">
                  <AlertCircle aria-hidden="true" className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                    <strong>Dext charges $30–$65/month</strong> for this. QuickBooks charges extra too. With us, it&apos;s already included in your plan — no separate subscription, no surprise invoice.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Comparison Table ── */}
        <section className="py-24 px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold text-center mb-16 text-primary dark:text-foreground">How we compare</h2>
            <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="p-6 text-sm font-bold">Feature</th>
                    <th className="p-6 text-sm font-bold text-muted-foreground">Traditional CPA</th>
                    <th className="p-6 text-sm font-bold text-muted-foreground">DIY Software</th>
                    <th className="p-6 text-sm font-bold text-primary">BookKeeping.business</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    ["Real-time Data", false, true, true],
                    ["Human Review", true, false, true],
                    ["Dedicated Rep", true, false, true],
                    ["Flat Monthly Fee", false, true, true],
                    ["AI-Assisted Accuracy", false, false, true],
                    ["Receipt Capture (no Dext/QBO add-on)", false, false, true],
                    ["Secure Client Portal", false, false, true],
                  ].map(([feature, cpa, diy, us]) => (
                    <tr key={feature as string} className="hover:bg-muted/30 transition-colors">
                      <td className="p-6 text-sm font-medium">{feature as string}</td>
                      <td className="p-6">
                        {cpa ? <Check aria-hidden="true" className="h-5 w-5 text-green-500" /> : <X aria-hidden="true" className="h-5 w-5 text-muted-foreground/40" />}
                      </td>
                      <td className="p-6">
                        {diy ? <Check aria-hidden="true" className="h-5 w-5 text-green-500" /> : <X aria-hidden="true" className="h-5 w-5 text-muted-foreground/40" />}
                      </td>
                      <td className="p-6">
                        {us ? <Check aria-hidden="true" className="h-5 w-5 text-primary font-bold" /> : <X aria-hidden="true" className="h-5 w-5 text-muted-foreground/40" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Security & Compliance ── */}
        <section className="py-24 px-6 lg:px-8 bg-card">
          <div className="mx-auto max-w-7xl flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2 space-y-6">
              <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Shield aria-hidden="true" className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-bold text-primary dark:text-foreground">Security &amp; Compliance</h2>
              <p className="text-muted-foreground leading-relaxed">
                We treat your data with the same security standards as major financial institutions.
                Your information is encrypted end-to-end and stored in high-security, compliant facilities.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2 text-sm">
                    <Lock aria-hidden="true" className="h-4 w-4 text-primary" /> Bank-level Encryption
                  </h3>
                  <p className="text-xs text-muted-foreground">256-bit SSL encryption protects your data in transit and at rest.</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2 text-sm">
                    <ClipboardCheck aria-hidden="true" className="h-4 w-4 text-primary" /> Full Audit Trail
                  </h3>
                  <p className="text-xs text-muted-foreground">Every change and access is logged with a permanent digital audit trail.</p>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
              {["SOC 2 TYPE II", "HIPAA COMPLIANT", "PCI DSS", "SSL SECURE"].map((badge) => (
                <div
                  key={badge}
                  className="aspect-square bg-background rounded-2xl flex items-center justify-center border border-border opacity-85 hover:opacity-100 transition-all"
                >
                  <span className="text-sm font-bold text-primary/90">{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className="py-24 px-6 lg:px-8 bg-primary/5">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-center text-3xl font-bold mb-16 text-primary dark:text-foreground">
              Trusted by modern founders
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  quote: "The transition from my old CPA to BookKeeping.business was seamless. Their portal is lightyears ahead of what I was using before.",
                  name: "Sarah Jenkins",
                  role: "CEO, TechFlow Systems",
                },
                {
                  quote: "I finally feel like I have a grasp on my business finances. The real-time dashboard is a game changer for my decision making.",
                  name: "Marcus Chen",
                  role: "Founder, GreenRetail",
                },
                {
                  quote: "Excellent support. Every time I have a question about my tax filing, my rep gets back to me within the hour. Truly impressive.",
                  name: "Elena Rodriguez",
                  role: "Director, CreativeLoop",
                },
              ].map(({ quote, name, role }) => (
                <div key={name} className="p-8 bg-card rounded-2xl shadow-sm border border-border space-y-4">
                  <div className="flex gap-0.5" role="img" aria-label="5 out of 5 stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} aria-hidden="true" className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed italic">&ldquo;{quote}&rdquo;</p>
                  <div>
                    <p className="font-semibold text-sm">{name}</p>
                    <p className="text-xs text-muted-foreground">{role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-24 px-6 lg:px-8 bg-card">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-12 text-primary dark:text-foreground">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {[
                {
                  q: "Is my financial data safe?",
                  a: "Yes. We use 256-bit SSL encryption and comply with SOC 2 security protocols. Your data is never sold or shared with third parties.",
                },
                {
                  q: "Do I get a dedicated bookkeeper?",
                  a: "Yes. Every client is assigned a dedicated account representative who learns your business and is your primary point of contact.",
                },
                {
                  q: "Can you help with past tax filings?",
                  a: "Absolutely. Our catchup bookkeeping service handles historical clean-up and we can assist with amended or prior-year tax returns.",
                },
                {
                  q: "What accounting software do you support?",
                  a: "We work with QuickBooks, Xero, Wave, FreshBooks, and spreadsheets. We can also migrate you to a new platform if needed.",
                },
                {
                  q: "How do I get started?",
                  a: "Submit the intake form or book a free 15-minute consultation. We'll review your situation and provide a custom quote tailored to your needs — no obligation.",
                },
              ].map(({ q, a }) => (
                <details key={q} className="group border border-border rounded-xl overflow-hidden">
                  <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-muted/40 transition-colors list-none">
                    <span className="font-semibold text-sm">{q}</span>
                    <span className="ml-4 flex-shrink-0 h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="py-20 px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="relative bg-primary rounded-[3rem] p-12 lg:p-24 overflow-hidden text-center space-y-8">
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-96 w-96 bg-primary-foreground/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 h-96 w-96 bg-primary-foreground/5 rounded-full blur-3xl" />
              <h2 className="relative text-4xl lg:text-6xl font-bold text-primary-foreground max-w-4xl mx-auto leading-tight">
                Ready to never worry about your books again?
              </h2>
              <p className="relative text-primary-foreground/70 text-lg max-w-2xl mx-auto">
                Join thousands of business owners who trust us with their financial future.
              </p>
              <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  href="/signup"
                  className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-primary-foreground text-primary font-bold text-lg hover:opacity-90 transition-all"
                >
                  Create Free Account
                </Link>
                <Link
                  href="/services"
                  className="w-full sm:w-auto px-10 py-5 rounded-2xl border-2 border-primary-foreground/20 text-primary-foreground font-bold text-lg hover:bg-primary-foreground/10 transition-all"
                >
                  View All Services
                </Link>
              </div>
              <p className="relative text-primary-foreground/40 text-sm">
                No credit card required • Self-service setup in under 5 minutes
              </p>
            </div>
          </div>
        </section>

      </main>

      <SiteFooter />
    </div>
  )
}
