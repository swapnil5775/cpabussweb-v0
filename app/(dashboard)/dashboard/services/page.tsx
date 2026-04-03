"use client"

import { type ComponentType, useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Building2,
  CalendarRange,
  CheckCircle2,
  ClipboardList,
  FileBadge,
  Loader2,
  SearchCheck,
  Shield,
  Timer,
  TrendingUp,
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

const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "tax-prep",
    title: "Tax Prep",
    subtitle: "One-time filing services for current-year filing, prior-year cleanup, and year-end form work.",
    audience: "Owners and businesses that need filing support without changing monthly bookkeeping plans.",
    timing: "Use this when you need filing this year, prior-year returns cleaned up, or January form compliance.",
    services: [
      {
        key: "tax_individual",
        icon: BookOpen,
        badge: "Current or Prior Year",
        includes: [
          "Federal 1040 return with schedules",
          "Primary state filing support",
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
          "K-1 coordination",
          "Books-to-return review before submission",
        ],
      },
      {
        key: "w2_1099_filing",
        icon: FileBadge,
        badge: "Year-End Forms",
        includes: [
          "W-2 and 1099 preparation and e-filing",
          "Recipient copy distribution support",
          "Deadline checklist",
          "One-time year-end compliance engagement",
        ],
      },
    ],
  },
  {
    id: "business-services",
    title: "Business Services",
    subtitle: "Operational and compliance services for active businesses needing one-time support.",
    audience: "Existing businesses handling compliance, payroll setup, strategic review, or cleanup.",
    timing: "Use this when books are behind, compliance filings are due, or owner-level strategy support is needed.",
    services: [
      {
        key: "registered_agent_services",
        icon: Briefcase,
        badge: "Annual Compliance",
        includes: [
          "Registered agent update coordination",
          "State notice routing support",
          "Compliance calendar guidance",
          "Current-cycle setup and handling",
        ],
      },
      {
        key: "state_filings_support",
        icon: Shield,
        badge: "Compliance",
        includes: [
          "Annual reports and amendment coordination",
          "State filing checklist and deadlines",
          "Multi-state compliance support",
          "Current-cycle filing package",
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
        key: "business_consultation_review",
        icon: TrendingUp,
        badge: "Owner Review",
        includes: [
          "One-time strategy call",
          "Financial and KPI review packet",
          "Priority issues and next steps",
          "Current-year planning and cleanup guidance",
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
    subtitle: "Due diligence support before buying a business or taking over historical books.",
    audience: "Buyers, investors, and operators reviewing financial quality before a transaction.",
    timing: "Use this before signing or during due diligence when you need risk flags quickly.",
    services: [
      {
        key: "acquisition_file_review",
        icon: SearchCheck,
        badge: "Due Diligence",
        includes: [
          "Financial statement and ledger review",
          "Risk flag summary",
          "Cash flow and margin readout",
          "Decision memo for handoff discussion",
        ],
      },
    ],
  },
  {
    id: "new-business-opening",
    title: "New Business Opening",
    subtitle: "Formation and first-year setup support for new founders and newly formalized entities.",
    audience: "Founders launching a new LLC and setting up core operating systems correctly.",
    timing: "Use this when launching this year or formalizing a side business into a legal entity.",
    services: [
      {
        key: "llc_formation",
        icon: Building2,
        badge: "Launch Setup",
        includes: [
          "Formation paperwork support",
          "EIN application assistance",
          "Operating agreement template guidance",
          "First-year compliance kickoff checklist",
        ],
      },
    ],
  },
]

function getService(serviceKey: ServiceKey) {
  return ONE_TIME_SERVICES[serviceKey]
}

type ServiceOrder = {
  id: string
  order_number: string | null
  service_type: string
  service_name: string
  status: string
  intake_status: string
  created_at: string
  tracker: Array<{ label: string; done: boolean }>
}

export default function ServicesPage() {
  const searchParams = useSearchParams()
  const highlight = searchParams.get("highlight")
  const justPaid = searchParams.get("session_id")
  const paidService = searchParams.get("service")
  const [loading, setLoading] = useState<string | null>(null)
  const [orders, setOrders] = useState<ServiceOrder[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [resumeLookupLoading, setResumeLookupLoading] = useState(false)
  const [resumeOrderId, setResumeOrderId] = useState<string | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadOrders() {
      const response = await fetch("/api/service-orders")
      const data = await response.json().catch(() => ({}))
      if (response.ok) setOrders(data.orders ?? [])
      setOrdersLoading(false)
    }
    loadOrders()
  }, [])

  useEffect(() => {
    if (!justPaid) return
    const sessionId = justPaid

    let cancelled = false
    async function pollForOrderBySession() {
      setResumeLookupLoading(true)

      const finalizeResponse = await fetch("/api/service-orders/finalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      }).catch(() => null)

      const finalizeData = await finalizeResponse?.json().catch(() => ({}))
      if (!cancelled && finalizeData?.order_id) {
        setResumeOrderId(finalizeData.order_id)
        window.location.href = `/dashboard/services/orders/${finalizeData.order_id}/intake`
        return
      }

      for (let attempt = 0; attempt < 7; attempt += 1) {
        const response = await fetch(`/api/service-orders?session_id=${encodeURIComponent(sessionId)}`)
        const data = await response.json().catch(() => ({}))
        const order = data?.orders?.[0]
        if (!cancelled && order?.id) {
          setResumeOrderId(order.id)
          window.location.href = `/dashboard/services/orders/${order.id}/intake`
          return
        }
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
      if (!cancelled) {
        setResumeLookupLoading(false)
        setError("Could not auto-open your intake form. Use Continue Intake in My Service Orders below.")
      }
    }
    pollForOrderBySession()
    return () => { cancelled = true }
  }, [justPaid])

  async function handleOrder(serviceKey: ServiceKey | "catchup") {
    if (serviceKey === "catchup") {
      window.location.href = "/contact"
      return
    }

    setLoading(serviceKey)
    setError("")

    // Try Stripe checkout first
    const checkoutRes = await fetch("/api/stripe/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serviceType: serviceKey }),
    })
    const checkoutData = await checkoutRes.json()

    // If Stripe is configured and returned a URL, go to Stripe
    if (checkoutRes.ok && checkoutData.url) {
      window.location.href = checkoutData.url
      return
    }

    // If Stripe fallback (no key configured) — skip checkout, create order directly
    if (checkoutData.fallback) {
      const orderRes = await fetch("/api/service-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service_type: serviceKey }),
      })
      const orderData = await orderRes.json()
      if (orderRes.ok && orderData.order_id) {
        window.location.href = `/dashboard/services/orders/${orderData.order_id}/intake`
        return
      }
      setError(orderData.error ?? "Failed to create service request.")
      setLoading(null)
      return
    }

    // Service price not configured in Stripe — create intake-only order
    if (!checkoutRes.ok && checkoutData.error === "Invalid service") {
      const orderRes = await fetch("/api/service-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service_type: serviceKey }),
      })
      const orderData = await orderRes.json()
      if (orderRes.ok && orderData.order_id) {
        window.location.href = `/dashboard/services/orders/${orderData.order_id}/intake`
        return
      }
      setError(orderData.error ?? "Failed to create service request.")
      setLoading(null)
      return
    }

    setError("Failed to start checkout. Please try again.")
    setLoading(null)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Add-on Services</h1>
        <p className="text-sm text-muted-foreground">
          One-time services for filing, compliance, setup, and due diligence ordered directly from your dashboard.
        </p>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">How this works</CardTitle>
          <CardDescription>
            Choose a one-time service, complete secure checkout, and submit the service intake form so the team can start without waiting on a kickoff call.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          {[
            "Pick the service matching your current need.",
            "Checkout now or request a quote for cleanup projects.",
            "Submit intake details and track progress from your order tracker.",
          ].map((item, index) => (
            <div key={item} className="rounded-xl border bg-background px-3 py-3 text-sm text-muted-foreground">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-foreground">
                Step {index + 1}
              </span>
              {item}
            </div>
          ))}
        </CardContent>
      </Card>

      {justPaid && paidService && (
        <div className="flex items-start gap-3 rounded-2xl border border-green-300/40 bg-green-50 px-4 py-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-700" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-green-900">Service ordered successfully</p>
            <p className="text-sm text-green-800">
              {resumeLookupLoading
                ? "Preparing your intake form. Redirecting now..."
                : "Your intake form is ready in your order tracker below."}
            </p>
            {!resumeLookupLoading && resumeOrderId && (
              <Link href={`/dashboard/services/orders/${resumeOrderId}/intake`} className="mt-2 inline-block">
                <Button size="sm">Continue to Intake</Button>
              </Link>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">My Service Orders</CardTitle>
          <CardDescription>
            Track status, resume intake, and monitor timeline updates for each paid service.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {ordersLoading ? (
            <p className="text-sm text-muted-foreground">Loading orders...</p>
          ) : justPaid && resumeLookupLoading ? (
            <p className="text-sm text-muted-foreground">Payment received. Creating your service order...</p>
          ) : orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No paid service orders yet.</p>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="rounded-xl border bg-background p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">{order.service_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.order_number ?? "Order pending"} · {new Date(order.created_at).toLocaleDateString("en-US")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={order.intake_status === "submitted" ? "default" : "secondary"}>
                      {order.intake_status === "submitted" ? "Intake Submitted" : "Intake Pending"}
                    </Badge>
                    <Link href={`/dashboard/services/orders/${order.id}/intake`}>
                      <Button size="sm" variant={order.intake_status === "submitted" ? "outline" : "default"}>
                        {order.intake_status === "submitted" ? "View Intake" : "Continue Intake"}
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="grid gap-2 md:grid-cols-5">
                  {order.tracker.map((step) => (
                    <div
                      key={step.label}
                      className={`rounded-lg border px-2.5 py-2 text-[11px] ${step.done ? "bg-primary/5 border-primary/20 text-foreground" : "text-muted-foreground"}`}
                    >
                      {step.label}
                    </div>
                  ))}
                </div>
                {order.intake_status !== "submitted" ? (
                  <p className="flex items-center gap-1.5 text-xs text-amber-700">
                    <Timer className="h-3.5 w-3.5" />
                    Complete intake to let the team start work.
                  </p>
                ) : null}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <div className="space-y-5">
        {SERVICE_CATEGORIES.map((category) => (
          <Card key={category.id}>
            <CardHeader className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="text-xl">{category.title}</CardTitle>
                <Badge variant="secondary">{category.services.length} services</Badge>
              </div>
              <CardDescription className="text-sm">{category.subtitle}</CardDescription>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border bg-muted/30 px-3 py-3 text-sm text-muted-foreground">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-foreground">
                    Who It&apos;s For
                  </span>
                  {category.audience}
                </div>
                <div className="rounded-xl border bg-muted/30 px-3 py-3 text-sm text-muted-foreground">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-foreground">
                    When To Order
                  </span>
                  {category.timing}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {category.services.map(({ key, icon: Icon, badge, includes }) => {
                  const isCatchup = key === "catchup"
                  const service = isCatchup ? null : getService(key)
                  const isHighlighted = highlight === key

                  return (
                    <div
                      key={key}
                      className={`rounded-2xl border bg-background p-4 ${isHighlighted ? "border-primary ring-1 ring-primary/30" : ""}`}
                    >
                      <div className="mb-3 flex items-start justify-between gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <div className="text-right">
                          {badge && (
                            <Badge variant="outline" className="mb-2 text-[11px]">
                              {badge}
                            </Badge>
                          )}
                          <p className="text-lg font-bold leading-none">
                            {isCatchup ? "Custom Quote" : service?.displayPrice}
                          </p>
                        </div>
                      </div>

                      <h3 className="text-sm font-semibold">
                        {isCatchup ? "Catchup Bookkeeping" : service?.name}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {isCatchup
                          ? "Historical reconciliation and cleanup for businesses behind on books."
                          : service?.description}
                      </p>

                      <ul className="mt-3 space-y-1.5">
                        {includes.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        className="mt-4 w-full"
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
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
