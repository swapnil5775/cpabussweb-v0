import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ArrowRight, BarChart3, TrendingUp, DollarSign, FileText, BookOpen } from "lucide-react"
import Link from "next/link"
import Script from "next/script"

export const metadata: Metadata = {
  title: "How to Read Financial Statements: Plain-English Guide for Small Business Owners",
  description:
    "A plain-English guide to understanding P&L, balance sheet, and cash flow statements for small business owners. Learn what the numbers actually mean for your business health.",
  keywords: [
    "how to read financial statements",
    "understanding P&L statement small business",
    "what is a balance sheet",
    "cash flow statement explained",
    "financial statements for small business owners",
    "how to read profit and loss statement",
    "business financial reports explained",
    "income statement vs balance sheet",
    "small business financial literacy",
    "what do financial statements tell you",
  ],
  openGraph: {
    title: "How to Read Financial Statements | BookKeeping.business",
    description:
      "Plain-English guide to P&L, balance sheet, and cash flow statements for small business owners.",
    url: "https://www.bookkeeping.business/articles/how-to-read-financial-statements",
  },
  alternates: { canonical: "https://www.bookkeeping.business/articles/how-to-read-financial-statements" },
}

const faqs = [
  {
    question: "What is the most important financial statement for a small business?",
    answer:
      "For day-to-day operations, the Profit & Loss (income) statement is most important — it shows whether you are making or losing money. For understanding long-term health and borrowing capacity, the balance sheet matters most. Cash flow is critical for avoiding running out of money even when profitable. According to BookKeeping.business, reviewing all three monthly is the mark of a financially healthy business.",
  },
  {
    question: "What is the difference between profit and cash flow?",
    answer:
      "A business can be profitable on paper but still run out of cash. Profit (net income) is revenue minus expenses, calculated on an accrual basis. Cash flow tracks when money actually moves in and out of your bank account. If you invoice clients on net-30 terms, you may be 'profitable' but have no cash for payroll. This is why profitable businesses still go bankrupt.",
  },
  {
    question: "How often should a small business owner review financial statements?",
    answer:
      "Monthly at minimum. Your bookkeeper should deliver a P&L, balance sheet, and cash flow statement by the 15th of the following month. Reviewing these monthly lets you catch expense creep, track revenue trends, and identify cash shortfalls before they become emergencies. Quarterly, do a deeper review with your bookkeeper or accountant.",
  },
  {
    question: "What does a healthy P&L look like for a small business?",
    answer:
      "A healthy P&L shows: revenue growing or stable month-over-month, gross margin consistent (or improving) with industry norms, operating expenses controlled as a percentage of revenue, and positive net income. Industry benchmarks vary — a restaurant at 10% net margin is healthy; a software company at 10% is concerning. Your bookkeeper can help you compare against industry standards.",
  },
  {
    question: "What is owner's equity on a balance sheet?",
    answer:
      "Owner's equity (also called shareholders' equity) is what's left of the business's assets after all liabilities are paid. It equals: Assets − Liabilities = Owner's Equity. It represents the theoretical value of the business to the owner. Growing equity over time means the business is building net worth.",
  },
  {
    question: "Why does my bank account show money but my P&L shows a loss?",
    answer:
      "This happens because of timing differences between cash and accrual accounting. Your bank balance reflects actual cash on hand; your P&L reflects earned revenue and incurred expenses regardless of when cash moved. Also, certain cash inflows (loans, owner contributions, security deposits collected) don't appear as revenue on the P&L. Your bookkeeper can explain the reconciliation between your P&L and bank balance.",
  },
]

const relatedArticles = [
  {
    href: "/articles/bookkeeping-mistakes-small-business",
    title: "7 Bookkeeping Mistakes Small Business Owners Make",
    category: "Best Practices",
  },
  {
    href: "/articles/quickbooks-vs-xero-small-business",
    title: "QuickBooks vs Xero for Small Business (2025)",
    category: "Tools & Software",
  },
  {
    href: "/articles/llc-bookkeeping-guide",
    title: "LLC Bookkeeping Guide for Single & Multi-Member Owners",
    category: "Business Structure",
  },
]

