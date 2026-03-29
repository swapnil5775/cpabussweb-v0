import type { Metadata } from "next"
import Link from "next/link"
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
  Star,
  Check,
  X,
  BarChart2,
  CloudUpload,
} from "lucide-react"
import { CALENDLY_URL, CONTACT_EMAIL } from "@/lib/constants"

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

export default function HomePage() {
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
                <span className="text-primary/50 dark:text-foreground/40">handled.</span>
              </h1>

              <p className="text-lg lg:text-xl text-muted-foreground max-w-xl leading-relaxed">
                Secure uploads, dedicated reps, and human-reviewed prep for your peace of mind.
                We combine modern automation with expert human oversight.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-base shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all"
                >
                  Get Started Free
                </Link>
                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl border-2 border-primary/20 text-primary dark:text-foreground font-bold text-base hover:bg-primary/5 transition-all"
                >
                  Schedule a Call
                </a>
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
                    <CloudUpload className="h-8 w-8 text-muted-foreground/50" />
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
              <h2 className="text-3xl lg:text-4xl font-bold text-primary dark:text-foreground">How It Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our streamlined process takes the stress out of managing your finances.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Upload, title: "Upload", desc: "Securely send your documents via our encrypted portal and connect your accounts." },
                { icon: Cpu, title: "AI + Human Prep", desc: "Smart automation categorizes transactions while our team ensures every detail is accurate." },
                { icon: ShieldCheck, title: "Human Review", desc: "A certified tax professional performs a final check on every line item before filing." },
                { icon: Send, title: "E-file", desc: "Seamless electronic filing with instant confirmation, storage, and audit trail." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="group p-8 rounded-2xl border border-border hover:border-primary/30 hover:shadow-xl transition-all">
                  <div className="h-14 w-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
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
                        <Icon className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold mb-1">{title}</h4>
                        <p className="text-primary-foreground/60 text-sm leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative aspect-square lg:aspect-auto min-h-[360px] rounded-3xl bg-primary-foreground/5 border border-primary-foreground/10 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-slate-900 opacity-40" />
                <BarChart2 className="relative h-40 w-40 text-primary-foreground/15" />
              </div>
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section className="py-24 px-6 lg:px-8 bg-card">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16 space-y-3">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary dark:text-foreground">All-in-One Solutions</h2>
              <p className="text-muted-foreground">Professional services tailored for businesses of all sizes.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 items-start">

              {/* Plan 1 */}
              <div className="p-8 rounded-3xl border border-border hover:border-primary/40 transition-all flex flex-col h-full bg-background">
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-primary dark:text-foreground mb-2">Monthly Bookkeeping</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-primary dark:text-foreground">from $75</span>
                    <span className="text-muted-foreground">/mo</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  {["Up to 50 transactions/month", "Monthly financial reports", "Tax-ready year-end books", "Dedicated account rep"].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/contact" className="w-full py-3.5 rounded-xl border border-primary text-primary font-bold text-sm text-center hover:bg-primary hover:text-primary-foreground transition-all">
                  Get Started
                </Link>
              </div>

              {/* Plan 2 — highlighted */}
              <div className="p-8 rounded-3xl bg-primary text-primary-foreground shadow-2xl shadow-primary/25 scale-105 relative flex flex-col h-full">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-background text-primary text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-primary/20 whitespace-nowrap">
                  Most Popular
                </div>
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-2">Catchup Bookkeeping</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black">Custom Pricing</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  {["Clean up past financial years", "Reconciliation for audits", "Historical tax filing support", "Dedicated clean-up expert", "Free initial assessment"].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-primary-foreground/80">
                      <Check className="h-4 w-4 text-primary-foreground flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/contact" className="w-full py-3.5 rounded-xl bg-primary-foreground text-primary font-bold text-sm text-center hover:opacity-90 transition-all">
                  Request Quote
                </Link>
              </div>

              {/* Plan 3 */}
              <div className="p-8 rounded-3xl border border-border hover:border-primary/40 transition-all flex flex-col h-full bg-background">
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-primary dark:text-foreground mb-2">Business Services</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-primary dark:text-foreground">Full-Service</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  {["LLC formation assistance", "EIN application support", "Registered agent services", "Payroll management", "CFO-level financial advice"].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/contact" className="w-full py-3.5 rounded-xl border border-primary text-primary font-bold text-sm text-center hover:bg-primary hover:text-primary-foreground transition-all">
                  Talk to Sales
                </Link>
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
                    ["Secure Client Portal", false, false, true],
                  ].map(([feature, cpa, diy, us]) => (
                    <tr key={feature as string} className="hover:bg-muted/30 transition-colors">
                      <td className="p-6 text-sm font-medium">{feature as string}</td>
                      <td className="p-6">
                        {cpa ? <Check className="h-5 w-5 text-green-500" /> : <X className="h-5 w-5 text-muted-foreground/40" />}
                      </td>
                      <td className="p-6">
                        {diy ? <Check className="h-5 w-5 text-green-500" /> : <X className="h-5 w-5 text-muted-foreground/40" />}
                      </td>
                      <td className="p-6">
                        {us ? <Check className="h-5 w-5 text-primary font-bold" /> : <X className="h-5 w-5 text-muted-foreground/40" />}
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
                <Shield className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-bold text-primary dark:text-foreground">Security &amp; Compliance</h2>
              <p className="text-muted-foreground leading-relaxed">
                We treat your data with the same security standards as major financial institutions.
                Your information is encrypted end-to-end and stored in high-security, compliant facilities.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2 text-sm">
                    <Lock className="h-4 w-4 text-primary" /> Bank-level Encryption
                  </h4>
                  <p className="text-xs text-muted-foreground">256-bit SSL encryption protects your data in transit and at rest.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2 text-sm">
                    <ClipboardCheck className="h-4 w-4 text-primary" /> Full Audit Trail
                  </h4>
                  <p className="text-xs text-muted-foreground">Every change and access is logged with a permanent digital audit trail.</p>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
              {["SOC 2 TYPE II", "HIPAA COMPLIANT", "PCI DSS", "SSL SECURE"].map((badge) => (
                <div
                  key={badge}
                  className="aspect-square bg-background rounded-2xl flex items-center justify-center border border-border opacity-60 hover:opacity-100 transition-all"
                >
                  <span className="text-sm font-bold text-primary/70">{badge}</span>
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
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
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
                  q: "How much does it cost?",
                  a: "Monthly bookkeeping starts at $75/month. Tax prep and business services are priced based on complexity. We provide a free quote after your intake call.",
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
                  href="/contact"
                  className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-primary-foreground text-primary font-bold text-lg hover:opacity-90 transition-all"
                >
                  Get Started Now
                </Link>
                <Link
                  href="/services"
                  className="w-full sm:w-auto px-10 py-5 rounded-2xl border-2 border-primary-foreground/20 text-primary-foreground font-bold text-lg hover:bg-primary-foreground/10 transition-all"
                >
                  View All Services
                </Link>
              </div>
              <p className="relative text-primary-foreground/40 text-sm">
                No credit card required • Free intake consultation
              </p>
            </div>
          </div>
        </section>

      </main>

      <SiteFooter />
    </div>
  )
}
