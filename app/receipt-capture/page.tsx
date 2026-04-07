import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ScanLine, Upload, Mail, Smartphone, Check, X, ArrowRight,
  Zap, FileText, Tag, Calendar, DollarSign, ShoppingBag,
  Clock, Shield, Inbox, BarChart2, AlertCircle,
} from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Receipt Capture — AI-Powered, No Dext or QBO Add-On Needed | BookKeeping.business",
  description:
    "Upload receipts, forward them by email, or snap a photo. AI automatically extracts vendor, date, amount, and category. No Dext, Hubdoc, or QBO add-on subscription required — included in every plan.",
  keywords: [
    "receipt capture bookkeeping",
    "Dext alternative included",
    "Hubdoc alternative free",
    "receipt scanning small business",
    "AI receipt extraction",
    "forward receipts by email bookkeeper",
    "no Dext subscription needed",
    "receipt capture included bookkeeping",
    "QBO receipt add-on alternative",
    "automatic receipt categorization",
  ],
  openGraph: {
    title: "Receipt Capture — Already Included. No Dext. No Add-On.",
    description:
      "Snap, email, or upload receipts. AI reads every one — vendor, date, total, tax, category. Part of every BookKeeping.business plan at no extra cost.",
    url: "https://www.bookkeeping.business/receipt-capture",
  },
  alternates: { canonical: "https://www.bookkeeping.business/receipt-capture" },
}

