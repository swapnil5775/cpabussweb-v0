export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createAdmin } from "@supabase/supabase-js"
import { Resend } from "resend"
import { cookies } from "next/headers"
import { resolveActiveOrganizationId } from "@/lib/organizations"

const admin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const resend = new Resend(process.env.RESEND_API_KEY)
const ADMIN_EMAIL = process.env.NOTIFICATION_EMAIL!
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.bookkeeping.business"

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const cookieStore = await cookies()
  const orgId = await resolveActiveOrganizationId({
    admin,
    userId: user.id,
    cookieStore,
    suggestedName: "Primary Organization",
  })

  const { file_name, document_type, tax_year, file_size_bytes } = await request.json()

  // Get client details for the email
  const [{ data: bp }, { data: cp }] = await Promise.all([
    admin.from("business_profiles").select("business_name, business_type").eq("user_id", user.id).eq("organization_id", orgId).maybeSingle(),
    admin.from("client_profiles").select("full_name").eq("user_id", user.id).eq("organization_id", orgId).maybeSingle(),
  ])

  const businessName = bp?.business_name ?? "Unknown Business"
  const clientName = cp?.full_name ?? user.email ?? "Client"

  const categoryLabels: Record<string, string> = {
    bank_statement: "Bank Statements",
    credit_card: "Credit Card Statements",
    income_statement: "Income Statement",
    invoices: "Invoices",
    expense_sheet: "Expense Sheet",
    payroll: "Payroll Reports",
    insurance: "Insurance",
    utility_bills: "Utility Bills",
    water_bill: "Water Bills",
    rent_mortgage: "Rent / Mortgage",
    other: "Other Documents",
  }
  const categoryLabel = categoryLabels[document_type] ?? document_type

  function formatBytes(bytes: number | null) {
    if (!bytes) return ""
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }

  try {
    await resend.emails.send({
      from: `BookKeeping.business <noreply@${process.env.RESEND_VERIFIED_DOMAIN}>`,
      to: ADMIN_EMAIL,
      subject: `📄 New document uploaded — ${businessName}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px">
          <h2 style="margin:0 0 4px;font-size:18px">New Document Uploaded</h2>
          <p style="color:#888;margin:0 0 24px;font-size:13px">A client has uploaded a document that needs your review.</p>

          <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:24px">
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #eee;color:#555;width:140px">Client</td>
              <td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:600">${clientName}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #eee;color:#555">Business</td>
              <td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:600">${businessName}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #eee;color:#555">Category</td>
              <td style="padding:10px 0;border-bottom:1px solid #eee">${categoryLabel}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #eee;color:#555">Tax Year</td>
              <td style="padding:10px 0;border-bottom:1px solid #eee">${tax_year}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #eee;color:#555">File</td>
              <td style="padding:10px 0;border-bottom:1px solid #eee">${file_name}${file_size_bytes ? ` <span style="color:#888">(${formatBytes(file_size_bytes)})</span>` : ""}</td>
            </tr>
          </table>

          <a href="${SITE_URL}/admin" style="display:inline-block;background:#0f172a;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">
            Review in Admin Panel →
          </a>

          <p style="color:#aaa;font-size:12px;margin-top:28px">
            Log in to admin → Documents section to download, review, and mark this document as reviewed.
          </p>
        </div>
      `,
    })
  } catch { /* non-blocking — don't fail the upload if email fails */ }

  return NextResponse.json({ ok: true })
}
