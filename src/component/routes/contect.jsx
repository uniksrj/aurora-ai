"use client"

import { useState } from "react"

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ email: "", message: "" })

  function onSubmit(e) {
    e.preventDefault()
    // Simulate submit
    setTimeout(() => setSent(true), 600)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Contact / Support</h1>
      <p className="mt-2 text-sm text-muted-foreground">Questions or feedback? We’d love to hear from you.</p>

      {sent ? (
        <div className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4 text-sm">
          Thanks! We received your message and will get back to you soon.
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm">
            <span className="text-muted-foreground">Email</span>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="rounded-md border border-white/10 bg-transparent px-3 py-2"
              placeholder="you@example.com"
            />
          </label>
          <label className="grid gap-2 text-sm">
            <span className="text-muted-foreground">Message</span>
            <textarea
              required
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              className="min-h-32 rounded-md border border-white/10 bg-transparent px-3 py-2"
              placeholder="How can we help?"
            />
          </label>
          <button className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-brand-foreground hover:opacity-90 transition">
            Send
          </button>
        </form>
      )}
    </div>
  )
}
