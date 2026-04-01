import { createClient as createAdmin } from "@supabase/supabase-js"

const QBO_CLIENT_ID = process.env.QBO_CLIENT_ID!.trim()
const QBO_CLIENT_SECRET = process.env.QBO_CLIENT_SECRET!.trim()
const QBO_REDIRECT_URI = process.env.QBO_REDIRECT_URI!.trim()
const IS_SANDBOX = process.env.QBO_ENVIRONMENT === "sandbox"

export const QBO_AUTH_URL = "https://appcenter.intuit.com/connect/oauth2"
export const QBO_TOKEN_URL = "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer"
export const QBO_BASE_URL = IS_SANDBOX
  ? "https://sandbox-quickbooks.api.intuit.com/v3/company"
  : "https://quickbooks.api.intuit.com/v3/company"

export const QBO_SCOPES = [
  "com.intuit.quickbooks.accounting",
  "openid",
  "profile",
  "email",
].join(" ")

// Build the authorization URL for OAuth redirect
export function buildQBOAuthUrl(state: string, redirectUri?: string): string {
  const params = new URLSearchParams({
    client_id: QBO_CLIENT_ID,
    scope: QBO_SCOPES,
    redirect_uri: redirectUri ?? QBO_REDIRECT_URI,
    response_type: "code",
    access_type: "offline",
    state,
  })
  return `${QBO_AUTH_URL}?${params.toString()}`
}

// Exchange authorization code for tokens
export async function exchangeCodeForTokens(code: string, redirectUri?: string): Promise<{
  access_token: string
  refresh_token: string
  expires_in: number
}> {
  const credentials = Buffer.from(`${QBO_CLIENT_ID}:${QBO_CLIENT_SECRET}`).toString("base64")
  const res = await fetch(QBO_TOKEN_URL, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri ?? QBO_REDIRECT_URI,
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`QBO token exchange failed: ${err}`)
  }
  return res.json()
}

// Refresh an expired access token
export async function refreshQBOToken(refreshToken: string): Promise<{
  access_token: string
  refresh_token: string
  expires_in: number
}> {
  const credentials = Buffer.from(`${QBO_CLIENT_ID}:${QBO_CLIENT_SECRET}`).toString("base64")
  const res = await fetch(QBO_TOKEN_URL, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  })
  if (!res.ok) throw new Error("QBO token refresh failed")
  return res.json()
}

// Get a valid access token for a user — refreshes automatically if expired
export async function getValidQBOToken(userId: string): Promise<{
  access_token: string
  realm_id: string
} | null> {
  const admin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: conn } = await admin
    .from("qbo_connections")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (!conn) return null

  const now = new Date()
  const expiresAt = new Date(conn.token_expires_at)

  // If token expires in less than 5 minutes, refresh it
  if (expiresAt.getTime() - now.getTime() < 5 * 60 * 1000) {
    try {
      const refreshed = await refreshQBOToken(conn.refresh_token)
      const newExpiry = new Date(Date.now() + refreshed.expires_in * 1000).toISOString()
      await admin.from("qbo_connections").update({
        access_token: refreshed.access_token,
        refresh_token: refreshed.refresh_token,
        token_expires_at: newExpiry,
        updated_at: new Date().toISOString(),
      }).eq("user_id", userId)
      return { access_token: refreshed.access_token, realm_id: conn.realm_id }
    } catch {
      return null
    }
  }

  return { access_token: conn.access_token, realm_id: conn.realm_id }
}

// Make an authenticated QBO API call
export async function qboFetch(
  userId: string,
  path: string,
  options: RequestInit = {}
): Promise<Response | null> {
  const token = await getValidQBOToken(userId)
  if (!token) return null

  const url = `${QBO_BASE_URL}/${token.realm_id}${path}`
  return fetch(url, {
    ...options,
    headers: {
      "Authorization": `Bearer ${token.access_token}`,
      "Accept": "application/json",
      ...(options.headers ?? {}),
    },
  })
}
