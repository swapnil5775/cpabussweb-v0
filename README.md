# BookKeeping.business — Platform README

> **Living document.** Updated as features ship. Use this as the authoritative reference for what has been built, how it works, known issues, and what to watch out for.

---

## Platform Positioning

**BookKeeping.business** is a self-serve online bookkeeping platform for US small businesses and solopreneurs. Unlike traditional bookkeeping firms that require a discovery call before you can even see pricing, this platform is fully self-onboarding:

1. Create a free account
2. Complete the onboarding wizard (business type, entity, revenue, books status, plan selection)
3. Pay via Stripe (or stay on free tier)
4. Dashboard activates immediately — dedicated bookkeeper assigned within 1 business day

**Key differentiator:** No sales calls required to start. No "contact us for pricing." Real monthly pricing shown upfront. Tax filing included in all paid plans.

**Target customers:** Restaurants, hotels, childcare centers, realtors, home-based businesses, tutoring, retail — any US small business owner who wants professional bookkeeping without the friction of a traditional firm.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, React Server Components) |
| Auth | Supabase Auth SSR (`@supabase/ssr`) |
| Database | Supabase (Postgres) with Row Level Security |
| Storage | Supabase Storage (`documents` bucket, private) |
| Payments | Stripe (subscriptions + one-time, Checkout + Billing Portal) |
| Email | Resend (`noreply@webhost4ever.com`) |
| Hosting | Vercel (project: `v0-tax-toolz-marketing-website`) |
| Domain | `www.bookkeeping.business` |
| Scheduling | Calendly (`https://calendly.com/book1on1s/intake-call-business-book`) |

---

## Subscription Plans

All plans are **monthly recurring** via Stripe. Tax filing is included in all paid plans.

| Plan | Price | Target | Stripe Price ID Env Var |
|---|---|---|---|
| **Essentials** | $149/mo | Solopreneurs, small single-entity businesses | `STRIPE_PRICE_ESSENTIALS` |
| **Growth** | $249/mo | Scaling businesses (popular) | `STRIPE_PRICE_GROWTH` |
| **Enterprise** | $399/mo | Multi-entity, complex needs | `STRIPE_PRICE_ENTERPRISE` |

### Essentials includes
- Monthly reconciliation, transaction categorization
- P&L + Balance Sheet reports
- Dedicated bookkeeper + email support
- Quarterly business review
- Owner's personal tax prep & filing

### Growth adds
- Advanced financial reports, cash flow forecasting
- Expense tracking & insights
- Priority email support, monthly business review
- Owner's + spouse tax filing

### Enterprise adds
- Multi-entity bookkeeping, inventory management
- Custom reporting, dedicated account manager
- Phone + email support

---

## One-Time Add-On Services

| Service | Price | Stripe Price ID Env Var |
|---|---|---|
| LLC Formation Assistance | $299 | `STRIPE_PRICE_LLC_FORMATION` |
| Individual Tax Filing (1040) | $299 | `STRIPE_PRICE_TAX_INDIVIDUAL` |
| Business Tax Filing (1120-S/1120/1065) | $499 | `STRIPE_PRICE_TAX_BUSINESS` |
| Payroll Setup | $199 | `STRIPE_PRICE_PAYROLL_SETUP` |

Upsells are shown contextually on the free dashboard based on business profile data:
- No entity type → LLC Formation
- Jan–Apr + any user → Business Tax Filing
- Books status = behind/never done → Catchup Bookkeeping

---

## Required Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_JWT_SECRET=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ESSENTIALS=
STRIPE_PRICE_GROWTH=
STRIPE_PRICE_ENTERPRISE=
STRIPE_PRICE_LLC_FORMATION=
STRIPE_PRICE_TAX_INDIVIDUAL=
STRIPE_PRICE_TAX_BUSINESS=
STRIPE_PRICE_PAYROLL_SETUP=

# Email (Resend)
RESEND_API_KEY=
RESEND_VERIFIED_DOMAIN=webhost4ever.com
NOTIFICATION_EMAIL=          # Where admin email alerts go

