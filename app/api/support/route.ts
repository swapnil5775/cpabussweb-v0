export const dynamic = "force-dynamic"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"
import { Resend } from "resend"
import { resolveActiveOrganizationId } from "@/lib/organizations"

const resend = new Resend(process.env.RESEND_API_KEY)
if (!process.env.NOTIFICATION_EMAIL) throw new Error("NOTIFICATION_EMAIL is not set")
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL

async function getAuthUser() {
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
  return supabase.auth.getUser()
}

const admin = () => createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET — list tickets (with latest message preview) for current user
export async function GET() {
  const { data: { user }, error } = await getAuthUser()
  if (error || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const cookieStore = await cookies()
  const orgId = await resolveActiveOrganizationId({ admin: admin(), userId: user.id, cookieStore, suggestedName: "Primary Organization" })

  const { data: tickets } = await admin()
    .from("support_tickets")
    .select("*, support_messages(id, body, is_staff, created_at)")
    .eq("user_id", user.id)
    .eq("organization_id", orgId)
    .order("updated_at", { ascending: false })

  return NextResponse.json({ tickets: tickets ?? [] })
}

// POST — create new ticket with first message, or reply to existing ticket
export async function POST(request: Request) {
  const { data: { user }, error } = await getAuthUser()
  if (error || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const cookieStore = await cookies()
  const orgId = await resolveActiveOrganizationId({ admin: admin(), userId: user.id, cookieStore, suggestedName: "Primary Organization" })

  // Check paid plan
  const { data: subscription } = await admin()
    .from("subscriptions")
    .select("status, plan")
    .eq("user_id", user.id)
    .eq("organization_id", orgId)
    .maybeSingle()

  const { data: bizProfile } = await admin()
    .from("business_profiles")
    .select("selected_plan")
    .eq("user_id", user.id)
    .eq("organization_id", orgId)
    .maybeSingle()

  const isPaid = subscription?.status === "active" || subscription?.status === "trialing"
  const isFree = !isPaid || bizProfile?.selected_plan === "free"

  if (isFree) {
    return NextResponse.json({ error: "Support messaging is available on paid plans only." }, { status: 403 })
  }

  const body = await request.json()
  const { subject, message, ticket_id } = body

  if (!message?.trim()) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 })
  }

  let ticketId = ticket_id

  // New ticket
  if (!ticketId) {
    if (!subject?.trim()) return NextResponse.json({ error: "Subject is required" }, { status: 400 })

    const { data: ticket, error: ticketErr } = await admin()
      .from("support_tickets")
      .insert({ user_id: user.id, organization_id: orgId, subject: subject.trim(), status: "open" })
      .select()
      .single()

    if (ticketErr || !ticket) {
      return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 })
    }
    ticketId = ticket.id
  } else {
    // Update ticket timestamp + reopen if closed
    await admin()
      .from("support_tickets")
      .update({ updated_at: new Date().toISOString(), status: "open" })
      .eq("id", ticketId)
      .eq("user_id", user.id)
      .eq("organization_id", orgId)
  }

  const { error: msgErr } = await admin()
    .from("support_messages")
    .insert({ ticket_id: ticketId, user_id: user.id, organization_id: orgId, body: message.trim(), is_staff: false })

  if (msgErr) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }

  const escHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;")
  // Notify admin via Resend (non-blocking)
  resend.emails.send({
    from: "BookKeeping.business Support <noreply@webhost4ever.com>",
    to: NOTIFICATION_EMAIL,
    subject: `[Support] ${subject ?? "New reply"} — ${user.email}`,
    html: `
      <p><strong>From:</strong> ${escHtml(user.email ?? "")}</p>
      <p><strong>Subject:</strong> ${escHtml(subject ?? "(reply)")}</p>
      <p><strong>Message:</strong></p>
      <blockquote style="border-left:3px solid #e5e7eb;padding-left:12px;color:#374151">${escHtml(message.trim()).replace(/\n/g, "<br>")}</blockquote>
      <p style="color:#9ca3af;font-size:13px">Ticket ID: ${escHtml(ticketId)}</p>
    `,
  }).catch(() => {})

  return NextResponse.json({ success: true, ticket_id: ticketId })
}
