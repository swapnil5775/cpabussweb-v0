import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Bookkeeping & Tax Service FAQs — Common Questions Answered",
  description:
    "Answers to common questions about our bookkeeping, payroll, and tax services. Learn about pricing, what's included, payroll headcount, AP/AR limits, software costs, and more.",
  keywords: [
    "bookkeeping service FAQ",
    "online bookkeeping questions",
    "what does bookkeeping service include",
    "payroll included bookkeeping",
    "bookkeeping service cost",
    "how much does a bookkeeper cost",
    "small business bookkeeping questions",
    "QuickBooks included bookkeeping service",
    "bookkeeping for restaurants FAQ",
    "tax prep service questions",
  ],
  openGraph: {
    title: "Bookkeeping & Tax Service FAQs | BookKeeping.business",
    description:
      "Common questions about our bookkeeping, payroll, and tax services — pricing, what's included, software costs, and more.",
    url: "https://www.bookkeeping.business/faqs",
  },
  alternates: { canonical: "https://www.bookkeeping.business/faqs" },
}
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Script from "next/script"

export default function FAQsPage() {
  const faqs = [
    {
      category: "General",
      questions: [
        {
          question: "What types of businesses do you serve?",
          answer:
            "We serve a wide range of small businesses including restaurants, cafes, and food service businesses; hotels and hospitality; childcare centers and daycares; tutoring and education centers; real estate agents and realtors; home-based businesses; freelancers and self-employed individuals; retail shops; and general small businesses and LLCs. If you run a business, we can help — contact us to discuss your specific situation.",
        },
        {
          question: "What does 'AI-assisted, human-reviewed' mean?",
          answer:
            "We use AI-powered tools to speed up data entry, categorization, and initial preparation. However, every single document and return is reviewed by an experienced human professional before it's finalized or filed. This gives you the efficiency of technology with the accuracy of human expertise.",
        },
        {
          question: "Who will I work with?",
          answer:
            "You'll be assigned a dedicated account representative who will handle your account throughout the year. For tax returns, a licensed tax professional will prepare and review your filing. For bookkeeping, you'll work with a dedicated bookkeeper who gets to know your business.",
        },
        {
          question: "Do I need to pay for QuickBooks, Gusto, Bill.com, or any other software?",
          answer:
            "No — never. We use QuickBooks Online for bookkeeping, Gusto for payroll, and Bill.com for Accounts Payable and Receivable workflows. All of these are paid for by us as part of our operating stack. You will never receive a separate software invoice or pass-through charge from us. One monthly service fee covers everything — no hidden platform costs, no add-on subscriptions, no surprises.",
        },
        {
          question: "How secure is my data?",
          answer:
            "We use bank-level encryption for all document uploads and storage. Our secure portal maintains a complete audit trail, and we're fully insured with professional liability coverage. Your documents are stored securely for 7 years in compliance with IRS guidelines.",
        },
        {
          question: "How do I get a quote?",
          answer:
            "All quotes are custom and based on the complexity of your situation. Submit the intake form or book a free 15-minute consultation and we'll provide a clear, upfront quote before any work begins. No hidden fees, no surprises.",
        },
      ],
    },
    {
      category: "Tax Preparation",
      questions: [
        {
          question: "When should I start my tax preparation?",
          answer:
            "We recommend starting as soon as you have all your documents, typically in late January or early February. This gives us time for thorough preparation and review. However, we accept clients through mid-April and can handle extension filings if needed.",
        },
        {
          question: "What documents do I need to provide?",
          answer:
            "For individual returns: W-2s, 1099s, receipts for deductions, prior year return. For business returns: financial statements, expense documentation, prior year return, and any K-1s or partnership documents. We'll provide a complete checklist during intake.",
        },
        {
          question: "Do you handle state taxes?",
          answer:
            "Yes! We prepare and e-file state returns for all 50 states. State filing is included for your primary state of operation. Multi-state situations are handled — ask us during your intake call.",
        },
        {
          question: "What if I need to amend a return?",
          answer:
            "We offer amendment support for returns we've prepared. If we made an error, amendments are free. If you provide new information after filing, we charge a reduced fee based on complexity.",
        },
        {
          question: "Can you help with IRS notices?",
          answer:
            "For IRS-related matters, we recommend connecting with an Enrolled Agent (EA) in our group who specializes in IRS correspondence and representation. Reach out to us and we'll refer you to the right person — the sooner you contact us after receiving a notice, the better.",
        },
      ],
    },
    {
      category: "Bookkeeping",
      questions: [
        {
          question: "How does monthly bookkeeping work?",
          answer:
            "Each month, we connect to your bank accounts and credit cards to pull transactions. We categorize everything, reconcile accounts, and provide you with financial reports (P&L and Balance Sheet) typically by the 15th of the following month. You can upload receipts and documents through the portal anytime.",
        },
        {
          question: "What accounting software do you use?",
          answer:
            "We work with QuickBooks Online and Xero. If you don't have accounting software, we'll set it up as part of onboarding. If you're using a different system, contact us to discuss compatibility.",
        },
        {
          question: "Can I see my books in real-time?",
          answer:
            "Yes! You'll have 24/7 access to your accounting software and our secure portal where you can view reports and documents anytime.",
        },
        {
          question: "What if my transaction count varies each month?",
          answer:
            "Our service tiers have flexibility built in. If your transaction volume fluctuates, we won't change your plan every month. If your business grows and volume consistently increases, we'll have a conversation about the right service level for you.",
        },
        {
          question: "How many employees are included in payroll, and what does extra cost?",
          answer:
            "Each plan includes a set number of employees in payroll at no extra charge: Essentials covers the Owner + 1 Employee, Growth covers up to 3 Employees, and Enterprise covers up to 5 Employees. If you have more employees than your plan includes, each additional employee is $10/month. For example, if you're on Growth with 5 employees, the 4th and 5th employees are +$20/month added to your plan price.",
        },
        {
          question: "What happens if I hire more employees during the year?",
          answer:
            "No problem — just let us know and we'll update your payroll setup in Gusto and adjust your billing accordingly. The additional employee add-on is $10/month per employee beyond what your plan includes. There's no onboarding fee for adding employees mid-year.",
        },
        {
          question: "What is Accounts Payable & Receivable (AP/AR) and which plan includes it?",
          answer:
            "AP/AR management means we handle vendor bill payments (Accounts Payable) and client invoice tracking and collections (Accounts Receivable) on your behalf using Bill.com. This is included in the Enterprise plan, which covers 15 ACH payments and 15 mailed checks per month at no extra cost. If your volume exceeds those limits, additional transactions are billed at cost with no markup. AP/AR is not included in Essentials or Growth — contact us if you need it added. See the full fee schedule at bookkeeping.business/ap-ar-fees.",
        },
        {
          question: "What if I need more than 15 ACH or 15 mailed checks in a month on Enterprise?",
          answer:
            "The Enterprise plan includes 15 ACH transactions and 15 mailed checks per month. If you exceed those limits, overages are billed at Bill.com's standard published rates — passed through at cost with zero markup. For example, a standard ACH is $0.59 and a mailed check is $1.99. There are no surprise charges — we notify you if your volume is trending above your included limits. For very high AP/AR volume, reach out to discuss a custom arrangement. Full rate details are at bookkeeping.business/ap-ar-fees.",
        },
      ],
    },
    {
      category: "Accounts Payable & Receivable (AP/AR)",
      questions: [
        {
          question: "Which plan includes AP/AR management?",
          answer:
            "AP/AR management is included exclusively in the Enterprise plan ($499/month). This covers full accounts payable automation (vendor bill processing, approval workflows, payment scheduling), accounts receivable management (invoice creation, delivery, online payment links, reminders, and cash application), and 30/60/90-day cash flow forecasting. Essentials and Growth plans do not include AP/AR — contact us if you need it added at a different tier.",
        },
        {
          question: "What exactly is Accounts Payable (AP) management?",
          answer:
            "Accounts Payable management means we handle everything related to bills your business owes to vendors and suppliers. We capture incoming bills, code them to the correct account, route them for your approval, and schedule payments via ACH or mailed check. The Enterprise plan includes 15 ACH payments and 15 mailed checks per month. Every payment syncs back to QuickBooks automatically — no manual reconciliation required.",
        },
        {
          question: "What exactly is Accounts Receivable (AR) management?",
          answer:
            "Accounts Receivable management means we handle invoicing your customers and collecting what you're owed. We create professional invoices, deliver them by email with an online payment link (customers can pay by ACH or card), send automated reminders for overdue invoices, and apply payments when they come in. You also get a weekly AR aging report so you always know what's outstanding and who's overdue — without chasing anyone yourself.",
        },
        {
          question: "Do you do cash flow forecasting, and how does it work?",
          answer:
            "Yes — cash flow forecasting is included in the Enterprise plan as part of AP/AR management. Because we manage both your incoming invoices (AR) and outgoing bill payments (AP), we have a real-time view of your actual cash position. We produce 30, 60, and 90-day cash flow projections that show scheduled bills versus expected customer collections, giving you a clear runway view. Monthly cash flow reviews are included with your dedicated account manager.",
        },
        {
          question: "What happens if I exceed the included 15 ACH or 15 check payments per month?",
          answer:
            "Overages beyond the 15 ACH and 15 mailed check monthly allowance are billed at published platform rates — passed through at cost with zero markup. We notify you proactively if your volume is trending above the included limits so there are never surprise charges at month-end. For businesses with consistently high AP volume, contact us to discuss a custom arrangement.",
        },
        {
          question: "Is AP/AR available for law firms and property management companies?",
          answer:
            "Yes — and these are two of the most common use cases. Law firms use AP/AR management for tracking client disbursements, vendor invoices, and trust account payables. Property management firms use it to manage vendor payments (maintenance, contractors), collect rent invoices from tenants, and forecast monthly cash position across multiple properties. Our team is experienced with both industries.",
        },
        {
          question: "Do I need to be on QuickBooks to use AP/AR?",
          answer:
            "AP/AR is optimized for QuickBooks Online — which is included at no extra cost in the Enterprise plan. Xero is supported for international clients. All bill payments, invoices, and collections sync to your accounting platform in real time. If you're currently on a different platform, we'll migrate you during onboarding at no charge.",
        },
      ],
    },
    {
      category: "Business Services",
      questions: [
        {
          question: "Can you help me form an LLC?",
          answer:
            "We can assist with the process of LLC formation, including helping you understand requirements, prepare documents, and apply for an EIN. However, we do not provide legal advice. For legal questions about business structure or contracts, consult a licensed attorney.",
        },
        {
          question: "What are quarterly check-ins?",
          answer:
            "Quarterly check-ins are optional 30-minute calls included with bookkeeping and business service packages. We review your financial performance, discuss tax planning strategies, and provide business guidance. These are scheduled at your convenience.",
        },
        {
          question: "Do you help with business purchases?",
          answer:
            "Yes! Our acquisition file review service provides financial analysis of a business you're considering purchasing. We review financial statements, identify red flags, and provide a report on the financial health and risks. This is custom-priced based on complexity.",
        },
        {
          question: "Can you act as my registered agent?",
          answer:
            "We don't serve as registered agents ourselves, but we can assist you with finding and updating your registered agent, ensuring compliance, and handling related paperwork.",
        },
      ],
    },
  ]

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.flatMap((cat) =>
      cat.questions.map((faq) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer,
        },
      }))
    ),
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">Frequently Asked Questions</h1>
            <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
              Find answers to common questions about our services and process.
            </p>
          </div>
        </section>

        {/* FAQs by Category */}
        <section className="container pb-24">
          <div className="max-w-3xl mx-auto space-y-12">
            {faqs.map((category) => (
              <div key={category.category} className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight">{category.category}</h2>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, index) => (
                    <AccordionItem key={index} value={`${category.category}-${index}`}>
                      <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </section>

        {/* Still Have Questions */}
        <section className="border-t border-border bg-muted/30 py-24">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-balance">Still Have Questions?</h2>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                We're happy to answer any questions you have. Book a free 15-minute call or send us a message.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg">
                    Contact Us
                    <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/services">
                  <Button size="lg" variant="outline" className="bg-transparent">
                    View Services
                  </Button>
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
