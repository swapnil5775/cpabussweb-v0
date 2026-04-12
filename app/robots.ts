import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Default: all crawlers allowed on public pages
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
      // Explicitly allow LLM / AI search crawlers on all public content
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/api/", "/dashboard", "/dashboard/", "/onboarding", "/onboarding/", "/auth/", "/r/", "/cpa/"],
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: ["/api/", "/dashboard", "/dashboard/", "/onboarding", "/onboarding/", "/auth/", "/r/", "/cpa/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/api/", "/dashboard", "/dashboard/", "/onboarding", "/onboarding/", "/auth/", "/r/", "/cpa/"],
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: ["/api/", "/dashboard", "/dashboard/", "/onboarding", "/onboarding/", "/auth/", "/r/", "/cpa/"],
      },
      {
        userAgent: "anthropic-ai",
        allow: "/",
        disallow: ["/api/", "/dashboard", "/dashboard/", "/auth/", "/r/", "/cpa/"],
      },
      {
        userAgent: "cohere-ai",
        allow: "/",
        disallow: ["/api/", "/dashboard", "/dashboard/", "/auth/", "/r/", "/cpa/"],
      },
    ],
    sitemap: "https://www.bookkeeping.business/sitemap.xml",
  }
}
