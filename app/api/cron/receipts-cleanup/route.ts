/**
 * Data Retention Cleanup Cron
 *
 * Runs daily at 03:00 UTC.
 * - Free orgs:  delete receipts + storage files older than 30 days
 * - Paid orgs:  delete receipts + storage files older than 12 months
 *
 * Files are deleted from Supabase Storage (documents bucket) and
 * then the DB record is removed.
 */

import { NextRequest, NextResponse } from "next/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"

export const runtime = "nodejs"
export const maxDuration = 60

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization")
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const admin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const now = new Date()

  // ── 1. Find all orgs and their active subscription plan ──────────────────
  const { data: orgs } = await admin
    .from("organizations")
    .select("id")

  if (!orgs || orgs.length === 0) {
    return NextResponse.json({ deleted: 0, message: "No orgs found" })
  }

  const orgIds = orgs.map((o) => o.id)

  // Get active subscriptions for all orgs in one query
  const { data: activeSubs } = await admin
    .from("subscriptions")
    .select("organization_id, plan, status")
    .in("organization_id", orgIds)
    .in("status", ["active", "trialing"])

  // Build a set of paid org IDs
  const paidOrgIds = new Set((activeSubs ?? []).map((s) => s.organization_id))

  // ── 2. Compute cutoff dates ───────────────────────────────────────────────
  const freeCutoff = new Date(now)
  freeCutoff.setDate(freeCutoff.getDate() - 30)

  const paidCutoff = new Date(now)
  paidCutoff.setMonth(paidCutoff.getMonth() - 12)

  let deleted = 0
  let errors = 0

  // ── 3. Delete expired receipts in batches ─────────────────────────────────
  async function deleteExpiredForOrgs(targetOrgIds: string[], cutoff: Date) {
    const cutoffStr = cutoff.toISOString()

    // Fetch receipts to delete (get storage_path for file cleanup)
    const { data: expired } = await admin
      .from("receipts")
      .select("id, storage_path")
      .in("organization_id", targetOrgIds)
      .lt("created_at", cutoffStr)
      .limit(500)  // safety cap per run

    if (!expired || expired.length === 0) return

    // Delete files from storage
    const paths = expired.map((r) => r.storage_path).filter(Boolean)
    if (paths.length > 0) {
      const { error: storageErr } = await admin.storage
        .from("documents")
        .remove(paths)
      if (storageErr) {
        console.error("Storage delete error:", storageErr.message)
        errors++
      }
    }

    // Delete DB records
    const ids = expired.map((r) => r.id)
    const { error: dbErr } = await admin
      .from("receipts")
      .delete()
      .in("id", ids)

    if (dbErr) {
      console.error("DB delete error:", dbErr.message)
      errors++
    } else {
      deleted += expired.length
    }
  }

  // Free orgs: 30-day retention
  const freeOrgIds = orgIds.filter((id) => !paidOrgIds.has(id))
  if (freeOrgIds.length > 0) {
    await deleteExpiredForOrgs(freeOrgIds, freeCutoff)
  }

  // Paid orgs: 12-month retention
  if (paidOrgIds.size > 0) {
    await deleteExpiredForOrgs([...paidOrgIds], paidCutoff)
  }

  return NextResponse.json({
    deleted,
    errors,
    freeOrgs: freeOrgIds.length,
    paidOrgs: paidOrgIds.size,
    ran: now.toISOString(),
  })
}
