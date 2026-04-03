import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createClient } from "@supabase/supabase-js"
import type Stripe from "stripe"
import { Resend } from "resend"
import { buildOrderNumber, getServiceName } from "@/lib/service-intake"

// Disable body parsing — Stripe needs the raw body for signature verification
export const dynamic = "force-dynamic"

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.bookkeeping.business"

async function upsertSubscription(
  userId: string,
  organizationId: string | undefined,
  subscription: Stripe.Subscription,
  plan?: string
) {
  let effectiveOrgId = organizationId
  if (!effectiveOrgId) {
    const { data: defaultOrg } = await admin
      .from("organizations")
      .select("id")
      .eq("user_id", userId)
      .eq("is_default", true)
      .maybeSingle()
    effectiveOrgId = defaultOrg?.id
  }

  const data: Record<string, unknown> = {
    user_id: userId,
    organization_id: effectiveOrgId ?? null,
    stripe_customer_id: subscription.customer as string,
    stripe_subscription_id: subscription.id,
    status: subscription.status,
    current_period_end: new Date((subscription as unknown as { current_period_end: number }).current_period_end * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  }
  if (plan) data.plan = plan

  await admin.from("subscriptions").upsert(data, { onConflict: "organization_id" })
}

async function resolveDefaultOrganizationId(userId: string): Promise<string | null> {
  const { data: defaultOrg } = await admin
    .from("organizations")
    .select("id")
    .eq("user_id", userId)
    .eq("is_default", true)
    .maybeSingle()
  return defaultOrg?.id ?? null
}

async function sendServiceOrderEmail(params: {
  userId: string
  organizationId: string
  orderId: string
  orderNumber: string
  serviceType: string | null | undefined
}) {
  if (!resend) return
  const { data } = await admin.auth.admin.getUserById(params.userId)
  const to = data.user?.email
  if (!to) return

  const serviceName = getServiceName(params.serviceType)
  const intakeUrl = `${SITE_URL}/dashboard/services/orders/${params.orderId}/intake`

  await resend.emails.send({
    from: `BookKeeping.business <noreply@${process.env.RESEND_VERIFIED_DOMAIN}>`,
    to,
    subject: `${serviceName} order received — ${params.orderNumber}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h2 style="margin:0 0 8px">Order Confirmed: ${serviceName}</h2>
        <p style="margin:0 0 12px;color:#475569">Order Number: <strong>${params.orderNumber}</strong></p>
        <p style="margin:0 0 18px;color:#475569">
          Payment is complete. Please finish your intake form so our team can begin work immediately.
          You can submit now or continue later using the same link.
        </p>
        <a href="${intakeUrl}" style="display:inline-block;background:#0f172a;color:#fff;text-decoration:none;padding:12px 16px;border-radius:8px;font-weight:600">
          Complete Intake Form
        </a>
        <p style="margin-top:18px;color:#64748b;font-size:12px">
          Timeline starts after intake submission. You will receive status updates by email.
        </p>
      </div>
    `,
  })
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
        const organizationId = session.metadata?.organization_id
        if (!userId) break

        if (session.mode === "subscription" && session.subscription) {
          // Fetch the full subscription object
          const sub = await stripe.subscriptions.retrieve(session.subscription as string)
          await upsertSubscription(userId, organizationId, sub, session.metadata?.plan)

          // Referral credit: check if this user was referred
          try {
            const { data: { user: newUser } } = await admin.auth.admin.getUserById(userId)
            const refCode = (newUser?.user_metadata as Record<string, string> | undefined)?.ref_code
            if (refCode && session.mode === "subscription") {
              const { data: codeRow } = await admin.from("referral_codes").select("user_id").eq("code", refCode).single()
              if (codeRow) {
                // Find the invite
                const { data: invite } = await admin
                  .from("referral_invites")
                  .select("id")
                  .eq("referrer_id", codeRow.user_id)
                  .eq("status", "pending")
                  .limit(1)
                  .single()
                if (invite) {
                  await admin.from("referral_invites").update({ status: "converted", referred_user_id: userId }).eq("id", invite.id)
                  await admin.from("referral_credits").insert({ user_id: codeRow.user_id, invite_id: invite.id })
                }
              }
            }
          } catch (_) { /* non-blocking */ }
        }

        if (session.mode === "payment") {
          let effectiveOrgId = organizationId
          if (!effectiveOrgId) {
            const { data: defaultOrg } = await admin
              .from("organizations")
              .select("id")
              .eq("user_id", userId)
              .eq("is_default", true)
              .maybeSingle()
            effectiveOrgId = defaultOrg?.id
          }
          if (!effectiveOrgId) break

          // Strip the cs_test_/cs_live_ prefix so buildOrderNumber gets the unique part of the session id
          const sessionSuffix = session.id.replace(/^cs_(test|live)_/, "")
          const orderNumber = buildOrderNumber(sessionSuffix, session.created ? new Date(session.created * 1000).toISOString() : new Date().toISOString())
          // Record one-time service order as paid
          const orderPayload = {
            user_id: userId,
            organization_id: effectiveOrgId,
            order_number: orderNumber,
            service_type: session.metadata?.service_type,
            amount_cents: session.amount_total,
            stripe_checkout_session_id: session.id,
            status: "paid",
            intake_status: "pending",
            intake_answers: {},
            updated_at: new Date().toISOString(),
          }
          const { data: insertedOrder } = await admin
            .from("service_orders")
            .upsert(orderPayload, { onConflict: "stripe_checkout_session_id", ignoreDuplicates: true })
            .select("id, order_number")
            .maybeSingle()

          const savedOrder = insertedOrder
            ? insertedOrder
            : (await admin
              .from("service_orders")
              .select("id, order_number")
              .eq("stripe_checkout_session_id", session.id)
              .maybeSingle()
            ).data

          if (savedOrder?.id) {
            await sendServiceOrderEmail({
              userId,
              organizationId: effectiveOrgId,
              orderId: savedOrder.id,
              orderNumber: savedOrder.order_number ?? orderNumber,
              serviceType: session.metadata?.service_type,
            })
          }
        }
        break
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription
        const userId = sub.metadata?.user_id
        const organizationId = sub.metadata?.organization_id
        if (!userId) break
        await upsertSubscription(userId, organizationId, sub)
        break
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription
        const userId = sub.metadata?.user_id
        if (!userId) break
        const organizationId = sub.metadata?.organization_id ?? await resolveDefaultOrganizationId(userId)
        if (!organizationId) break
        await admin
          .from("subscriptions")
          .update({ status: "canceled", updated_at: new Date().toISOString() })
          .eq("user_id", userId)
          .eq("organization_id", organizationId)
        break
      }
    }
  } catch (err) {
    console.error("Webhook handler error:", err)
    return NextResponse.json({ error: "Handler failed" }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
