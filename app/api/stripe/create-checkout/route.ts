export const dynamic = "force-dynamic"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { PLANS, ONE_TIME_SERVICES, type PlanKey, type ServiceKey } from "@/lib/stripe-plans"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.bookkeeping.business"

export async function POST(request: Request) {
  const body = await request.json()
  const { plan, serviceType } = body // plan = PlanKey, serviceType = ServiceKey (one-time)

  // Auth check
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    }
  )

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    if (plan) {
      // ── Subscription checkout ─────────────────────────────
      const planConfig = PLANS[plan as PlanKey]
      if (!planConfig?.priceId) {
        return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
      }

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [{ price: planConfig.priceId, quantity: 1 }],
        success_url: `${SITE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
        cancel_url: `${SITE_URL}/onboarding`,
        customer_email: user.email,
        metadata: { user_id: user.id, plan },
        subscription_data: { metadata: { user_id: user.id, plan } },
      })

      return NextResponse.json({ url: session.url })
    }

    if (serviceType) {
      // ── One-time service checkout ─────────────────────────
      const svc = ONE_TIME_SERVICES[serviceType as ServiceKey]
      if (!svc?.priceId) {
        return NextResponse.json({ error: "Invalid service" }, { status: 400 })
      }

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [{ price: svc.priceId, quantity: 1 }],
        success_url: `${SITE_URL}/dashboard/services?session_id={CHECKOUT_SESSION_ID}&service=${serviceType}`,
        cancel_url: `${SITE_URL}/dashboard/services`,
        customer_email: user.email,
        metadata: { user_id: user.id, service_type: serviceType },
      })

      return NextResponse.json({ url: session.url })
    }

    return NextResponse.json({ error: "Must provide plan or serviceType" }, { status: 400 })
  } catch (err) {
    console.error("Stripe checkout error:", err)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
