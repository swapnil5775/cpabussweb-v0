export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createAdmin } from "@supabase/supabase-js"
import { randomBytes } from "crypto"
import { Resend } from "resend"

const admin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const resend = new Resend(process.env.RESEND_API_KEY)
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.bookkeeping.business"

function generateToken(): string {
  return randomBytes(16).toString("hex")
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data } = await admin
    .from("cpa_access_tokens")
    .select("*")
    .eq("client_user_id", user.id)
    .single()

  return NextResponse.json({ token: data ?? null })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const label: string | null = body.label ?? null
  const invited_email: string | null = body.invited_email
    ? body.invited_email.toLowerCase().trim()
    : null

  if (!invited_email) {
    return NextResponse.json({ error: "CPA email is required" }, { status: 400 })
  }

  const token = generateToken()

  // Get business name for the email
  const { data: profile } = await admin
    .from("business_profiles")
    .select("business_name")
    .eq("user_id", user.id)
    .single()

  const businessName = profile?.business_name ?? "your client"
  const portalUrl = `${SITE_URL}/cpa/${token}`

  // Upsert token (one per client — regenerates if already exists)
  const { data, error } = await admin
    .from("cpa_access_tokens")
    .upsert({ client_user_id: user.id, token, label, invited_email }, { onConflict: "client_user_id" })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Send invite email to the CPA
  await resend.emails.send({
    from: `BookKeeping.business <noreply@${process.env.RESEND_VERIFIED_DOMAIN}>`,
    to: invited_email,
    subject: `${businessName} has shared their bookkeeping workspace with you`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px">
        <div style="margin-bottom:24px">
          <strong style="font-size:18px">BookKeeping.business</strong>
        </div>
        <h2 style="margin:0 0 8px">You've been invited to view a client workspace</h2>
        <p style="color:#555;margin:0 0 8px">
          <strong>${businessName}</strong> has shared their read-only bookkeeping workspace with you via BookKeeping.business.
        </p>
        <p style="color:#555;margin:0 0 24px">
          You can view their business details, documents on file, and upcoming tax deadlines.
          A free account is required — sign in or create one using this email address (${invited_email}).
        </p>
        <a href="${portalUrl}" style="display:inline-block;background:#0f172a;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">
          View Client Workspace →
        </a>
        <p style="color:#999;font-size:12px;margin-top:32px">
          This link is private and was shared exclusively with ${invited_email}.<br/>
          If you did not expect this, you can safely ignore it.
        </p>
      </div>
    `,
  }).catch(() => {/* non-blocking */})

  return NextResponse.json({ token: data })
}

export async function DELETE() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  await admin.from("cpa_access_tokens").delete().eq("client_user_id", user.id)
  return NextResponse.json({ ok: true })
}
