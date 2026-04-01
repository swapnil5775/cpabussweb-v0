const GUSTO_CLIENT_ID = process.env.GUSTO_CLIENT_ID!.trim()
const GUSTO_CLIENT_SECRET = process.env.GUSTO_CLIENT_SECRET!.trim()
const IS_DEMO = process.env.GUSTO_ENVIRONMENT !== "production"

export const GUSTO_BASE_URL = IS_DEMO
  ? "https://api.gusto-demo.com"
  : "https://api.gusto.com"

// Get a platform-level system access token (client credentials)
// Used for creating companies and platform-wide operations
export async function getSystemToken(): Promise<string> {
  const res = await fetch(`${GUSTO_BASE_URL}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: GUSTO_CLIENT_ID,
      client_secret: GUSTO_CLIENT_SECRET,
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Gusto system token failed: ${err}`)
  }
  const data = await res.json()
  return data.access_token
}

// Create a partner-managed company for a new client
// Returns company_uuid and a company-level access token
export async function createPartnerCompany(params: {
  company_name: string
  first_name: string
  last_name: string
  email: string
}): Promise<{ company_uuid: string; access_token: string }> {
  const token = await getSystemToken()
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
      company: {
        name: params.company_name,
      },
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

// Authenticated call to Gusto API using a company token
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

// Get company info
export async function getCompany(companyToken: string, companyUuid: string) {
  const res = await gustoFetch(companyToken, `/v1/companies/${companyUuid}`)
  if (!res.ok) return null
  return res.json()
}

// List employees for a company
export async function getEmployees(companyToken: string, companyUuid: string) {
  const res = await gustoFetch(companyToken, `/v1/companies/${companyUuid}/employees?include=all_compensations`)
  if (!res.ok) return []
  return res.json()
}

// Create an employee (minimal — Gusto onboarding fills in the rest)
export async function createEmployee(
  companyToken: string,
  companyUuid: string,
  params: {
    first_name: string
    last_name: string
    email: string
    start_date: string // YYYY-MM-DD
  }
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

// Get payrolls for a company
export async function getPayrolls(companyToken: string, companyUuid: string) {
  const res = await gustoFetch(companyToken, `/v1/companies/${companyUuid}/payrolls?include=totals`)
  if (!res.ok) return []
  return res.json()
}
