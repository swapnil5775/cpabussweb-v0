export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createAdmin } from "@supabase/supabase-js"
import { randomBytes } from "crypto"

const admin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function generateCode(): string {
  return randomBytes(3).toString("hex").toUpperCase()
}

// GET: return referral code, invites, credits
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  // Get or create referral code
  let { data: codeRow } = await admin
    .from("referral_codes")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!codeRow) {
    const code = generateCode()
    const { data } = await admin
      .from("referral_codes")
      .insert({ user_id: user.id, code })
      .select()
      .single()
    codeRow = data
  }

  const [{ data: invites }, { data: credits }] = await Promise.all([
    admin.from("referral_invites").select("*").eq("referrer_id", user.id).order("created_at"),
    admin.from("referral_credits").select("*").eq("user_id", user.id).order("created_at"),
  ])

  return NextResponse.json({ code: codeRow?.code, invites: invites ?? [], credits: credits ?? [] })
}
