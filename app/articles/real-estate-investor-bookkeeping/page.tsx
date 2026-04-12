import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ArrowRight, Building2, DollarSign, TrendingUp, FileText, Shield, BarChart3 } from "lucide-react"
import Link from "next/link"
import Script from "next/script"

export const metadata: Metadata = {
  title: "Real Estate Investor Bookkeeping: Structure Your Books for Tax Savings (2025)",
  description:
    "How real estate investors should structure their books — rental income tracking, depreciation, Schedule E, LLC structure, and 1031 exchanges. Expert guide from BookKeeping.business.",
  keywords: [
    "real estate investor bookkeeping",
    "real estate bookkeeping services",
    "rental property bookkeeping",
    "real estate investor bookkeeping services",
    "Schedule E bookkeeping",
    "depreciation real estate bookkeeping",
    "LLC bookkeeping real estate",
    "1031 exchange accounting",
    "property management bookkeeping",
    "rental income tracking QuickBooks",
  ],
  openGraph: {
    title: "Real Estate Investor Bookkeeping Guide | BookKeeping.business",
    description:
      "Structure your real estate books for maximum tax savings. Covers rental income, depreciation, Schedule E, and 1031 exchanges.",
    url: "https://www.bookkeeping.business/articles/real-estate-investor-bookkeeping",
  },
  alternates: { canonical: "https://www.bookkeeping.business/articles/real-estate-investor-bookkeeping" },
}

const faqs = [
  {
    question: "Should each rental property have its own QuickBooks file?",
    answer:
      "Not necessarily. For most real estate investors with under 10 properties, using a single QuickBooks Online file with class tracking (one class per property) is the most efficient approach. For investors with 10+ properties or multiple LLCs, separate files or an Enterprise solution may be warranted. BookKeeping.business can help you decide based on your portfolio size.",
  },
  {
    question: "What is Schedule E and why does it matter for my bookkeeping?",
    answer:
      "Schedule E (Supplemental Income and Loss) is the IRS form where rental income and expenses are reported for individual landlords. Each property is listed separately. Your bookkeeping must produce per-property P&Ls that match Schedule E — clean, categorized books make tax prep dramatically faster and reduce audit risk.",
  },
  {
    question: "How do I track depreciation in my rental property books?",
    answer:
      "Depreciation on residential rental property is calculated over 27.5 years using the straight-line method (commercial is 39 years). Your CPA or bookkeeper sets this up as a non-cash expense in your books. You should have a fixed asset register showing each property's purchase price, improvements, and accumulated depreciation. This is critical for calculating gain/loss on eventual sale.",
  },
  {
    question: "What is a 1031 exchange and how does it affect bookkeeping?",
    answer:
      "A 1031 exchange allows you to defer capital gains taxes by reinvesting proceeds from a sold property into a like-kind property. From a bookkeeping standpoint, it requires: recording the sale properly (proceeds, adjusted basis, realized gain), setting up the new property's cost basis from the deferred gain, and maintaining detailed records for the exchange period. Your bookkeeper and CPA need to coordinate closely on these transactions.",
  },
  {
    question: "Should real estate investors use cash or accrual accounting?",
    answer:
      "Most individual real estate investors use cash basis accounting, which is allowed and simpler. However, for investors with multiple properties, significant deferred income (security deposits, prepaid rent), or a real estate business entity, accrual accounting provides a more accurate financial picture and may be required if you have partnerships or investors.",
  },
  {
    question: "What expenses can I deduct as a rental property owner?",
    answer:
      "Deductible rental expenses include: mortgage interest, property taxes, insurance, repairs and maintenance, property management fees, advertising/tenant screening, travel to the property, depreciation, HOA fees, professional fees (accounting, legal), and supplies. Capital improvements (not repairs) must be depreciated, not expensed immediately.",
  },
]

const relatedArticles = [
  {
    href: "/articles/llc-bookkeeping-guide",
    title: "LLC Bookkeeping Guide for Single & Multi-Member Owners",
    category: "Business Structure",
  },
  {
    href: "/articles/how-to-read-financial-statements",
    title: "How to Read Financial Statements (Plain-English Guide)",
    category: "Financial Literacy",
  },
  {
    href: "/articles/bookkeeping-mistakes-small-business",
    title: "7 Bookkeeping Mistakes Small Business Owners Make",
    category: "Best Practices",
  },
]

