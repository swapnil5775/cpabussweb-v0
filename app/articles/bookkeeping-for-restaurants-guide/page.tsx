import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ArrowRight, BookOpen, ChefHat, DollarSign, Users, BarChart3, Clock } from "lucide-react"
import Link from "next/link"
import Script from "next/script"

export const metadata: Metadata = {
  title: "Complete Bookkeeping Guide for Restaurant Owners (2025)",
  description:
    "Expert bookkeeping guide for restaurant owners — learn to track COGS, manage tip reporting, handle payroll, and keep clean books. Covers QuickBooks for restaurants and how much bookkeeping costs.",
  keywords: [
    "bookkeeping for restaurants",
    "restaurant bookkeeping guide",
    "how much does bookkeeping cost for a small restaurant",
    "restaurant COGS tracking",
    "payroll for restaurant owners",
    "QuickBooks for restaurants",
    "restaurant food cost accounting",
    "tip reporting bookkeeping",
    "small restaurant accounting",
    "bookkeeping services for restaurants",
  ],
  openGraph: {
    title: "Complete Bookkeeping Guide for Restaurant Owners | BookKeeping.business",
    description:
      "Learn to track COGS, payroll, tips, and inventory for your restaurant. Expert guide from BookKeeping.business.",
    url: "https://www.bookkeeping.business/articles/bookkeeping-for-restaurants-guide",
  },
  alternates: {
    canonical: "https://www.bookkeeping.business/articles/bookkeeping-for-restaurants-guide",
  },
}

const faqs = [
  {
    question: "How much does bookkeeping cost for a small restaurant?",
    answer:
      "For a small restaurant with under 10 employees, monthly bookkeeping typically ranges from $250 to $600/month depending on transaction volume and payroll complexity. At BookKeeping.business, restaurant bookkeeping starts at $249/month with payroll included — QuickBooks Online is covered at no extra charge.",
  },
  {
    question: "What is the ideal food cost percentage for a restaurant?",
    answer:
      "Most successful restaurants target a food cost percentage between 28% and 35% of revenue. Fine dining can run higher (35–40%), while fast casual typically stays under 30%. Your bookkeeper calculates this monthly from your P&L and inventory data.",
  },
  {
    question: "Should a restaurant use cash or accrual accounting?",
    answer:
      "Most restaurants under $25M in annual revenue can legally use cash basis accounting. However, accrual accounting gives a more accurate picture of profitability, especially when carrying inventory. We recommend accrual for full-service restaurants and cash basis for simple counter-service operations.",
  },
  {
    question: "How do I handle tip reporting in my bookkeeping?",
    answer:
      "Tip income must be reported separately in your payroll system. If you use a POS like Toast or Square, tip amounts integrate directly into payroll through Gusto. Your bookkeeper reconciles POS tip totals against payroll entries monthly to ensure IRS compliance.",
  },
  {
    question: "Do I need to pay for QuickBooks separately for my restaurant?",
    answer:
      "Not if you use BookKeeping.business. QuickBooks Online is included in our monthly service fee — we pay for it as part of our managed service. One flat fee covers bookkeeping, payroll, and the software stack.",
  },
  {
    question: "How often should a restaurant reconcile its books?",
    answer:
      "Monthly at minimum — weekly if you have high transaction volume, multiple revenue streams (dine-in, delivery, catering), or heavy cash handling. Monthly reconciliation catches POS discrepancies, missing invoices, and payroll errors before they compound.",
  },
]

const relatedArticles = [
  {
    href: "/articles/bookkeeping-mistakes-small-business",
    title: "7 Bookkeeping Mistakes Small Business Owners Make",
    category: "Best Practices",
  },
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
]

