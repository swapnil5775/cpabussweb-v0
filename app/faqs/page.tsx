import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "FAQs - Tax Prep, Bookkeeping & Business Services Questions | BookKeeping.business",
  description:
    "Answers to frequently asked questions about our tax preparation, bookkeeping services, pricing, security, and process. Learn how we combine AI assistance with human expertise.",
  keywords: [
    "bookkeeping FAQ",
    "tax preparation questions",
    "online bookkeeping help",
    "small business accounting FAQ",
    "tax filing questions",
    "bookkeeping service pricing",
    "AI bookkeeping questions",
  ],
  openGraph: {
    title: "FAQs - Tax Prep, Bookkeeping & Business Services Questions | BookKeeping.business",
    description:
      "Find answers to common questions about our tax preparation, bookkeeping services, pricing, and process.",
    url: "https://bookkeeping.business/faqs",
  },
}
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function FAQsPage() {
  const faqs = [
    {
      category: "General",
      questions: [
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
          question: "How secure is my data?",
          answer:
            "We use bank-level encryption for all document uploads and storage. Our secure portal maintains a complete audit trail, and we're fully insured with professional liability coverage. Your documents are stored securely for 7 years in compliance with IRS guidelines.",
        },
        {
          question: "What is your pricing structure?",
          answer:
            "We offer transparent, upfront pricing based on the complexity of your situation. Individual tax returns start at $149, bookkeeping starts at $75/month, and business returns start at $800. We'll provide a clear quote before starting work, and there are no hidden fees.",
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
            "Yes! We prepare and e-file state returns for all 50 states. State filing is included in our base pricing for one state. Additional states are $100 per state return.",
        },
        {
          question: "What if I need to amend a return?",
          answer:
            "We offer amendment support for returns we've prepared. If we made an error, amendments are free. If you provide new information after filing, we charge a reduced fee based on complexity.",
        },
        {
          question: "Can you help with IRS notices?",
          answer:
            "Yes, we can help you understand and respond to IRS notices. This is billed separately as it requires additional research and correspondence work. Contact us as soon as you receive a notice.",
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
            "Our pricing tiers have some flexibility built in. If you occasionally go over your tier limit, we won't immediately raise your rate. However, if your volume consistently increases, we'll discuss moving you to the appropriate tier.",
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

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">Frequently Asked Questions</h1>
            <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
              Find answers to common questions about our services, pricing, and process.
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
                    <ArrowRight className="ml-2 h-4 w-4" />
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