# Site
NEXT_PUBLIC_SITE_URL=https://www.bookkeeping.business
```

All vars must be set on the **correct Vercel project** (`v0-tax-toolz-marketing-website`). See "Known Issues → Vercel Two-Project Confusion" below.

---

## Database Schema

### `business_profiles`
Created during the onboarding wizard. One row per user.

| Column | Type | Notes |
|---|---|---|
| `user_id` | uuid | FK → auth.users |
| `business_name`, `business_type` | text | Step 1 |
| `entity_type` | text | `none \| sole_prop \| llc_single \| llc_multi \| s_corp \| c_corp \| partnership` |
| `revenue_range` | text | `under_50k` through `over_500k` |
| `books_status` | text | `current \| behind_1_3 \| behind_3_plus \| never_done` |
| `bookkeeping_platform` | text | quickbooks, xero, wave, etc. |
| `worker_types` | text[] | Array: ft_w2, pt_w2, contractors_1099, etc. |
| `headcount` | text | just_me through 50_plus |
| `needs_payroll`, `payroll_platform` | text | Payroll info |
| `bank_accounts_count`, `credit_cards_count` | text | Banking volume |
| `selected_plan` | text | `essentials \| growth \| enterprise \| free` |
| `onboarding_completed_at` | timestamptz | Set on wizard completion |
| `onboarding_call_scheduled_at` | timestamptz | Set when user marks call scheduled |

### `subscriptions`
Written by the Stripe webhook. One row per user.

| Column | Type | Notes |
|---|---|---|
| `user_id` | uuid | FK → auth.users |
| `stripe_customer_id` | text | Stripe customer |
| `stripe_subscription_id` | text | Stripe subscription |
| `plan` | text | `essentials \| growth \| enterprise` |
| `status` | text | `pending \| active \| past_due \| canceled \| trialing` |
| `current_period_end` | timestamptz | Renewal date |

### `client_profiles`
Personal and business contact details. One row per user.

| Column | Type | Notes |
|---|---|---|
| `full_name`, `phone` | text | Personal |
| `business_address_line1/2`, `business_city/state/zip` | text | Business address |
| `personal_address_line1/2`, `personal_city/state/zip` | text | Personal mailing address |
| `secondary_email` | text | Notification email (separate from auth email) |
| `secondary_email_verified` | boolean | OTP verified flag |
| `secondary_email_code` | text | 6-digit OTP (cleared after use) |
| `secondary_email_code_expires_at` | timestamptz | 15-min TTL |
| `cpa_firm_name` | text | Existing CPA/bookkeeper firm |
| `cpa_full_name`, `cpa_email`, `cpa_phone` | text | CPA contact details |
| `cpa_address_line1/2`, `cpa_city/state/zip` | text | CPA address |

### `documents`
Uploaded files stored in Supabase Storage private bucket.

| Column | Notes |
|---|---|
| `file_name`, `storage_path` | File metadata |
| `file_size_bytes`, `document_type` | Categorization |

### `support_tickets` + `support_messages`
In-dashboard messaging system (paid users only).

| Column | Notes |
|---|---|
| `support_tickets.subject`, `.status` | `open \| resolved` |
| `support_messages.body` | Message content |
| `support_messages.is_staff` | true = team reply (shown on left in UI) |

### `service_orders`
One-time service purchases tracked here alongside Stripe.

---

## Application Routes

### Public (Marketing Site)
| Route | Description |
|---|---|
| `/` | Homepage — hero, how it works, features, pricing teaser |
| `/services` | Full service details |
| `/how-it-works` | 4-step self-serve onboarding walkthrough |
| `/about`, `/why-us` | Trust/positioning pages |
| `/bookkeeping`, `/tax-prep`, `/business-services` | Service detail pages |
| `/faqs` | FAQ page |
| `/contact` | Contact form |
| `/privacy`, `/terms` | Legal |
| `/signup` | → redirects to Supabase signup |
| `/login` | Supabase-powered login |

### Dashboard (Authenticated)
| Route | Description |
|---|---|
| `/dashboard` | Main dashboard — paid vs free split layout |
| `/dashboard/profile` | Personal info, addresses, secondary email OTP, CPA details |
| `/dashboard/documents` | Upload and manage documents |
| `/dashboard/services` | Add-on services marketplace |
| `/dashboard/support` | Messaging with team (paid only; free sees locked state) |

### API Routes
| Route | Method | Description |
|---|---|---|
| `/api/auth/signout` | POST | Sign out → 303 redirect to `/login` |
| `/api/profile` | GET/POST | Load/upsert `client_profiles` |
| `/api/verify-email/send` | POST | Generate + send 6-digit OTP via Resend |
| `/api/verify-email/confirm` | POST | Validate OTP, mark `secondary_email_verified` |
| `/api/support` | GET/POST | List tickets + messages; create ticket/reply (paid only) |
| `/api/onboarding-call` | POST | Mark onboarding call scheduled |
| `/api/stripe/create-checkout` | POST | Start Stripe Checkout session |
| `/api/stripe/create-portal` | POST | Open Stripe Billing Portal |
| `/api/stripe/webhook` | POST | Handle Stripe events (payment, subscription updates) |
| `/api/contact` | POST | Contact form → email via Resend |
| `/api/onboarding` | POST | Save onboarding wizard data |

---

## Key Features Built

### Self-Serve Onboarding Wizard (`/onboarding`)
- 7-step multi-step form collecting all business context
- Step 1: Business name + type
- Step 2: Legal entity type
- Step 3: Revenue range
- Step 4: Books status + current platform
- Step 5: Team/worker types + headcount
- Step 6: Payroll + banking details
- Step 7: Plan selection → Stripe Checkout

### Paid Dashboard (post-payment UX)
When redirected to `/dashboard?session_id=...&plan=...` after payment:
- **Welcome banner** — gradient celebration card with plan name + first name, auto-dismisses after 12s, X to close early
- **Plan badge** — color-coded: amber (Enterprise), purple (Growth), blue (Essentials)
- **Onboarding call banner** — mandatory within 7 days, shows countdown badge, overdue state in amber after 7 days
- **Getting Started Checklist** — 5 tasks with progress bar:
  1. Schedule onboarding call (Required) — external Calendly link
  2. Complete profile → `/dashboard/profile`
  3. Upload first document → `/dashboard/documents`
  4. Add CPA/bookkeeper details → `/dashboard/profile`
  5. Say hello in Support → `/dashboard/support`
- **4 status cards** — Account Status, Plan, Documents, Next Tax Deadline
- **Plan features card** — shows included features for their plan, Manage Billing + Upgrade buttons
- **Tax deadlines panel** — upcoming 3 tax deadlines with days-remaining countdown, urgent highlight ≤14 days
- **Recent documents** — last 3 uploaded, or empty state with upload CTA

### Free Dashboard
- Upgrade banner (always visible) → `/onboarding`
- Calendly call prompt (dismissable) — optional soft ask to book a free consultation
- Profile completeness progress bar (4 items: name, phone, address, secondary email)
- Tax deadlines
- Contextual upsells based on business profile data
- Locked Support section with upgrade prompt

### Profile Page (`/dashboard/profile`)
Five sections:
1. **Personal Info** — full name, phone
2. **Business Address** — line1/2, city, state, zip
3. **Personal Mailing Address** — separate from business
4. **Secondary Email** — with 6-digit OTP verification flow via Resend
5. **CPA / Accountant Details** — firm name, contact name, email, phone, full address (so team can coordinate with existing CPA)

### In-Dashboard Support/Messaging (`/dashboard/support`)
- **Paid users only** — free users see a locked card with upgrade prompt
- Create support requests with subject + message
- Thread-style view with bubble chat UI
- Staff replies appear on the left labeled "BookKeeping.business Team"
- User messages on the right in primary color
- Admin receives email notification via Resend on new messages (non-blocking)

### Onboarding Call Management
- Free users: dismissable optional Calendly prompt ("Book a free 15-min call")
- Paid users (≤7 days): countdown badge showing days remaining
- Paid users (>7 days, not scheduled): amber overdue warning banner
- "Already scheduled" button — fires `POST /api/onboarding-call`, records `onboarding_call_scheduled_at`
- Once scheduled: green confirmation replaces all banners
- Checklist item also reflects call status

### Stripe Integration
- Subscription checkout via Stripe Checkout (hosted page)
- `justPaid = !!session_id` param in URL → dashboard shows paid state immediately even if webhook hasn't fired yet
- Stripe Billing Portal (`/api/stripe/create-portal`) for subscription management, cancellation, invoice download
- Webhook handles: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
- One-time services use separate Checkout sessions with `mode: "payment"`

### Secondary Email OTP Verification
- User enters secondary/notification email on profile page
- Click "Verify" → `POST /api/verify-email/send` generates 6-digit code, stores with 15-min TTL, sends via Resend
- User enters code → `POST /api/verify-email/confirm` validates, sets `secondary_email_verified = true`, clears code
- If secondary email is changed, verified status resets to false automatically

### Marketing Site CTAs (Updated to Self-Serve)
- All "Contact Us" / "Book a Call" primary CTAs changed to "Create Free Account" → `/signup`
- Homepage hero, How It Works, Services page all updated
- How It Works page rewritten to reflect self-serve 4-step flow

---

## Bugs Fixed

### HTTP 405 on Logout
**Cause:** `NextResponse.redirect()` defaults to 307 (Temporary Redirect), which preserves the POST method. The login page only accepts GET, so it returns 405.
**Fix:** `NextResponse.redirect(url, { status: 303 })` forces a GET redirect.
**File:** `app/api/auth/signout/route.ts`

### Server Crash for Free-Tier Users ("Application error")
**Cause:** `subscription.plan` accessed without null check when `subscription` row is null (free users have no subscription row).
**Fix:** Use optional chaining `subscription?.plan ?? "Free"` throughout dashboard.
**File:** `app/(dashboard)/dashboard/page.tsx`

### Post-Payment Dashboard Not Showing Paid State
**Cause:** Stripe webhook fires asynchronously — by the time user lands on `/dashboard`, the `subscriptions` row may not exist yet.
**Fix:** Read `session_id` query param — if present, treat as `justPaid = true` and force paid dashboard layout regardless of DB state. Webhook will catch up shortly after.
**File:** `app/(dashboard)/dashboard/page.tsx`

### Vercel Two-Project Confusion
**Cause:** Running `vercel link` without specifying project created a second project `cpabussweb-v0`. Env vars (including Stripe) were pushed to the wrong project.
**Fix:** `vercel link --project v0-tax-toolz-marketing-website` to re-link to the correct project, then re-push all env vars.
**Correct Vercel project:** `v0-tax-toolz-marketing-website` at `vercel.com/swapnil5775-yahoocoms-projects/v0-tax-toolz-marketing-website`
**Wrong project (can be deleted):** `cpabussweb-v0`

### Stripe API TypeScript Version Error
**Cause:** Stripe SDK `apiVersion` type is strict — only known version strings accepted.
**Fix:** Use a known valid version string that matches the installed SDK.
**File:** `app/api/stripe/webhook/route.ts`

---

## Security & Access Control

### Row Level Security (RLS)
All tables have RLS enabled. Users can only read/write their own rows:
- `business_profiles` — select, insert, update own row
- `subscriptions` — select only (written by webhook via service role)
- `client_profiles` — select, insert, update own row
- `documents` — select, insert, delete own row
- `support_tickets` — select, insert own rows
- `support_messages` — select, insert own rows

### Service Role Client
Admin writes (subscription updates from webhook, OTP verification) use the `SUPABASE_SERVICE_ROLE_KEY` client which bypasses RLS. This key is **never exposed to the browser**.

### Support Access Gate
The support API checks that a user has an active/trialing subscription AND `selected_plan !== "free"` before allowing ticket creation. Returns 403 for free users.

### OTP Security
- 6-digit numeric code
- 15-minute TTL enforced server-side
- Code cleared from DB after successful verification
- Secondary email must match what's on record

---

## Stripe Webhook Configuration

**Endpoint:** `https://www.bookkeeping.business/api/stripe/webhook`
**Events to listen for:**
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

