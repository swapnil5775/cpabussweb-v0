import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"
import { NextResponse } from "next/server"

// Simple in-memory rate limiter: max 3 submissions per IP per 10 minutes
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_MAX = 3
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return true
  }

  if (entry.count >= RATE_LIMIT_MAX) return false

  entry.count++
  return true
}

function row(label: string, value: string | null | undefined) {
  if (!value) return ""
  return `<tr>
    <td style="padding:8px 12px;font-weight:600;color:#374151;white-space:nowrap;vertical-align:top;">${label}</td>
    <td style="padding:8px 12px;color:#111827;">${value}</td>
  </tr>`
}

export async function POST(request: Request) {
  // Rate limiting
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown"

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a few minutes before trying again." },
      { status: 429 }
    )
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  // Required field validation
  const { firstName, lastName, email } = body
  if (
    !firstName || typeof firstName !== "string" || firstName.trim().length === 0 ||
    !lastName || typeof lastName !== "string" || lastName.trim().length === 0 ||
    !email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return NextResponse.json(
      { error: "First name, last name, and a valid email are required." },
      { status: 400 }
    )
  }

  // Use service role key to bypass RLS for server-side inserts
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error: dbError } = await supabase.from("leads").insert({
    first_name: (firstName as string).trim(),
    last_name: (lastName as string).trim(),
    email: (email as string).trim().toLowerCase(),
    phone: typeof body.phone === "string" && body.phone ? body.phone.trim() : null,
    preferred_contact_method: body.preferredContact ?? "email",
    service_type: body.clientType ?? null,
    services_needed: Array.isArray(body.servicesNeeded) ? body.servicesNeeded : [],
    business_legal_name: typeof body.businessName === "string" && body.businessName ? body.businessName.trim() : null,
    entity_type: body.businessStructure ?? null,
    states_of_operation: typeof body.stateOfFormation === "string" && body.stateOfFormation
      ? [body.stateOfFormation.trim()]
      : null,
    annual_revenue_bucket: body.estimatedRevenue ?? null,
    current_software: body.accountingSoftware ?? null,
    current_bookkeeping_management: body.currentSituation ?? null,
    pain_points: body.hearAboutUs ?? null,
    anything_else: body.additionalNotes ?? null,
    status: "new",
  })

  if (dbError) {
    console.error("Supabase insert error:", dbError)
    return NextResponse.json(
      { error: "Failed to save your request. Please try again." },
      { status: 500 }
    )
  }

  // Send email notification (non-blocking — don't fail the response if email fails)
  const notificationEmail = process.env.NOTIFICATION_EMAIL
  const resendKey = process.env.RESEND_API_KEY

  if (notificationEmail && resendKey) {
    try {
      const resend = new Resend(resendKey)
      const fullName = `${(firstName as string).trim()} ${(lastName as string).trim()}`
      const services = Array.isArray(body.servicesNeeded) && body.servicesNeeded.length > 0
        ? (body.servicesNeeded as string[]).join(", ")
        : null

      await resend.emails.send({
        from: "BookKeeping.business <noreply@bookkeeping.business>",
        to: notificationEmail,
        subject: `New lead: ${fullName} — BookKeeping.business`,
        html: `
          <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;background:#f9fafb;padding:32px 24px;">
            <div style="background:#1e3829;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
              <h1 style="margin:0;color:#fff;font-size:20px;font-weight:700;">
                📬 New Lead — BookKeeping.business
              </h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.7);font-size:14px;">
                Submitted ${new Date().toLocaleString("en-US", { timeZone: "America/New_York", dateStyle: "full", timeStyle: "short" })} ET
              </p>
            </div>

            <div style="background:#fff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;margin-bottom:20px;">
              <table style="width:100%;border-collapse:collapse;font-size:14px;">
                ${row("Name", fullName)}
                ${row("Email", `<a href="mailto:${(email as string).trim().toLowerCase()}" style="color:#1e3829;">${(email as string).trim().toLowerCase()}</a>`)}
                ${row("Phone", typeof body.phone === "string" ? body.phone : null)}
                ${row("Preferred Contact", typeof body.preferredContact === "string" ? body.preferredContact : null)}
                ${row("Client Type", typeof body.clientType === "string" ? body.clientType : null)}
                ${row("Services Needed", services)}
                ${row("Business Name", typeof body.businessName === "string" ? body.businessName : null)}
                ${row("Business Structure", typeof body.businessStructure === "string" ? body.businessStructure : null)}
                ${row("State", typeof body.stateOfFormation === "string" ? body.stateOfFormation : null)}
                ${row("Est. Revenue", typeof body.estimatedRevenue === "string" ? body.estimatedRevenue : null)}
                ${row("Current Software", typeof body.accountingSoftware === "string" ? body.accountingSoftware : null)}
                ${row("Current Situation", typeof body.currentSituation === "string" ? body.currentSituation : null)}
                ${row("How They Heard", typeof body.hearAboutUs === "string" ? body.hearAboutUs : null)}
                ${row("Additional Notes", typeof body.additionalNotes === "string" ? body.additionalNotes : null)}
              </table>
            </div>

            <div style="text-align:center;">
              <a href="mailto:${(email as string).trim().toLowerCase()}"
                style="display:inline-block;background:#1e3829;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
                Reply to ${(firstName as string).trim()}
              </a>
            </div>

            <p style="margin-top:24px;text-align:center;font-size:12px;color:#9ca3af;">
              BookKeeping.business — bookkeeping.business
            </p>
          </div>
        `,
      })
    } catch (emailErr) {
      // Log but don't block — lead is already saved in Supabase
      console.error("Email notification failed:", emailErr)
    }
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
