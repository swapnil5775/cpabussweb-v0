"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, ArrowRight, ArrowLeft, Loader2, BookOpenCheck } from "lucide-react"
import { PLANS, type PlanKey } from "@/lib/stripe-plans"
import { cn } from "@/lib/utils"

type OnboardingData = {
  businessName: string
  businessType: string
  entityType: string
  revenueRange: string
  booksStatus: string
  selectedPlan: PlanKey | ""
}

const TOTAL_STEPS = 5

const BUSINESS_TYPES = [
  { value: "restaurant", label: "Restaurant / Food Service" },
  { value: "hotel", label: "Hotel / Hospitality" },
  { value: "childcare", label: "Childcare / Daycare" },
  { value: "realtor", label: "Real Estate / Realtor" },
  { value: "home_based", label: "Home-Based Business" },
  { value: "tutoring", label: "Tutoring / Education" },
  { value: "retail", label: "Retail Shop" },
  { value: "other", label: "Other Small Business" },
]

const ENTITY_TYPES = [
  { value: "none", label: "No LLC / No Entity", sub: "Sole proprietor or not formed yet" },
  { value: "sole_prop", label: "Sole Proprietor", sub: "Schedule C filer" },
  { value: "llc_single", label: "Single-Member LLC", sub: "Disregarded entity" },
  { value: "llc_multi", label: "Multi-Member LLC", sub: "Partnership taxation" },
  { value: "s_corp", label: "S-Corporation", sub: "Form 1120-S filer" },
  { value: "c_corp", label: "C-Corporation", sub: "Form 1120 filer" },
]

const REVENUE_RANGES = [
  { value: "under_50k", label: "Under $50K / year" },
  { value: "50k_100k", label: "$50K – $100K / year" },
  { value: "100k_250k", label: "$100K – $250K / year" },
  { value: "250k_500k", label: "$250K – $500K / year" },
  { value: "over_500k", label: "Over $500K / year" },
]

const BOOKS_STATUSES = [
  { value: "current", label: "Up to date", sub: "Books are current or it's a new business" },
  { value: "behind_1_3", label: "1–3 months behind", sub: "A little behind, needs catchup" },
  { value: "behind_3_plus", label: "3+ months behind", sub: "Significantly behind" },
  { value: "never_done", label: "Never tracked", sub: "No bookkeeping done yet" },
]

