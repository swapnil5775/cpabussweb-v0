export const dynamic = "force-dynamic"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const { email } = await request.json()
  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email is required" }, { status: 400 })
  }

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
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  // Generate 6-digit code
  const code = String(Math.floor(100000 + Math.random() * 900000))
  const expires = new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 min

  const admin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Store code (upsert client_profiles row)
  const { error } = await admin
    .from("client_profiles")
    .upsert({
      user_id: user.id,
      secondary_email: email,
      secondary_email_verified: false,
      secondary_email_code: code,
      secondary_email_code_expires_at: expires,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" })

  if (error) {
    console.error("OTP store error:", error)
    return NextResponse.json({ error: "Failed to generate code" }, { status: 500 })
  }

  // Send email via Resend
  const { error: emailError } = await resend.emails.send({
    from: "BookKeeping.business <noreply@webhost4ever.com>",
    to: email,
    subject: "Your email verification code",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h2 style="font-size:18px;font-weight:700;margin-bottom:8px">Verify your email</h2>
        <p style="color:#6b7280;margin-bottom:24px">Enter the code below in your profile settings to verify this email address.</p>
        <div style="background:#f3f4f6;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px">
          <span style="font-size:36px;font-weight:700;letter-spacing:0.15em;font-family:monospace">${code}</span>
        </div>
        <p style="font-size:13px;color:#9ca3af">This code expires in 15 minutes. If you didn't request this, you can ignore this email.</p>
      </div>
    `,
  })

  if (emailError) {
    console.error("OTP email error:", emailError)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