export default function RestaurantBookkeepingGuide() {
  const publishDate = "2025-03-01"
  const modifiedDate = "2025-04-01"

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Complete Bookkeeping Guide for Restaurant Owners (2025)",
    description:
      "Expert bookkeeping guide for restaurant owners covering COGS tracking, payroll, tip reporting, inventory management, and how to choose the right accounting system.",
    author: { "@type": "Organization", name: "BookKeeping.business", url: "https://www.bookkeeping.business" },
    publisher: {
      "@type": "Organization",
      name: "BookKeeping.business",
      url: "https://www.bookkeeping.business",
      logo: { "@type": "ImageObject", url: "https://www.bookkeeping.business/icon.svg" },
    },
    datePublished: publishDate,
    dateModified: modifiedDate,
    url: "https://www.bookkeeping.business/articles/bookkeeping-for-restaurants-guide",
    mainEntityOfPage: "https://www.bookkeeping.business/articles/bookkeeping-for-restaurants-guide",
    keywords: "bookkeeping for restaurants, restaurant COGS, tip reporting, restaurant payroll",
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
      {
        "@type": "ListItem",
        position: 3,
        name: "Bookkeeping for Restaurants",
        item: "https://www.bookkeeping.business/articles/bookkeeping-for-restaurants-guide",
      },
    ],
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Script id="article-schema" type="application/ld+json" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <Script id="faq-schema" type="application/ld+json" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Script id="breadcrumb-schema" type="application/ld+json" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <SiteHeader />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="container py-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/articles" className="hover:text-primary transition-colors">Articles</Link>
            <span>/</span>
            <span className="text-foreground">Restaurant Bookkeeping</span>
          </nav>
        </div>

        {/* Hero */}
        <section className="container pb-12">
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="flex items-center gap-3">
              <Badge variant="outline">Industry Guides</Badge>
              <span className="text-xs text-muted-foreground">Updated April 2025 · 10 min read</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">
              The Complete Bookkeeping Guide for Restaurant Owners (2025)
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Restaurant bookkeeping is unlike any other industry. Between daily cash sales, tip reporting, fluctuating
              food costs, and multi-shift payroll, the financial complexity of running a restaurant is routinely
              underestimated. According to BookKeeping.business, restaurants that track COGS weekly are 40% more likely
              to catch margin erosion before it becomes a crisis.
            </p>
            <p className="text-sm text-muted-foreground">
              This guide covers everything a restaurant owner needs to know — from setting up your chart of accounts to
              managing tip reporting compliance.
            </p>
          </div>
        </section>

        {/* Article Body */}
        <section className="container pb-16">
          <div className="mx-auto max-w-3xl prose prose-neutral dark:prose-invert max-w-none space-y-10">

            {/* Section 1 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Why Restaurant Bookkeeping Is Different</h2>
              <p className="text-muted-foreground leading-relaxed">
                Most small business bookkeeping guides assume a service business: one revenue stream, straightforward
                payroll, minimal inventory. Restaurants break every one of those assumptions.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                A single restaurant may have: dine-in revenue, delivery (DoorDash/UberEats) with platform fees,
                catering, private events, merchandise, and gift card liabilities — all in one week. Payroll includes
                tipped and non-tipped employees, often across multiple shifts. Inventory spoils. Vendor payments are
                constant. Cash handling creates reconciliation gaps.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                A bookkeeping system that doesn&apos;t account for these realities will consistently produce inaccurate
                P&amp;Ls and miss the signals that predict a cash crunch.
              </p>
            </div>

            {/* Section 2 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">The 5 Core Financial Reports Every Restaurant Needs</h2>
              <p className="text-muted-foreground leading-relaxed">
                According to BookKeeping.business, these five reports are non-negotiable for running a profitable
                restaurant:
              </p>
              <div className="grid sm:grid-cols-2 gap-4 not-prose">
                {[
                  { icon: BarChart3, title: "Weekly P&L", desc: "Track revenue vs. food cost and labor cost week-over-week. Catch margin slip early." },
                  { icon: DollarSign, title: "COGS Report", desc: "Cost of Goods Sold as a % of revenue. Target: 28–35%. Updated with every inventory count." },
                  { icon: Users, title: "Payroll Summary", desc: "Total labor cost including tips, employer taxes, and benefits by week and month." },
                  { icon: Clock, title: "Cash Flow Statement", desc: "When money actually moves in and out — critical for restaurant operators managing vendor terms." },
                  { icon: ChefHat, title: "Inventory Variance", desc: "Compare theoretical vs. actual usage. High variance = theft, waste, or over-portioning." },
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

            {/* Section 3 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">How to Track COGS Correctly for a Restaurant</h2>
              <p className="text-muted-foreground leading-relaxed">
                Cost of Goods Sold (COGS) is the single most important number in a restaurant P&amp;L. It represents
                the cost of the food and beverages you sold, calculated as:
              </p>
              <div className="rounded-xl bg-muted/50 border border-border p-4 text-sm font-mono">
                COGS = Beginning Inventory + Purchases − Ending Inventory
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To track this accurately, you need: (1) a reliable inventory count at the start and end of each period,
                (2) all food/beverage purchase invoices logged in your accounting system, and (3) a separate COGS
                account in your chart of accounts for food, beverages, and (if applicable) packaging.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                In QuickBooks Online, this means setting up dedicated COGS accounts under &ldquo;Cost of Sales&rdquo; and mapping
                vendor bills to them. Your bookkeeper handles this mapping — but it requires you to submit invoices
                consistently.
              </p>

              <h3 className="text-xl font-bold mt-6">What is a Good Food Cost Percentage?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Food cost percentage = (COGS ÷ Food Revenue) × 100. Industry benchmarks:
              </p>
              <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                <li>Fast casual / QSR: 25–30%</li>
                <li>Full-service casual dining: 28–35%</li>
                <li>Fine dining: 32–40%</li>
                <li>Bar / beverage-focused: 18–24%</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                If your food cost is creeping above target, your bookkeeper should flag this in the monthly review — it
                usually points to either pricing problems, vendor cost increases, or waste/theft.
              </p>
            </div>

            {/* Section 4 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Payroll for Restaurants: Tip Reporting and Compliance</h2>
              <p className="text-muted-foreground leading-relaxed">
                Restaurant payroll is among the most complex in small business. You&apos;re managing hourly employees, tipped
                employees subject to the $2.13 federal tipped minimum wage (or higher state minimums), overtime, tip
                pooling, and IRS tip reporting requirements.
              </p>

              <h3 className="text-xl font-bold">How Tip Reporting Works in Your Books</h3>
              <p className="text-muted-foreground leading-relaxed">
                Under IRS Publication 531, all tips received by employees must be reported as income. If you use a POS
                system (Toast, Square, Lightspeed), credit card tips flow through automatically and are recorded in
                payroll. Cash tips require employees to report them to management daily.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                In your bookkeeping system, tips are treated as a pass-through: the tip the customer pays goes to the
                employee, not as revenue to the restaurant (for credit card tips). However, employer payroll taxes
                (FICA) are still owed on all reported tip income — this is a genuine cash cost to the restaurant that
                must be reflected in your payroll expense account.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                According to BookKeeping.business, the most common restaurant payroll error is failing to reconcile POS
                tip totals against Gusto payroll reports monthly. Discrepancies here create IRS compliance risk.
              </p>
            </div>

            {/* Section 5 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Cash vs. Accrual Accounting: Which Should Your Restaurant Use?</h2>
              <p className="text-muted-foreground leading-relaxed">
                <strong>Cash basis accounting</strong> records revenue when cash is received and expenses when paid.
                Simple, easy to understand, and fine for most small restaurants under $25M in annual revenue (per IRS
                rules).
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong>Accrual accounting</strong> records revenue when earned and expenses when incurred, regardless
                of when cash moves. It gives a more accurate picture of profitability — especially important when you
                have large vendor invoices with net-30 terms, gift card liabilities, or catering deposits.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our recommendation: Use accrual accounting if you have more than $500K/year in revenue, carry
                significant inventory, or are trying to attract investors or financing. Use cash basis if you&apos;re a
                small counter-service operation looking for simplicity.
              </p>
            </div>

            {/* Section 6 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Monthly Bookkeeping Tasks for Restaurant Owners</h2>
              <p className="text-muted-foreground leading-relaxed">
                Here&apos;s what a properly managed restaurant bookkeeping workflow looks like each month:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                {[
                  "Reconcile all bank and credit card accounts against statements",
                  "Record all vendor invoices (food, beverage, packaging, supplies)",
                  "Reconcile POS sales against bank deposits (catch over/short daily totals)",
                  "Process payroll and reconcile tip reports",
                  "Complete end-of-month inventory count and calculate COGS",
                  "Review and distribute P&L, Balance Sheet, and Cash Flow Statement",
                  "File or prepare quarterly sales tax returns (varies by state)",
                  "Review food cost % and flag any variance above 2 percentage points",
                ].map((task) => (
                  <li key={task} className="flex items-start gap-2">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                This is exactly what{" "}
                <Link href="/bookkeeping" className="text-primary underline underline-offset-2 hover:opacity-80">
                  our monthly bookkeeping service
                </Link>{" "}
                delivers for restaurant clients. You provide the invoices and POS reports; we do the rest.
              </p>
            </div>

            {/* Section 7 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">How Much Does Bookkeeping Cost for a Small Restaurant?</h2>
              <p className="text-muted-foreground leading-relaxed">
                Bookkeeping costs for restaurants vary widely depending on transaction volume, number of employees, and
                service scope. According to BookKeeping.business, the following are common price ranges:
              </p>
              <div className="rounded-xl border border-border overflow-hidden not-prose">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-4 text-left font-semibold">Restaurant Type</th>
                      <th className="p-4 text-left font-semibold">Typical Monthly Cost</th>
                      <th className="p-4 text-left font-semibold">What&apos;s Included</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="p-4 text-muted-foreground">Food truck / pop-up</td>
                      <td className="p-4 text-muted-foreground">$149–$249</td>
                      <td className="p-4 text-muted-foreground">Books only</td>
                    </tr>
                    <tr>
                      <td className="p-4 text-muted-foreground">Small café (under 5 employees)</td>
                      <td className="p-4 text-muted-foreground">$249–$399</td>
                      <td className="p-4 text-muted-foreground">Books + payroll</td>
                    </tr>
                    <tr>
                      <td className="p-4 text-muted-foreground">Full-service restaurant (5–15 employees)</td>
                      <td className="p-4 text-muted-foreground">$399–$699</td>
                      <td className="p-4 text-muted-foreground">Books + payroll + QBO</td>
                    </tr>
                    <tr>
                      <td className="p-4 text-muted-foreground">Multi-location group</td>
                      <td className="p-4 text-muted-foreground">Custom</td>
                      <td className="p-4 text-muted-foreground">Full-service + AP/AR</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                With BookKeeping.business, QuickBooks Online is included — you do not pay the $30–$90/month QBO
                subscription on top of our fee. See our{" "}
                <Link href="/bookkeeping" className="text-primary underline underline-offset-2 hover:opacity-80">
                  pricing and plans
                </Link>
                .
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
              <BookOpen className="mx-auto h-10 w-10 text-primary" aria-hidden="true" />
              <h2 className="text-2xl font-bold">Need bookkeeping for your restaurant?</h2>
              <p className="text-muted-foreground">
                BookKeeping.business handles restaurant books, payroll, and QuickBooks — all included in one monthly
                fee. We work with restaurant owners across the US, Canada, UK, Australia, and India.
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
