import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { Lock, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FinancialsDashboard } from "@/components/dashboard/financials-dashboard"
import { resolveActiveOrganizationId } from "@/lib/organizations"

export default async function FinancialsPage() {
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

  const [
    { data: profile },
    { data: subscription },
  ] = await Promise.all([
    admin.from("business_profiles").select("selected_plan").eq("user_id", user.id).eq("organization_id", organizationId).maybeSingle(),
    admin.from("subscriptions").select("status, plan").eq("user_id", user.id).eq("organization_id", organizationId).maybeSingle(),
  ])

  const isFree = !subscription || subscription.status === "canceled" || profile?.selected_plan === "free"

  if (isFree) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-amber-600" />
            <CardTitle>Financials is a premium feature</CardTitle>
          </div>
          <CardDescription>
            Upgrade to unlock live financial statements, report exports, and a client-friendly reporting view on top of your QuickBooks data.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-3 flex-wrap">
          <Button asChild>
            <Link href="/dashboard/upgrade">
              <Sparkles className="h-4 w-4" />
              Upgrade Plan
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return <FinancialsDashboard />
}
