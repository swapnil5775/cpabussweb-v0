"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Loader2, CheckCircle2, Building2, BookOpen, ClipboardList, Users, BarChart3, FileBadge, Shield, SearchCheck } from "lucide-react"
import { ONE_TIME_SERVICES, type ServiceKey } from "@/lib/stripe-plans"

const SERVICES = [
  {
    key: "llc_formation" as ServiceKey,
    icon: Building2,
    badge: null,
    includes: [
      "Formation document preparation",
      "EIN application assistance",
      "Operating agreement template",
      "State filing coordination",
    ],
  },
  {
    key: "tax_individual" as ServiceKey,
    icon: BookOpen,
    badge: "Tax Season",
    includes: [
      "Federal 1040 return",
      "State return (primary state)",
      "All schedules included",
      "Human review before filing",
    ],
  },
  {
    key: "tax_business" as ServiceKey,
    icon: ClipboardList,
    badge: "Tax Season",
    includes: [
      "Business return (1120-S, 1120, or 1065)",
      "K-1 schedules for partners/shareholders",
      "Federal + state e-filing",
      "Human review before filing",
    ],
  },
  {
    key: "payroll_setup" as ServiceKey,
    icon: Users,
    badge: null,
    includes: [
      "Payroll system configuration",
      "Employee onboarding setup",
      "Pay schedule + direct deposit",
      "First payroll run walkthrough",
    ],
  },
  {
    key: "w2_1099_filing" as ServiceKey,
    icon: FileBadge,
    badge: "Year-End",
    includes: [
      "W-2 preparation for employees",
      "1099-NEC / 1099-MISC filing",
      "IRS + SSA e-filing included",
      "Recipient copies distributed",
    ],
  },
  {
    key: "state_filings_support" as ServiceKey,
    icon: Shield,
    badge: "Compliance",
    includes: [
      "Annual report preparation",
      "State amendment filing support",
      "Compliance deadline guidance",
      "Multi-state coordination help",
    ],
  },
  {
    key: "acquisition_file_review" as ServiceKey,
    icon: SearchCheck,
    badge: "Due Diligence",
    includes: [
      "Financial statement review",
      "Risk flag summary",
      "Cash flow and margin analysis",
      "Acquisition decision memo",
    ],
  },
]

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

    const res = await fetch("/api/stripe/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serviceType: serviceKey }),
    })
    const data = await res.json()

    if (!res.ok || !data.url) {
      setError("Failed to start checkout. Please try again.")
      setLoading(null)
      return
    }

    window.location.href = data.url
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Add-on Services</h1>
        <p className="text-muted-foreground text-sm">One-time services to complement your monthly plan.</p>
        <p className="text-xs text-muted-foreground">
          Expanded inside the portal so paid users can buy more of the same business services showcased on the main website without leaving the dashboard.
        </p>
      </div>

      {justPaid && paidService && (
        <div className="rounded-2xl bg-green-50 border border-green-200 px-5 py-4 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold text-sm text-green-900">Service ordered successfully</p>
            <p className="text-xs text-green-700">Your dedicated team will reach out within 1 business day to begin.</p>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {SERVICES.map(({ key, icon: Icon, badge, includes }) => {
          const svc = ONE_TIME_SERVICES[key]
          const isHighlighted = highlight === key
          return (
            <Card
              key={key}
              className={isHighlighted ? "border-primary shadow-md" : undefined}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="flex items-center gap-2">
                    {badge && <Badge variant="outline" className="text-xs">{badge}</Badge>}
                    <span className="text-lg font-black text-primary">{svc.displayPrice}</span>
                  </div>
                </div>
                <CardTitle className="text-base mt-3">{svc.name}</CardTitle>
                <CardDescription className="text-sm">{svc.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-1.5">
                  {includes.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={isHighlighted ? "default" : "outline"}
                  disabled={loading === key}
                  onClick={() => handleOrder(key)}
                >
                  {loading === key
                    ? <><Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />Processing...</>
                    : <>Add to Account <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" /></>
                  }
                </Button>
              </CardContent>
            </Card>
          )
        })}

        {/* Catchup — quote-based */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <BarChart3 className="h-5 w-5" aria-hidden="true" />
              </div>
              <span className="text-lg font-black text-primary">Custom Quote</span>
            </div>
            <CardTitle className="text-base mt-3">Catchup Bookkeeping</CardTitle>
            <CardDescription>Historical reconciliation for businesses behind on their books.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-1.5">
              {["Historical transaction reconciliation", "Expense categorization cleanup", "Audit-ready financial records", "Smooth transition to monthly service"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => window.location.href = "/contact"}
            >
              Get a Quote
              <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
