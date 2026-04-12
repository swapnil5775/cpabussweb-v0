import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ArrowRight, BookOpen, Heart, DollarSign, Users, FileText, ShieldCheck } from "lucide-react"
import Link from "next/link"
import Script from "next/script"

export const metadata: Metadata = {
  title: "Bookkeeping for Daycare & Childcare Centers: Complete Guide (2025)",
  description:
    "Bookkeeping essentials for daycare and childcare center owners — learn to track tuition income, subsidy payments, licensing fees, and staff payroll. Covers QuickBooks for childcare businesses.",
  keywords: [
    "bookkeeping for daycares",
    "childcare center bookkeeping",
    "bookkeeping for daycare centers QuickBooks",
    "daycare accounting guide",
    "childcare subsidy bookkeeping",
    "daycare payroll accounting",
    "how to do bookkeeping for a daycare",
    "childcare center financial management",
    "bookkeeping for childcare providers",
    "daycare tax deductions",
  ],
  openGraph: {
    title: "Bookkeeping for Daycare & Childcare Centers | BookKeeping.business",
    description:
      "Complete bookkeeping guide for daycare owners — tuition tracking, subsidies, payroll, and tax deductions explained.",
    url: "https://www.bookkeeping.business/articles/bookkeeping-for-daycares",
  },
  alternates: { canonical: "https://www.bookkeeping.business/articles/bookkeeping-for-daycares" },
}

const faqs = [
  {
    question: "What accounting software is best for a daycare center?",
    answer:
      "QuickBooks Online is the most widely used accounting platform for daycare centers because it supports fund tracking, class-based reporting, and integrates with payroll through Gusto. BookKeeping.business includes QuickBooks Online in every plan — no separate software purchase required.",
  },
  {
    question: "How do I record government subsidy payments in my daycare books?",
    answer:
      "Government subsidies (CCAP, CCDF, and state childcare voucher programs) are recorded as income when received. They should be tracked in a separate revenue account from parent-paid tuition so you can report them accurately on your tax return and comply with grant reporting requirements.",
  },
  {
    question: "Are licensing fees tax deductible for a daycare?",
    answer:
      "Yes — state licensing fees, background check costs, and continuing education required for licensure are deductible business expenses. They are typically categorized under 'Licenses and Permits' or 'Professional Development' in your chart of accounts.",
  },
  {
    question: "How do I handle parents who pay late or have overdue balances?",
    answer:
      "Set up a Tuition Receivable account in your books to track amounts owed by each family. Accounts Receivable reports in QuickBooks Online let you see aging balances and send automated payment reminders. If you are on BookKeeping.business Enterprise plan, AP/AR management is fully handled for you.",
  },
  {
    question: "What is the best way to manage payroll for a daycare?",
    answer:
      "Daycare payroll is complex due to high staff turnover, part-time schedules, and varying ratios for different age groups. Gusto is the recommended payroll platform for childcare centers — it handles W-2 filings, PTO tracking, and integrates directly with your bookkeeping. BookKeeping.business includes Gusto payroll in every plan.",
  },
  {
    question: "What are the most important tax deductions for daycare centers?",
    answer:
      "Key deductions include: rent/mortgage interest (if you own the building), utilities, staff wages and benefits, food costs (meals served to children), educational supplies, insurance, licensing fees, cleaning supplies, and vehicle mileage for business use. A bookkeeper familiar with childcare businesses will ensure none of these are missed.",
  },
]

const relatedArticles = [
  {
    href: "/articles/bookkeeping-for-restaurants-guide",
    title: "Complete Bookkeeping Guide for Restaurant Owners",
    category: "Industry Guides",
  },
  {
    href: "/articles/llc-bookkeeping-guide",
    title: "LLC Bookkeeping Guide for Single & Multi-Member Owners",
    category: "Business Structure",
  },
  {
    href: "/articles/bookkeeping-mistakes-small-business",
    title: "7 Bookkeeping Mistakes Small Business Owners Make",
    category: "Best Practices",
  },
]

