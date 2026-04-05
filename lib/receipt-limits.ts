/**
 * Receipt credit limits and data retention rules by plan.
 *
 * Free:       20 receipts total (lifetime cap, no monthly reset)
 * Essentials: 100 receipts / month, resets on billing cycle
 * Growth:     300 receipts / month
 * Enterprise: 500 receipts / month
 *
 * Data retention:
 *   Free:  30 days  — files + records auto-deleted
 *   Paid:  12 months
 */

import { SupabaseClient } from "@supabase/supabase-js"

export const RECEIPT_LIMITS: Record<string, number> = {
  free:       20,
  essentials: 100,
  growth:     300,
  enterprise: 500,
}

export type ReceiptQuota = {
  plan: string
  isMonthly: boolean        // paid plans reset monthly; free is lifetime
  limit: number
  used: number
  remaining: number
  allowed: boolean
  resetLabel: string        // e.g. "monthly" or "lifetime"
}

/**
 * Returns quota info for an org. Pass a service-role admin client.
 */
export async function getReceiptQuota(
  admin: SupabaseClient,
  organizationId: string
): Promise<ReceiptQuota> {
  // Look up active subscription for this org
  const { data: sub } = await admin
    .from("subscriptions")
    .select("plan, status")
    .eq("organization_id", organizationId)
    .in("status", ["active", "trialing"])
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  const plan = sub?.plan?.toLowerCase() ?? "free"
  const limit = RECEIPT_LIMITS[plan] ?? RECEIPT_LIMITS.free
  const isMonthly = plan !== "free"
  const currentMonth = new Date().toISOString().slice(0, 7)

  let usedQuery = admin
    .from("receipts")
    .select("id", { count: "exact", head: true })
    .eq("organization_id", organizationId)

  if (isMonthly) {
    // Count this calendar month only
    usedQuery = usedQuery.eq("month_year", currentMonth)
  }
  // Free: count all receipts ever (lifetime cap)

  const { count } = await usedQuery
  const used = count ?? 0
  const remaining = Math.max(0, limit - used)

  return {
    plan,
    isMonthly,
    limit,
    used,
    remaining,
    allowed: used < limit,
    resetLabel: isMonthly ? "monthly" : "lifetime",
  }
}

/**
 * Quick yes/no check — returns null if allowed, or an error message string.
 */
export async function checkReceiptLimit(
  admin: SupabaseClient,
  organizationId: string
): Promise<string | null> {
  const quota = await getReceiptQuota(admin, organizationId)
  if (quota.allowed) return null

  if (quota.plan === "free") {
    return `Free plan limit reached (${quota.limit} receipts total). Upgrade to continue capturing receipts.`
  }
  return `Monthly receipt limit reached (${quota.limit}/month on ${quota.plan} plan). Limit resets next month.`
}
