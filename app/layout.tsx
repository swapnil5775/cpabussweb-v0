import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Online Bookkeeping & Tax Services for Small Business | BookKeeping.business",
    template: "%s | BookKeeping.business",
  },
  description:
    "Professional online bookkeeping, payroll, and tax services for small businesses across the USA. Dedicated bookkeeper, software included (QuickBooks, Gusto, Bill.com) — one flat monthly fee, no surprises.",
  keywords: [
    "online bookkeeping services",
    "small business bookkeeping",
    "bookkeeping and tax service",
    "virtual bookkeeper",
    "monthly bookkeeping service",
    "bookkeeping with payroll included",
    "affordable bookkeeping services USA",
    "restaurant bookkeeping services",
    "hotel accounting services",
    "childcare bookkeeping services",
    "realtor bookkeeping",
    "home-based business bookkeeping",
    "Pilot alternative",
    "Collective alternative",
    "Bench alternative",
    "bookkeeping service no software fees",
  ],
  authors: [{ name: "BookKeeping.business" }],
  metadataBase: new URL("https://www.bookkeeping.business"),
  alternates: { canonical: "https://www.bookkeeping.business" },
  openGraph: {
    title: "Online Bookkeeping & Tax Services for Small Business | BookKeeping.business",
    description:
      "Professional bookkeeping, payroll, and tax services for small businesses — dedicated bookkeeper, all software included, one flat monthly fee.",
    url: "https://www.bookkeeping.business",
    siteName: "BookKeeping.business",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Bookkeeping & Tax Services for Small Business | BookKeeping.business",
    description:
      "Professional bookkeeping, payroll, and tax services — dedicated bookkeeper, all software included, one flat monthly fee.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          id="schema-org"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              "name": "BookKeeping.business",
              "url": "https://www.bookkeeping.business",
              "logo": "https://www.bookkeeping.business/icon.svg",
              "email": "hello@bookkeeping.business",
              "description": "Monthly bookkeeping, tax preparation, and business services for restaurants, hotels, childcare centers, realtors, home-based businesses, and small businesses. AI-assisted, human-reviewed. Clients never pay for software subscriptions.",
              "slogan": "AI-assisted bookkeeping and tax prep. Human-reviewed. No software subscriptions for clients.",
              "areaServed": { "@type": "Country", "name": "United States" },
              "serviceType": [
                "Bookkeeping",
                "Tax Preparation",
                "Payroll Administration",
                "Business Consulting",
                "LLC Formation Assistance"
              ],
              "knowsAbout": [
                "Restaurant bookkeeping",
                "Hotel accounting",
                "Childcare center bookkeeping",
                "Realtor tax preparation",
                "Home-based business accounting",
                "S-Corp tax filing",
                "Small business bookkeeping",
                "Monthly reconciliation",
                "QuickBooks alternative"
              ],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Bookkeeping and Tax Services",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Monthly Bookkeeping",
                      "description": "Monthly reconciliation, transaction categorization, financial reports, dedicated bookkeeper, and owner's personal tax prep included.",
                      "url": "https://www.bookkeeping.business/bookkeeping"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Tax Preparation",
                      "description": "Individual and business tax returns — W-2, self-employed, S-Corp, C-Corp, Partnership — with federal and state e-filing included.",
                      "url": "https://www.bookkeeping.business/tax-prep"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Catchup Bookkeeping",
                      "description": "Historical transaction reconciliation for businesses behind on their books.",
                      "url": "https://www.bookkeeping.business/bookkeeping"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Business Services",
                      "description": "LLC formation assistance, registered agent coordination, state filings, business consultation, acquisition file review.",
                      "url": "https://www.bookkeeping.business/business-services"
                    }
                  }
                ]
              },
              "sameAs": [
                "https://bookkeeping.business"
              ]
            })
          }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-X290C9HEH9"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-X290C9HEH9');
          `}
        </Script>
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
