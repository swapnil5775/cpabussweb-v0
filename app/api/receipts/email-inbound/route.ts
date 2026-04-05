/**
 * Postmark Inbound Webhook
 *
 * Setup (one-time, 5 minutes):
 * 1. Create free account at postmarkapp.com
 * 2. Add an Inbound server → copy the inbound address e.g. abc123@inbound.postmarkapp.com
 * 3. In 20i StackCP, change each org forwarder target from fileme@bookkeeping.business
 *    to that Postmark inbound address (or add it as a second destination)
 * 4. In Postmark → Inbound → Webhook URL: https://www.bookkeeping.business/api/receipts/email-inbound
 * 5. Set POSTMARK_INBOUND_SECRET env var to any secret string, add to Postmark webhook header
 *
 * Postmark POSTs JSON immediately when email arrives — zero polling delay.
 */

import { NextRequest, NextResponse } from "next/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"
import { checkReceiptLimit } from "@/lib/receipt-limits"

export const runtime = "nodejs"

type PostmarkAttachment = {
  Name: string
  Content: string       // base64
  ContentType: string
  ContentLength: number
}

type PostmarkPayload = {
  From: string
  ToFull: { Email: string }[]
  Subject: string
  Date: string
  Attachments: PostmarkAttachment[]
}

const ALLOWED_MIME = new Set([
  "image/jpeg", "image/jpg", "image/png", "image/heic", "image/heif",
  "image/webp", "application/pdf",
])

function detectMime(filename: string, declared: string): string {
  if (declared && ALLOWED_MIME.has(declared.toLowerCase())) return declared.toLowerCase()
  const ext = filename.split(".").pop()?.toLowerCase() ?? ""
  const map: Record<string, string> = {
    jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
    heic: "image/heic", heif: "image/heic", webp: "image/webp", pdf: "application/pdf",
  }
  return map[ext] ?? declared
}

export async function POST(request: NextRequest) {
  // Optional secret header check (set in Postmark webhook config)
  const secret = process.env.POSTMARK_INBOUND_SECRET
  if (secret) {
    const provided = request.headers.get("x-webhook-secret")
    if (provided !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  const body = await request.json().catch(() => null) as PostmarkPayload | null
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })

  const admin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const fromAddress = body.From?.match(/<([^>]+)>/)?.[1] ?? body.From ?? null
  const subject = body.Subject ?? "(no subject)"
  const receivedAt = body.Date ? new Date(body.Date).toISOString() : new Date().toISOString()
  const monthYear = new Date().toISOString().slice(0, 7)

  // Route by To: address — match local part to receipt_email_token
  let userId: string | null = null
  let organizationId: string | null = null

  const toAddresses = body.ToFull ?? []
  for (const to of toAddresses) {
    const localPart = to.Email?.split("@")[0]?.toLowerCase()
    if (!localPart || localPart === "fileme") continue

    const { data: org } = await admin
      .from("organizations")
      .select("id, owner_id")
      .eq("receipt_email_token", localPart)
      .single()

    if (org) {
      organizationId = org.id
      userId = org.owner_id
      break
    }
  }

  // Fallback: match FROM to a registered user (for direct fileme@ sends)
  if (!organizationId && fromAddress) {
    const { data: { users } } = await admin.auth.admin.listUsers()
    const matched = users.find(u => u.email?.toLowerCase() === fromAddress.toLowerCase())
    if (matched) {
      userId = matched.id
      const { data: sub } = await admin
        .from("subscriptions").select("organization_id")
        .eq("user_id", matched.id).in("status", ["active", "trialing"])
        .order("created_at", { ascending: false }).limit(1).single()
      organizationId = sub?.organization_id ?? null
      if (!organizationId) {
        const { data: org } = await admin
          .from("organizations").select("id")
          .eq("owner_id", matched.id).order("created_at", { ascending: true }).limit(1).single()
        organizationId = org?.id ?? null
      }
    }
  }

  if (!organizationId) {
    return NextResponse.json({ status: "skipped", reason: "no matching org" })
  }

  // Check receipt credit limit
  const limitError = await checkReceiptLimit(admin, organizationId)
  if (limitError) {
    return NextResponse.json({ status: "skipped", reason: limitError })
  }

  const attachments = body.Attachments ?? []
  let processed = 0

  for (const att of attachments) {
    const mime = detectMime(att.Name, att.ContentType)
    if (!ALLOWED_MIME.has(mime)) continue

    const safeName = att.Name.replace(/[^a-zA-Z0-9._-]/g, "_")
    const storagePath = `receipts/${organizationId}/${monthYear}/${Date.now()}_${safeName}`
    const fileBytes = Buffer.from(att.Content, "base64")

    const { error: storageError } = await admin.storage
      .from("documents")
      .upload(storagePath, fileBytes, { contentType: mime, upsert: false })

    if (storageError) continue

    const { data: receipt } = await admin
      .from("receipts")
      .insert({
        user_id: userId,
        organization_id: organizationId,
        storage_path: storagePath,
        file_name: att.Name,
        file_size_bytes: att.ContentLength ?? fileBytes.length,
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
      // Trigger OCR immediately — this is instant delivery, so OCR runs right now
      fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/receipts/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receipt_id: receipt.id, internal_secret: process.env.CRON_SECRET }),
      }).catch(() => {})
      processed++
    }
  }

  return NextResponse.json({ status: "ok", processed })
}
