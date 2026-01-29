import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">BookKeeping.business</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Tech-enabled tax & bookkeeping services with human preparation and review.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-foreground transition-colors">
                  All Services
                </Link>
              </li>
              <li>
                <Link href="/bookkeeping" className="text-muted-foreground hover:text-foreground transition-colors">
                  Bookkeeping
                </Link>
              </li>
              <li>
                <Link href="/tax-prep" className="text-muted-foreground hover:text-foreground transition-colors">
                  Tax Prep & Filing
                </Link>
              </li>
              <li>
                <Link
                  href="/business-services"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Business Services
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="text-muted-foreground hover:text-foreground transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/client-portal" className="text-muted-foreground hover:text-foreground transition-colors">
                  Client Portal
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border space-y-3">
          <p className="text-xs text-muted-foreground text-center">
            Client Portal access is provided as part of our service. Features may vary by engagement.
          </p>
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} BookKeeping.business. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
