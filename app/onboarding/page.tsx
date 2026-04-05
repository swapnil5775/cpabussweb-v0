"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, ArrowRight, ArrowLeft, Loader2, BookOpenCheck, Minus, Plus } from "lucide-react"
import { PLANS, type PlanKey, calcEmployeeCost, formatEmployeeCost } from "@/lib/stripe-plans"
import { cn } from "@/lib/utils"

const TOTAL_STEPS = 8

type OnboardingData = {
  // Step 1 — Business type
  businessName: string
  businessType: string
  // Step 2 — Owner info (NEW)
  ownerFirstName: string
  ownerLastName: string
  ownerEmail: string
  ownerPhone: string
  ein: string
  businessAddress: string
  businessCity: string
  businessState: string
  businessZip: string
  // Step 3 — Entity
  entityType: string
  // Step 4 — Revenue
  revenueRange: string
  // Step 5 — Books
  booksStatus: string
  bookkeepingPlatform: string
  // Step 6 — Team
  workerTypes: string[]
  employeeCount: number
  headcount: string
  // Step 7 — Payroll & banking
  needsPayroll: string
  payrollPlatform: string
  bankAccountsCount: string
  creditCardsCount: string
  hasAchVendors: string
  // Step 8 — Plan
  selectedPlan: PlanKey | "free" | ""
}

function OptionCard({ selected, onClick, label, sub }: { selected: boolean; onClick: () => void; label: string; sub?: string }) {
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
          <Check className="h-3 w-3 text-primary-foreground" />
        </div>
      )}
    </button>
  )
}

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

