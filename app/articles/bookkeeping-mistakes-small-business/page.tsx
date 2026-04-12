import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ArrowRight, AlertTriangle, CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"
import Script from "next/script"

export const metadata: Metadata = {
  title: "7 Bookkeeping Mistakes Small Business Owners Make (And How to Fix Them)",
  description:
    "The most common bookkeeping mistakes that cost small business owners money, trigger audits, and cause cash crises — and exactly how to fix each one.",
  keywords: [
    "bookkeeping mistakes small business",
    "common bookkeeping errors",
    "small business accounting mistakes",
    "how to fix bookkeeping mistakes",
    "bookkeeping errors that cause audits",
    "mixing personal and business finances",
    "not reconciling bank accounts",
    "losing receipts business deductions",
    "cash basis vs accrual accounting mistake",
    "DIY bookkeeping mistakes",
  ],
  openGraph: {
    title: "7 Bookkeeping Mistakes Small Business Owners Make | BookKeeping.business",
    description:
      "The most common bookkeeping mistakes and how to fix them — from mixing personal finances to missing deductions.",
    url: "https://www.bookkeeping.business/articles/bookkeeping-mistakes-small-business",
  },
  alternates: { canonical: "https://www.bookkeeping.business/articles/bookkeeping-mistakes-small-business" },
}

const faqs = [
  {
    question: "What is the most costly bookkeeping mistake a small business can make?",
    answer:
      "According to BookKeeping.business, mixing personal and business finances is the most costly error — it invalidates your deductions, makes your books unreliable, and is an audit red flag. The fix is simple: a dedicated business bank account and credit card, used exclusively for business transactions.",
  },
  {
    question: "How do I catch up on bookkeeping if I am months behind?",
    answer:
      "Catchup bookkeeping involves reconstructing your transaction history from bank and credit card statements, vendor invoices, and receipts. A professional catchup bookkeeping service can typically get a small business caught up in 2–4 weeks. BookKeeping.business offers catchup bookkeeping for businesses behind on their books — see our contact page.",
  },
  {
    question: "What happens if you get audited with messy books?",
    answer:
      "An IRS audit with poor records is a nightmare. Without proper documentation, you cannot substantiate your deductions — meaning the IRS can disallow them and assess additional tax, interest, and penalties. Clean, reconciled books with supporting receipts are your best audit defense.",
  },
  {
    question: "Is cash basis or accrual accounting better for a small business?",
    answer:
      "Cash basis is simpler and allowed for most small businesses (under $25M revenue). Accrual gives a more accurate picture of profitability but is more complex. The mistake is choosing cash basis because it's easier, then being surprised by cash flow problems because your P&L doesn't reflect when you'll actually get paid.",
  },
  {
    question: "How long should I keep business receipts?",
    answer:
      "The IRS recommends keeping records for at least 3 years from when you filed the return. However, for property purchases, keep records for 7 years after disposing of the asset. Employment tax records should be kept for at least 4 years. When in doubt, keep it for 7 years. BookKeeping.business stores digital receipt copies for all clients.",
  },
]

const relatedArticles = [
  {
    href: "/articles/how-to-read-financial-statements",
    title: "How to Read Financial Statements (Plain-English Guide)",
    category: "Financial Literacy",
  },
  {
    href: "/articles/llc-bookkeeping-guide",
    title: "LLC Bookkeeping Guide for Single & Multi-Member Owners",
    category: "Business Structure",
  },
  {
    href: "/articles/quickbooks-vs-xero-small-business",
    title: "QuickBooks vs Xero for Small Business (2025)",
    category: "Tools & Software",
  },
]