function OptionCard({
  selected,
  onClick,
  label,
  sub,
}: {
  selected: boolean
  onClick: () => void
  label: string
  sub?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left px-4 py-3 rounded-xl border-2 transition-all flex items-center justify-between gap-3",
        selected
          ? "border-primary bg-primary/5 text-primary"
          : "border-border hover:border-primary/40 hover:bg-muted/50"
      )}
    >
      <div>
        <p className="font-medium text-sm">{label}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
      {selected && (
        <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <Check className="h-3 w-3 text-primary-foreground" aria-hidden="true" />
        </div>
      )}
    </button>
  )
}

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const [data, setData] = useState<OnboardingData>({
    businessName: "",
    businessType: "",
    entityType: "",
    revenueRange: "",
    booksStatus: "",
    selectedPlan: "",
  })

  function set(field: keyof OnboardingData, value: string) {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  function canAdvance() {
    if (step === 1) return data.businessType !== ""
    if (step === 2) return data.entityType !== ""
    if (step === 3) return data.revenueRange !== ""
    if (step === 4) return data.booksStatus !== ""
    return false
  }

  async function handlePlanSelect(plan: PlanKey) {
    setData((prev) => ({ ...prev, selectedPlan: plan }))
    setLoading(true)
    setError("")

    try {
      // 1. Save onboarding profile
      const profileRes = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, selectedPlan: plan }),
      })
      if (!profileRes.ok) throw new Error("Failed to save profile")

      // 2. Create Stripe checkout session
      const checkoutRes = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      })
      const checkoutData = await checkoutRes.json()
      if (!checkoutRes.ok || !checkoutData.url) throw new Error("Failed to create checkout")

      // 3. Redirect to Stripe
      window.location.href = checkoutData.url
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setLoading(false)
    }
  }

  const progressPercent = ((step - 1) / (TOTAL_STEPS - 1)) * 100

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-background px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BookOpenCheck className="h-4 w-4" aria-hidden="true" />
          </div>
          <span className="font-bold text-primary">BookKeeping.business</span>
        </Link>
        <span className="text-sm text-muted-foreground">Step {step} of {TOTAL_STEPS}</span>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-border">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex-1 flex items-start justify-center px-4 py-12">
        <div className="w-full max-w-lg space-y-8">

          {/* ── Step 1: Business name + type ── */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">What type of business do you run?</h1>
                <p className="text-muted-foreground text-sm">We&apos;ll tailor your bookkeeping to your industry.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessName">Business name (optional)</Label>
                <Input
                  id="businessName"
                  placeholder="e.g. Sunrise Childcare LLC"
                  value={data.businessName}
                  onChange={(e) => set("businessName", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {BUSINESS_TYPES.map((t) => (
                  <OptionCard
                    key={t.value}
                    label={t.label}
                    selected={data.businessType === t.value}
                    onClick={() => set("businessType", t.value)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Step 2: Entity type ── */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">What&apos;s your business structure?</h1>
                <p className="text-muted-foreground text-sm">This determines your tax filing requirements.</p>
              </div>
              <div className="space-y-2">
                {ENTITY_TYPES.map((t) => (
                  <OptionCard
                    key={t.value}
                    label={t.label}
                    sub={t.sub}
                    selected={data.entityType === t.value}
                    onClick={() => set("entityType", t.value)}
                  />
                ))}
              </div>
              {data.entityType === "none" && (
                <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
                  No entity? We can help you form an LLC as an add-on service after signup.
                </div>
              )}
            </div>
          )}

          {/* ── Step 3: Revenue range ── */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">What&apos;s your annual revenue?</h1>
                <p className="text-muted-foreground text-sm">Used to recommend the right plan. All ranges are served.</p>
              </div>
              <div className="space-y-2">
                {REVENUE_RANGES.map((r) => (
                  <OptionCard
                    key={r.value}
                    label={r.label}
                    selected={data.revenueRange === r.value}
                    onClick={() => set("revenueRange", r.value)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Step 4: Books status ── */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">Where are your books right now?</h1>
                <p className="text-muted-foreground text-sm">No judgment — we fix books at every stage.</p>
              </div>
              <div className="space-y-2">
                {BOOKS_STATUSES.map((s) => (
                  <OptionCard
                    key={s.value}
                    label={s.label}
                    sub={s.sub}
                    selected={data.booksStatus === s.value}
                    onClick={() => set("booksStatus", s.value)}
                  />
                ))}
              </div>
              {(data.booksStatus === "behind_3_plus" || data.booksStatus === "never_done") && (
                <div className="rounded-xl bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-800">
                  We&apos;ll recommend a Catchup Bookkeeping add-on after signup to get you fully caught up before monthly service starts.
                </div>
              )}
            </div>
          )}

          {/* ── Step 5: Plan selection ── */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">Choose your plan</h1>
                <p className="text-muted-foreground text-sm">All plans include owner&apos;s personal tax prep + filing. Cancel anytime.</p>
              </div>

              {error && (
                <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                {(Object.entries(PLANS) as [PlanKey, typeof PLANS[PlanKey]][]).map(([key, plan]) => (
                  <div
                    key={key}
                    className={cn(
                      "rounded-2xl border-2 p-5 space-y-4 transition-all",
                      "popular" in plan && plan.popular ? "border-primary" : "border-border"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base">{plan.name}</h3>
                          {"popular" in plan && plan.popular && (
                            <Badge className="text-xs">Most Popular</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{plan.label}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-2xl font-black text-primary">{plan.displayPrice}</span>
                        <span className="text-xs text-muted-foreground">/mo</span>
                      </div>
                    </div>

                    <ul className="space-y-1.5">
                      {plan.features.slice(0, 4).map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm">
                          <Check className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                          <span className="text-muted-foreground">{f}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className="w-full"
                      variant={"popular" in plan && plan.popular ? "default" : "outline"}
                      disabled={loading}
                      onClick={() => handlePlanSelect(key)}
                    >
                      {loading && data.selectedPlan === key ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />
                      ) : null}
                      Start with {plan.name}
                      <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
                    </Button>
                  </div>
                ))}
              </div>

              <p className="text-xs text-center text-muted-foreground">
                Secure checkout via Stripe. Cancel anytime. No software subscription fees — ever.
              </p>
            </div>
          )}

          {/* Nav buttons */}
          <div className="flex gap-3">
            {step > 1 && (
              <Button
                variant="outline"
                className="bg-transparent"
                onClick={() => setStep((s) => s - 1)}
                disabled={loading}
              >
                <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
                Back
              </Button>
            )}
            {step < TOTAL_STEPS && (
              <Button
                className="flex-1"
                onClick={() => setStep((s) => s + 1)}
                disabled={!canAdvance()}
              >
                Continue
                <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