function Field({ label, required, children, hint }: { label: string; required?: boolean; children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-medium text-muted-foreground">
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware",
  "Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky",
  "Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi",
  "Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico",
  "New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania",
  "Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont",
  "Virginia","Washington","West Virginia","Wisconsin","Wyoming",
]

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

const PAYROLL_OPTIONS = [
  { value: "yes_current", label: "Yes — already have a payroll system", sub: "We'll review and migrate it" },
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
  return (
    <Suspense>
      <OnboardingPageInner />
    </Suspense>
  )
}

function OnboardingPageInner() {
  const searchParams = useSearchParams()
  const resuming = searchParams.get("resume") === "true"
  const startStep = Math.max(1, parseInt(searchParams.get("step") ?? "1", 10))

  const [step, setStep] = useState(startStep)
  const [loading, setLoading] = useState(false)
  const [prefilling, setPrefilling] = useState(resuming)
  const [error, setError] = useState("")
  const [ownerErrors, setOwnerErrors] = useState<Record<string, string>>({})
  const router = useRouter()

  const [data, setData] = useState<OnboardingData>({
    businessName: "", businessType: "",
    ownerFirstName: "", ownerLastName: "", ownerEmail: "", ownerPhone: "",
    ein: "", businessAddress: "", businessCity: "", businessState: "Florida", businessZip: "",
    entityType: "", revenueRange: "", booksStatus: "", bookkeepingPlatform: "",
    workerTypes: [], employeeCount: 0, headcount: "",
    needsPayroll: "", payrollPlatform: "",
    bankAccountsCount: "", creditCardsCount: "", hasAchVendors: "",
    selectedPlan: "",
  })

  // Pre-fill from saved profile when resuming
  useEffect(() => {
    if (!resuming) return
    fetch("/api/onboarding")
      .then((r) => r.json())
      .then(({ businessProfile: bp, clientProfile: cp }) => {
        if (!bp && !cp) return
        setData((prev) => ({
          ...prev,
          businessName: bp?.business_name ?? prev.businessName,
          businessType: bp?.business_type ?? prev.businessType,
          ownerFirstName: cp?.owner_first_name ?? prev.ownerFirstName,
          ownerLastName: cp?.owner_last_name ?? prev.ownerLastName,
          ownerEmail: cp?.owner_email ?? prev.ownerEmail,
          ownerPhone: cp?.phone ?? prev.ownerPhone,
          ein: bp?.ein ?? prev.ein,
          businessAddress: cp?.business_address_line1 ?? prev.businessAddress,
          businessCity: cp?.business_city ?? prev.businessCity,
          businessState: bp?.business_state ?? prev.businessState,
          businessZip: bp?.business_zip ?? prev.businessZip,
          entityType: bp?.entity_type ?? prev.entityType,
          revenueRange: bp?.revenue_range ?? prev.revenueRange,
          booksStatus: bp?.books_status ?? prev.booksStatus,
          bookkeepingPlatform: bp?.bookkeeping_platform ?? prev.bookkeepingPlatform,
          workerTypes: Array.isArray(bp?.worker_types) ? bp.worker_types : prev.workerTypes,
          employeeCount: bp?.employee_count ?? prev.employeeCount,
          headcount: bp?.headcount ?? prev.headcount,
          needsPayroll: bp?.needs_payroll ?? prev.needsPayroll,
          payrollPlatform: bp?.payroll_platform ?? prev.payrollPlatform,
          bankAccountsCount: bp?.bank_accounts_count ?? prev.bankAccountsCount,
          creditCardsCount: bp?.credit_cards_count ?? prev.creditCardsCount,
          hasAchVendors: bp?.has_ach_vendors ?? prev.hasAchVendors,
          selectedPlan: bp?.selected_plan ?? prev.selectedPlan,
        }))
      })
      .catch(() => {})
      .finally(() => setPrefilling(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function set(field: keyof OnboardingData, value: string | number) {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  function toggleWorkerType(value: string) {
    setData((prev) => {
      const has = prev.workerTypes.includes(value)
      if (value === "just_me") return { ...prev, workerTypes: has ? [] : ["just_me"], employeeCount: 0 }
      const next = has
        ? prev.workerTypes.filter((v) => v !== value)
        : [...prev.workerTypes.filter((v) => v !== "just_me"), value]
      return { ...prev, workerTypes: next }
    })
  }

  function adjustEmployeeCount(delta: number) {
    setData((prev) => ({ ...prev, employeeCount: Math.max(0, Math.min(500, prev.employeeCount + delta)) }))
  }

  function validateOwnerStep() {
    const errs: Record<string, string> = {}
    if (!data.ownerFirstName.trim()) errs.ownerFirstName = "Required"
    if (!data.ownerLastName.trim()) errs.ownerLastName = "Required"
    if (!data.ownerEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.ownerEmail)) errs.ownerEmail = "Valid email required"
    setOwnerErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function saveProfile(plan: PlanKey | "free") {
    fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, selectedPlan: plan }),
    }).catch(() => {})
  }

  async function handlePlanSelect(plan: PlanKey) {
    setData((prev) => ({ ...prev, selectedPlan: plan }))
    setLoading(true)
    setError("")
    await saveProfile(plan)
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      })
      const d = await res.json()
      if (d.fallback) { window.location.href = `/contact?plan=${plan}&source=onboarding`; return }
      if (!res.ok || !d.url) throw new Error("Failed to start checkout — please try again.")
      window.location.href = d.url
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
      setLoading(false)
    }
  }

  async function handleSkipPlan() {
    setLoading(true)
    await saveProfile("free")
    router.push("/dashboard")
    router.refresh()
  }

  function next() { setStep((s) => s + 1); window.scrollTo(0, 0) }
  function back() { setStep((s) => s - 1); window.scrollTo(0, 0) }

  const progress = ((step - 1) / (TOTAL_STEPS - 1)) * 100
  // Used for employee-step preview — shows cost at Essentials level (most conservative)
  const empCost = calcEmployeeCost(data.employeeCount, 2)

  if (prefilling) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Loading your saved profile…</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-background px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BookOpenCheck className="h-4 w-4" />
          </div>
          <span className="font-bold text-primary">BookKeeping.business</span>
        </Link>
        <div className="flex items-center gap-3">
          {resuming && (
            <Link href="/dashboard/upgrade" className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2">
              ← Back to upgrade
            </Link>
          )}
          <span className="text-sm text-muted-foreground">Step {step} of {TOTAL_STEPS}</span>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-border">
        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex-1 flex items-start justify-center px-4 py-12">
        <div className="w-full max-w-lg space-y-8">

          {/* ── Step 1: Business type ── */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Step 1 of {TOTAL_STEPS}</p>
                <h1 className="text-2xl font-bold tracking-tight">What type of business do you run?</h1>
                <p className="text-muted-foreground text-sm mt-1">We'll tailor your bookkeeping setup to your industry.</p>
              </div>
              <div className="space-y-2">
                <Label>Business name <span className="text-muted-foreground text-xs">(optional)</span></Label>
                <Input placeholder="e.g. Sunrise Childcare LLC" value={data.businessName}
                  onChange={(e) => set("businessName", e.target.value)} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {BUSINESS_TYPES.map((t) => (
                  <OptionCard key={t.value} label={t.label} selected={data.businessType === t.value}
                    onClick={() => set("businessType", t.value)} />
                ))}
              </div>
            </div>
          )}

          {/* ── Step 2: Owner / contact info (NEW) ── */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Step 2 of {TOTAL_STEPS}</p>
                <h1 className="text-2xl font-bold tracking-tight">Tell us about yourself</h1>
                <p className="text-muted-foreground text-sm mt-1">We need this to set up your account, payroll, and tax filings correctly.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="First name" required>
                  <Input placeholder="John" value={data.ownerFirstName}
                    onChange={(e) => set("ownerFirstName", e.target.value)}
                    className={ownerErrors.ownerFirstName ? "border-destructive" : ""} />
                  {ownerErrors.ownerFirstName && <p className="text-xs text-destructive">{ownerErrors.ownerFirstName}</p>}
                </Field>
                <Field label="Last name" required>
                  <Input placeholder="Smith" value={data.ownerLastName}
                    onChange={(e) => set("ownerLastName", e.target.value)}
                    className={ownerErrors.ownerLastName ? "border-destructive" : ""} />
                  {ownerErrors.ownerLastName && <p className="text-xs text-destructive">{ownerErrors.ownerLastName}</p>}
                </Field>
              </div>

              <Field label="Business email" required>
                <Input type="email" placeholder="john@yourbusiness.com" value={data.ownerEmail}
                  onChange={(e) => set("ownerEmail", e.target.value)}
                  className={ownerErrors.ownerEmail ? "border-destructive" : ""} />
                {ownerErrors.ownerEmail && <p className="text-xs text-destructive">{ownerErrors.ownerEmail}</p>}
              </Field>

              <Field label="Phone number">
                <Input type="tel" placeholder="(813) 555-0100" value={data.ownerPhone}
                  onChange={(e) => set("ownerPhone", e.target.value)} />
              </Field>

              <Field label="EIN — Employer Identification Number"
                hint="Optional now. Required before we can run payroll or file business taxes. Format: 12-3456789">
                <Input placeholder="12-3456789" value={data.ein}
                  onChange={(e) => set("ein", e.target.value)} />
              </Field>

              <div className="border-t border-border pt-4 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Business address</p>
                <Field label="Street address">
                  <Input placeholder="123 Main St, Suite 100" value={data.businessAddress}
                    onChange={(e) => set("businessAddress", e.target.value)} />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="City">
                    <Input placeholder="Tampa" value={data.businessCity}
                      onChange={(e) => set("businessCity", e.target.value)} />
                  </Field>
                  <Field label="ZIP code">
                    <Input placeholder="33601" value={data.businessZip}
                      onChange={(e) => set("businessZip", e.target.value)} />
                  </Field>
                </div>
                <Field label="State">
                  <select
                    value={data.businessState}
                    onChange={(e) => set("businessState", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
              </div>
            </div>
          )}

          {/* ── Step 3: Entity type ── */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Step 3 of {TOTAL_STEPS}</p>
                <h1 className="text-2xl font-bold tracking-tight">What&apos;s your business structure?</h1>
                <p className="text-muted-foreground text-sm mt-1">Determines your tax filing requirements. Skip if unsure.</p>
              </div>
              <div className="space-y-2">
                {ENTITY_TYPES.map((t) => (
                  <OptionCard key={t.value} label={t.label} sub={t.sub}
                    selected={data.entityType === t.value} onClick={() => set("entityType", t.value)} />
                ))}
              </div>
              {data.entityType === "none" && (
                <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
                  We can help you form an LLC as an add-on after signup.
                </div>
              )}
            </div>
          )}

          {/* ── Step 4: Revenue ── */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Step 4 of {TOTAL_STEPS}</p>
                <h1 className="text-2xl font-bold tracking-tight">What&apos;s your annual revenue?</h1>
                <p className="text-muted-foreground text-sm mt-1">Helps us recommend the right plan. Skip if unsure.</p>
              </div>
              <div className="space-y-2">
                {REVENUE_RANGES.map((r) => (
                  <OptionCard key={r.value} label={r.label} selected={data.revenueRange === r.value}
                    onClick={() => set("revenueRange", r.value)} />
                ))}
              </div>
            </div>
          )}

          {/* ── Step 5: Books status ── */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Step 5 of {TOTAL_STEPS}</p>
                <h1 className="text-2xl font-bold tracking-tight">Where are your books right now?</h1>
                <p className="text-muted-foreground text-sm mt-1">No judgment — we handle every situation.</p>
              </div>
              <div className="space-y-2">
                {BOOKS_STATUSES.map((s) => (
                  <OptionCard key={s.value} label={s.label} sub={s.sub}
                    selected={data.booksStatus === s.value} onClick={() => set("booksStatus", s.value)} />
                ))}
              </div>
              <div className="space-y-3 pt-2">
                <p className="text-sm font-semibold">Current bookkeeping software <span className="text-muted-foreground font-normal">(optional)</span></p>
                <div className="flex flex-wrap gap-2">
                  {BOOKKEEPING_PLATFORMS.map((p) => (
                    <Chip key={p.value} label={p.label} selected={data.bookkeepingPlatform === p.value}
                      onClick={() => set("bookkeepingPlatform", data.bookkeepingPlatform === p.value ? "" : p.value)} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 6: Team & employees ── */}
          {step === 6 && (
            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Step 6 of {TOTAL_STEPS}</p>
                <h1 className="text-2xl font-bold tracking-tight">Tell us about your team</h1>
                <p className="text-muted-foreground text-sm mt-1">This determines your payroll pricing. First 5 employees are always included free.</p>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold">Worker types <span className="text-muted-foreground font-normal">(select all that apply)</span></p>
                <div className="flex flex-wrap gap-2">
                  {WORKER_TYPES.map((w) => (
                    <Chip key={w.value} label={w.label}
                      selected={data.workerTypes.includes(w.value)} onClick={() => toggleWorkerType(w.value)} />
                  ))}
                </div>
              </div>

              {/* Employee count with pricing */}
              <div className="rounded-xl border border-border bg-background p-5 space-y-4">
                <p className="text-sm font-semibold">How many employees do you have?</p>
                <div className="flex items-center gap-4">
                  <button type="button" onClick={() => adjustEmployeeCount(-1)}
                    className="h-9 w-9 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors">
                    <Minus className="h-4 w-4" />
                  </button>
                  <div className="flex-1">
                    <Input
                      type="number" min="0" max="500"
                      value={data.employeeCount}
                      onChange={(e) => set("employeeCount", Math.max(0, Math.min(500, parseInt(e.target.value) || 0)))}
                      className="text-center text-xl font-bold h-12"
                    />
                  </div>
                  <button type="button" onClick={() => adjustEmployeeCount(1)}
                    className="h-9 w-9 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Pricing breakdown */}
                <div className="rounded-lg p-3 text-sm space-y-1 bg-primary/5 border border-primary/20">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Employees included in plan</span>
                    <span className="font-medium text-green-600">2–5 (varies by plan)</span>
                  </div>
                  {data.employeeCount > 2 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Additional employees</span>
                      <span className="font-medium">+$10/mo each</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-border/50 pt-1 mt-1">
                    <span className="font-semibold">Exact cost shown per plan below</span>
                    <span className="font-bold text-primary">↓</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 7: Payroll & banking ── */}
          {step === 7 && (
            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Step 7 of {TOTAL_STEPS}</p>
                <h1 className="text-2xl font-bold tracking-tight">Payroll & banking</h1>
                <p className="text-muted-foreground text-sm mt-1">Skip any section you don&apos;t have an answer for yet.</p>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold">Do you need payroll processing?</p>
                <div className="space-y-2">
                  {PAYROLL_OPTIONS.map((o) => (
                    <OptionCard key={o.value} label={o.label} sub={o.sub}
                      selected={data.needsPayroll === o.value} onClick={() => set("needsPayroll", o.value)} />
                  ))}
                </div>
              </div>

              {data.needsPayroll === "yes_current" && (
                <div className="space-y-3">
                  <p className="text-sm font-semibold">Current payroll platform <span className="text-muted-foreground font-normal">(optional)</span></p>
                  <div className="flex flex-wrap gap-2">
                    {PAYROLL_PLATFORMS.map((p) => (
                      <Chip key={p.value} label={p.label} selected={data.payrollPlatform === p.value}
                        onClick={() => set("payrollPlatform", data.payrollPlatform === p.value ? "" : p.value)} />
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <p className="text-sm font-semibold">Business bank accounts</p>
                <div className="flex flex-wrap gap-2">
                  {BANK_COUNTS.map((b) => (
                    <Chip key={b.value} label={b.label} selected={data.bankAccountsCount === b.value}
                      onClick={() => set("bankAccountsCount", data.bankAccountsCount === b.value ? "" : b.value)} />
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold">Business credit cards</p>
                <div className="flex flex-wrap gap-2">
                  {CARD_COUNTS.map((c) => (
                    <Chip key={c.value} label={c.label} selected={data.creditCardsCount === c.value}
                      onClick={() => set("creditCardsCount", data.creditCardsCount === c.value ? "" : c.value)} />
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold">ACH vendor payments?</p>
                <div className="space-y-2">
                  {ACH_OPTIONS.map((a) => (
                    <OptionCard key={a.value} label={a.label} sub={a.sub}
                      selected={data.hasAchVendors === a.value} onClick={() => set("hasAchVendors", a.value)} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 8: Plan selection ── */}
          {step === 8 && (
            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Step 8 of {TOTAL_STEPS}</p>
                <h1 className="text-2xl font-bold tracking-tight">Choose your plan</h1>
                <p className="text-muted-foreground text-sm mt-1">
                  All plans include bookkeeping + payroll + tax filings. Cancel anytime.
                </p>
              </div>

              {/* Employee cost reminder */}
              {data.employeeCount > 2 && (
                <div className="rounded-xl bg-primary/5 border border-primary/20 px-4 py-3 text-sm">
                  <span className="font-medium">You have {data.employeeCount} employees. </span>
                  <span className="text-muted-foreground">Each plan includes a set number — extra employees are +$10/mo each. See per-plan cost below.</span>
                </div>
              )}

              {error && (
                <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">{error}</div>
              )}

              <div className="space-y-3">
                {(Object.entries(PLANS) as [PlanKey, typeof PLANS[PlanKey]][]).map(([key, plan]) => {
                  const planEmpCost = calcEmployeeCost(data.employeeCount, plan.includedEmployees)
                  const total = plan.basePrice + planEmpCost
                  return (
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
                          <div className="text-2xl font-black text-primary">${total}<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
                          {planEmpCost > 0 && (
                            <div className="text-xs text-muted-foreground">${plan.basePrice} + ${planEmpCost} payroll</div>
                          )}
                        </div>
                      </div>
                      <ul className="space-y-1.5">
                        {plan.features.slice(0, 5).map((f) => (
                          <li key={f} className="flex items-start gap-2 text-sm">
                            <Check className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{f}</span>
                          </li>
                        ))}
                      </ul>
                      <Button className="w-full" variant={"popular" in plan && plan.popular ? "default" : "outline"}
                        disabled={loading} onClick={() => handlePlanSelect(key)}>
                        {loading && data.selectedPlan === key
                          ? <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          : null}
                        Get started with {plan.name} — ${total}/mo
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  )
                })}
              </div>

              <div className="rounded-2xl border-2 border-dashed border-border p-5 text-center space-y-3">
                <p className="text-sm font-semibold">Not ready to subscribe yet?</p>
                <p className="text-xs text-muted-foreground">Create a free account to explore your dashboard and upload documents. Upgrade anytime.</p>
                <Button variant="ghost" className="w-full" disabled={loading} onClick={handleSkipPlan}>
                  {loading && data.selectedPlan === "free" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Continue with free account
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground">Secure checkout via Stripe · No setup fees · Cancel anytime</p>
            </div>
          )}

          {/* ── Navigation ── */}
          <div className="flex gap-3">
            {step > 1 && (
              <Button variant="outline" className="bg-transparent" onClick={back} disabled={loading}>
                <ArrowLeft className="h-4 w-4 mr-2" />Back
              </Button>
            )}
            {step < TOTAL_STEPS && (
              <Button className="flex-1"
                disabled={step === 1 && !data.businessType}
                onClick={() => {
                  if (step === 2) {
                    if (!validateOwnerStep()) return
                  }
                  next()
                }}>
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
            {step > 1 && step < TOTAL_STEPS && (
              <Button variant="ghost" className="text-muted-foreground" onClick={next}>Skip</Button>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