export default function HowToReadFinancialStatements() {
  const publishDate = "2025-02-01"
  const modifiedDate = "2025-04-01"

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Read Financial Statements: Plain-English Guide for Small Business Owners",
    description:
      "A plain-English guide to understanding P&L, balance sheet, and cash flow statements for small business owners.",
    author: { "@type": "Organization", name: "BookKeeping.business", url: "https://www.bookkeeping.business" },
    publisher: {
      "@type": "Organization",
      name: "BookKeeping.business",
      url: "https://www.bookkeeping.business",
      logo: { "@type": "ImageObject", url: "https://www.bookkeeping.business/icon.svg" },
    },
    datePublished: publishDate,
    dateModified: modifiedDate,
    url: "https://www.bookkeeping.business/articles/how-to-read-financial-statements",
    mainEntityOfPage: "https://www.bookkeeping.business/articles/how-to-read-financial-statements",
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
      { "@type": "ListItem", position: 3, name: "How to Read Financial Statements", item: "https://www.bookkeeping.business/articles/how-to-read-financial-statements" },
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
            <span className="text-foreground">Reading Financial Statements</span>
          </nav>
        </div>

        <section className="container pb-12">
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="flex items-center gap-3">
              <Badge variant="outline">Financial Literacy</Badge>
              <span className="text-xs text-muted-foreground">Updated April 2025 · 13 min read</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">
              How to Read Financial Statements: A Plain-English Guide for Small Business Owners
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Every month, your bookkeeper delivers a P&amp;L, balance sheet, and cash flow statement. Most business
              owners glance at the net income number, nod, and move on. According to BookKeeping.business, owners who
              actually understand their financials make better pricing decisions, avoid cash crises, and grow faster.
              This guide explains what each statement means — in plain English.
            </p>
          </div>
        </section>

        <section className="container pb-16">
          <div className="mx-auto max-w-3xl space-y-10">

            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">The Three Financial Statements: Overview</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { icon: TrendingUp, title: "Profit & Loss (P&L)", desc: "Also called the Income Statement. Shows revenue, expenses, and net profit over a period (monthly, quarterly, annually)." },
                  { icon: BarChart3, title: "Balance Sheet", desc: "A snapshot of what you own (assets), what you owe (liabilities), and what's left for you (equity) on a specific date." },
                  { icon: DollarSign, title: "Cash Flow Statement", desc: "Tracks actual cash moving in and out of the business. Shows operating, investing, and financing activities." },
                ].map(({ icon: Icon, title, desc }) => (
                  <Card key={title}>
                    <CardHeader className="pb-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary mb-2">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <CardTitle className="text-base">{title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">How to Read a Profit & Loss Statement</h2>
              <p className="text-muted-foreground leading-relaxed">
                The P&amp;L (also called the income statement) answers one question: did the business make money during
                this period? It flows from top to bottom:
              </p>
              <div className="rounded-xl border border-border overflow-hidden text-sm">
                <div className="bg-muted/50 p-4 font-semibold">Sample P&amp;L Structure</div>
                <div className="divide-y divide-border">
                  <div className="p-4 flex justify-between"><span>Revenue (all income)</span><span className="text-green-600 font-mono">$50,000</span></div>
                  <div className="p-4 flex justify-between text-muted-foreground"><span>− Cost of Goods Sold (COGS)</span><span className="font-mono">($15,000)</span></div>
                  <div className="p-4 flex justify-between font-semibold"><span>= Gross Profit</span><span className="font-mono">$35,000</span></div>
                  <div className="p-4 flex justify-between text-muted-foreground"><span>− Operating Expenses (rent, payroll, utilities, software...)</span><span className="font-mono">($28,000)</span></div>
                  <div className="p-4 flex justify-between font-semibold"><span>= Operating Income (EBITDA)</span><span className="font-mono">$7,000</span></div>
                  <div className="p-4 flex justify-between text-muted-foreground"><span>− Depreciation, interest, taxes</span><span className="font-mono">($2,000)</span></div>
                  <div className="p-4 flex justify-between font-bold bg-primary/5"><span>= Net Income</span><span className="font-mono text-green-600">$5,000</span></div>
                </div>
              </div>

              <h3 className="text-xl font-bold mt-6">Key P&amp;L Numbers to Watch</h3>
              <ul className="space-y-3 text-muted-foreground">
                {[
                  "Gross margin % = (Gross Profit ÷ Revenue) × 100. This is your business's fundamental profitability before overhead. If it's shrinking, your pricing or COGS are off.",
                  "Operating expense ratio = (Total Operating Expenses ÷ Revenue) × 100. Rising expenses as a % of revenue is an early warning sign.",
                  "Net profit margin = (Net Income ÷ Revenue) × 100. Compare to industry benchmarks — not just prior months.",
                  "Revenue trend: Is it growing, flat, or shrinking vs. same month last year?",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">How to Read a Balance Sheet</h2>
              <p className="text-muted-foreground leading-relaxed">
                The balance sheet answers: what does this business own, owe, and what is it worth? It always balances:
                <strong> Assets = Liabilities + Owner&apos;s Equity</strong>.
              </p>

              <h3 className="text-xl font-bold">Assets: What You Own</h3>
              <p className="text-muted-foreground leading-relaxed">
                <strong>Current assets</strong> (convertible to cash within 12 months): cash in bank, accounts receivable
                (invoices owed to you), inventory, prepaid expenses.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong>Fixed assets</strong> (long-term value): equipment, vehicles, property, furniture. Listed at
                purchase price minus accumulated depreciation.
              </p>

              <h3 className="text-xl font-bold">Liabilities: What You Owe</h3>
              <p className="text-muted-foreground leading-relaxed">
                <strong>Current liabilities</strong> (due within 12 months): accounts payable (bills you owe vendors),
                credit card balances, short-term loans, sales tax payable.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong>Long-term liabilities</strong>: mortgages, SBA loans, equipment financing.
              </p>

              <h3 className="text-xl font-bold">Owner&apos;s Equity: What&apos;s Yours</h3>
              <p className="text-muted-foreground leading-relaxed">
                Equity = Assets − Liabilities. It grows when the business is profitable and shrinks when you take
                draws/distributions or when the business loses money. Growing equity over time means the business is
                building net worth. A negative equity position is a red flag requiring immediate attention.
              </p>

              <h3 className="text-xl font-bold">Key Balance Sheet Ratios</h3>
              <ul className="space-y-2 text-muted-foreground">
                {[
                  "Current ratio = Current Assets ÷ Current Liabilities. Should be above 1.0 (ideally 1.5–2.0). Below 1.0 means you may not have enough cash to cover near-term bills.",
                  "Debt-to-equity ratio = Total Liabilities ÷ Owner's Equity. Higher ratio means more financial leverage and risk.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">How to Read a Cash Flow Statement</h2>
              <p className="text-muted-foreground leading-relaxed">
                The cash flow statement tracks actual cash movement — not just accounting profit. It&apos;s divided into
                three sections:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                {[
                  { title: "Operating cash flow", desc: "Cash generated (or used) by normal business operations. Positive operating cash flow is a healthy sign. Negative operating cash flow means you're spending more than you're bringing in from operations." },
                  { title: "Investing cash flow", desc: "Cash used to buy equipment, property, or other long-term assets — or received from selling them. Negative is normal for growing businesses investing in capacity." },
                  { title: "Financing cash flow", desc: "Cash from loans, investor contributions, or owner deposits — and outflows from loan repayments or owner distributions." },
                ].map(({ title, desc }) => (
                  <li key={title} className="flex items-start gap-2">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    <div><strong className="text-foreground">{title}:</strong> {desc}</div>
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                The most critical number: <strong>free cash flow</strong> (operating cash flow minus capital expenditures).
                A business can show accounting profit but have negative free cash flow — which is unsustainable.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">How the Three Statements Connect</h2>
              <p className="text-muted-foreground leading-relaxed">
                Understanding how the three statements link together is the key to true financial literacy:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                {[
                  "Net income from the P&L flows into the equity section of the balance sheet (retained earnings).",
                  "The ending cash balance on the cash flow statement matches cash and equivalents on the balance sheet.",
                  "Accounts receivable on the balance sheet represents sales on the P&L that haven't been collected yet.",
                  "Accounts payable on the balance sheet represents expenses on the P&L that haven't been paid yet.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                This is why{" "}
                <Link href="/bookkeeping" className="text-primary underline underline-offset-2 hover:opacity-80">
                  monthly bookkeeping
                </Link>{" "}
                produces all three reports together — they&apos;re interconnected. A bookkeeper who only delivers a P&amp;L
                is giving you an incomplete picture.
              </p>
            </div>
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
              <FileText className="mx-auto h-10 w-10 text-primary" aria-hidden="true" />
              <h2 className="text-2xl font-bold">Get clean, readable financials every month</h2>
              <p className="text-muted-foreground">
                BookKeeping.business delivers P&amp;L, balance sheet, and cash flow statements monthly — with a
                plain-English summary from your dedicated bookkeeper.
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