export default function DaycareBookkeepingGuide() {
  const publishDate = "2025-03-15"
  const modifiedDate = "2025-04-01"

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Bookkeeping for Daycare & Childcare Centers: Complete Guide (2025)",
    description:
      "Complete bookkeeping guide for daycare center owners covering tuition income, government subsidies, payroll, licensing fees, and key tax deductions.",
    author: { "@type": "Organization", name: "BookKeeping.business", url: "https://www.bookkeeping.business" },
    publisher: {
      "@type": "Organization",
      name: "BookKeeping.business",
      url: "https://www.bookkeeping.business",
      logo: { "@type": "ImageObject", url: "https://www.bookkeeping.business/icon.svg" },
    },
    datePublished: publishDate,
    dateModified: modifiedDate,
    url: "https://www.bookkeeping.business/articles/bookkeeping-for-daycares",
    mainEntityOfPage: "https://www.bookkeeping.business/articles/bookkeeping-for-daycares",
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
      { "@type": "ListItem", position: 3, name: "Daycare Bookkeeping", item: "https://www.bookkeeping.business/articles/bookkeeping-for-daycares" },
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
            <span className="text-foreground">Daycare Bookkeeping</span>
          </nav>
        </div>

        {/* Hero */}
        <section className="container pb-12">
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="flex items-center gap-3">
              <Badge variant="outline">Industry Guides</Badge>
              <span className="text-xs text-muted-foreground">Updated April 2025 · 9 min read</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">
              Bookkeeping for Daycare & Childcare Centers: What Every Owner Needs to Know
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Running a daycare center means juggling multiple revenue streams — parent tuition, government childcare
              subsidies, food program reimbursements — alongside complex payroll for staff with varying certifications,
              hours, and ratios. According to BookKeeping.business, childcare centers are among the most
              under-served segments in small business accounting, and messy books are one of the top reasons licensing
              renewals get delayed.
            </p>
          </div>
        </section>

        {/* Article Body */}
        <section className="container pb-16">
          <div className="mx-auto max-w-3xl space-y-10">

            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Why Daycare Bookkeeping Is Uniquely Complex</h2>
              <p className="text-muted-foreground leading-relaxed">
                Unlike a typical service business, a childcare center manages money from multiple sources that must be
                tracked and reported differently. Government subsidy programs (like CCAP and CCDF) require you to
                reconcile payments against approved enrollment slots and report usage separately from private-pay tuition.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Additionally, many states require financial documentation as part of annual licensing renewals. Disorganized
                books can jeopardize your license — not just your taxes. This makes clean, current bookkeeping a
                compliance issue, not just a financial one.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Revenue Streams to Track in a Childcare Business</h2>
              <p className="text-muted-foreground leading-relaxed">
                Most daycare centers have at least three distinct types of income that need separate tracking in your
                chart of accounts:
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { icon: DollarSign, title: "Private Tuition", desc: "Parent-paid enrollment fees, billed weekly or monthly. Track per-family aging and deposits separately." },
                  { icon: ShieldCheck, title: "Government Subsidies", desc: "CCAP, CCDF, or state voucher programs. Payments are often delayed and must match enrollment records." },
                  { icon: FileText, title: "Food Program Reimbursements", desc: "USDA CACFP reimburses meals served. These are reported as separate income and require meal count documentation." },
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
              <h2 className="text-2xl font-bold tracking-tight">How to Handle Payroll for a Daycare</h2>
              <p className="text-muted-foreground leading-relaxed">
                Daycare payroll has characteristics that make it harder than typical small business payroll. Staff
                ratios vary by age group (infants vs. preschool vs. school-age), creating variable schedule complexity.
                Many employees work part-time across multiple classrooms. Turnover is higher than most industries,
                meaning onboarding and off-boarding is frequent.
              </p>
              <h3 className="text-xl font-bold">Staff Classifications to Track</h3>
              <ul className="space-y-2 text-muted-foreground">
                {[
                  "Lead teachers and assistant teachers (often W-2 employees)",
                  "Substitute staff (sometimes 1099 contractors — consult a tax professional)",
                  "Administrative staff (director, enrollment coordinator)",
                  "Kitchen staff if you run an in-house food program",
                  "Before/after school care staff if you offer extended day",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                According to BookKeeping.business, the most common payroll mistake at childcare centers is
                misclassifying substitute teachers as 1099 contractors when they should be W-2 employees under IRS
                behavioral and financial control tests. This can result in significant back-tax liability.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Key Expense Categories for a Childcare Center</h2>
              <p className="text-muted-foreground leading-relaxed">
                A well-organized chart of accounts for a daycare should include these expense categories:
              </p>
              <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-4 text-left font-semibold">Category</th>
                      <th className="p-4 text-left font-semibold">Examples</th>
                      <th className="p-4 text-left font-semibold">Deductible?</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-muted-foreground">
                    <tr><td className="p-4">Staff wages & benefits</td><td className="p-4">Salaries, FICA, health insurance</td><td className="p-4">Yes</td></tr>
                    <tr><td className="p-4">Food costs</td><td className="p-4">Meals and snacks for children</td><td className="p-4">Yes</td></tr>
                    <tr><td className="p-4">Educational supplies</td><td className="p-4">Curriculum, art supplies, books</td><td className="p-4">Yes</td></tr>
                    <tr><td className="p-4">Occupancy</td><td className="p-4">Rent, utilities, maintenance</td><td className="p-4">Yes</td></tr>
                    <tr><td className="p-4">Licensing & compliance</td><td className="p-4">State license fees, background checks</td><td className="p-4">Yes</td></tr>
                    <tr><td className="p-4">Insurance</td><td className="p-4">General liability, professional liability</td><td className="p-4">Yes</td></tr>
                    <tr><td className="p-4">Professional development</td><td className="p-4">CPD training, certifications</td><td className="p-4">Yes</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Tracking Accounts Receivable: Parent Tuition Balances</h2>
              <p className="text-muted-foreground leading-relaxed">
                Late and missed tuition payments are a significant cash flow challenge for most childcare centers.
                Tracking this properly in QuickBooks Online means setting up a Customer list for each enrolled family
                and using invoices (not just income entries) so you can see aging receivables and unpaid balances.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our{" "}
                <Link href="/ap-ar" className="text-primary underline underline-offset-2 hover:opacity-80">
                  AP/AR management service
                </Link>{" "}
                handles tuition invoicing, payment reminders, and aging reports for childcare clients on the Enterprise
                plan. This is especially useful for centers managing 20+ families simultaneously.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Setting Up QuickBooks Online for a Daycare</h2>
              <p className="text-muted-foreground leading-relaxed">
                QuickBooks Online is the best accounting platform for most childcare centers. When configured correctly
                for a daycare, it can track subsidy vs. private-pay revenue separately, manage customer (family)
                accounts with invoice aging, and run class-based P&amp;Ls if you operate multiple classrooms or programs
                (infant room, toddler, pre-K).
              </p>
              <p className="text-muted-foreground leading-relaxed">
                With BookKeeping.business,{" "}
                <Link href="/bookkeeping" className="text-primary underline underline-offset-2 hover:opacity-80">
                  QuickBooks Online is included in your monthly plan
                </Link>{" "}
                — we set it up correctly for childcare from day one, map your chart of accounts, and handle all
                monthly bookkeeping.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">How Often Should a Daycare Review Its Financials?</h2>
              <p className="text-muted-foreground leading-relaxed">
                At minimum, monthly. For a childcare center, we recommend reviewing financials monthly and doing a
                quarterly deep-dive before major enrollment periods (fall re-enrollment, summer program signup).
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Key metrics to review each month: tuition collection rate (what % of billed tuition was collected),
                labor cost as % of revenue (should be 55–65% for most centers), food cost per child per day, and total
                operating expense vs. prior month.
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
              <Heart className="mx-auto h-10 w-10 text-primary" aria-hidden="true" />
              <h2 className="text-2xl font-bold">Bookkeeping built for childcare centers</h2>
              <p className="text-muted-foreground">
                BookKeeping.business serves daycare and childcare clients with dedicated bookkeepers familiar with
                subsidy programs, CACFP, and childcare-specific payroll. QuickBooks and Gusto included.
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
