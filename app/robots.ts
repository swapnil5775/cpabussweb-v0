import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Block private/app pages to save crawl budget for real content pages
        disallow: [
          "/_next/static/",
          "/_next/image/",
          "/api/",
          "/dashboard",
          "/dashboard/",
          "/onboarding",
          "/onboarding/",
          "/login",
          "/signup",
          "/auth/",
          "/r/",
          "/cpa/",
        ],
      },
    ],
    sitemap: "https://www.bookkeeping.business/sitemap.xml",
  }
}
