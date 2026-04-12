import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ArrowRight, BarChart3, Check, X, Zap, Globe2, DollarSign } from "lucide-react"
import Link from "next/link"
import Script from "next/script"

export const metadata: Metadata = {
  title: "QuickBooks Online vs Xero for Small Business: Honest 2025 Comparison",
  description:
    "An honest QuickBooks Online vs Xero comparison for small business owners — pricing, features, integrations, and which software is best for restaurants, real estate, freelancers, and international businesses.",
  keywords: [
    "QuickBooks vs Xero small business",
    "QuickBooks Online vs Xero comparison",
    "best accounting software small business 2025",
    "QuickBooks bookkeeping service",
    "cloud bookkeeping service for small business",
    "Xero vs QuickBooks for restaurants",
    "QuickBooks Online pricing 2025",
    "Xero pricing 2025",
    "which accounting software for small business",
    "QuickBooks or Xero which is better",
  ],
  openGraph: {
    title: "QuickBooks Online vs Xero for Small Business | BookKeeping.business",
    description:
      "Honest 2025 comparison of QuickBooks vs Xero — pricing, features, and which is better for your industry.",
    url: "https://www.bookkeeping.business/articles/quickbooks-vs-xero-small-business",
  },
  alternates: { canonical: "https://www.bookkeeping.business/articles/quickbooks-vs-xero-small-business" },
}

const faqs = [
  {
    question: "Is QuickBooks Online better than Xero for small businesses in the US?",
    answer:
      "For most US-based small businesses, QuickBooks Online is the better choice due to wider accountant adoption, stronger payroll integration with Gusto, and more US-specific tax features. Xero is a strong alternative for businesses that want a cleaner interface or operate internationally. BookKeeping.business supports both platforms.",
  },
  {
    question: "How much does QuickBooks Online cost in 2025?",
    answer:
      "QuickBooks Online pricing in 2025: Simple Start ($35/month), Essentials ($65/month), Plus ($99/month), Advanced ($235/month). These prices are before Intuit's frequent promotional discounts. When you work with BookKeeping.business, QuickBooks Online is included in your plan — you pay one flat fee to us.",
  },
  {
    question: "How much does Xero cost in 2025?",
    answer:
      "Xero pricing in 2025: Starter ($20/month), Standard ($47/month), Premium ($80/month). Xero also charges per user for some features. Like QuickBooks, when you work with BookKeeping.business, Xero is included in your monthly service fee.",
  },
  {
    question: "Which is easier to use — QuickBooks or Xero?",
    answer:
      "Most users find Xero's interface cleaner and more intuitive for day-to-day tasks. QuickBooks has more features but can feel cluttered. However, since a professional bookkeeper handles the software when you work with a bookkeeping service, ease of use is less important than which platform your bookkeeper is expert in.",
  },
  {
    question: "Which software is better for international businesses?",
    answer:
      "Xero is generally better for international businesses. It supports multi-currency natively (included in all plans above Starter), has stronger integrations with non-US payroll systems, and is more widely used in the UK, Australia, Canada, and New Zealand. BookKeeping.business uses Xero for all international clients.",
  },
  {
    question: "Can I switch from QuickBooks to Xero (or vice versa)?",
    answer:
      "Yes, migrating between the two platforms is possible. The process involves exporting historical transactions, chart of accounts, and outstanding balances. It typically takes 2–4 weeks for a clean migration. BookKeeping.business handles platform migrations for clients who need to switch.",
  },
]

const relatedArticles = [
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
  {
    href: "/articles/llc-bookkeeping-guide",
    title: "LLC Bookkeeping Guide for Single & Multi-Member Owners",
    category: "Business Structure",
  },
]

