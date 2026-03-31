export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createAdmin } from "@supabase/supabase-js"
import { randomBytes } from "crypto"

const admin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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
  const label = body.label ?? null
  const token = generateToken()

  // Upsert (one token per client, overwrite/regenerate)
  const { data, error } = await admin
    .from("cpa_access_tokens")
    .upsert({ client_user_id: user.id, token, label }, { onConflict: "client_user_id" })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ token: data })
}

export async function DELETE() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  await admin.from("cpa_access_tokens").delete().eq("client_user_id", user.id)
  return NextResponse.json({ ok: true })
}
