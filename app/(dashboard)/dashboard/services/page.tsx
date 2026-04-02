"use client"

import { type ComponentType, useState } from "react"
import { useSearchParams } from "next/navigation"
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Building2,
  CalendarRange,
  CheckCircle2,
  ClipboardList,
  FileBadge,
  Loader2,
  SearchCheck,
  Shield,
  Sparkles,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ONE_TIME_SERVICES, type ServiceKey } from "@/lib/stripe-plans"

type ServiceCard = {
  key: ServiceKey | "catchup"
  icon: ComponentType<{ className?: string }>
  badge?: string
  includes: string[]
}

type ServiceCategory = {
  id: string
  title: string
  subtitle: string
  audience: string
  timing: string
  services: ServiceCard[]
}

const CATEGORY_STYLES = [
  {
    shell: "border-emerald-200/70 bg-emerald-50/70",
    badge: "border-emerald-300/40 bg-emerald-100/70 text-emerald-800",
    icon: "bg-emerald-500/10 text-emerald-700",
  },
  {
    shell: "border-sky-200/70 bg-sky-50/70",
    badge: "border-sky-300/40 bg-sky-100/70 text-sky-800",
    icon: "bg-sky-500/10 text-sky-700",
  },
  {
    shell: "border-amber-200/70 bg-amber-50/70",
    badge: "border-amber-300/40 bg-amber-100/70 text-amber-800",
    icon: "bg-amber-500/10 text-amber-700",
  },
  {
    shell: "border-violet-200/70 bg-violet-50/70",
    badge: "border-violet-300/40 bg-violet-100/70 text-violet-800",
    icon: "bg-violet-500/10 text-violet-700",
  },
] as const

const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "tax-prep",
    title: "Tax Prep",
    subtitle: "One-time filing work for the current year, prior year catch-up, or year-end form delivery.",
    audience: "Best for owners, couples, and businesses that need a return prepared or worker forms filed without changing their monthly bookkeeping plan.",
    timing: "Order when you need this year's filing completed, last year's return cleaned up, or January form season handled.",
    services: [
      {
        key: "tax_individual",
        icon: BookOpen,
        badge: "Current or Prior Year",
        includes: [
          "Federal 1040 return with schedules",
          "State filing support for the primary state",
          "Organizer review before filing",
          "Secure document checklist after checkout",
        ],
      },
      {
        key: "tax_business",
        icon: ClipboardList,
        badge: "Business Return",
        includes: [
          "1120-S, 1120, or 1065 preparation",
          "Federal and state filing support",
          "K-1 coordination for owners or partners",
          "Books-to-return review before submission",
        ],
      },
      {
        key: "w2_1099_filing",
        icon: FileBadge,
        badge: "Year-End Forms",
        includes: [
          "W-2 or 1099 preparation and e-filing",
          "Recipient copy distribution support",
          "Deadline planning and checklist",
          "One-time year-end compliance engagement",
        ],
      },
    ],
  },
  {
    id: "business-services",
    title: "Business Services",
    subtitle: "Operational and compliance support for active businesses that need one-time help outside the monthly plan.",
    audience: "Best for established businesses that need cleanup, state filings, or payroll implementation without a separate advisory engagement.",
    timing: "Order when you are behind on books, need compliance filings handled, or need payroll turned on correctly this year.",
    services: [
      {
        key: "state_filings_support",
        icon: Shield,
        badge: "Compliance",
        includes: [
          "Annual reports and amendment coordination",
          "State filing checklist and deadlines",
          "Multi-state compliance support",
          "One-time filing package for the current cycle",
        ],
      },
      {
        key: "payroll_setup",
        icon: Users,
        badge: "Payroll Launch",
        includes: [
          "Payroll platform configuration",
          "Pay schedule and direct deposit setup",
          "Employee onboarding baseline",
          "First-run readiness checklist",
        ],
      },
      {
        key: "catchup",
        icon: CalendarRange,
        badge: "Custom Quote",
        includes: [
          "Historical transaction cleanup",
          "Expense categorization and reconciliations",
          "Books brought current for tax or monthly service",
          "Scope priced after file review",
        ],
      },
    ],
  },
  {
    id: "acquisition",
    title: "Acquisition",
    subtitle: "Due diligence support for buyers reviewing a business, file transfer, or takeover before committing.",
    audience: "Best for buyers, investors, or operators reviewing another company’s books before acquiring assets, stock, or clients.",
    timing: "Order before signing, during due diligence, or when inheriting books from another accountant or seller.",
    services: [
      {
        key: "acquisition_file_review",
        icon: SearchCheck,
        badge: "Due Diligence",
        includes: [
          "Financial statement and ledger review",
          "Risk flag summary before purchase",
          "Cash flow and margin readout",
          "Decision memo for handoff discussion",
        ],
      },
    ],
  },
  {
    id: "new-business-opening",
    title: "New Business Opening",
    subtitle: "Formation and first-time setup services for owners starting operations or formalizing a new entity.",
    audience: "Best for founders opening a new LLC, getting their EIN, or setting up core admin systems before first revenue or payroll.",
    timing: "Order when launching a new business this year or formalizing an existing side business into a proper entity.",
    services: [
      {
        key: "llc_formation",
        icon: Building2,
        badge: "Launch Setup",
        includes: [
          "Formation paperwork support",
          "EIN application assistance",
          "Operating agreement template guidance",
          "Kickoff checklist for first-year compliance",
        ],
      },
    ],
  },
]

