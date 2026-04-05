import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us — Get Started with Bookkeeping & Tax Services",
  description:
    "Get in touch to start your bookkeeping, payroll, or tax service. We serve small businesses across the USA — restaurants, hotels, childcare, realtors, and more. Fast response, no commitment required.",
  keywords: [
    "contact bookkeeping service",
    "hire online bookkeeper",
    "get a bookkeeper for small business",
    "bookkeeping service inquiry",
    "start bookkeeping service",
    "small business bookkeeper contact",
  ],
  openGraph: {
    title: "Contact Us — Get Started with Bookkeeping & Tax Services | BookKeeping.business",
    description:
      "Get in touch to start your bookkeeping, payroll, or tax service for your small business.",
    url: "https://www.bookkeeping.business/contact",
  },
  alternates: { canonical: "https://www.bookkeeping.business/contact" },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