All routes using Stripe or Supabase must export `export const dynamic = "force-dynamic"` to prevent Next.js from caching them at build time.

**Webhook signature verification** is enforced — raw request body + `STRIPE_WEBHOOK_SECRET`.

---

## Email (Resend)

**From address:** `noreply@webhost4ever.com` (verified domain)
**Admin notifications go to:** `NOTIFICATION_EMAIL` env var

Emails sent:
- OTP verification code for secondary email
- Admin notification on new support ticket/message

---

## Calendly Integration

**URL:** `https://calendly.com/book1on1s/intake-call-business-book`

Used in:
- Free dashboard: optional "Schedule Free Call" prompt (dismissable)
- Paid dashboard: mandatory 7-day onboarding call requirement
- Onboarding checklist: first required task
- All open in `target="_blank"` with `rel="noopener noreferrer"`

The "Already scheduled" button records the call in DB without requiring Calendly webhook integration.

---

## Things to Watch Out For

### Webhook Race Condition
Stripe webhooks can arrive after the user lands on the dashboard. The `justPaid` flag (from `session_id` URL param) is the workaround. If a user bookmarks `/dashboard?session_id=...` and returns later, they'd see the paid welcome banner repeatedly. Consider clearing `session_id` from URL after first render if this becomes an issue.

