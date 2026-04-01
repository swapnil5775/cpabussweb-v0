import { createClient as createAdmin } from "@supabase/supabase-js"

const GUSTO_CLIENT_ID = process.env.GUSTO_CLIENT_ID!.trim()
const GUSTO_CLIENT_SECRET = process.env.GUSTO_CLIENT_SECRET!.trim()
const IS_DEMO = process.env.GUSTO_ENVIRONMENT !== "production"
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.bookkeeping.business"

export const GUSTO_BASE_URL = IS_DEMO
  ? "https://api.gusto-demo.com"
  : "https://api.gusto.com"

export const GUSTO_AUTH_URL = IS_DEMO
  ? "https://api.gusto-demo.com/oauth/authorize"
  : "https://api.gusto.com/oauth/authorize"

export const GUSTO_TOKEN_URL = IS_DEMO
  ? "https://api.gusto-demo.com/oauth/token"
  : "https://api.gusto.com/oauth/token"

export const GUSTO_REDIRECT_URI = `${SITE_URL}/api/gusto/callback`

// Build OAuth authorization URL for firm-level connection
export function buildGustoAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: GUSTO_CLIENT_ID,
    redirect_uri: GUSTO_REDIRECT_URI,
    response_type: "code",
    state,
  })
  return `${GUSTO_AUTH_URL}?${params.toString()}`
}

// Exchange authorization code for access + refresh tokens
export async function exchangeGustoCode(code: string): Promise<{
  access_token: string
  refresh_token: string
  expires_in: number
}> {
  const res = await fetch(GUSTO_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: GUSTO_CLIENT_ID,
      client_secret: GUSTO_CLIENT_SECRET,
      redirect_uri: GUSTO_REDIRECT_URI,
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Gusto token exchange failed: ${err}`)
  }
  return res.json()
}

// Refresh an expired firm token
export async function refreshGustoToken(refreshToken: string): Promise<{
  access_token: string
  refresh_token: string
  expires_in: number
}> {
  const res = await fetch(GUSTO_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: GUSTO_CLIENT_ID,
      client_secret: GUSTO_CLIENT_SECRET,
    }),
  })
  if (!res.ok) throw new Error("Gusto token refresh failed")
  return res.json()
}

// Get the stored firm access token, refreshing if needed
export async function getFirmToken(): Promise<string> {
  const db = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data: fc } = await db
    .from("gusto_firm_connection")
    .select("*")
    .eq("id", "00000000-0000-0000-0000-000000000001")
    .single()

  if (!fc) throw new Error("Gusto firm account not connected. Connect it from the admin panel first.")

  // Refresh if within 5 minutes of expiry
  if (fc.token_expires_at) {
    const expiresAt = new Date(fc.token_expires_at).getTime()
    if (expiresAt - Date.now() < 5 * 60 * 1000) {
      const refreshed = await refreshGustoToken(fc.refresh_token)
      const newExpiry = new Date(Date.now() + refreshed.expires_in * 1000).toISOString()
      await db.from("gusto_firm_connection").update({
        access_token: refreshed.access_token,
        refresh_token: refreshed.refresh_token,
        token_expires_at: newExpiry,
        updated_at: new Date().toISOString(),
      }).eq("id", "00000000-0000-0000-0000-000000000001")
      return refreshed.access_token
    }
  }

  return fc.access_token
}

// Create a partner-managed company using the firm token
export async function createPartnerCompany(params: {
  company_name: string
  first_name: string
  last_name: string
  email: string
}): Promise<{ company_uuid: string; access_token: string }> {
  const token = await getFirmToken()
  const res = await fetch(`${GUSTO_BASE_URL}/v1/partner_managed_companies`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-Gusto-API-Version": "2025-06-15",
    },
    body: JSON.stringify({
      user: {
        first_name: params.first_name,
        last_name: params.last_name,
        email: params.email,
      },
      company: { name: params.company_name },
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Gusto create company failed: ${err}`)
  }
  const data = await res.json()
  return {
    company_uuid: data.company_uuid ?? data.uuid,
    access_token: data.access_token,
  }
}

// Authenticated call using a company-level token
export async function gustoFetch(
  companyToken: string,
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  return fetch(`${GUSTO_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Authorization": `Bearer ${companyToken}`,
      "Content-Type": "application/json",
      "X-Gusto-API-Version": "2025-06-15",
      ...(options.headers ?? {}),
    },
  })
}

export async function getEmployees(companyToken: string, companyUuid: string) {
  const res = await gustoFetch(companyToken, `/v1/companies/${companyUuid}/employees`)
  if (!res.ok) return []
  return res.json()
}

export async function createEmployee(
  companyToken: string,
  companyUuid: string,
  params: { first_name: string; last_name: string; email: string; start_date: string }
) {
  const res = await gustoFetch(companyToken, `/v1/companies/${companyUuid}/employees`, {
    method: "POST",
    body: JSON.stringify(params),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Create employee failed: ${err}`)
  }
  return res.json()
}

export async function getPayrolls(companyToken: string, companyUuid: string) {
  const res = await gustoFetch(companyToken, `/v1/companies/${companyUuid}/payrolls?include=totals`)
  if (!res.ok) return []
  return res.json()
}
