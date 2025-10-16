"use client"

export default function About() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold">About Aurora AI</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Aurora AI is a modern, fast image generator focused on premium quality and an elegant experience. We combine
        powerful models with a polished interface so you can create stunning visuals effortlessly.
      </p>

      <h2 className="mt-10 text-xl font-semibold">FAQ</h2>
      <div className="mt-4 divide-y divide-white/10 rounded-xl border border-white/10">
        {[
          ["What styles can I use?", "Professional headshot, cartoon, anime, fantasy, and more."],
          ["Do you support mobile?", "Yes, the interface is fully responsive and touch-friendly."],
          ["Can I use images commercially?", "Yes, generated images are yours, subject to model provider terms."],
        ].map(([q, a]) => (
          <details key={q} className="group open:bg-white/5">
            <summary className="cursor-pointer list-none px-5 py-4 text-sm font-medium">{q}</summary>
            <div className="px-5 pb-5 text-sm text-muted-foreground">{a}</div>
          </details>
        ))}
      </div>
    </div>
  )
}