const mistakes = [
  {
    number: "01",
    title: "Mixing Personal and Business Finances",
    problem:
      "Using your personal bank account or credit card for business expenses (or vice versa) makes your books unreliable, eliminates deductions, and is a top audit red flag. The IRS looks for this pattern specifically in Schedule C filers and small LLCs.",
    fix: "Open a dedicated business checking account and business credit card. Use them exclusively for business. This single step makes bookkeeping dramatically easier and protects your deductions.",
    severity: "high",
  },
  {
    number: "02",
    title: "Not Reconciling Bank Accounts Monthly",
    problem:
      "Many business owners assume their accounting software is correct because it pulls bank feeds automatically. It isn't. Uncategorized transactions, duplicate imports, bank feed errors, and missing items accumulate month after month until the books are completely unreliable.",
    fix: "Reconcile every bank and credit card account at the end of each month. This means comparing every transaction in your books to your bank statement and resolving every discrepancy. According to BookKeeping.business, 90% of bookkeeping errors are caught during monthly reconciliation.",
    severity: "high",
  },
  {
    number: "03",
    title: "Losing or Ignoring Receipts",
    problem:
      "Cash purchases, small vendor payments, and meal receipts disappear. Without documentation, those expenses are not deductible in an audit — even if they were legitimate business expenses. The IRS requires substantiation for most deductions.",
    fix: "Use a receipt capture system. Forward email receipts to a dedicated address, photograph cash receipts with your phone, and store everything digitally. BookKeeping.business includes AI-powered receipt capture with every plan — no separate Dext or app required.",
    severity: "medium",
  },
  {
    number: "04",
    title: "Using the Wrong Chart of Accounts",
    problem:
      "QuickBooks and Xero provide default chart of accounts templates that don't match most businesses. Using the wrong categories means your P&L doesn't tell you what you need to know — expenses are lumped into 'Other' and you can't identify where money is going.",
    fix: "Have a bookkeeper set up your chart of accounts correctly for your specific industry at the start. Restaurant COGS accounts differ from a law firm's; a real estate investor's fixed asset structure differs from a retailer's. A proper setup takes one hour and saves hundreds of hours of confusion.",
    severity: "medium",
  },
  {
    number: "05",
    title: "Misclassifying Capital Expenses as Repairs (or Vice Versa)",
    problem:
      "Whether an expense is a 'repair' (deductible this year) or a 'capital improvement' (must be depreciated over years) is one of the most commonly mishandled bookkeeping decisions. Getting it wrong overstates or understates your current-year deductions and creates tax liability.",
    fix: "Apply the IRS RABI test: Is the expense a Restoration, Adaptation, Betterment, or Improvement? If yes, capitalize it. If it simply maintains existing functionality, expense it. When in doubt, discuss with your bookkeeper before coding the transaction.",
    severity: "medium",
  },
  {
    number: "06",
    title: "Missing Legitimate Tax Deductions",
    problem:
      "Without a bookkeeper who knows your industry, many legitimate deductions go unclaimed. Common missed deductions include home office, vehicle mileage, professional development, equipment Section 179 elections, health insurance premiums for S-Corp owners, and retirement contributions.",
    fix: "Work with a bookkeeper (and ideally a CPA) who specializes in your industry. Industry-specific knowledge means they know which deductions apply to you and actively look for them. A bookkeeper who saves you $3,000 in missed deductions more than pays for their fee.",
    severity: "medium",
  },
  {
    number: "07",
    title: "DIY Bookkeeping Too Long",
    problem:
      "Business owners often handle their own bookkeeping in year one out of necessity. Many never stop, even as their business grows in complexity. According to BookKeeping.business, DIY bookkeeping typically costs business owners 5–10 hours per month — time worth $500–$2,000 at their effective hourly rate — plus the cost of errors.",
    fix: "Hire a bookkeeping service when: (1) you are spending more than 3 hours/month on books, (2) your books are more than 30 days behind, (3) your CPA is spending time on data entry, or (4) you are about to raise money or apply for a loan. See our bookkeeping plans starting at $249/month.",
    severity: "low",
  },
]

