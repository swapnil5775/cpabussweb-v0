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
  return `
    <tr style="border-bottom:1px solid #f3f4f6;">
      <td style="padding:10px 16px;font-weight:600;color:#374151;white-space:nowrap;vertical-align:top;font-size:13px;width:160px;">${label}</td>
      <td style="padding:10px 16px;color:#111827;font-size:13px;">${value}</td>
    </tr>`
}

const BRAND_GREEN = "#1e3829"
const BRAND_LIGHT = "#f0f7f3"

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown"
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
      ? [body.stateOfFormation.trim()] : null,
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

  // ── Email notifications (non-blocking) ──────────────────────────────────
  const resendKey = process.env.RESEND_API_KEY
  const notificationEmail = process.env.NOTIFICATION_EMAIL
  const domain = process.env.RESEND_VERIFIED_DOMAIN ?? "webhost4ever.com"
  const fromAddress = `BookKeeping.business <noreply@${domain}>`

  if (resendKey) {
    const resend = new Resend(resendKey)
    const firstName_ = (firstName as string).trim()
    const lastName_ = (lastName as string).trim()
    const email_ = (email as string).trim().toLowerCase()
    const fullName = `${firstName_} ${lastName_}`
    const services = Array.isArray(body.servicesNeeded) && body.servicesNeeded.length > 0
      ? (body.servicesNeeded as string[]).join(", ") : null
    const submittedAt = new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
      dateStyle: "full",
      timeStyle: "short",
    })

    // ── 1. Notification email → you ─────────────────────────────────────
    if (notificationEmail) {
      await resend.emails.send({
        from: fromAddress,
        to: notificationEmail,
        subject: `New lead: ${fullName} — BookKeeping.business`,
        html: `
<div style="font-family:system-ui,-apple-system,sans-serif;max-width:620px;margin:0 auto;background:#f9fafb;padding:32px 20px;">

  <div style="background:${BRAND_GREEN};border-radius:14px;padding:22px 28px;margin-bottom:24px;">
    <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.55);">New Submission</p>
    <h1 style="margin:6px 0 0;color:#fff;font-size:22px;font-weight:800;">📬 ${fullName}</h1>
    <p style="margin:6px 0 0;color:rgba(255,255,255,0.6);font-size:13px;">${submittedAt} ET &nbsp;·&nbsp; bookkeeping.business/contact</p>
  </div>

  <div style="background:#fff;border-radius:14px;border:1px solid #e5e7eb;overflow:hidden;margin-bottom:20px;">
    <table style="width:100%;border-collapse:collapse;">
      ${row("Name", fullName)}
      ${row("Email", `<a href="mailto:${email_}" style="color:${BRAND_GREEN};text-decoration:none;">${email_}</a>`)}
      ${row("Phone", typeof body.phone === "string" ? body.phone : null)}
      ${row("Preferred Contact", typeof body.preferredContact === "string" ? body.preferredContact : null)}
      ${row("Client Type", typeof body.clientType === "string" ? body.clientType : null)}
      ${row("Services Needed", services)}
      ${row("Business Name", typeof body.businessName === "string" ? body.businessName : null)}
      ${row("Entity Type", typeof body.businessStructure === "string" ? body.businessStructure : null)}
      ${row("State", typeof body.stateOfFormation === "string" ? body.stateOfFormation : null)}
      ${row("Est. Revenue", typeof body.estimatedRevenue === "string" ? body.estimatedRevenue : null)}
      ${row("Current Software", typeof body.accountingSoftware === "string" ? body.accountingSoftware : null)}
      ${row("Current Situation", typeof body.currentSituation === "string" ? body.currentSituation : null)}
      ${row("How They Heard", typeof body.hearAboutUs === "string" ? body.hearAboutUs : null)}
      ${row("Notes", typeof body.additionalNotes === "string" ? body.additionalNotes : null)}
    </table>
  </div>

  <div style="text-align:center;margin-bottom:28px;">
    <a href="mailto:${email_}?subject=Re: Your BookKeeping.business Inquiry"
       style="display:inline-block;background:${BRAND_GREEN};color:#fff;padding:13px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;">
      Reply to ${firstName_}
    </a>
  </div>

  <p style="text-align:center;font-size:11px;color:#9ca3af;margin:0;">
    BookKeeping.business &nbsp;·&nbsp; bookkeeping.business
  </p>
</div>`,
      }).catch((e) => console.error("Notification email failed:", e))
    }

    // ── 2. Confirmation email → submitter ────────────────────────────────
    await resend.emails.send({
      from: fromAddress,
      to: email_,
      subject: `We received your message — BookKeeping.business`,
      html: `
<div style="font-family:system-ui,-apple-system,sans-serif;max-width:600px;margin:0 auto;background:#f9fafb;padding:32px 20px;">

  <!-- Header -->
  <div style="background:${BRAND_GREEN};border-radius:14px;padding:28px 32px;margin-bottom:28px;text-align:center;">
    <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.5);">BookKeeping.business</p>
    <h1 style="margin:0;color:#fff;font-size:24px;font-weight:800;line-height:1.3;">
      We got your message, ${firstName_}!
    </h1>
  </div>

  <!-- Body -->
  <div style="background:#fff;border-radius:14px;border:1px solid #e5e7eb;padding:32px;margin-bottom:20px;">
    <p style="margin:0 0 16px;font-size:15px;color:#111827;line-height:1.6;">
      Thank you for reaching out. A member of our team will review your request and be in touch with you
      <strong>within 1 business day</strong>.
    </p>
    <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.6;">
      You can expect to hear from us via your preferred contact method. In the meantime, feel free to explore
      our services or check out our FAQs.
    </p>

    <!-- What to expect -->
    <div style="background:${BRAND_LIGHT};border-radius:10px;padding:20px 24px;margin-bottom:24px;">
      <p style="margin:0 0 12px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${BRAND_GREEN};">What happens next</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:6px 0;vertical-align:top;">
            <span style="display:inline-block;background:${BRAND_GREEN};color:#fff;border-radius:50%;width:22px;height:22px;text-align:center;line-height:22px;font-size:11px;font-weight:700;margin-right:10px;">1</span>
            <span style="font-size:13px;color:#374151;">Our team reviews your intake details</span>
          </td>
        </tr>
        <tr>
          <td style="padding:6px 0;vertical-align:top;">
            <span style="display:inline-block;background:${BRAND_GREEN};color:#fff;border-radius:50%;width:22px;height:22px;text-align:center;line-height:22px;font-size:11px;font-weight:700;margin-right:10px;">2</span>
            <span style="font-size:13px;color:#374151;">We prepare a custom quote based on your needs</span>
          </td>
        </tr>
        <tr>
          <td style="padding:6px 0;vertical-align:top;">
            <span style="display:inline-block;background:${BRAND_GREEN};color:#fff;border-radius:50%;width:22px;height:22px;text-align:center;line-height:22px;font-size:11px;font-weight:700;margin-right:10px;">3</span>
            <span style="font-size:13px;color:#374151;">We reach out to schedule a free 15-minute call</span>
          </td>
        </tr>
      </table>
    </div>

    <div style="text-align:center;">
      <a href="https://bookkeeping.business/faqs"
         style="display:inline-block;background:${BRAND_GREEN};color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;">
        View FAQs
      </a>
      &nbsp;&nbsp;
      <a href="https://bookkeeping.business/services"
         style="display:inline-block;background:transparent;color:${BRAND_GREEN};padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;border:2px solid ${BRAND_GREEN};">
        Explore Services
      </a>
    </div>
  </div>

  <!-- Footer -->
  <div style="text-align:center;padding:0 20px;">
    <p style="font-size:13px;color:#374151;margin:0 0 4px;font-weight:600;">BookKeeping.business</p>
    <p style="font-size:12px;color:#9ca3af;margin:0;">
      AI-assisted. Human-reviewed. All in one place.<br/>
      <a href="https://bookkeeping.business" style="color:#9ca3af;">bookkeeping.business</a>
    </p>
    <p style="font-size:11px;color:#d1d5db;margin:16px 0 0;">
      You received this because you submitted a contact form at bookkeeping.business.
    </p>
  </div>

</div>`,
    }).catch((e) => console.error("Confirmation email failed:", e))

  }

  return NextResponse.json({ success: true }, { status: 201 })
}
