export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { createClient as createAdmin } from "@supabase/supabase-js"

const admin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Gusto sends a verification_token on first setup — echo it back AND store it
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get("verification_token")
  if (token) {
    // Check if the firm connection row exists
    const { data: existing } = await admin
      .from("gusto_firm_connection")
      .select("id")
      .eq("id", "00000000-0000-0000-0000-000000000001")
      .single()

    if (existing) {
      // Row exists — just update the webhook token
      await admin
        .from("gusto_firm_connection")
        .update({ webhook_verification_token: token, updated_at: new Date().toISOString() })
        .eq("id", "00000000-0000-0000-0000-000000000001")
    } else {
      // No firm connection yet — insert a placeholder row to hold the token
      await admin
        .from("gusto_firm_connection")
        .insert({
          id: "00000000-0000-0000-0000-000000000001",
          access_token: "pending",
          webhook_verification_token: token,
        })
    }
    return new Response(token, { status: 200 })
  }
  return new Response("OK", { status: 200 })
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const eventType = payload.event_type as string
  const entityType = payload.entity_type as string

  // Gusto sends verification challenge on subscription creation
  if (payload.verification_token) {
    return new Response(payload.verification_token as string, { status: 200 })
  }

  try {
    switch (entityType) {
      case "Payroll": {
        // Payroll processed — could trigger QBO journal entry sync
        const data = payload.data as Record<string, unknown>
        const companyUuid = data?.company_uuid as string
        if (companyUuid && eventType === "payroll.submitted") {
          // Find which client this company belongs to
          const { data: gc } = await admin
            .from("gusto_companies")
            .select("user_id")
            .eq("company_uuid", companyUuid)
            .single()
          if (gc) {
            // Log payroll event for admin visibility (future: auto-post to QBO)
            console.log(`Payroll submitted for user ${gc.user_id}`)
          }
        }
        break
      }

      case "Employee": {
        // Employee onboarding completed or updated
        const data = payload.data as Record<string, unknown>
        console.log(`Employee event ${eventType}:`, data?.uuid)
        break
      }

      case "Company": {
        const data = payload.data as Record<string, unknown>
        const companyUuid = data?.uuid as string
        if (companyUuid) {
          await admin
            .from("gusto_companies")
            .update({ setup_status: "active", updated_at: new Date().toISOString() })
            .eq("company_uuid", companyUuid)
        }
        break
      }

      case "Document":
      case "Form": {
        // Tax forms, W-2s, etc. generated — future: push to client Documents vault
        const data = payload.data as Record<string, unknown>
        console.log(`${entityType} event ${eventType}:`, data?.uuid)
        break
      }
    }
  } catch (e) {
    console.error("Gusto webhook handler error:", e)
  }

  return NextResponse.json({ received: true })
}
