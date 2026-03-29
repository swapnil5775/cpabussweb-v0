import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createClient } from "@supabase/supabase-js"
import type Stripe from "stripe"

// Disable body parsing — Stripe needs the raw body for signature verification
export const dynamic = "force-dynamic"

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function upsertSubscription(
  userId: string,
  subscription: Stripe.Subscription,
  plan?: string
) {
  const data: Record<string, unknown> = {
    user_id: userId,
    stripe_customer_id: subscription.customer as string,
    stripe_subscription_id: subscription.id,
    status: subscription.status,
    current_period_end: new Date((subscription as unknown as { current_period_end: number }).current_period_end * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  }
  if (plan) data.plan = plan

  await admin.from("subscriptions").upsert(data, { onConflict: "user_id" })
}

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get("stripe-signature")!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error("Webhook signature error:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.user_id
        if (!userId) break

        if (session.mode === "subscription" && session.subscription) {
          // Fetch the full subscription object
          const sub = await stripe.subscriptions.retrieve(session.subscription as string)
          await upsertSubscription(userId, sub, session.metadata?.plan)
        }

        if (session.mode === "payment") {
          // Record one-time service order as paid
          await admin.from("service_orders").insert({
            user_id: userId,
            service_type: session.metadata?.service_type,
            amount_cents: session.amount_total,
            stripe_checkout_session_id: session.id,
            status: "paid",
          })
        }
        break
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription
        const userId = sub.metadata?.user_id
        if (!userId) break
        await upsertSubscription(userId, sub)
        break
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription
        const userId = sub.metadata?.user_id
        if (!userId) break
        await admin
          .from("subscriptions")
          .update({ status: "canceled", updated_at: new Date().toISOString() })
          .eq("user_id", userId)
        break
      }
    }
  } catch (err) {
    console.error("Webhook handler error:", err)
    return NextResponse.json({ error: "Handler failed" }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
