import { createClient as createAdmin } from "@supabase/supabase-js"

export const ACTIVE_ORG_COOKIE = "active_org_id"

type CookieLike = {
  get: (name: string) => { value: string } | undefined
}

export type OrganizationRow = {
  id: string
  user_id: string
  name: string
  country_code: string | null
  accounting_platform: string | null
  is_default: boolean
  created_at: string
}

export function getAdminClient() {
  return createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function ensureDefaultOrganization(
  admin: ReturnType<typeof getAdminClient>,
  userId: string,
  suggestedName?: string | null
) {
  const { data: existing } = await admin
    .from("organizations")
    .select("id, user_id, name, country_code, accounting_platform, is_default, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle()

  if (existing) return existing as OrganizationRow

  const name = (suggestedName && suggestedName.trim()) || "Primary Organization"
  const { data: created, error } = await admin
    .from("organizations")
    .insert({
      user_id: userId,
      name,
      is_default: true,
    })
    .select("id, user_id, name, country_code, accounting_platform, is_default, created_at")
    .single()

  if (error || !created) {
    throw new Error(`Failed to create default organization: ${error?.message ?? "unknown"}`)
  }

  return created as OrganizationRow
}

export async function listOrganizationsForUser(
  admin: ReturnType<typeof getAdminClient>,
  userId: string
) {
  const { data } = await admin
    .from("organizations")
    .select("id, user_id, name, country_code, accounting_platform, is_default, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })

  return (data ?? []) as OrganizationRow[]
}

export async function resolveActiveOrganizationId(params: {
  admin: ReturnType<typeof getAdminClient>
  userId: string
  cookieStore?: CookieLike
  suggestedName?: string | null
}) {
  const { admin, userId, cookieStore, suggestedName } = params
  const organizations = await listOrganizationsForUser(admin, userId)
  if (organizations.length === 0) {
    const created = await ensureDefaultOrganization(admin, userId, suggestedName)
    return created.id
  }

  const cookieValue = cookieStore?.get(ACTIVE_ORG_COOKIE)?.value
  const matched = cookieValue
    ? organizations.find((org) => org.id === cookieValue)
    : null

  if (matched) return matched.id

  const defaultOrg = organizations.find((org) => org.is_default) ?? organizations[0]
  return defaultOrg.id
}
