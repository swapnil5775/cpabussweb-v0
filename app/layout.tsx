import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BookKeeping.business - Tech-Enabled Tax & Bookkeeping Services",
  description:
    "Modern tax preparation and bookkeeping services combining AI-assisted workflows with human preparation and review. Secure portal, dedicated account rep — all in one centralized place.",
  generator: "v0.app",
  keywords: [
    "bookkeeping services",
    "tax preparation",
    "small business accounting",
    "online bookkeeping",
    "tax filing services",
    "business tax prep",
    "virtual bookkeeper",
    "affordable bookkeeping",
    "AI bookkeeping",
    "US tax services",
  ],
  authors: [{ name: "BookKeeping.business" }],
  openGraph: {
    title: "BookKeeping.business - Tech-Enabled Tax & Bookkeeping Services",
    description:
      "Modern tax preparation and bookkeeping services combining AI-assisted workflows with human preparation and review.",
    url: "https://bookkeeping.business",
    siteName: "BookKeeping.business",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BookKeeping.business - Tech-Enabled Tax & Bookkeeping Services",
    description:
      "Modern tax preparation and bookkeeping services combining AI-assisted workflows with human preparation and review.",
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
