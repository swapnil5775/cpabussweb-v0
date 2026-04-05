import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"
import crypto from "crypto"

export const runtime = "nodejs"

const TWENTY_I_BEARER = Buffer.from(
  (process.env.TWENTY_I_API_KEY ?? "").split("+")[0]
).toString("base64")
const TWENTY_I_PACKAGE_ID = process.env.TWENTY_I_PACKAGE_ID ?? "3653391"
const RECEIPT_DOMAIN = "bookkeeping.business"
const RECEIPT_INBOX = `fileme@${RECEIPT_DOMAIN}`
const ADMIN_EMAIL = process.env.NOTIFICATION_EMAIL!

async function twentyIPost(body: object): Promise<{ ok: boolean; status: number; error?: string }> {
  try {
    const res = await fetch(
      `https://api.20i.com/package/${TWENTY_I_PACKAGE_ID}/email/${RECEIPT_DOMAIN}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TWENTY_I_BEARER}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    )
    if (!res.ok) {
      const text = await res.text().catch(() => "")
      return { ok: false, status: res.status, error: text.slice(0, 200) }
    }
    return { ok: true, status: res.status }
  } catch (e) {
    return { ok: false, status: 0, error: String(e) }
  }
}

async function provisionReceiptEmail(local: string): Promise<{ mailbox: string; forwarder: string }> {
  const password = crypto.randomBytes(12).toString("base64url")
  const mb = await twentyIPost({ new: { mailbox: { local, send: "true", receive: "true", password } } })
  const fw = await twentyIPost({ new: { forward: { local, remote: RECEIPT_INBOX } } })

  const mbStatus = mb.ok ? "created" : mb.status === 502 ? "already_exists" : `failed_${mb.status}`
  const fwStatus = fw.ok ? "created" : fw.status === 502 ? "already_exists" : `failed_${fw.status}`
  return { mailbox: mbStatus, forwarder: fwStatus }
}

export async function POST() {
  // Admin-only
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const admin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Fetch all orgs missing a token
  const { data: orgs, error } = await admin
    .from("organizations")
    .select("id, name, receipt_email_token")
    .is("receipt_email_token", null)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!orgs || orgs.length === 0) {
    return NextResponse.json({ message: "All organizations already have receipt email tokens.", processed: 0 })
  }

  const results: { org_id: string; org_name: string; token: string; forwarder: string; mailbox: string; forward_rule: string }[] = []

  for (const org of orgs) {
    const slug = (org.name ?? "org")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 20)
    const hex = crypto.randomBytes(3).toString("hex")
    const token = `${slug}-${hex}`

    await admin
      .from("organizations")
      .update({ receipt_email_token: token })
      .eq("id", org.id)

    const provision = await provisionReceiptEmail(token)
    results.push({
      org_id: org.id,
      org_name: org.name,
      token,
      forwarder: `${token}@${RECEIPT_DOMAIN}`,
      mailbox: provision.mailbox,
      forward_rule: provision.forwarder,
    })
  }

  return NextResponse.json({ processed: results.length, results })
}
