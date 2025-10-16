"use client"

import { Link } from "react-router-dom"

const plans = [
  {
    name: "Starter",
    price: "$9",
    period: "/50 credits",
    features: ["HD outputs", "Basic styles", "Email support"],
    cta: "Buy credits",
    popular: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/200 credits",
    features: ["HD+ outputs", "All styles", "Priority support", "Batch processing"],
    cta: "Buy credits",
    popular: true,
  },
  {
    name: "Studio",
    price: "$49",
    period: "/unlimited 7 days",
    features: ["Unlimited renders", "All features", "Commercial license", "Dedicated support"],
    cta: "Start trial",
    popular: false,
  },
]

export default function Pricing() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-center">Pricing</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">Flexible options for creators and teams.</p>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`rounded-xl border border-white/10 p-6 ${p.popular ? "bg-white/5 ring-1 ring-brand/40" : "bg-transparent"}`}
          >
            <div className="flex items-baseline justify-between">
              <h3 className="text-lg font-medium">{p.name}</h3>
              {p.popular && (
                <span className="rounded-full bg-brand/15 px-2 py-1 text-xs text-brand-foreground">Popular</span>
              )}
            </div>
            <div className="mt-4">
              <span className="text-3xl font-semibold">{p.price}</span>
              <span className="text-muted-foreground"> {p.period}</span>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {p.features.map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>
            <button className="mt-6 w-full rounded-lg bg-brand px-4 py-2 text-sm font-medium text-brand-foreground hover:opacity-90 transition">
              {p.cta}
            </button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Need more?{" "}
              <Link to="/contact" className="text-primary hover:underline">
                Contact sales
              </Link>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