### Subscription Status Sources of Truth
The `subscriptions` table is the only source of truth for active plans. If a subscription is canceled in Stripe but the webhook fails, the dashboard will still show paid status. Stripe webhook reliability and retry logic should be monitored.

### `current_period_end` in Stripe API
In newer Stripe API versions, `current_period_end` may not be a top-level field on the subscription object — it may be under `items.data[0]`. The webhook handler should be verified to correctly extract this for the renewal date display on the dashboard.

### Service Role Key Exposure
`SUPABASE_SERVICE_ROLE_KEY` must NEVER be referenced in any `"use client"` component or any file that gets bundled client-side. All admin DB operations must happen in API routes or Server Components only.

### RLS on `support_messages` Staff Replies
Staff replies (`is_staff = true`) are inserted via the service role client in the API. The current RLS allows users to see messages where `user_id = auth.uid()` — staff replies use the replying admin's user_id. This means staff replies are only visible to the user if the `ticket_id` FK resolves correctly. If staff reply visibility breaks, check that `user_id` on staff messages is set to the ticket owner's user_id, not the admin's.

### Two Vercel Projects
`cpabussweb-v0` is a duplicate project that was accidentally created. It should be deleted from Vercel to avoid deployment confusion. The real project serving production is `v0-tax-toolz-marketing-website`.

