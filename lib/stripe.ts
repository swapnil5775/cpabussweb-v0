import Stripe from "stripe"

let _instance: Stripe | undefined

function getInstance(): Stripe {
  if (!_instance) {
    _instance = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-03-25.dahlia",
    })
  }
  return _instance
}

// Proxy: defers Stripe instantiation until first property access (safe at build time)
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop: string | symbol) {
    return (getInstance() as unknown as Record<string | symbol, unknown>)[prop]
  },
})