function formatService(serviceKey: ServiceKey) {
  return ONE_TIME_SERVICES[serviceKey]
}

export default function ServicesPage() {
  const searchParams = useSearchParams()
  const highlight = searchParams.get("highlight")
  const justPaid = searchParams.get("session_id")
  const paidService = searchParams.get("service")
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState("")

  async function handleOrder(serviceKey: ServiceKey | "catchup") {
    if (serviceKey === "catchup") {
      window.location.href = "/contact"
      return
    }

    setLoading(serviceKey)
    setError("")

    const response = await fetch("/api/stripe/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serviceType: serviceKey }),
    })
    const data = await response.json()

    if (!response.ok || !data.url) {
      setError("Failed to start checkout. Please try again.")
      setLoading(null)
      return
    }

    window.location.href = data.url
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(37,99,235,0.14),_transparent_28%),linear-gradient(135deg,_#ffffff,_#f8fafc_55%,_#eef6ff)] p-6 shadow-sm">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.45),transparent)]" />
        <div className="relative space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border-slate-200 bg-white/90 text-slate-700">
              <Sparkles className="mr-1 h-3 w-3" />
              Premium Add-on Services
            </Badge>
            <Badge variant="outline" className="bg-white/70">
              One-time engagements
            </Badge>
          </div>
          <div className="max-w-3xl space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Order specialized services without leaving your client portal.</h1>
            <p className="text-sm leading-6 text-slate-600 md:text-base">
              These are one-time arrangements for the current year, prior year cleanup, launch work, or transaction-specific projects.
              After checkout, our team reviews your order, schedules a kickoff call, and sends the exact document checklist needed to start.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              "Choose the one-time service that matches your current need.",
              "Complete secure checkout or request a quote for larger cleanup work.",
              "Our team schedules the kickoff call and document intake from there.",
            ].map((step, index) => (
              <div key={step} className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-slate-700 shadow-sm">
                <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                  {index + 1}
                </div>
                {step}
              </div>
            ))}
          </div>
        </div>
      </section>

      {justPaid && paidService && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
          <div className="space-y-1">
            <p className="font-semibold text-emerald-950">Service ordered successfully</p>
            <p className="text-sm text-emerald-800">
              Your order is in. Our team will reach out within 1 business day to confirm scope, timing, and the documents needed to start.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {SERVICE_CATEGORIES.map((category, categoryIndex) => {
          const palette = CATEGORY_STYLES[categoryIndex % CATEGORY_STYLES.length]

          return (
            <section key={category.id} className={`rounded-[28px] border p-5 shadow-sm md:p-6 ${palette.shell}`}>
              <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <Badge className={palette.badge}>
                      <BadgeCheck className="mr-1 h-3 w-3" />
                      {category.title}
                    </Badge>
                    <div>
                      <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{category.title}</h2>
                      <p className="mt-2 text-sm leading-6 text-slate-700">{category.subtitle}</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/70 bg-white/80 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Who It&apos;s For</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{category.audience}</p>
                  </div>

                  <div className="rounded-2xl border border-white/70 bg-white/80 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">When To Order</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{category.timing}</p>
                  </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                  {category.services.map(({ key, icon: Icon, badge, includes }) => {
                    const isCatchup = key === "catchup"
                    const service = isCatchup ? null : formatService(key)
                    const isHighlighted = highlight === key

                    return (
                      <Card
                        key={key}
                        className={`border-white/80 bg-white/90 shadow-sm ${isHighlighted ? "ring-2 ring-primary/30" : ""}`}
                      >
                        <CardHeader className="space-y-4 pb-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${palette.icon}`}>
                              <Icon className="h-5 w-5" aria-hidden="true" />
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              {badge && <Badge variant="outline">{badge}</Badge>}
                              <span className="text-xl font-black text-slate-900">
                                {isCatchup ? "Custom Quote" : service?.displayPrice}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <CardTitle className="text-base text-slate-950">
                              {isCatchup ? "Catchup Bookkeeping" : service?.name}
                            </CardTitle>
                            <CardDescription className="text-sm text-slate-600">
                              {isCatchup
                                ? "Historical reconciliation and cleanup for businesses that are behind on their books."
                                : service?.description}
                            </CardDescription>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <ul className="space-y-2">
                            {includes.map((item) => (
                              <li key={item} className="flex gap-2 text-sm text-slate-600">
                                <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>

                          <Button
                            className="w-full"
                            variant={isHighlighted ? "default" : "outline"}
                            disabled={loading === key}
                            onClick={() => handleOrder(key)}
                          >
                            {loading === key ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                                Processing...
                              </>
                            ) : (
                              <>
                                {isCatchup ? "Request a Quote" : "Add to Account"}
                                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                              </>
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