### `force-dynamic` Required on API Routes
Any API route using `createClient()` (Supabase auth) or Stripe must export `export const dynamic = "force-dynamic"`. Without this, Next.js may attempt to statically render it at build time and crash.

### Database Migrations
Migrations are in `scripts/` and must be run manually against the Supabase Postgres instance. They are NOT auto-applied. Use a direct postgres connection (Node `pg` client) when `psql` is not available:
```js
const { Client } = require('pg')
const client = new Client({
  connectionString: process.env.POSTGRES_URL_NON_POOLING,
  ssl: { rejectUnauthorized: false }
})
```

---

## Potential Next Features / Roadmap Ideas

- **Supabase Realtime on support messages** — live chat feel without polling
- **Staff admin dashboard** — internal view of all clients, ticket queue, subscription status
- **Stripe customer portal deep link** — link directly to invoice history vs. main portal
- **Onboarding call webhook from Calendly** — auto-mark call as scheduled when Calendly confirms
- **Document categorization** — tag uploads as bank statement, receipt, tax doc, etc.
- **Monthly report delivery** — email clients when new reports are ready
- **Referral program** — discounts for referring other businesses
- **Mobile-responsive polish pass** — audit all dashboard pages on small screens
- **Annual billing option** — 2 months free, reduces monthly churn

---

## Project File Map (Key Files)

```
app/
  page.tsx                          # Homepage (redirects to dashboard if logged in)
  (auth)/
    login/                          # Supabase login page
    signup/                         # Supabase signup page
  (dashboard)/
    layout.tsx                      # Dashboard shell, nav: Overview, Documents, Services, Support, Profile
    error.tsx                       # Error boundary with Try Again + Sign Out
    dashboard/
      page.tsx                      # Main dashboard — paid vs free split
      profile/page.tsx              # Profile: personal info, addresses, OTP, CPA
      documents/page.tsx            # Document upload/list
      services/page.tsx             # Add-on services marketplace
      support/page.tsx              # Messaging UI (paid only)
  api/
    auth/signout/route.ts           # POST logout → 303 redirect
    profile/route.ts                # GET/POST client_profiles
    verify-email/send/route.ts      # OTP send via Resend
    verify-email/confirm/route.ts   # OTP validate + set verified
    support/route.ts                # Tickets + messages API
    onboarding-call/route.ts        # Mark call scheduled
    stripe/
      create-checkout/route.ts      # Stripe Checkout session
      create-portal/route.ts        # Stripe Billing Portal
      webhook/route.ts              # Stripe event handler
  onboarding/page.tsx               # 7-step onboarding wizard
  how-it-works/page.tsx             # Marketing: self-serve steps
  services/page.tsx                 # Marketing: service details
  global-error.tsx                  # Top-level error page

components/
  dashboard/
    paid-welcome.tsx                # Gradient celebration banner (auto-dismiss 12s)
    onboarding-checklist.tsx        # 5-task checklist with progress bar
    onboarding-call-banner.tsx      # Calendly call prompt (free) / countdown (paid)

lib/
  stripe-plans.ts                   # Plan + service definitions with price IDs
  supabase/
    server.ts                       # SSR Supabase client (cookies)
    client.ts                       # Browser Supabase client

scripts/
  001_create_leads_table.sql        # Contact form leads
  002_create_client_tables.sql      # business_profiles, subscriptions, documents, service_orders
  003_add_client_profiles.sql       # client_profiles (personal info, addresses, OTP, CPA)
  004_support_tables.sql            # support_tickets, support_messages
```

---

## Deployment

**Git repo:** `https://github.com/swapnil5775/cpabussweb-v0`
**Branch:** `main` → auto-deploys to Vercel on push
**Vercel project:** `v0-tax-toolz-marketing-website`
**Production URL:** `https://www.bookkeeping.business`

To deploy: commit and push to `main`. Vercel picks it up automatically (~1-2 min build).

To update env vars: `vercel env add VAR_NAME --project v0-tax-toolz-marketing-website`

---

*Last updated: March 2026*
