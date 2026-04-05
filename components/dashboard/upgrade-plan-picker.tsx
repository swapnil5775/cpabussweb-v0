"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Loader2, Star } from "lucide-react"
import { PLANS, type PlanKey, calcEmployeeCost } from "@/lib/stripe-plans"
import { cn } from "@/lib/utils"

export function UpgradePlanPicker({ employeeCount }: { employeeCount: number }) {
  const [loading, setLoading] = useState<PlanKey | null>(null)
  const [error, setError] = useState("")

  async function handleSelect(plan: PlanKey) {
    setLoading(plan)
    setError("")
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      })
      const d = await res.json()
      if (d.fallback) { window.location.href = `/contact?plan=${plan}&source=upgrade`; return }
      if (!res.ok || !d.url) throw new Error(d.error ?? "Failed to start checkout — please try again.")
      window.location.href = d.url
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
      setLoading(null)
    }
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>
      )}
      {(Object.entries(PLANS) as [PlanKey, typeof PLANS[PlanKey]][]).map(([key, plan]) => {
        const empCost = calcEmployeeCost(employeeCount, plan.includedEmployees)
        const total = plan.basePrice + empCost
        const isLoading = loading === key
        return (
          <div
            key={key}
            className={cn(
              "rounded-2xl border-2 p-4 transition-colors",
              "popular" in plan && plan.popular
                ? "border-primary bg-primary/5"
                : "border-border bg-background"
            )}
          >
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-bold text-sm">{plan.name}</p>
                  {"popular" in plan && plan.popular && (
                    <Badge className="text-[10px] gap-0.5 py-0 bg-primary">
                      <Star className="h-2.5 w-2.5 fill-current" />Most Popular
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{plan.label}</p>

                {/* Pricing breakdown */}
                <div className="mt-2 space-y-0.5">
                  <p className="text-xs text-muted-foreground">
                    Base: <span className="font-medium text-foreground">{plan.displayPrice}/mo</span>
                    {empCost > 0 && (
                      <span className="ml-2">
                        + Payroll add-on: <span className="font-medium text-foreground">+${empCost}/mo</span>
                        <span className="text-muted-foreground/70">
                          {" "}({employeeCount - plan.includedEmployees} emp × $10)
                        </span>
                      </span>
                    )}
                  </p>
                  {empCost > 0 && (
                    <p className="text-sm font-semibold text-primary">Total: ${total}/mo</p>
                  )}
                </div>

                {/* Features */}
                <ul className="mt-3 space-y-1">
                  {plan.features.slice(0, 4).map((f) => (
                    <li key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                  {plan.features.length > 4 && (
                    <li className="text-xs text-muted-foreground pl-4.5">
                      +{plan.features.length - 4} more included
                    </li>
                  )}
                </ul>
              </div>

              <Button
                size="sm"
                variant={"popular" in plan && plan.popular ? "default" : "outline"}
                className={cn(
                  "shrink-0 self-start min-w-[110px]",
                  !("popular" in plan && plan.popular) && "bg-transparent"
                )}
                disabled={!!loading}
                onClick={() => handleSelect(key)}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  `Get ${plan.name}`
                )}
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
