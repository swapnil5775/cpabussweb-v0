"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, ArrowRight, ArrowLeft, Loader2, BookOpenCheck, X } from "lucide-react"
import { PLANS, type PlanKey } from "@/lib/stripe-plans"
import { cn } from "@/lib/utils"

const TOTAL_STEPS = 7

type OnboardingData = {
  businessName: string
  businessType: string
  entityType: string
  revenueRange: string
  booksStatus: string
  bookkeepingPlatform: string
  workerTypes: string[]
  headcount: string
  needsPayroll: string
  payrollPlatform: string
  bankAccountsCount: string
  creditCardsCount: string
  hasAchVendors: string
  selectedPlan: PlanKey | "free" | ""
}

// ── Option card ─────────────────────────────────────────────
function Card({
  selected, onClick, label, sub,
}: { selected: boolean; onClick: () => void; label: string; sub?: string }) {
  return (
    <button type="button" onClick={onClick}
      className={cn(
        "w-full text-left px-4 py-3 rounded-xl border-2 transition-all flex items-center justify-between gap-3",
        selected ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/40 hover:bg-muted/50"
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

// ── Multi-select chip ────────────────────────────────────────
function Chip({ selected, onClick, label }: { selected: boolean; onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick}
      className={cn(
        "px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all",
        selected ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/40"
      )}
    >
      {label}
    </button>
  )
}

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
  { value: "none", label: "No Entity Yet", sub: "Haven't formed one yet" },
  { value: "sole_prop", label: "Sole Proprietor", sub: "Schedule C / no LLC" },
  { value: "llc_single", label: "Single-Member LLC", sub: "Disregarded entity" },
  { value: "llc_multi", label: "Multi-Member LLC", sub: "Partnership taxation" },
  { value: "s_corp", label: "S-Corporation", sub: "Form 1120-S" },
  { value: "c_corp", label: "C-Corporation", sub: "Form 1120" },
  { value: "partnership", label: "Partnership", sub: "Form 1065" },
]

const REVENUE_RANGES = [
  { value: "under_50k", label: "Under $50K / year" },
  { value: "50k_100k", label: "$50K – $100K / year" },
  { value: "100k_250k", label: "$100K – $250K / year" },
  { value: "250k_500k", label: "$250K – $500K / year" },
  { value: "over_500k", label: "Over $500K / year" },
]

const BOOKS_STATUSES = [
  { value: "current", label: "Up to date", sub: "Books are current or new business" },
  { value: "behind_1_3", label: "1–3 months behind", sub: "Needs some catchup" },
  { value: "behind_3_plus", label: "3+ months behind", sub: "Significantly behind" },
  { value: "never_done", label: "Never tracked", sub: "Starting from scratch" },
]

const BOOKKEEPING_PLATFORMS = [
  { value: "quickbooks", label: "QuickBooks Online" },
  { value: "xero", label: "Xero" },
  { value: "freshbooks", label: "FreshBooks" },
  { value: "wave", label: "Wave" },
  { value: "spreadsheet", label: "Excel / Google Sheets" },
  { value: "none", label: "Nothing / Starting fresh" },
  { value: "other", label: "Other" },
]

const WORKER_TYPES = [
  { value: "ft_w2", label: "Full-time (W2)" },
  { value: "pt_w2", label: "Part-time (W2)" },
  { value: "contractors_1099", label: "1099 Contractors" },
  { value: "per_diem", label: "Per-Diem" },
  { value: "international", label: "International Contractors" },
  { value: "just_me", label: "Just me / No staff" },
]

const HEADCOUNTS = [
  { value: "just_me", label: "Just me" },
  { value: "2_5", label: "2–5" },
  { value: "6_10", label: "6–10" },
  { value: "11_25", label: "11–25" },
  { value: "26_50", label: "26–50" },
  { value: "50_plus", label: "50+" },
]

const PAYROLL_OPTIONS = [
  { value: "yes_current", label: "Yes — already have a payroll system", sub: "We'll review and optimize it" },
  { value: "yes_new", label: "Yes — looking for a new platform", sub: "We'll set it up for you" },
  { value: "no", label: "No — don't need payroll", sub: "No employees or contractors to pay" },
]

const PAYROLL_PLATFORMS = [
  { value: "quickbooks_payroll", label: "QuickBooks Payroll" },
  { value: "gusto", label: "Gusto" },
  { value: "adp", label: "ADP" },
  { value: "paychex", label: "Paychex" },
  { value: "rippling", label: "Rippling" },
  { value: "other", label: "Other" },
]

const BANK_COUNTS = [
  { value: "1", label: "1 account" },
  { value: "2_3", label: "2–3 accounts" },
  { value: "4_plus", label: "4+ accounts" },
]

const CARD_COUNTS = [
  { value: "0", label: "None" },
  { value: "1", label: "1 card" },
  { value: "2_3", label: "2–3 cards" },
  { value: "4_plus", label: "4+ cards" },
]

const ACH_OPTIONS = [
  { value: "yes", label: "Yes — regularly", sub: "ACH transfers or invoice-based vendor payments" },
  { value: "sometimes", label: "Sometimes", sub: "Occasional vendor payments" },
  { value: "no", label: "No", sub: "Cash or card only" },
]

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const [data, setData] = useState<OnboardingData>({
    businessName: "", businessType: "", entityType: "",
    revenueRange: "", booksStatus: "", bookkeepingPlatform: "",
    workerTypes: [], headcount: "", needsPayroll: "", payrollPlatform: "",
    bankAccountsCount: "", creditCardsCount: "", hasAchVendors: "",
    selectedPlan: "",
  })

  function setField(field: keyof OnboardingData, value: string) {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  function toggleWorkerType(value: string) {
    setData((prev) => {
      const has = prev.workerTypes.includes(value)
      if (value === "just_me") return { ...prev, workerTypes: has ? [] : ["just_me"] }
      const next = has
        ? prev.workerTypes.filter((v) => v !== value)
        : [...prev.workerTypes.filter((v) => v !== "just_me"), value]
      return { ...prev, workerTypes: next }
    })
  }

  // Steps 1-6 are skippable by advancing; step 7 (plan) has explicit skip
  function canAdvance() {
    if (step === 1) return data.businessType !== ""
    return true // steps 2-6 can be skipped with Continue
  }

  async function saveProfile(plan: PlanKey | "free") {
    fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, workerTypes: data.workerTypes, selectedPlan: plan }),
    }).catch(() => {})
  }

  async function handlePlanSelect(plan: PlanKey) {
    setData((prev) => ({ ...prev, selectedPlan: plan }))
    setLoading(true)
    setError("")
    await saveProfile(plan)

    try {
      const checkoutRes = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      })
      const checkoutData = await checkoutRes.json()

      if (checkoutData.fallback) {
        window.location.href = `/contact?plan=${plan}&source=onboarding`
        return
      }
      if (!checkoutRes.ok || !checkoutData.url) throw new Error("Failed to start checkout — please try again.")
      window.location.href = checkoutData.url
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  async function handleSkipPlan() {
    setLoading(true)
    await saveProfile("free")
    router.push("/dashboard")
    router.refresh()
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

      {/* Progress */}
      <div className="h-1 bg-border">
        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progressPercent}%` }} />
      </div>

      <div className="flex-1 flex items-start justify-center px-4 py-12">
        <div className="w-full max-w-lg space-y-8">

          {/* ── Step 1: Business info ── */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">What type of business do you run?</h1>
                <p className="text-muted-foreground text-sm mt-1">We&apos;ll tailor your setup to your industry.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessName">Business name <span className="text-muted-foreground text-xs">(optional)</span></Label>
                <Input id="businessName" placeholder="e.g. Sunrise Childcare LLC"
                  value={data.businessName} onChange={(e) => setField("businessName", e.target.value)} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {BUSINESS_TYPES.map((t) => (
                  <Card key={t.value} label={t.label} selected={data.businessType === t.value}
                    onClick={() => setField("businessType", t.value)} />
                ))}
              </div>
            </div>
          )}

          {/* ── Step 2: Entity type ── */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">What&apos;s your business structure?</h1>
                <p className="text-muted-foreground text-sm mt-1">Determines your tax filing requirements. Skip if unsure.</p>
              </div>
              <div className="space-y-2">
                {ENTITY_TYPES.map((t) => (
                  <Card key={t.value} label={t.label} sub={t.sub}
                    selected={data.entityType === t.value} onClick={() => setField("entityType", t.value)} />
                ))}
              </div>
              {data.entityType === "none" && (
                <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
                  We can help you form an LLC as an add-on after signup.
                </div>
              )}
            </div>
          )}

          {/* ── Step 3: Revenue ── */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">What&apos;s your annual revenue?</h1>
                <p className="text-muted-foreground text-sm mt-1">Helps us recommend the right plan. Skip if unsure.</p>
              </div>
              <div className="space-y-2">
                {REVENUE_RANGES.map((r) => (
                  <Card key={r.value} label={r.label} selected={data.revenueRange === r.value}
                    onClick={() => setField("revenueRange", r.value)} />
                ))}
              </div>
            </div>
          )}

          {/* ── Step 4: Books status + platform ── */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Where are your books right now?</h1>
                <p className="text-muted-foreground text-sm mt-1">No judgment — we handle every situation. Skip if unsure.</p>
              </div>
              <div className="space-y-2">
                {BOOKS_STATUSES.map((s) => (
                  <Card key={s.value} label={s.label} sub={s.sub}
                    selected={data.booksStatus === s.value} onClick={() => setField("booksStatus", s.value)} />
                ))}
              </div>

              <div className="space-y-3 pt-2">
                <p className="text-sm font-semibold">Current bookkeeping software <span className="text-muted-foreground font-normal">(optional)</span></p>
                <div className="flex flex-wrap gap-2">
                  {BOOKKEEPING_PLATFORMS.map((p) => (
                    <Chip key={p.value} label={p.label} selected={data.bookkeepingPlatform === p.value}
                      onClick={() => setField("bookkeepingPlatform", data.bookkeepingPlatform === p.value ? "" : p.value)} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 5: Team & labor ── */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Tell us about your team</h1>
                <p className="text-muted-foreground text-sm mt-1">Helps us understand your payroll and labor needs. Skip anything you&apos;re unsure about.</p>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold">What types of workers do you have? <span className="text-muted-foreground font-normal">(select all that apply)</span></p>
                <div className="flex flex-wrap gap-2">
                  {WORKER_TYPES.map((w) => (
                    <Chip key={w.value} label={w.label}
                      selected={data.workerTypes.includes(w.value)} onClick={() => toggleWorkerType(w.value)} />
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold">Approximate total headcount <span className="text-muted-foreground font-normal">(optional)</span></p>
                <div className="flex flex-wrap gap-2">
                  {HEADCOUNTS.map((h) => (
                    <Chip key={h.value} label={h.label} selected={data.headcount === h.value}
                      onClick={() => setField("headcount", data.headcount === h.value ? "" : h.value)} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 6: Payroll & banking ── */}
          {step === 6 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Payroll & banking</h1>
                <p className="text-muted-foreground text-sm mt-1">Skip any section you don&apos;t have an answer for yet.</p>
              </div>

              {/* Payroll */}
              <div className="space-y-3">
                <p className="text-sm font-semibold">Do you need payroll processing?</p>
                <div className="space-y-2">
                  {PAYROLL_OPTIONS.map((o) => (
                    <Card key={o.value} label={o.label} sub={o.sub}
                      selected={data.needsPayroll === o.value} onClick={() => setField("needsPayroll", o.value)} />
                  ))}
                </div>
              </div>

              {data.needsPayroll === "yes_current" && (
                <div className="space-y-3">
                  <p className="text-sm font-semibold">Which payroll platform are you using? <span className="text-muted-foreground font-normal">(optional)</span></p>
                  <div className="flex flex-wrap gap-2">
                    {PAYROLL_PLATFORMS.map((p) => (
                      <Chip key={p.value} label={p.label} selected={data.payrollPlatform === p.value}
                        onClick={() => setField("payrollPlatform", data.payrollPlatform === p.value ? "" : p.value)} />
                    ))}
                  </div>
                </div>
              )}

              {/* Banking */}
              <div className="space-y-3">
                <p className="text-sm font-semibold">Business bank accounts <span className="text-muted-foreground font-normal">(optional)</span></p>
                <div className="flex flex-wrap gap-2">
                  {BANK_COUNTS.map((b) => (
                    <Chip key={b.value} label={b.label} selected={data.bankAccountsCount === b.value}
                      onClick={() => setField("bankAccountsCount", data.bankAccountsCount === b.value ? "" : b.value)} />
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold">Business credit cards <span className="text-muted-foreground font-normal">(optional)</span></p>
                <div className="flex flex-wrap gap-2">
                  {CARD_COUNTS.map((c) => (
                    <Chip key={c.value} label={c.label} selected={data.creditCardsCount === c.value}
                      onClick={() => setField("creditCardsCount", data.creditCardsCount === c.value ? "" : c.value)} />
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold">ACH transfers or invoice-based vendor payments? <span className="text-muted-foreground font-normal">(optional)</span></p>
                <div className="space-y-2">
                  {ACH_OPTIONS.map((a) => (
                    <Card key={a.value} label={a.label} sub={a.sub}
                      selected={data.hasAchVendors === a.value} onClick={() => setField("hasAchVendors", a.value)} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 7: Plan selection ── */}
          {step === 7 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Choose your plan</h1>
                <p className="text-muted-foreground text-sm mt-1">All plans include personal tax prep + filing. Cancel anytime. Or skip and explore free.</p>
              </div>

              {error && (
                <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">{error}</div>
              )}

              <div className="space-y-3">
                {(Object.entries(PLANS) as [PlanKey, typeof PLANS[PlanKey]][]).map(([key, plan]) => (
                  <div key={key} className={cn(
                    "rounded-2xl border-2 p-5 space-y-4 transition-all",
                    "popular" in plan && plan.popular ? "border-primary" : "border-border"
                  )}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base">{plan.name}</h3>
                          {"popular" in plan && plan.popular && <Badge className="text-xs">Most Popular</Badge>}
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
                    <Button className="w-full" variant={"popular" in plan && plan.popular ? "default" : "outline"}
                      disabled={loading} onClick={() => handlePlanSelect(key)}>
                      {loading && data.selectedPlan === key
                        ? <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />
                        : null}
                      Start with {plan.name}
                      <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Free tier skip */}
              <div className="rounded-2xl border-2 border-dashed border-border p-5 text-center space-y-3">
                <p className="text-sm font-semibold">Not ready to subscribe yet?</p>
                <p className="text-xs text-muted-foreground">Create a free account to explore your dashboard, upload documents, and see what&apos;s available. Upgrade anytime.</p>
                <Button variant="ghost" className="w-full" disabled={loading} onClick={handleSkipPlan}>
                  {loading && data.selectedPlan === "free"
                    ? <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />
                    : null}
                  Continue with free account
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground">Secure checkout via Stripe. No software subscription fees — ever.</p>
            </div>
          )}

          {/* ── Navigation ── */}
          <div className="flex gap-3">
            {step > 1 && (
              <Button variant="outline" className="bg-transparent" onClick={() => setStep((s) => s - 1)} disabled={loading}>
                <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
                Back
              </Button>
            )}
            {step < TOTAL_STEPS && (
              <Button className="flex-1" onClick={() => setStep((s) => s + 1)} disabled={!canAdvance()}>
                {step === 1 ? "Continue" : "Continue"}
                <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
              </Button>
            )}
            {step > 1 && step < TOTAL_STEPS && (
              <Button variant="ghost" className="text-muted-foreground" onClick={() => setStep((s) => s + 1)}>
                Skip
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
