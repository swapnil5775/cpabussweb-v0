import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"
import { resolveActiveOrganizationId } from "@/lib/organizations"
import { cookies } from "next/headers"
import crypto from "crypto"

const TWENTY_I_BEARER = Buffer.from(
  (process.env.TWENTY_I_API_KEY ?? "c19e5157e066006a9").split("+")[0]
).toString("base64")
const TWENTY_I_PACKAGE_ID = process.env.TWENTY_I_PACKAGE_ID ?? "3653391"
const RECEIPT_DOMAIN = "bookkeeping.business"
const RECEIPT_INBOX = `fileme@${RECEIPT_DOMAIN}`

async function twentyIPost(body: object): Promise<void> {
  try {
    await fetch(
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
  } catch {
    // Non-fatal — catch-all is the safety net
  }
}

async function provisionReceiptEmail(local: string): Promise<void> {
  const password = crypto.randomBytes(12).toString("base64url")
  // Create mailbox (visible in 20i StackCP), then add forwarder
  await twentyIPost({ new: { mailbox: { local, send: "true", receive: "true", password } } })
  await twentyIPost({ new: { forward: { local, remote: RECEIPT_INBOX } } })
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const admin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const cookieStore = await cookies()
  const organizationId = await resolveActiveOrganizationId({ admin, userId: user.id, cookieStore }).catch(() => null)
  if (!organizationId) return NextResponse.json({ error: "No organization" }, { status: 404 })

  let { data: org } = await admin
    .from("organizations")
    .select("receipt_email_token")
    .eq("id", organizationId)
    .single()

  if (!org?.receipt_email_token) {
    // Get org name to build friendly slug
    const { data: orgDetails } = await admin
      .from("organizations")
      .select("name")
      .eq("id", organizationId)
      .single()

    const slug = (orgDetails?.name ?? "org")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 20)
    const hex = crypto.randomBytes(3).toString("hex") // 6 chars
    const token = `${slug}-${hex}`

    const { data: updated } = await admin
      .from("organizations")
      .update({ receipt_email_token: token })
      .eq("id", organizationId)
      .select("receipt_email_token")
      .single()
    org = updated

    // Auto-create mailbox + forwarder via 20i API
    if (token) await provisionReceiptEmail(token)
  }

  const token = org?.receipt_email_token
  const receiptEmail = `${token}@${RECEIPT_DOMAIN}`

  return NextResponse.json({ receipt_email: receiptEmail, token })
}
