export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createAdmin } from "@supabase/supabase-js"
import { Resend } from "resend"

const admin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const resend = new Resend(process.env.RESEND_API_KEY)
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.bookkeeping.business"

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { email } = await request.json()
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 })

  // Check max 3 invites
  const { count } = await admin
    .from("referral_invites")
    .select("id", { count: "exact", head: true })
    .eq("referrer_id", user.id)

  if ((count ?? 0) >= 3) {
    return NextResponse.json({ error: "Maximum 3 referrals allowed" }, { status: 400 })
  }

  // Get referral code
  const { data: codeRow } = await admin
    .from("referral_codes")
    .select("code")
    .eq("user_id", user.id)
    .single()

  if (!codeRow) return NextResponse.json({ error: "No referral code found" }, { status: 400 })

  // Insert invite (ignore duplicate)
  const { error: insertError } = await admin
    .from("referral_invites")
    .insert({ referrer_id: user.id, invited_email: email.toLowerCase().trim() })

  if (insertError && !insertError.message.includes("duplicate")) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  // Get referrer first name
  const firstName = (user.user_metadata as { first_name?: string })?.first_name ?? ""
  const referralLink = `${SITE_URL}/r/${codeRow.code}`

  // Send invite email
  await resend.emails.send({
    from: `BookKeeping.business <noreply@${process.env.RESEND_VERIFIED_DOMAIN}>`,
    to: email,
    subject: `${firstName || "Someone"} invited you to BookKeeping.business`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px">
        <h2 style="margin:0 0 8px">You've been invited!</h2>
        <p style="color:#555;margin:0 0 24px">
          ${firstName ? `<strong>${firstName}</strong> thought` : "Someone thought"} you'd benefit from professional bookkeeping — with monthly reconciliation, dedicated bookkeeper, and tax filing all included.
        </p>
        <a href="${referralLink}" style="display:inline-block;background:#0f172a;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">
          Create your free account →
        </a>
        <p style="color:#999;font-size:12px;margin-top:32px">Plans start at $149/month. No contracts.</p>
      </div>
    `,
  })

  return NextResponse.json({ ok: true })
}
