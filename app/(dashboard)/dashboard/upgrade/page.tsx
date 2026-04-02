import { createClient as createServiceClient } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import Link from "next/link"
import { CheckCircle2, Edit2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PLANS, calcEmployeeCost, formatEmployeeCost, type PlanKey } from "@/lib/stripe-plans"
import { UpgradePlanPicker } from "@/components/dashboard/upgrade-plan-picker"
import { resolveActiveOrganizationId } from "@/lib/organizations"

// Label maps (mirrors onboarding page constants)
const BIZ_TYPE: Record<string, string> = {
  restaurant: "Restaurant / Food Service", hotel: "Hotel / Hospitality",
  childcare: "Childcare / Daycare", realtor: "Real Estate / Realtor",
  home_based: "Home-Based Business", tutoring: "Tutoring / Education",
  retail: "Retail Shop", other: "Other Small Business",
}
const ENTITY: Record<string, string> = {
  none: "No Entity Yet", sole_prop: "Sole Proprietor", llc_single: "Single-Member LLC",
  llc_multi: "Multi-Member LLC", s_corp: "S-Corporation", c_corp: "C-Corporation",
  partnership: "Partnership",
}
const REVENUE: Record<string, string> = {
  under_50k: "Under $50K / year", "50k_100k": "$50K – $100K / year",
  "100k_250k": "$100K – $250K / year", "250k_500k": "$250K – $500K / year",
  over_500k: "Over $500K / year",
}
const BOOKS: Record<string, string> = {
  current: "Up to date", behind_1_3: "1–3 months behind",
  behind_3_plus: "3+ months behind", never_done: "Never tracked",
}
const PLATFORM: Record<string, string> = {
  quickbooks: "QuickBooks Online", xero: "Xero", freshbooks: "FreshBooks",
  wave: "Wave", spreadsheet: "Excel / Google Sheets", none: "Starting fresh", other: "Other",
}
const WORKER: Record<string, string> = {
  ft_w2: "Full-time W2", pt_w2: "Part-time W2", contractors_1099: "1099 Contractors",
  per_diem: "Per-Diem", international: "International", just_me: "Just me",
}
const PAYROLL_OPT: Record<string, string> = {
  yes_current: "Yes — existing system", yes_new: "Yes — new platform", no: "No payroll needed",
}
const PAYROLL_PLAT: Record<string, string> = {
  quickbooks_payroll: "QuickBooks Payroll", gusto: "Gusto", adp: "ADP",
  paychex: "Paychex", rippling: "Rippling", other: "Other",
}

function label(map: Record<string, string>, val?: string | null) {
  if (!val) return null
  return map[val] ?? val
}

function SummaryRow({ title, value, step }: { title: string; value: string | null; step?: number }) {
  if (!value) return null
  return (
    <div className="flex items-start justify-between gap-3 py-2 border-b border-border/50 last:border-0">
      <div>
        <p className="text-xs text-muted-foreground">{title}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
      {step && (
        <Link href={`/onboarding?resume=true&step=${step}`} className="shrink-0">
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground">
            <Edit2 className="h-3 w-3" />Edit
          </Button>
        </Link>
      )}
    </div>
  )
}

export default async function UpgradePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const admin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const cookieStore = await cookies()
  const organizationId = await resolveActiveOrganizationId({
    admin,
    userId: user.id,
    cookieStore,
    suggestedName: "Primary Organization",
  })

  const [{ data: bp }, { data: cp }] = await Promise.all([
    admin.from("business_profiles").select("*").eq("user_id", user.id).eq("organization_id", organizationId).maybeSingle(),
    admin.from("client_profiles").select("*").eq("user_id", user.id).eq("organization_id", organizationId).maybeSingle(),
  ])

  const hasProfile = !!(bp?.business_name || bp?.entity_type || cp?.full_name)
  const empCount: number = bp?.employee_count ?? 0
  const empCost = calcEmployeeCost(empCount)
  const workerTypes: string[] = Array.isArray(bp?.worker_types) ? bp.worker_types : []

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Back */}
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Choose Your Plan</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {hasProfile
            ? "Your profile is saved — just pick a plan to get started."
            : "Complete your profile below or go straight to plan selection."}
        </p>
      </div>

      {/* Profile summary card */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold">Your Business Profile</CardTitle>
          <Link href="/onboarding?resume=true">
            <Button variant="outline" size="sm" className="h-7 px-3 text-xs gap-1.5 bg-transparent">
              <Edit2 className="h-3 w-3" />
              Edit All
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-0">
          {hasProfile ? (
            <>
              <SummaryRow title="Business Name" value={bp?.business_name ?? null} step={1} />
              <SummaryRow title="Business Type" value={label(BIZ_TYPE, bp?.business_type)} step={1} />
              <SummaryRow
                title="Owner"
                value={[cp?.owner_first_name, cp?.owner_last_name].filter(Boolean).join(" ") || cp?.full_name || null}
                step={2}
              />
              <SummaryRow title="Owner Email" value={cp?.owner_email ?? cp?.secondary_email ?? null} step={2} />
              <SummaryRow title="Phone" value={cp?.phone ?? null} step={2} />
              <SummaryRow title="EIN" value={bp?.ein ?? null} step={2} />
              <SummaryRow
                title="Business Address"
                value={[cp?.business_address_line1, cp?.business_city, bp?.business_state, bp?.business_zip].filter(Boolean).join(", ") || null}
                step={2}
              />
              <SummaryRow title="Entity Type" value={label(ENTITY, bp?.entity_type)} step={3} />
              <SummaryRow title="Annual Revenue" value={label(REVENUE, bp?.revenue_range)} step={4} />
              <SummaryRow title="Books Status" value={label(BOOKS, bp?.books_status)} step={5} />
              <SummaryRow title="Bookkeeping Platform" value={label(PLATFORM, bp?.bookkeeping_platform)} step={5} />
              {workerTypes.length > 0 && (
                <SummaryRow
                  title="Worker Types"
                  value={workerTypes.map((w) => WORKER[w] ?? w).join(", ")}
                  step={6}
                />
              )}
              {empCount > 0 && (
                <SummaryRow
                  title="Employees"
                  value={`${empCount} employee${empCount !== 1 ? "s" : ""} — ${formatEmployeeCost(empCount)}`}
                  step={6}
                />
              )}
              <SummaryRow title="Payroll" value={label(PAYROLL_OPT, bp?.needs_payroll)} step={7} />
              {bp?.payroll_platform && (
                <SummaryRow title="Payroll Platform" value={label(PAYROLL_PLAT, bp.payroll_platform)} step={7} />
              )}
            </>
          ) : (
            <div className="py-6 text-center space-y-3">
              <p className="text-sm text-muted-foreground">No profile saved yet.</p>
              <Link href="/onboarding">
                <Button size="sm">Complete Your Profile</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plan selection */}
      <div className="space-y-3">
        <div>
          <h2 className="font-semibold text-base">Select a Plan</h2>
          <p className="text-xs text-muted-foreground mt-0.5">All plans include dedicated bookkeeper + monthly reports + tax filing.</p>
        </div>
        <UpgradePlanPicker employeeCount={empCount} />
      </div>

      <p className="text-xs text-center text-muted-foreground pb-4">
        Secure checkout via Stripe · No setup fees · Cancel anytime
      </p>
    </div>
  )
}
