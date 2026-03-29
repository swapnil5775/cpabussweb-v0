import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

// Simple in-memory rate limiter: max 3 submissions per IP per 10 minutes
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_MAX = 3
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return true
  }

  if (entry.count >= RATE_LIMIT_MAX) return false

  entry.count++
  return true
}

export async function POST(request: Request) {
  // Rate limiting
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown"

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a few minutes before trying again." },
      { status: 429 }
    )
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  // Required field validation
  const { firstName, lastName, email } = body
  if (
    !firstName || typeof firstName !== "string" || firstName.trim().length === 0 ||
    !lastName || typeof lastName !== "string" || lastName.trim().length === 0 ||
    !email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return NextResponse.json(
      { error: "First name, last name, and a valid email are required." },
      { status: 400 }
    )
  }

  // Use service role key to bypass RLS for server-side inserts
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await supabase.from("leads").insert({
    first_name: (firstName as string).trim(),
    last_name: (lastName as string).trim(),
    email: (email as string).trim().toLowerCase(),
    phone: typeof body.phone === "string" && body.phone ? body.phone.trim() : null,
    preferred_contact_method: body.preferredContact ?? "email",
    service_type: body.clientType ?? null,
    services_needed: Array.isArray(body.servicesNeeded) ? body.servicesNeeded : [],
    business_legal_name: typeof body.businessName === "string" && body.businessName ? body.businessName.trim() : null,
    entity_type: body.businessStructure ?? null,
    states_of_operation: typeof body.stateOfFormation === "string" && body.stateOfFormation
      ? [body.stateOfFormation.trim()]
      : null,
    annual_revenue_bucket: body.estimatedRevenue ?? null,
    current_software: body.accountingSoftware ?? null,
    current_bookkeeping_management: body.currentSituation ?? null,
    pain_points: body.hearAboutUs ?? null,
    anything_else: body.additionalNotes ?? null,
    status: "new",
  })

  if (error) {
    console.error("Supabase insert error:", error)
    return NextResponse.json(
      { error: "Failed to save your request. Please try again." },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
