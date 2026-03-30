import { createClient } from "@/lib/supabase/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2, Clock, FileUp, ShoppingBag, ArrowRight, CreditCard,
  Building2, BookOpen, AlertCircle, Star
} from "lucide-react"
import { PLANS, ONE_TIME_SERVICES } from "@/lib/stripe-plans"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; plan?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const admin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const [{ data: profile }, { data: subscription }, { data: recentDocs }] = await Promise.all([
    admin.from("business_profiles").select("*").eq("user_id", user.id).single(),
    admin.from("subscriptions").select("*").eq("user_id", user.id).single(),
    admin.from("documents").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(3),
  ])

  // Free tier — no subscription record, or profile selected "free"
  const isFree = !subscription || subscription.status === "canceled" || profile?.selected_plan === "free"

  const isSettingUp = subscription?.status === "pending" && params.session_id
  const planConfig = subscription?.plan ? PLANS[subscription.plan as keyof typeof PLANS] : null
  const firstName = (user.user_metadata as { first_name?: string })?.first_name ?? ""

  // Contextual upsell offers based on profile
  const upsells: { key: string; title: string; desc: string; price: string; icon: React.ElementType }[] = []

  if (profile?.entity_type === "none") {
    upsells.push({
      key: "llc_formation",
      title: ONE_TIME_SERVICES.llc_formation.name,
      desc: ONE_TIME_SERVICES.llc_formation.description,
      price: ONE_TIME_SERVICES.llc_formation.displayPrice,
      icon: Building2,
    })
  }

  const month = new Date().getMonth() + 1
  if (month >= 1 && month <= 4) {
    upsells.push({
      key: "tax_business",
      title: ONE_TIME_SERVICES.tax_business.name,
      desc: ONE_TIME_SERVICES.tax_business.description,
      price: ONE_TIME_SERVICES.tax_business.displayPrice,
      icon: BookOpen,
    })
  }

  if (profile?.books_status === "behind_3_plus" || profile?.books_status === "never_done") {
    upsells.push({
      key: "catchup",
      title: "Catchup Bookkeeping",
      desc: "Get your historical books cleaned up before monthly service begins.",
      price: "Custom quote",
      icon: AlertCircle,
    })
  }

  return (
    <div className="space-y-8">
      {/* Free tier upgrade banner */}
      {isFree && (
        <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-bold text-primary">You&apos;re on a free account</p>
            <p className="text-sm text-muted-foreground mt-0.5">Upgrade to activate your bookkeeper, get monthly reports, and include tax filing.</p>
          </div>
          <Link href="/onboarding" className="shrink-0">
            <Button size="sm">
              View Plans
              <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      )}

      {/* Success banner after payment */}
      {isSettingUp && (
        <div className="rounded-2xl bg-primary text-primary-foreground px-6 py-5 flex items-center gap-4">
          <Star className="h-6 w-6 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-bold">Welcome aboard! Your account is being set up.</p>
            <p className="text-sm opacity-90 mt-0.5">Your dedicated bookkeeper will reach out within 1 business day.</p>
          </div>
        </div>
      )}

      {/* Overview header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {firstName ? `Hey, ${firstName}` : "Your Dashboard"}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {profile?.business_name ?? "Your account"} — {planConfig?.name ?? subscription.plan} Plan
        </p>
      </div>

      {/* Status + Plan cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Account Status</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            {subscription?.status === "active" ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-600" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-sm">Active</p>
                  <p className="text-xs text-muted-foreground">Books in good standing</p>
                </div>
              </>
            ) : (
              <>
                <Clock className="h-5 w-5 text-amber-500" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-sm">Setting up</p>
                  <p className="text-xs text-muted-foreground">We&apos;ll reach out shortly</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Your Plan</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">{isFree ? "Free Account" : (planConfig?.name ?? subscription?.plan)}</p>
              <p className="text-xs text-muted-foreground">{isFree ? "Upgrade to activate" : `${planConfig?.displayPrice}/mo`}</p>
            </div>
            <Badge variant={isFree ? "outline" : "default"} className="text-xs">{isFree ? "Free" : "Active"}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Link href="/dashboard/documents">
              <Button variant="outline" size="sm" className="w-full bg-transparent justify-start">
                <FileUp className="h-4 w-4 mr-2" aria-hidden="true" />
                Upload Documents
              </Button>
            </Link>
            <ManageBillingButton />
          </CardContent>
        </Card>
      </div>

      {/* Upsell offers */}
      {upsells.length > 0 && (
        <section className="space-y-4">
          <div>
            <h2 className="font-semibold text-base">Recommended Add-ons</h2>
            <p className="text-sm text-muted-foreground">Based on your business profile</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {upsells.map((offer) => {
              const Icon = offer.icon
              return (
                <Card key={offer.key} className="hover:border-primary/40 transition-colors">
                  <CardContent className="pt-5 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm">{offer.title}</p>
                          <Badge variant="outline" className="text-xs shrink-0">{offer.price}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{offer.desc}</p>
                      </div>
                    </div>
                    <Link href={`/dashboard/services?highlight=${offer.key}`}>
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        Learn More
                        <ArrowRight className="h-3.5 w-3.5 ml-2" aria-hidden="true" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>
      )}

      {/* Recent documents */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-base">Recent Documents</h2>
          <Link href="/dashboard/documents" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        {recentDocs && recentDocs.length > 0 ? (
          <div className="space-y-2">
            {recentDocs.map((doc) => (
              <div key={doc.id} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-background">
                <FileUp className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{doc.file_name}</p>
                  <p className="text-xs text-muted-foreground">{new Date(doc.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-border px-6 py-10 text-center">
            <FileUp className="h-8 w-8 mx-auto text-muted-foreground mb-3" aria-hidden="true" />
            <p className="text-sm font-medium">No documents yet</p>
            <p className="text-xs text-muted-foreground mt-1">Upload bank statements, receipts, or tax docs</p>
            <Link href="/dashboard/documents" className="mt-4 inline-block">
              <Button size="sm">Upload a Document</Button>
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}

function ManageBillingButton() {
  return (
    <form action="/api/stripe/create-portal" method="POST">
      <Button variant="outline" size="sm" className="w-full bg-transparent justify-start" type="submit">
        <CreditCard className="h-4 w-4 mr-2" aria-hidden="true" />
        Manage Billing
      </Button>
    </form>
  )
}
