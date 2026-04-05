import { NextRequest, NextResponse } from "next/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"
import Anthropic from "@anthropic-ai/sdk"

export const runtime = "nodejs"
export const maxDuration = 60

const EXTRACT_PROMPT = `You are extracting data from a receipt or invoice image/document.
Return ONLY a valid JSON object with exactly these fields (use null if not found):
{
  "vendor": "business name shown on receipt",
  "date": "YYYY-MM-DD format",
  "total": numeric total amount (no currency symbol),
  "tax": numeric tax amount (no currency symbol),
  "category": one of: food_beverage, office_supplies, utilities, travel, entertainment, professional_services, equipment, rent, fuel, advertising, other
}
No explanation, no markdown, just the JSON object.`

type ExtractedReceipt = {
  vendor: string | null
  date: string | null
  total: number | null
  tax: number | null
  category: string | null
}

function parseJson(text: string): ExtractedReceipt | null {
  const jsonStr = text.replace(/^```json?\n?/, "").replace(/\n?```$/, "").trim()
  try { return JSON.parse(jsonStr) as ExtractedReceipt }
  catch { return null }
}

// Primary: Claude claude-haiku-4-5 — cheapest, best structured receipt extraction, handles images + PDFs
async function extractWithClaude(fileBytes: Uint8Array, mimeType: string): Promise<ExtractedReceipt | null> {
  if (!process.env.ANTHROPIC_API_KEY) return null

  const isImage = mimeType.startsWith("image/")
  const isPdf = mimeType === "application/pdf"
  if (!isImage && !isPdf) return null

  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    const base64 = Buffer.from(fileBytes).toString("base64")

    const contentBlock = isImage
      ? ({ type: "image" as const, source: { type: "base64" as const, media_type: mimeType as "image/jpeg" | "image/png" | "image/gif" | "image/webp", data: base64 } })
      : ({ type: "document" as const, source: { type: "base64" as const, media_type: "application/pdf" as const, data: base64 } })

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      messages: [{ role: "user", content: [contentBlock, { type: "text", text: EXTRACT_PROMPT }] }],
    })

    const text = response.content[0]?.type === "text" ? response.content[0].text.trim() : ""
    return parseJson(text)
  } catch (err) {
    console.error("Claude OCR failed:", err)
    return null
  }
}

// Fallback: GPT-4o-mini — kicks in if Claude fails or key missing, images only (PDFs need text layer)
async function extractWithOpenAI(fileBytes: Uint8Array, mimeType: string): Promise<ExtractedReceipt | null> {
  if (!process.env.OPENAI_API_KEY) return null
  if (!mimeType.startsWith("image/")) return null // GPT-4o-mini vision handles images; PDFs need different approach

  try {
    const base64 = Buffer.from(fileBytes).toString("base64")
    const dataUrl = `data:${mimeType};base64,${base64}`

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 512,
        messages: [
          {
            role: "user",
            content: [
              { type: "image_url", image_url: { url: dataUrl, detail: "low" } },
              { type: "text", text: EXTRACT_PROMPT },
            ],
          },
        ],
      }),
    })

    const json = await res.json()
    const text: string = json?.choices?.[0]?.message?.content ?? ""
    return parseJson(text)
  } catch (err) {
    console.error("OpenAI OCR failed:", err)
    return null
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({})) as { receipt_id?: string; internal_secret?: string }

  if (body.internal_secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { receipt_id } = body
  if (!receipt_id) return NextResponse.json({ error: "receipt_id required" }, { status: 400 })

  const admin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  await admin.from("receipts").update({ status: "processing", updated_at: new Date().toISOString() }).eq("id", receipt_id)

  const { data: receipt } = await admin.from("receipts").select("storage_path, file_name").eq("id", receipt_id).single()
  if (!receipt) return NextResponse.json({ error: "Receipt not found" }, { status: 404 })

  const { data: fileData, error: downloadError } = await admin.storage.from("documents").download(receipt.storage_path)
  if (downloadError || !fileData) {
    await admin.from("receipts").update({ status: "pending", updated_at: new Date().toISOString() }).eq("id", receipt_id)
    return NextResponse.json({ error: "File download failed" }, { status: 500 })
  }

  const ext = receipt.file_name.split(".").pop()?.toLowerCase() ?? ""
  const mimeMap: Record<string, string> = {
    jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
    heic: "image/heic", heif: "image/heic", webp: "image/webp", pdf: "application/pdf",
  }
  const mimeType = mimeMap[ext] ?? fileData.type ?? "image/jpeg"
  const bytes = new Uint8Array(await fileData.arrayBuffer())

  // Try Claude first, then OpenAI as fallback
  const extracted = (await extractWithClaude(bytes, mimeType)) ?? (await extractWithOpenAI(bytes, mimeType))

  if (!extracted) {
    await admin.from("receipts").update({ status: "pending", updated_at: new Date().toISOString() }).eq("id", receipt_id)
    return NextResponse.json({ status: "pending_manual" })
  }

  await admin.from("receipts").update({
    status: "extracted",
    extracted_vendor: extracted.vendor,
    extracted_date: extracted.date,
    extracted_amount: extracted.total,
    extracted_tax: extracted.tax,
    extracted_category: extracted.category,
    extracted_raw_json: extracted,
    updated_at: new Date().toISOString(),
  }).eq("id", receipt_id)

  return NextResponse.json({ status: "extracted", data: extracted })
}