const comparisonData = [
  { feature: "US market adoption", qbo: "Very high", xero: "Growing" },
  { feature: "Interface / UX", qbo: "Feature-rich, can feel complex", xero: "Clean, modern" },
  { feature: "Multi-currency", qbo: "Plus & above", xero: "Standard & above" },
  { feature: "Payroll (US)", qbo: "Gusto or built-in", xero: "Gusto integration" },
  { feature: "Inventory tracking", qbo: "Plus & above", xero: "Standard & above" },
  { feature: "Project tracking", qbo: "Plus & above", xero: "All plans" },
  { feature: "Bank feeds", qbo: "Strong", xero: "Strong" },
  { feature: "Accountant access", qbo: "Widely used by US CPAs", xero: "More common globally" },
  { feature: "Mobile app quality", qbo: "Good", xero: "Very good" },
  { feature: "Customer support", qbo: "Variable", xero: "Generally better rated" },
  { feature: "Receipt capture", qbo: "Add-on only", xero: "Hubdoc included" },
  { feature: "Best for international", qbo: "US-focused", xero: "Strong globally" },
]

export default function QuickBooksVsXero() {
  const publishDate = "2025-02-15"
  const modifiedDate = "2025-04-01"

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "QuickBooks Online vs Xero for Small Business: Honest 2025 Comparison",
    description:
      "An honest comparison of QuickBooks Online vs Xero for small business owners — pricing, features, integrations, and which is best for different industries.",
    author: { "@type": "Organization", name: "BookKeeping.business", url: "https://www.bookkeeping.business" },
    publisher: {
      "@type": "Organization",
      name: "BookKeeping.business",
      url: "https://www.bookkeeping.business",
      logo: { "@type": "ImageObject", url: "https://www.bookkeeping.business/icon.svg" },
    },
    datePublished: publishDate,
    dateModified: modifiedDate,
    url: "https://www.bookkeeping.business/articles/quickbooks-vs-xero-small-business",
    mainEntityOfPage: "https://www.bookkeeping.business/articles/quickbooks-vs-xero-small-business",
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
      { "@type": "ListItem", position: 3, name: "QuickBooks vs Xero", item: "https://www.bookkeeping.business/articles/quickbooks-vs-xero-small-business" },
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
            <span className="text-foreground">QuickBooks vs Xero</span>
          </nav>
        </div>

        <section className="container pb-12">
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="flex items-center gap-3">
              <Badge variant="outline">Tools & Software</Badge>
              <span className="text-xs text-muted-foreground">Updated April 2025 · 12 min read</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">
              QuickBooks Online vs Xero for Small Business: An Honest 2025 Comparison
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              QuickBooks Online and Xero are the two dominant cloud accounting platforms for small businesses
              worldwide. According to BookKeeping.business — which uses both daily across hundreds of clients —
              neither platform is universally better. The right choice depends on your location, industry, team size,
              and how you work with your accountant.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              This article gives you an honest, experience-based comparison — not a vendor marketing summary. We&apos;ll
              cover pricing, features, integrations, and which type of business benefits most from each platform.
            </p>
          </div>
        </section>

        <section className="container pb-16">
          <div className="mx-auto max-w-3xl space-y-10">

            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">The Short Answer: Who Should Use Which?</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-primary" aria-hidden="true" />
                      Choose QuickBooks Online if...
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {[
                      "You are based in the US",
                      "Your CPA already uses QBO",
                      "You need robust US payroll (Gusto / QBO Payroll)",
                      "You have inventory to track",
                      "You are in the restaurant, retail, or construction industry",
                      "You need detailed job/project costing",
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                        <span className="text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Globe2 className="h-4 w-4 text-primary" aria-hidden="true" />
                      Choose Xero if...
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {[
                      "You are based in UK, Australia, NZ, or Canada",
                      "You need multi-currency from day one",
                      "You prefer a cleaner, simpler interface",
                      "You have a small team and need easy collaboration",
                      "You are a freelancer or service-based business",
                      "Your bookkeeper uses Xero internationally",
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                        <span className="text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Pricing Comparison: QuickBooks Online vs Xero</h2>
              <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-4 text-left font-semibold">Plan</th>
                      <th className="p-4 text-left font-semibold">QuickBooks Online</th>
                      <th className="p-4 text-left font-semibold">Xero</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-muted-foreground">
                    <tr><td className="p-4">Entry</td><td className="p-4">Simple Start — $35/mo</td><td className="p-4">Starter — $20/mo</td></tr>
                    <tr><td className="p-4">Mid</td><td className="p-4">Essentials — $65/mo</td><td className="p-4">Standard — $47/mo</td></tr>
                    <tr><td className="p-4">Full</td><td className="p-4">Plus — $99/mo</td><td className="p-4">Premium — $80/mo</td></tr>
                    <tr><td className="p-4">Advanced</td><td className="p-4">Advanced — $235/mo</td><td className="p-4">Ultimate — $115/mo</td></tr>
                    <tr className="bg-primary/5"><td className="p-4 font-medium">With BookKeeping.business</td><td className="p-4 text-primary font-medium">Included in plan</td><td className="p-4 text-primary font-medium">Included in plan</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground">
                Note: Prices listed are retail as of 2025 before promotional discounts. When you use{" "}
                <Link href="/bookkeeping" className="text-primary underline underline-offset-2 hover:opacity-80">
                  BookKeeping.business
                </Link>
                , the software subscription is covered in your monthly fee.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Full Feature Comparison</h2>
              <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-4 text-left font-semibold">Feature</th>
                      <th className="p-4 text-left font-semibold">QuickBooks Online</th>
                      <th className="p-4 text-left font-semibold">Xero</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-muted-foreground">
                    {comparisonData.map(({ feature, qbo, xero }) => (
                      <tr key={feature}>
                        <td className="p-4 font-medium text-foreground">{feature}</td>
                        <td className="p-4">{qbo}</td>
                        <td className="p-4">{xero}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Which Is Better for Specific Industries?</h2>

              <h3 className="text-xl font-bold">Restaurants & Food Service</h3>
              <p className="text-muted-foreground leading-relaxed">
                <strong>QuickBooks Online wins</strong> for US restaurants. QBO has broader integration with restaurant
                POS systems (Toast, Square, Lightspeed), stronger inventory features, and is more familiar to US-based
                restaurant accountants. The Plus or Advanced plan is typically needed for full inventory functionality.
              </p>

              <h3 className="text-xl font-bold">Real Estate & Property Management</h3>
              <p className="text-muted-foreground leading-relaxed">
                <strong>QuickBooks Online Plus</strong> has stronger class tracking and budgeting that works well for
                property-level reporting. However, property management companies with many units often outgrow both
                platforms and need specialized tools like AppFolio or Buildium alongside their bookkeeping software.
              </p>

              <h3 className="text-xl font-bold">Freelancers & Service Businesses</h3>
              <p className="text-muted-foreground leading-relaxed">
                <strong>Xero Standard</strong> is often preferred by freelancers and service businesses for its cleaner
                invoicing workflow, project tracking on all plans, and more intuitive mobile app. QBO Simple Start
                works too but the UI can feel overwhelming for simple service businesses.
              </p>

              <h3 className="text-xl font-bold">International Businesses (UK, Australia, Canada)</h3>
              <p className="text-muted-foreground leading-relaxed">
                <strong>Xero dominates</strong> outside the US. It has higher market share in the UK, Australia, and
                New Zealand, and is better integrated with local payroll, VAT/GST, and banking systems in those
                markets. BookKeeping.business uses Xero exclusively for international clients.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">The Bottom Line: Does It Actually Matter Which One You Choose?</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you are working with a professional bookkeeping service, the platform matters much less than the
                expertise of your bookkeeper. A great bookkeeper using Xero will produce better results than a mediocre
                bookkeeper using QuickBooks — or vice versa.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                At BookKeeping.business, we support both platforms and cover the cost of either. When you onboard, we
                recommend the best platform for your location, industry, and existing setup — and if you want to switch,
                we handle the migration.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                See our{" "}
                <Link href="/bookkeeping" className="text-primary underline underline-offset-2 hover:opacity-80">
                  bookkeeping service plans
                </Link>{" "}
                — software is always included at no extra charge.
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
              <Zap className="mx-auto h-10 w-10 text-primary" aria-hidden="true" />
              <h2 className="text-2xl font-bold">Stop paying for QuickBooks or Xero separately</h2>
              <p className="text-muted-foreground">
                BookKeeping.business covers your accounting software subscription. One flat monthly fee — books,
                payroll, and platform included.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <Link href="/bookkeeping">
                  <Button size="lg">
                    See Bookkeeping Plans
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Button>
                </Link>
                <Link href="/why-us">
                  <Button size="lg" variant="outline" className="bg-transparent">
                    Why BookKeeping.business?
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
