import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Smartphone,
  Globe,
  FolderLock,
  MessageSquare,
  Bell,
  CheckSquare,
  PenTool,
  FileCheck,
  CreditCard,
  Receipt,
  Activity,
  Clock,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Client Portal & Mobile App - Secure Document Management | BookKeeping.business",
  description:
    "Upload documents, track progress, message your team, e-sign, and pay invoices — all in one secure portal. Access via web or mobile app. Bank-level encryption included.",
  keywords: [
    "secure client portal",
    "bookkeeping portal",
    "document upload portal",
    "mobile bookkeeping app",
    "e-sign documents",
    "secure file sharing",
    "client accounting portal",
    "tax document storage",
  ],
  openGraph: {
    title: "Client Portal & Mobile App | BookKeeping.business",
    description:
      "Upload documents, track progress, message your team, e-sign, and pay invoices — all in one secure portal.",
    url: "https://bookkeeping.business/client-portal",
  },
}

const features = [
  {
    title: "Secure Access (Web + Mobile)",
    description: "Access your portal anytime, anywhere",
    icon: Globe,
    items: [
      "Client Portal Login (web)",
      "Mobile App Access (iOS/Android)",
      "One place for tasks, documents, invoices",
    ],
  },
  {
    title: "Document Vault",
    description: "Your files, organized and protected",
    icon: FolderLock,
    items: [
      "Encrypted document upload & storage",
      "Organized folders (year/month/category)",
      "Always-available access to your files",
    ],
  },
  {
    title: "Communication & Collaboration",
    description: "Stay connected with your team",
    icon: MessageSquare,
    items: [
      "Secure messaging with your team",
      "Notifications and reminders",
      "Clear to-do list and request tracking",
    ],
  },
  {
    title: "E-Sign & Approvals",
    description: "Sign documents digitally",
    icon: PenTool,
    items: [
      "E-sign engagement letters and forms",
      "Approve documents without printing/scanning",
      "Track signature status",
    ],
  },
  {
    title: "Billing & Payments",
    description: "Manage invoices and payments",
    icon: CreditCard,
    items: [
      "View invoices inside the portal",
      "Pay online securely",
      "Download receipts and payment history",
    ],
  },
  {
    title: "Visibility & Tracking",
    description: "Know where things stand",
    icon: Activity,
    items: [
      "Status updates for your work",
      "Activity history (who did what and when)",
      "Clear next steps at every stage",
    ],
  },
]

const steps = [
  {
    number: "1",
    title: "Submit Intake",
    description: "Complete our intake form with your business and service details.",
    icon: CheckSquare,
  },
  {
    number: "2",
    title: "Get Portal Invite",
    description: "Receive your secure portal login via email within 24-48 hours.",
    icon: Bell,
  },
  {
    number: "3",
    title: "Upload + Track + Approve",
    description: "Upload documents, track progress, and e-sign approvals—all in one place.",
    icon: FileCheck,
  },
  {
    number: "4",
    title: "We Deliver + Store",
    description: "We complete your books/taxes and store everything securely for you.",
    icon: Receipt,
  },
]

const faqs = [
  {
    question: "Is my data secure?",
    answer:
      "Yes. All data is encrypted using bank-level 256-bit encryption both in transit and at rest. We use secure servers with regular security audits and never request sensitive documents through email.",
  },
  {
    question: "Can I use it on my phone?",
    answer:
      "Yes. Our mobile app is available for both iOS and Android devices. You can upload documents, view reports, message your team, and manage your account from anywhere.",
  },
  {
    question: "Do I have to email documents?",
    answer:
      "No—and we strongly recommend against it. All document uploads should go through your secure portal. This ensures encryption and creates a proper audit trail for your records.",
  },
  {
    question: "Can multiple people from my business access the portal?",
    answer:
      "Yes. We can set up multiple user accounts for your business with appropriate access levels. Just let your account rep know who needs access during onboarding.",
  },
  {
    question: "What if I'm behind on bookkeeping?",
    answer:
      "No problem. We offer catchup bookkeeping services to get you current. We'll reconcile your historical transactions, organize your records, and then transition you to ongoing monthly service.",
  },
]

export default function ClientPortalPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <Badge variant="outline" className="px-4 py-1.5">
              Client Portal & Mobile App
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">
              One Secure Portal for Your Books and Taxes
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
              Upload documents, track progress, message your team, e-sign, and pay invoices — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/contact">
                <Button size="lg">
                  Start Intake
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="bg-transparent" asChild>
                <a href="#features">See What's Included</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="border-t border-border bg-muted/30 py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
                Everything You Need in One Place
              </h2>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                A complete platform for managing your books, taxes, documents, and communication
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {features.map((feature) => (
                <Card key={feature.title}>
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {feature.items.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="container py-24">
          <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">How It Works</h2>
            <p className="text-muted-foreground leading-relaxed text-pretty">
              Getting started is simple—here's what to expect
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            {steps.map((step) => (
              <div key={step.number} className="text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground mx-auto text-2xl font-bold">
                  {step.number}
                </div>
                <h3 className="font-semibold text-lg">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mobile App Highlight */}
        <section className="border-t border-border bg-muted/30 py-24">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <Card className="overflow-hidden">
                <div className="grid md:grid-cols-2">
                  <CardContent className="p-8 md:p-12 flex flex-col justify-center space-y-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Smartphone className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold">Access on Any Device</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Our mobile app lets you upload receipts on the go, check on your work status, message your team,
                      and approve documents—right from your phone.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span>Available on iOS and Android</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span>Upload photos of receipts instantly</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span>Push notifications for updates</span>
                      </li>
                    </ul>
                  </CardContent>
                  <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-8 md:p-12 flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="space-y-2 p-4 rounded-lg bg-background/80">
                        <Clock className="h-8 w-8 mx-auto text-primary" />
                        <p className="text-xs text-muted-foreground">Real-time updates</p>
                      </div>
                      <div className="space-y-2 p-4 rounded-lg bg-background/80">
                        <Bell className="h-8 w-8 mx-auto text-primary" />
                        <p className="text-xs text-muted-foreground">Push notifications</p>
                      </div>
                      <div className="space-y-2 p-4 rounded-lg bg-background/80">
                        <FolderLock className="h-8 w-8 mx-auto text-primary" />
                        <p className="text-xs text-muted-foreground">Secure storage</p>
                      </div>
                      <div className="space-y-2 p-4 rounded-lg bg-background/80">
                        <PenTool className="h-8 w-8 mx-auto text-primary" />
                        <p className="text-xs text-muted-foreground">E-sign anywhere</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="container py-24">
          <div className="mx-auto max-w-3xl text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">Frequently Asked Questions</h2>
            <p className="text-muted-foreground leading-relaxed text-pretty">
              Common questions about our client portal
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Security Disclaimer */}
        <section className="border-t border-border bg-muted/30 py-12">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-2">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Security features include encrypted transfer and controlled access. We do not request sensitive
                documents through email.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-balance">Ready to Get Started?</h2>
              <p className="text-lg leading-relaxed text-pretty opacity-90">
                Submit your intake form and we'll set up your secure portal access within 24-48 hours.
              </p>
              <Link href="/contact">
                <Button size="lg" variant="secondary">
                  Start Your Intake
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
