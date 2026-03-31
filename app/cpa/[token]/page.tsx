import { createClient } from "@supabase/supabase-js"
import { notFound } from "next/navigation"
import { BookOpenCheck, FileUp, CalendarClock, Building2, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function CpaPortalPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  // Look up token
  const { data: tokenRow } = await admin
    .from("cpa_access_tokens")
    .select("client_user_id, label")
    .eq("token", token)
    .single()

  if (!tokenRow) notFound()

  const userId = tokenRow.client_user_id

  // Load client data
  const [
    { data: profile },
    { data: subscription },
    { data: docs },
  ] = await Promise.all([
    admin.from("business_profiles").select("business_name, entity_type, selected_plan").eq("user_id", userId).single(),
    admin.from("subscriptions").select("plan, status").eq("user_id", userId).single(),
    admin.from("documents").select("file_name, document_type, created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(20),
  ])

  const businessName = profile?.business_name ?? "This Business"
  const planName = subscription?.plan
    ? subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)
    : "Free"
  const entityMap: Record<string, string> = {
    sole_prop: "Sole Proprietorship", llc_single: "Single-Member LLC",
    llc_multi: "Multi-Member LLC", s_corp: "S-Corporation",
    c_corp: "C-Corporation", partnership: "Partnership", none: "Not yet formed",
  }
  const entityLabel = profile?.entity_type ? (entityMap[profile.entity_type] ?? profile.entity_type) : "—"

  const now = new Date()
  const currentYear = now.getFullYear()
  const allDeadlines = [
    { label: "Partnership / S-Corp Returns", date: new Date(currentYear, 2, 15), desc: "Form 1065 / 1120-S" },
    { label: "Individual / C-Corp Returns", date: new Date(currentYear, 3, 15), desc: "Form 1040 / 1120" },
    { label: "Q1 Estimated Tax", date: new Date(currentYear, 3, 15), desc: "Form 1040-ES" },
    { label: "Q2 Estimated Tax", date: new Date(currentYear, 5, 16), desc: "Form 1040-ES" },
    { label: "Extended Partnership / S-Corp", date: new Date(currentYear, 8, 15), desc: "If extension filed" },
    { label: "Q3 Estimated Tax", date: new Date(currentYear, 8, 15), desc: "Form 1040-ES" },
    { label: "Extended Individual / C-Corp", date: new Date(currentYear, 9, 15), desc: "If extension filed" },
  ]
  const upcomingDeadlines = allDeadlines.filter((d) => d.date >= now).sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 4)

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header */}
      <header className="border-b border-border bg-background px-4 py-4">
        <div className="mx-auto max-w-4xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BookOpenCheck className="h-4 w-4" />
            </div>
            <span className="font-bold text-primary text-sm">BookKeeping.business</span>
          </div>
          <Badge variant="outline" className="text-xs gap-1">
            <Shield className="h-3 w-3" />
            Read-only CPA View
          </Badge>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 space-y-6">
        {/* Title */}
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">
            {tokenRow.label ? `Shared with ${tokenRow.label}` : "Shared Workspace"}
          </p>
          <h1 className="text-2xl font-bold">{businessName}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            You are viewing a read-only snapshot of this client&apos;s bookkeeping workspace.
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Business Entity</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
              <p className="text-sm font-semibold">{entityLabel}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Bookkeeping Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-semibold">{planName} Plan</p>
              <p className="text-xs text-muted-foreground">{subscription?.status === "active" ? "Active subscription" : "Inactive"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Documents on File</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-2">
              <FileUp className="h-4 w-4 text-muted-foreground shrink-0" />
              <p className="text-sm font-semibold">{docs?.length ?? 0} files</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Documents */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <FileUp className="h-4 w-4" />
                Documents on File
              </CardTitle>
            </CardHeader>
            <CardContent>
              {docs && docs.length > 0 ? (
                <ul className="space-y-2">
                  {docs.map((doc, i) => (
                    <li key={i} className="flex items-center justify-between gap-2 py-1.5 border-b border-border last:border-0">
                      <p className="text-sm truncate">{doc.file_name}</p>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {new Date(doc.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>
              )}
            </CardContent>
          </Card>

          {/* Tax deadlines */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <CalendarClock className="h-4 w-4" />
                Upcoming Tax Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {upcomingDeadlines.map((d) => {
                  const daysLeft = Math.ceil((d.date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                  const urgent = daysLeft <= 14
                  return (
                    <li key={d.label} className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{d.label}</p>
                        <p className="text-xs text-muted-foreground">{d.desc}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-semibold">{d.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                        <p className={`text-xs ${urgent ? "text-amber-600 font-medium" : "text-muted-foreground"}`}>
                          {daysLeft === 0 ? "Today" : `${daysLeft}d`}
                        </p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CPA signup prompt */}
        <div className="rounded-2xl border border-border bg-background px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-sm">Are you a CPA or bookkeeper?</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Create a free account to manage multiple clients and access their shared workspaces in one place.
            </p>
          </div>
          <Link href="/signup" className="shrink-0">
            <Button size="sm" variant="outline" className="bg-transparent">
              Create free account
            </Button>
          </Link>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          This is a read-only view. Data is managed by BookKeeping.business on behalf of the client.
        </p>
      </main>
    </div>
  )
}