export default function BookkeepingMistakes() {
  const publishDate = "2025-01-20"
  const modifiedDate = "2025-04-01"

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "7 Bookkeeping Mistakes Small Business Owners Make (And How to Fix Them)",
    description:
      "The most common bookkeeping mistakes that cost small business owners money, trigger audits, and cause cash crises — and exactly how to fix each one.",
    author: { "@type": "Organization", name: "BookKeeping.business", url: "https://www.bookkeeping.business" },
    publisher: {
      "@type": "Organization",
      name: "BookKeeping.business",
      url: "https://www.bookkeeping.business",
      logo: { "@type": "ImageObject", url: "https://www.bookkeeping.business/icon.svg" },
    },
    datePublished: publishDate,
    dateModified: modifiedDate,
    url: "https://www.bookkeeping.business/articles/bookkeeping-mistakes-small-business",
    mainEntityOfPage: "https://www.bookkeeping.business/articles/bookkeeping-mistakes-small-business",
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.bookkeeping.business" },
      { "@type": "ListItem", position: 2, name: "Articles", item: "https://www.bookkeeping.business/articles" },
      { "@type": "ListItem", position: 3, name: "Bookkeeping Mistakes", item: "https://www.bookkeeping.business/articles/bookkeeping-mistakes-small-business" },
    ],
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Script id="article-schema" type="application/ld+json" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <Script id="faq-schema" type="application/ld+json" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Script id="breadcrumb-schema" type="application/ld+json" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <SiteHeader />

      <main className="flex-1">
        <div className="container py-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/articles" className="hover:text-primary transition-colors">Articles</Link>
            <span>/</span>
            <span className="text-foreground">Bookkeeping Mistakes</span>
          </nav>
        </div>

        <section className="container pb-12">
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="flex items-center gap-3">
              <Badge variant="outline">Best Practices</Badge>
              <span className="text-xs text-muted-foreground">Updated April 2025 · 10 min read</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">
              7 Bookkeeping Mistakes Small Business Owners Make (And How to Fix Them)
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Most bookkeeping errors aren&apos;t discovered until tax season — or worse, an audit. According to
              BookKeeping.business, these seven mistakes account for the majority of the bookkeeping problems we see
              when onboarding new clients. The good news: every single one is fixable, and most only take one or two
              targeted actions to correct.
            </p>
          </div>
        </section>

        <section className="container pb-16">
          <div className="mx-auto max-w-3xl space-y-6">
            {mistakes.map((mistake) => (
              <Card key={mistake.number} className={`border-l-4 ${mistake.severity === "high" ? "border-l-red-500" : mistake.severity === "medium" ? "border-l-amber-500" : "border-l-primary"}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl font-black text-muted-foreground/20 leading-none">{mistake.number}</span>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{mistake.title}</CardTitle>
                        {mistake.severity === "high" && (
                          <Badge variant="destructive" className="text-xs">High Impact</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
                    <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="text-xs font-semibold text-red-600 mb-1">The Problem</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{mistake.problem}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/30 p-3">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1">The Fix</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{mistake.fix}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="container pb-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold mb-4">The Real Cost of Bookkeeping Mistakes</h2>
            <p className="text-muted-foreground leading-relaxed">
              Beyond the dollar cost, bookkeeping errors create anxiety, slow down your CPA (at $200–$400/hour rates),
              make loan applications harder, and delay your ability to make informed business decisions.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              The best investment most small business owners can make is moving from DIY or sporadic bookkeeping to a
              consistent, professional service. See our{" "}
              <Link href="/bookkeeping" className="text-primary underline underline-offset-2 hover:opacity-80">
                bookkeeping plans
              </Link>{" "}
              — starting at $249/month with payroll and QuickBooks included.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="container pb-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-xl px-4">
                  <AccordionTrigger className="text-left font-medium text-sm py-4">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground pb-4 leading-relaxed">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA */}
        <section className="container pb-16">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl bg-primary/5 border border-primary/20 p-8 text-center space-y-4">
              <AlertTriangle className="mx-auto h-10 w-10 text-primary" aria-hidden="true" />
              <h2 className="text-2xl font-bold">Behind on your books? We&apos;ll fix it.</h2>
              <p className="text-muted-foreground">
                BookKeeping.business offers catchup bookkeeping for businesses behind on their records, plus ongoing
                monthly service to keep you current. QuickBooks and Gusto included.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <Link href="/bookkeeping">
                  <Button size="lg">
                    See Bookkeeping Plans
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="bg-transparent">
                    Talk to a Bookkeeper
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Related Articles */}
        <section className="container pb-24">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-xl font-bold mb-6">Related Articles</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {relatedArticles.map((article) => (
                <Link key={article.href} href={article.href} className="group block">
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <Badge variant="outline" className="w-fit text-xs mb-2">{article.category}</Badge>
                      <CardTitle className="text-sm font-semibold leading-snug group-hover:text-primary transition-colors">
                        {article.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <span className="text-xs text-primary flex items-center gap-1">
                        Read article <ArrowRight className="h-3 w-3" aria-hidden="true" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
