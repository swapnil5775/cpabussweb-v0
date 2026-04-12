import Link from "next/link"
import { BookOpenCheck, Mail, MapPin } from "lucide-react"
import { CONTACT_EMAIL, SITE_NAME, OFFICE_MIAMI, OFFICE_TAMPA, OFFICE_NEW_YORK } from "@/lib/constants"

export function SiteFooter() {
  return (
    <footer className="bg-background border-t border-border pt-20 pb-10 px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">

          {/* Brand col */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-2 w-fit">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <BookOpenCheck aria-hidden="true" className="h-3.5 w-3.5" />
              </div>
              <span className="text-base font-bold text-primary dark:text-foreground">BookKeeping.business</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              The modern standard for small business finance. Human expertise meets AI efficiency.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail aria-hidden="true" className="h-4 w-4" />
              {CONTACT_EMAIL}
            </a>
            <div className="space-y-1">
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin aria-hidden="true" className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
                <div>
                  <p className="text-xs font-medium text-foreground">{OFFICE_MIAMI.name}</p>
                  <p className="text-xs">{OFFICE_MIAMI.street}</p>
                  <p className="text-xs">{OFFICE_MIAMI.city}</p>
                </div>
              </div>
              <div className="flex gap-3 pl-6 pt-1">
                <span className="text-[10px] text-muted-foreground/60 border border-dashed border-border rounded px-1.5 py-0.5">{OFFICE_TAMPA.name} — Soon</span>
                <span className="text-[10px] text-muted-foreground/60 border border-dashed border-border rounded px-1.5 py-0.5">{OFFICE_NEW_YORK.name} — Soon</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-sm mb-5">Services</h3>
            <ul className="space-y-3.5 text-sm text-muted-foreground">
              {[
                { href: "/bookkeeping", label: "Bookkeeping" },
                { href: "/ap-ar", label: "AP/AR Services" },
                { href: "/tax-prep", label: "Tax Prep" },
                { href: "/services", label: "Catchup Books" },
                { href: "/business-services", label: "Business Services" },
                { href: "/receipt-capture", label: "Receipt Capture" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-primary transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-sm mb-5">Company</h3>
            <ul className="space-y-3.5 text-sm text-muted-foreground">
              {[
                { href: "/about", label: "About Us" },
                { href: "/why-us", label: "Why Us" },
                { href: "/how-it-works", label: "How It Works" },
                { href: "/contact", label: "Contact" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-primary transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-sm mb-5">Resources</h3>
            <ul className="space-y-3.5 text-sm text-muted-foreground">
              {[
                { href: "/articles", label: "Articles" },
                { href: "/faqs", label: "FAQs" },
                { href: "/client-portal", label: "Platform" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Service" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-primary transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground text-center md:text-right">
            Platform access — no separate subscriptions required.
          </p>
        </div>
      </div>
    </footer>
  )
}