export default function ReceiptCapturePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="mx-auto max-w-4xl text-center space-y-6">
            <Badge variant="outline" className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider border-primary/30 text-primary">
              Receipt Capture — Included in Every Plan
            </Badge>
            <h1 className="text-4xl font-black tracking-tight sm:text-6xl text-primary dark:text-foreground leading-[1.08]">
              Stop emailing receipts.<br className="hidden sm:block" />
              <span className="text-primary/70 dark:text-foreground/60"> Just drop them in.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Upload through the portal, forward from your inbox, or snap a photo on your phone.
              Our AI reads every receipt — vendor, date, total, tax, category — and logs it automatically.
              No Dext. No Hubdoc. No QBO add-on. Already included in your plan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-base hover:-translate-y-0.5 transition-all shadow-lg shadow-primary/20"
              >
                Start Free — 20 Receipts Included
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <Link
                href="/bookkeeping"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl border-2 border-primary/20 text-primary dark:text-foreground font-bold text-base hover:bg-primary/5 transition-all"
              >
                View Plans
              </Link>
            </div>
            {/* Cost savings callout */}
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 border border-border rounded-full px-5 py-2.5 mt-2">
              <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
              Dext charges $30–$65/month for the same thing. Ours is already included.
            </div>
          </div>
        </section>

        {/* ── 3 Ways to Submit ── */}
        <section className="bg-card border-t border-border px-6 lg:px-8 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-16 space-y-3">
              <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider">How It Works</Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-primary dark:text-foreground">
                Three ways to get receipts in
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Whichever way fits your workflow — we process it the same way, instantly.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Upload */}
              <div className="relative rounded-2xl border-2 border-border bg-background p-8 space-y-5 hover:border-primary/30 hover:shadow-lg transition-all">
                <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <Upload className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Upload in Portal</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Drag and drop receipts directly into your dashboard — JPG, PNG, PDF, HEIC. Upload one at a time or select multiple at once.
                  </p>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {[
                    "Drag & drop anywhere on the page",
                    "Select multiple files at once",
                    "Supports JPG, PNG, PDF, HEIC/HEIF",
                    "Up to 20 MB per file",
                    "Processing starts within seconds",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Email */}
              <div className="relative rounded-2xl border-2 border-primary/30 bg-primary/5 p-8 space-y-5 shadow-lg">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="text-xs bg-primary text-primary-foreground px-3 shadow">Most Popular</Badge>
                </div>
                <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <Mail className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Forward by Email</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Every account gets a unique email address (e.g. <span className="font-mono text-xs text-foreground">your-biz-abc123@bookkeeping.business</span>). Forward receipts directly — from anywhere.
                  </p>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {[
                    "Dedicated address per organization",
                    "Forward from Gmail, Outlook, Apple Mail",
                    "Attach multiple receipts per email",
                    "Works with email rules & auto-forwards",
                    "No login needed — just forward and forget",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="rounded-xl bg-background border border-primary/20 p-3 text-xs text-muted-foreground">
                  <strong className="text-foreground block mb-1">Pro tip:</strong>
                  Set up an auto-forward rule in Gmail or Outlook so any emailed receipt goes straight to your inbox — zero manual effort.
                </div>
              </div>

              {/* Phone */}
              <div className="relative rounded-2xl border-2 border-border bg-background p-8 space-y-5 hover:border-primary/30 hover:shadow-lg transition-all">
                <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <Smartphone className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Snap on Your Phone</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Open your portal on mobile, tap Upload, and take a photo of your receipt right there. Works with paper receipts, invoices, and printed statements.
                  </p>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {[
                    "Mobile-optimized upload interface",
                    "Tap to open camera directly",
                    "Paper & printed receipts both work",
                    "HEIC photos from iPhone supported",
                    "No app download required",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Coming Soon */}
            <div className="mt-8 rounded-2xl border border-dashed border-border bg-muted/20 p-6 flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-3 shrink-0">
                <div className="h-10 w-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-600">
                  <Smartphone className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-600 bg-amber-500/5">On the Roadmap</Badge>
              </div>
              <div>
                <p className="font-semibold text-sm">WhatsApp & Telegram receipt upload — coming soon</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Forward receipts directly from WhatsApp or Telegram to your dedicated bot. Same AI extraction, zero extra steps. No app download, no login — just send and forget.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── What AI extracts ── */}
        <section className="px-6 lg:px-8 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-16 space-y-3">
              <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider">AI Extraction</Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-primary dark:text-foreground">
                AI reads the receipt.<br className="hidden sm:block" /> You do nothing else.
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The moment a receipt comes in — via upload, email, or photo — our AI model processes it and extracts structured data automatically. No manual data entry. No tagging. No follow-up emails from your bookkeeper.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                {
                  icon: ShoppingBag,
                  label: "Vendor Name",
                  desc: "Identifies the merchant or vendor from any receipt format — printed, handwritten, or digital PDF.",
                },
                {
                  icon: Calendar,
                  label: "Transaction Date",
                  desc: "Reads the purchase date off the receipt and stores it against the correct accounting period.",
                },
                {
                  icon: DollarSign,
                  label: "Total Amount",
                  desc: "Extracts the total paid — including line items, tips, and any partial amounts on split receipts.",
                },
                {
                  icon: FileText,
                  label: "Tax Breakdown",
                  desc: "Pulls out sales tax, VAT, or HST separately so it maps correctly to your tax accounts.",
                },
                {
                  icon: Tag,
                  label: "Expense Category",
                  desc: "Auto-categorizes into standard chart-of-accounts buckets: meals, travel, office supplies, utilities, and more.",
                },
                {
                  icon: BarChart2,
                  label: "Full Audit Trail",
                  desc: "Every receipt is timestamped, sourced (upload/email), and stored with the original file for 12 months on paid plans.",
                },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex gap-4 p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all">
                  <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">{label}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 max-w-3xl mx-auto rounded-2xl bg-primary/5 border border-primary/20 p-6 flex items-start gap-4">
              <Zap className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm mb-1">Powered by Claude AI + GPT-4o — not a basic OCR scanner</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We use large language models — the same technology behind Claude and ChatGPT — to read receipts, not just pixel-match text. This means it works on wrinkled receipts, photos taken at an angle, foreign currencies, handwritten notes, and complex multi-line invoices. It understands context, not just characters.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── No email bombardment ── */}
        <section className="bg-card border-t border-border px-6 lg:px-8 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider">The Old Way vs. Our Way</Badge>
                <h2 className="text-3xl lg:text-4xl font-bold text-primary dark:text-foreground leading-tight">
                  No more &ldquo;can you send me that receipt?&rdquo;
                </h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Traditional bookkeepers constantly follow up by email asking clients to send missing receipts. You forward one, they ask for another. You forget one, they send a reminder. It&apos;s a loop that wastes everyone&apos;s time.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  With receipt capture built into our platform, everything flows automatically. Your receipts arrive — by whatever method you prefer — get processed, categorized, and matched to your books. Your bookkeeper sees them the moment they come in. No chasing. No email threads. No back-and-forth.
                </p>
                <div className="space-y-3">
                  {[
                    "No more back-and-forth receipt request emails",
                    "Bookkeeper sees receipts in real-time — no delays",
                    "Every receipt linked to a transaction in your books",
                    "Full log of what came in, when, and from which source",
                    "Audit-ready documentation stored for 12 months",
                  ].map((f) => (
                    <div key={f} className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-sm font-medium">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {/* Old way */}
                <div className="rounded-2xl border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/30 p-6 space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">The old way — manual & slow</p>
                  {[
                    "Bookkeeper emails: \"Missing receipt for $148 on Oct 3\"",
                    "You search your inbox, forward it",
                    "Two days later: \"One more missing — the Home Depot run\"",
                    "You dig through your wallet, take a photo, email it",
                    "Month-end books delayed waiting on missing receipts",
                    "Tax season: scrambling to find 9-month-old paper receipts",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-sm text-red-700 dark:text-red-300">
                      <X className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Our way */}
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">Our way — automatic & logged</p>
                  {[
                    "Receipt arrives (upload / email forward / photo)",
                    "AI reads it in seconds — vendor, date, amount, category",
                    "Bookkeeper sees it immediately in portal",
                    "Matched to the right transaction in your books",
                    "Stored with timestamp, source, and original file",
                    "12 months of clean, searchable receipt history",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-sm text-primary">
                      <Check className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Comparison vs Dext ── */}
        <section className="px-6 lg:px-8 py-24">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12 space-y-3">
              <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider">Why It Matters</Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-primary dark:text-foreground">
                What Dext, Hubdoc & QBO charge extra for
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Receipt capture is a core bookkeeping function. Treating it as an add-on is how software companies extract more money from small businesses. We disagree.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="p-5 text-left font-semibold">Feature</th>
                    <th className="p-5 text-center font-semibold text-muted-foreground">Dext / Hubdoc</th>
                    <th className="p-5 text-center font-semibold text-muted-foreground">QBO Receipt</th>
                    <th className="p-5 text-center font-semibold text-primary">BookKeeping.business</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    ["Receipt upload (portal)", true, true, true],
                    ["Email forwarding", true, false, true],
                    ["Phone photo capture", true, true, true],
                    ["AI data extraction", true, "Basic", true],
                    ["Vendor / date / total / tax / category", true, "Partial", true],
                    ["Searchable receipt history", true, true, true],
                    ["Direct bookkeeper access", false, false, true],
                    ["Included in bookkeeping plan", false, false, true],
                  ].map(([label, dext, qbo, us], i) => (
                    <tr key={i} className="hover:bg-muted/20 transition-colors">
                      <td className="p-5 font-medium">{label as string}</td>
                      <td className="p-5 text-center">
                        {dext === true ? <Check className="h-4 w-4 text-muted-foreground mx-auto" /> :
                          dext === false ? <X className="h-4 w-4 text-muted-foreground/40 mx-auto" /> :
                            <span className="text-xs text-muted-foreground">{dext as string}</span>}
                      </td>
                      <td className="p-5 text-center">
                        {qbo === true ? <Check className="h-4 w-4 text-muted-foreground mx-auto" /> :
                          qbo === false ? <X className="h-4 w-4 text-muted-foreground/40 mx-auto" /> :
                            <span className="text-xs text-muted-foreground">{qbo as string}</span>}
                      </td>
                      <td className="p-5 text-center bg-primary/5">
                        {us === true ? <Check className="h-4 w-4 text-primary mx-auto" /> :
                          us === false ? <X className="h-4 w-4 text-muted-foreground/40 mx-auto" /> :
                            <span className="text-xs text-primary font-medium">{us as string}</span>}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-muted/30">
                    <td className="p-5 font-bold">Monthly Cost</td>
                    <td className="p-5 text-center font-medium text-muted-foreground">$30–$65/mo extra</td>
                    <td className="p-5 text-center font-medium text-muted-foreground">$10–$20/mo extra</td>
                    <td className="p-5 text-center bg-primary/5 font-bold text-primary">$0 extra — included</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Plan limits ── */}
        <section className="bg-card border-t border-border px-6 lg:px-8 py-20">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12 space-y-3">
              <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider">Included With Your Plan</Badge>
              <h2 className="text-2xl lg:text-3xl font-bold text-primary dark:text-foreground">
                Receipt credits by plan
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-sm">
                Each plan includes a monthly receipt credit allowance. Credits reset every month on paid plans. Free accounts get 20 receipts total to try the feature before upgrading.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { plan: "Free", credits: "20 total", reset: "Lifetime cap", color: "border-border bg-muted/30", badge: "" },
                { plan: "Essentials", credits: "100 / month", reset: "Resets monthly", color: "border-border bg-background", badge: "" },
                { plan: "Growth", credits: "300 / month", reset: "Resets monthly", color: "border-primary/30 bg-primary/5", badge: "Popular" },
                { plan: "Enterprise", credits: "500 / month", reset: "Resets monthly", color: "border-border bg-background", badge: "" },
              ].map(({ plan, credits, reset, color, badge }) => (
                <div key={plan} className={`relative rounded-2xl border-2 ${color} p-6 text-center space-y-3`}>
                  {badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="text-xs bg-primary text-primary-foreground px-3">{badge}</Badge>
                    </div>
                  )}
                  <p className="font-bold text-sm">{plan}</p>
                  <p className="text-3xl font-black text-primary">{credits.split(" ")[0]}</p>
                  <p className="text-xs text-muted-foreground">{credits.includes("/") ? "receipts / month" : "receipts total"}</p>
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      {reset}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="rounded-xl border border-border bg-background p-4 flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold">Data retention</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Paid plans: 12 months of receipts stored. Free accounts: 30 days.</p>
                </div>
              </div>
              <div className="rounded-xl border border-border bg-background p-4 flex items-start gap-3">
                <Inbox className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold">Dedicated email address</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Every organization gets its own unique receipt email — auto-provisioned on signup.</p>
                </div>
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
              <div className="relative inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary-foreground/10 mx-auto">
                <ScanLine className="h-8 w-8 text-primary-foreground" />
              </div>
              <h2 className="relative text-3xl lg:text-5xl font-bold text-primary-foreground max-w-3xl mx-auto leading-tight">
                Your books. Your receipts. One place.
              </h2>
              <p className="relative text-primary-foreground/70 max-w-xl mx-auto">
                Sign up free and send your first 20 receipts in. No Dext account needed. No add-on required. Just forward them.
              </p>
              <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Link
                  href="/signup"
                  className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-primary-foreground text-primary font-bold text-base hover:opacity-90 transition-all"
                >
                  Start Free — No Credit Card
                </Link>
                <Link
                  href="/bookkeeping"
                  className="w-full sm:w-auto px-10 py-4 rounded-2xl border-2 border-primary-foreground/20 text-primary-foreground font-bold text-base hover:bg-primary-foreground/10 transition-all"
                >
                  View Plans & Pricing
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
