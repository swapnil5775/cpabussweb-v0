import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowRight, BookOpen } from "lucide-react"
import Link from "next/link"
import Script from "next/script"

export const metadata: Metadata = {
  title: "Small Business Bookkeeping & Accounting Articles | BookKeeping.business",
  description:
    "Expert guides on bookkeeping, accounting, and financial management for small business owners — restaurants, daycares, real estate investors, LLCs, and more.",
  keywords: [
    "small business bookkeeping guides",
    "accounting articles for small business",
    "bookkeeping tips small business owners",
    "how to do bookkeeping restaurant",
    "LLC accounting guide",
    "real estate bookkeeping articles",
    "QuickBooks vs Xero comparison",
    "financial statements explained",
    "bookkeeping mistakes to avoid",
    "childcare center accounting guide",
  ],
  openGraph: {
    title: "Small Business Bookkeeping Articles | BookKeeping.business",
    description:
      "Expert bookkeeping and accounting guides for small business owners — restaurants, real estate, LLCs, daycares, and more.",
    url: "https://www.bookkeeping.business/articles",
  },
  alternates: { canonical: "https://www.bookkeeping.business/articles" },
}

const articles = [
  {
    slug: "bookkeeping-for-restaurants-guide",
    title: "The Complete Bookkeeping Guide for Restaurant Owners (2025)",
    description:
      "Learn to track COGS, manage tip reporting, handle payroll, and keep clean books. Covers food cost %, POS reconciliation, and QuickBooks for restaurants.",
    category: "Industry Guides",
    readTime: "10 min",
    featured: true,
  },
  {
    slug: "bookkeeping-for-daycares",
    title: "Bookkeeping for Daycare & Childcare Centers: What Every Owner Needs to Know",
    description:
      "Tuition tracking, government subsidy accounting, CACFP food program, staff payroll, and key tax deductions for childcare business owners.",
    category: "Industry Guides",
    readTime: "9 min",
    featured: true,
  },
  {
    slug: "real-estate-investor-bookkeeping",
    title: "Real Estate Investor Bookkeeping: Structure Your Books for Maximum Tax Savings",
    description:
      "Property-level tracking, depreciation, Schedule E, 1031 exchanges, and the CapEx vs. repairs distinction that determines your tax bill.",
    category: "Industry Guides",
    readTime: "11 min",
    featured: true,
  },
  {
    slug: "quickbooks-vs-xero-small-business",
    title: "QuickBooks Online vs Xero for Small Business: An Honest 2025 Comparison",
    description:
      "Side-by-side comparison of pricing, features, integrations, and which platform is better for different industries and regions.",
    category: "Tools & Software",
    readTime: "12 min",
    featured: false,
  },
  {
    slug: "how-to-read-financial-statements",
    title: "How to Read Financial Statements: A Plain-English Guide for Small Business Owners",
    description:
      "What your P&L, balance sheet, and cash flow statement are actually telling you — explained without jargon for business owners.",
    category: "Financial Literacy",
    readTime: "13 min",
    featured: false,
  },
  {
    slug: "bookkeeping-mistakes-small-business",
    title: "7 Bookkeeping Mistakes Small Business Owners Make (And How to Fix Them)",
    description:
      "The most common errors — mixing personal and business finances, not reconciling, losing receipts, misclassifying expenses — and exactly how to fix each one.",
    category: "Best Practices",
    readTime: "10 min",
    featured: false,
  },
  {
    slug: "llc-bookkeeping-guide",
    title: "LLC Bookkeeping Guide: Single-Member & Multi-Member LLCs (2025)",
    description:
      "Owner draws vs. salary, capital accounts, profit allocation, S-Corp election timing, and what records every LLC must maintain.",
    category: "Business Structure",
    readTime: "11 min",
    featured: false,
  },
]

const categories = ["All", "Industry Guides", "Tools & Software", "Financial Literacy", "Best Practices", "Business Structure"]

const categoryColors: Record<string, string> = {
  "Industry Guides": "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800/30",
  "Tools & Software": "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-800/30",
  "Financial Literacy": "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800/30",
  "Best Practices": "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800/30",
  "Business Structure": "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-800/30",
}

export default function ArticlesIndex() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.bookkeeping.business" },
      { "@type": "ListItem", position: 2, name: "Articles", item: "https://www.bookkeeping.business/articles" },
    ],
  }

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Small Business Bookkeeping & Accounting Articles",
    description: "Expert guides on bookkeeping, accounting, and financial management for small business owners.",
    url: "https://www.bookkeeping.business/articles",
    publisher: {
      "@type": "Organization",
      name: "BookKeeping.business",
      url: "https://www.bookkeeping.business",
    },
  }

  const featuredArticles = articles.filter((a) => a.featured)
  const remainingArticles = articles.filter((a) => !a.featured)

  return (
    <div className="flex min-h-screen flex-col">
      <Script id="breadcrumb-schema" type="application/ld+json" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Script id="collection-schema" type="application/ld+json" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      <SiteHeader />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="container py-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground">Articles</span>
          </nav>
        </div>

        {/* Hero */}
        <section className="container pb-12">
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <Badge variant="outline" className="px-4 py-1.5">Learning Resources</Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">
              Small Business Bookkeeping & Accounting Guides
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
              Expert guides written by the bookkeepers at BookKeeping.business — covering industry-specific accounting,
              financial literacy, and best practices for small business owners.
            </p>
            <p className="text-sm text-muted-foreground">
              {articles.length} articles across {categories.length - 1} categories
            </p>
          </div>
        </section>

        {/* Featured Articles */}
        <section className="container pb-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-xl font-bold mb-6">Industry Guides</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredArticles.map((article) => (
                <Link key={article.slug} href={`/articles/${article.slug}`} className="group block">
                  <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-0.5">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${categoryColors[article.category] ?? ""}`}>
                          {article.category}
                        </span>
                        <span className="text-xs text-muted-foreground">{article.readTime} read</span>
                      </div>
                      <CardTitle className="text-base font-bold leading-snug group-hover:text-primary transition-colors">
                        {article.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <CardDescription className="text-sm leading-relaxed">{article.description}</CardDescription>
                      <span className="text-xs text-primary flex items-center gap-1 font-medium">
                        Read article <ArrowRight className="h-3 w-3" aria-hidden="true" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* All Articles */}
        <section className="container pb-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-xl font-bold mb-6">All Articles</h2>
            <div className="grid md:grid-cols-2 gap-5">
              {remainingArticles.map((article) => (
                <Link key={article.slug} href={`/articles/${article.slug}`} className="group block">
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${categoryColors[article.category] ?? ""}`}>
                          {article.category}
                        </span>
                        <span className="text-xs text-muted-foreground">{article.readTime} read</span>
                      </div>
                      <CardTitle className="text-base font-bold leading-snug group-hover:text-primary transition-colors">
                        {article.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <CardDescription className="text-sm leading-relaxed">{article.description}</CardDescription>
                      <span className="text-xs text-primary flex items-center gap-1 font-medium">
                        Read article <ArrowRight className="h-3 w-3" aria-hidden="true" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border bg-muted/30 py-20">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center space-y-6">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" aria-hidden="true" />
              <h2 className="text-3xl font-bold tracking-tight text-balance">Ready to get your books in order?</h2>
              <p className="text-muted-foreground leading-relaxed">
                BookKeeping.business provides monthly bookkeeping, payroll, and tax services for the exact business
                types covered in these guides — starting at $249/month with all software included.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
              <p className="text-xs text-muted-foreground">No credit card required · Cancel anytime</p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