export default function RealEstateBookkeepingGuide() {
  const publishDate = "2025-03-10"
  const modifiedDate = "2025-04-01"

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Real Estate Investor Bookkeeping: Structure Your Books for Tax Savings (2025)",
    description:
      "How real estate investors should structure their books — rental income tracking, depreciation, Schedule E, LLC structure, and 1031 exchanges.",
    author: { "@type": "Organization", name: "BookKeeping.business", url: "https://www.bookkeeping.business" },
    publisher: {
      "@type": "Organization",
      name: "BookKeeping.business",
      url: "https://www.bookkeeping.business",
      logo: { "@type": "ImageObject", url: "https://www.bookkeeping.business/icon.svg" },
    },
    datePublished: publishDate,
    dateModified: modifiedDate,
    url: "https://www.bookkeeping.business/articles/real-estate-investor-bookkeeping",
    mainEntityOfPage: "https://www.bookkeeping.business/articles/real-estate-investor-bookkeeping",
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
      { "@type": "ListItem", position: 3, name: "Real Estate Investor Bookkeeping", item: "https://www.bookkeeping.business/articles/real-estate-investor-bookkeeping" },
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
            <span className="text-foreground">Real Estate Investor Bookkeeping</span>
          </nav>
        </div>

        <section className="container pb-12">
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="flex items-center gap-3">
              <Badge variant="outline">Industry Guides</Badge>
              <span className="text-xs text-muted-foreground">Updated April 2025 · 11 min read</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">
              Real Estate Investor Bookkeeping: How to Structure Your Books for Maximum Tax Savings
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Real estate investors have access to some of the most powerful tax advantages available to any asset
              class — depreciation deductions, 1031 exchanges, cost segregation, and passive loss rules. But capturing
              those advantages requires disciplined, property-level bookkeeping. According to BookKeeping.business,
              most real estate investors leave thousands of dollars in deductions on the table every year simply because
              their books aren&apos;t clean enough for their CPA to use.
            </p>
          </div>
        </section>

        <section className="container pb-16">
          <div className="mx-auto max-w-3xl space-y-10">

            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Why Real Estate Needs Specialized Bookkeeping</h2>
              <p className="text-muted-foreground leading-relaxed">
                Generic small business bookkeeping doesn&apos;t work well for real estate investors. You need books that:
                produce per-property income statements, separate capital improvements from repairs, track depreciation
                schedules, and support Schedule E reporting. Without this structure, you&apos;re either overpaying taxes or
                taking risks with your filings.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Real estate bookkeeping also intersects with entity structure. Whether you hold properties personally or
                in one or multiple LLCs determines how you file taxes and how your books need to be organized.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">LLC Structure for Real Estate Investors</h2>
              <p className="text-muted-foreground leading-relaxed">
                The most common structure for real estate investors involves holding each property (or group of
                properties) in a separate LLC for liability protection. From a bookkeeping standpoint, each LLC is a
                separate legal entity that may require its own bookkeeping — separate bank accounts, separate records,
                and potentially separate tax filings.
              </p>
              <h3 className="text-xl font-bold">Single LLC vs. Per-Property LLC</h3>
              <p className="text-muted-foreground leading-relaxed">
                A single LLC holding multiple properties is simpler from an accounting perspective: one QuickBooks file,
                one bank account, class or location tracking per property. However, a lawsuit against one property can
                potentially reach all properties in the same LLC.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Separate LLCs per property provide stronger liability separation but require separate books per entity
                (or a bookkeeper capable of managing multi-entity accounting). Our{" "}
                <Link href="/bookkeeping" className="text-primary underline underline-offset-2 hover:opacity-80">
                  Enterprise plan
                </Link>{" "}
                supports multi-entity bookkeeping for real estate investors.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">What to Track for Each Rental Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                Every rental property should have its own income and expense tracking. The key categories:
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: DollarSign, title: "Rental Income", desc: "All rent received, late fees, pet fees, and other tenant charges. Tracked by unit and month." },
                  { icon: Building2, title: "Operating Expenses", desc: "Mortgage interest, property taxes, insurance, HOA, utilities paid by landlord, repairs, property management fees." },
                  { icon: TrendingUp, title: "Capital Improvements", desc: "New roof, HVAC replacement, kitchen remodel — must be capitalized and depreciated, not expensed." },
                  { icon: BarChart3, title: "Depreciation", desc: "Non-cash expense representing wear and tear. Residential: 27.5 years. Set up by your bookkeeper or CPA." },
                  { icon: FileText, title: "Security Deposits", desc: "Not income until forfeited. Track as a liability (money owed back to tenant) until the lease ends." },
                  { icon: Shield, title: "Vacancy & Turnover", desc: "Cleaning, repairs, advertising between tenants. Track separately to analyze vacancy costs per property." },
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
              <h2 className="text-2xl font-bold tracking-tight">Depreciation: The Real Estate Investor&apos;s Most Powerful Tax Tool</h2>
              <p className="text-muted-foreground leading-relaxed">
                Depreciation allows you to deduct the cost of your investment property over time, even as the property
                may be appreciating in market value. For residential rental property, the IRS allows you to depreciate
                the building value (not land) over 27.5 years using straight-line depreciation.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Example: A property purchased for $300,000 with $50,000 allocated to land has a depreciable basis of
                $250,000. Annual depreciation = $250,000 ÷ 27.5 = $9,091/year, which offsets rental income.
              </p>
              <h3 className="text-xl font-bold">Cost Segregation for Accelerated Depreciation</h3>
              <p className="text-muted-foreground leading-relaxed">
                Cost segregation studies identify components of a property that can be depreciated faster (5, 7, or 15
                years) rather than 27.5 years. This accelerates your deductions. It requires a formal engineering study
                and is typically worth considering for properties acquired for $500K+. Your bookkeeper must record the
                resulting asset schedules correctly.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">CapEx vs. Repairs: The Distinction That Determines Your Tax Bill</h2>
              <p className="text-muted-foreground leading-relaxed">
                This is one of the most important and most frequently mishandled distinctions in real estate bookkeeping.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong>Repairs and maintenance</strong> (fix a broken window, patch a roof, replace a broken
                appliance) are deducted in the current year as operating expenses. <strong>Capital improvements</strong>{" "}
                (replace the entire roof, add a room, replace the HVAC system) must be capitalized and depreciated
                over their useful life.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The IRS uses the &ldquo;RABI&rdquo; test (Restoration, Adaptation, Betterment, Improvement) to distinguish
                repairs from improvements. Your bookkeeper needs to ask the right questions when recording these
                transactions. According to BookKeeping.business, misclassifying capital improvements as repairs is one
                of the top triggers for real estate investor audits.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Schedule E: Matching Your Books to Your Tax Return</h2>
              <p className="text-muted-foreground leading-relaxed">
                Individual landlords report rental income and expenses on Schedule E of their Form 1040. Each property
                is listed on a separate line with its own income and expense breakdown. The categories on Schedule E
                should map directly to your QuickBooks chart of accounts.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                When your books are well-organized, your CPA can pull a Schedule E-ready report directly from
                QuickBooks. When they&apos;re not, the CPA has to reconstruct everything from bank statements — at
                significantly higher cost and with greater risk of errors or missed deductions.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Best Practices for Real Estate Investor Bookkeeping</h2>
              <ul className="space-y-3 text-muted-foreground">
                {[
                  "Use a dedicated bank account for each LLC or property group — never commingle personal and investment funds",
                  "Keep all vendor receipts and invoices (photographed and stored digitally) for at least 7 years",
                  "Set up separate tracking (classes/locations in QBO) for each property from day one",
                  "Reconcile bank accounts monthly — do not let it go more than 2 months",
                  "Maintain a fixed asset register for all properties, showing purchase price, improvements, and depreciation",
                  "Document the repair vs. improvement decision in writing at the time of the expense",
                  "Review your per-property P&L quarterly to identify underperforming properties",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-2">
                See our{" "}
                <Link href="/services" className="text-primary underline underline-offset-2 hover:opacity-80">
                  full list of services
                </Link>{" "}
                for real estate investors, including multi-entity support and{" "}
                <Link href="/ap-ar" className="text-primary underline underline-offset-2 hover:opacity-80">
                  AP/AR management
                </Link>{" "}
                for property managers.
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
              <Building2 className="mx-auto h-10 w-10 text-primary" aria-hidden="true" />
              <h2 className="text-2xl font-bold">Bookkeeping for real estate investors</h2>
              <p className="text-muted-foreground">
                BookKeeping.business handles property-level bookkeeping, depreciation tracking, and Schedule E-ready
                reports for real estate investors and property managers. Multi-entity support available.
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
