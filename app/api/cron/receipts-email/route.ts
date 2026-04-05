import { NextRequest, NextResponse } from "next/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"
import { ImapFlow } from "imapflow"
import { simpleParser } from "mailparser"

export const runtime = "nodejs"
export const maxDuration = 60

const ALLOWED_MIME = new Set([
  "image/jpeg", "image/jpg", "image/png", "image/heic", "image/heif",
  "image/webp", "application/pdf",
])

function detectMime(filename: string, declared?: string): string {
  if (declared && ALLOWED_MIME.has(declared)) return declared
  const ext = filename.split(".").pop()?.toLowerCase() ?? ""
  const map: Record<string, string> = {
    jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
    heic: "image/heic", heif: "image/heic", webp: "image/webp", pdf: "application/pdf",
  }
  return map[ext] ?? declared ?? "application/octet-stream"
}

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization")
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const admin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const client = new ImapFlow({
    host: process.env.IMAP_HOST ?? "imap.bookkeeping.business",
    port: Number(process.env.IMAP_PORT ?? 993),
    secure: true,
    auth: {
      user: process.env.IMAP_USER ?? "fileme@bookkeeping.business",
      pass: process.env.IMAP_PASS!,
    },
    logger: false,
  })

  let processed = 0
  let errors = 0

  try {
    await client.connect()
    await client.mailboxOpen("INBOX")

    // Fetch all UNSEEN messages
    const uids: number[] = []
    for await (const msg of client.fetch("1:*", { flags: true })) {
      if (msg.flags && !msg.flags.has("\\Seen")) {
        uids.push(msg.uid)
      }
    }

    for (const uid of uids) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const msg: any = await client.fetchOne(String(uid), { source: true }, { uid: true })
        if (!msg?.source) continue

        const parsed = await simpleParser(msg.source as Buffer)
        const fromAddress = parsed.from?.value?.[0]?.address ?? null
        const subject = parsed.subject ?? "(no subject)"
        const receivedAt = parsed.date?.toISOString() ?? new Date().toISOString()

        // Match sender email → Supabase user
        let userId: string | null = null
        let organizationId: string | null = null

        if (fromAddress) {
          const { data: { users } } = await admin.auth.admin.listUsers()
          const matchedUser = users.find((u) => u.email?.toLowerCase() === fromAddress.toLowerCase())
          if (matchedUser) {
            userId = matchedUser.id
            // Get their active org (first active subscription's org, or first org)
            const { data: sub } = await admin
              .from("subscriptions")
              .select("organization_id")
              .eq("user_id", matchedUser.id)
              .in("status", ["active", "trialing"])
              .order("created_at", { ascending: false })
              .limit(1)
              .single()
            organizationId = sub?.organization_id ?? null

            if (!organizationId) {
              const { data: org } = await admin
                .from("organizations")
                .select("id")
                .eq("owner_id", matchedUser.id)
                .order("created_at", { ascending: true })
                .limit(1)
                .single()
              organizationId = org?.id ?? null
            }
          }
        }

        const monthYear = new Date().toISOString().slice(0, 7)

        // Process each attachment
        if (parsed.attachments && parsed.attachments.length > 0) {
          for (const attachment of parsed.attachments) {
            const mime = detectMime(attachment.filename ?? "file", attachment.contentType)
            if (!ALLOWED_MIME.has(mime)) continue

            const safeName = (attachment.filename ?? `email_receipt_${Date.now()}`).replace(/[^a-zA-Z0-9._-]/g, "_")
            const storagePath = `receipts/${organizationId ?? fromAddress ?? "unmatched"}/${monthYear}/${Date.now()}_${safeName}`

            const { error: storageError } = await admin.storage
              .from("documents")
              .upload(storagePath, attachment.content, { contentType: mime, upsert: false })

            if (storageError) {
              console.error("Storage upload error:", storageError.message)
              errors++
              continue
            }

            const { data: receipt } = await admin
              .from("receipts")
              .insert({
                user_id: userId,
                organization_id: organizationId,
                storage_path: storagePath,
                file_name: attachment.filename ?? safeName,
                file_size_bytes: attachment.size ?? attachment.content.length,
                source: "email",
                status: "pending",
                email_from: fromAddress,
                email_subject: subject,
                email_received_at: receivedAt,
                month_year: monthYear,
              })
              .select("id")
              .single()

            if (receipt?.id) {
              // Trigger OCR async
              fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/receipts/process`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  receipt_id: receipt.id,
                  internal_secret: process.env.CRON_SECRET,
                }),
              }).catch(() => {})
              processed++
            }
          }
        } else {
          // Email body might itself be a forwarded receipt — skip for now, mark as no-attachment
          // Could extract inline images in a future iteration
        }

        // Mark email as SEEN so we don't re-process it
        await client.messageFlagsAdd(String(uid), ["\\Seen"], { uid: true })
      } catch (msgErr) {
        console.error("Error processing email uid", uid, msgErr)
        errors++
      }
    }
  } finally {
    await client.logout().catch(() => {})
  }

  return NextResponse.json({ processed, errors, checked: new Date().toISOString() })
}
