import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.bookkeeping.business"
  const currentDate = new Date().toISOString()

  return [
    // ── Tier 1: Primary conversion pages ──────────────────────
    { url: baseUrl,                                 lastModified: currentDate, changeFrequency: "weekly",  priority: 1.00 },
    { url: `${baseUrl}/bookkeeping`,                lastModified: currentDate, changeFrequency: "weekly",  priority: 0.98 },
    { url: `${baseUrl}/tax-prep`,                   lastModified: currentDate, changeFrequency: "weekly",  priority: 0.95 },
    { url: `${baseUrl}/ap-ar`,                      lastModified: currentDate, changeFrequency: "weekly",  priority: 0.95 },
    { url: `${baseUrl}/receipt-capture`,            lastModified: currentDate, changeFrequency: "weekly",  priority: 0.93 },
    // ── Tier 2: Trust & comparison pages ──────────────────────
    { url: `${baseUrl}/why-us`,                     lastModified: currentDate, changeFrequency: "weekly",  priority: 0.92 },
    { url: `${baseUrl}/services`,                   lastModified: currentDate, changeFrequency: "weekly",  priority: 0.90 },
    { url: `${baseUrl}/client-portal`,              lastModified: currentDate, changeFrequency: "monthly", priority: 0.88 },
    { url: `${baseUrl}/how-it-works`,               lastModified: currentDate, changeFrequency: "monthly", priority: 0.85 },
    // ── Tier 3: Conversion & supporting pages ─────────────────
    { url: `${baseUrl}/contact`,                    lastModified: currentDate, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/business-services`,          lastModified: currentDate, changeFrequency: "monthly", priority: 0.80 },
    { url: `${baseUrl}/faqs`,                       lastModified: currentDate, changeFrequency: "monthly", priority: 0.78 },
    { url: `${baseUrl}/about`,                      lastModified: currentDate, changeFrequency: "monthly", priority: 0.65 },
    // ── Tier 4: Reference pages ────────────────────────────────
    { url: `${baseUrl}/ap-ar-fees`,                 lastModified: currentDate, changeFrequency: "monthly", priority: 0.55 },
    // ── Tier 5: Legal ─────────────────────────────────────────
    { url: `${baseUrl}/privacy`,                    lastModified: currentDate, changeFrequency: "yearly",  priority: 0.30 },
    { url: `${baseUrl}/terms`,                      lastModified: currentDate, changeFrequency: "yearly",  priority: 0.30 },
  ]
}
