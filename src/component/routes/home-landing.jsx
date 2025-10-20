"use client"

import { Link } from "react-router"

function DemoImage({ alt, h = 320, w = 480, query ,src =""}) {
  let $src = !src ? 'generic-placeholder-icon.png' :  src;
  return (
    <img
      src={`/${$src}?height=${h}&width=${w}&query=${encodeURIComponent(query)}`}
      alt={alt}
      className="h-full w-full rounded-xl object-cover ring-1 ring-white/10 transition-transform duration-500 hover:scale-[1.02]"
      loading="lazy"
    />
  )
}

export default function HomeLanding() {
  return (
    <div className="mx-auto max-w-7xl px-4">
      {/* Hero */}
      <section className="relative grid gap-8 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs text-foreground">
            AI Image Generator
          </span>
          <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight md:text-6xl">
            Create stunning, premium visuals with a single click
          </h1>
          <p className="mt-4 text-pretty text-muted-foreground md:text-lg">
            Upload a photo and apply professional styles: headshots, cartoons, anime, fantasy, and more — with HD output
            and smooth controls.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              to="/generate"
              className="rounded-lg bg-brand px-6 py-3 text-sm font-medium text-brand-foreground hover:opacity-90 transition"
            >
              Generate now
            </Link>
            <Link
              to="/pricing"
              className="rounded-lg border border-accent-foreground/10 px-6 py-3 text-sm text-foreground hover:bg-white/5 transition"
            >
              View pricing
            </Link>
          </div>
        </div>

        {/* Demo Grid */}
        <div className="relative">
          <div
            className="pointer-events-none absolute inset-0 -z-10 blur-3xl"
            aria-hidden
            style={{ background: "radial-gradient(1200px 400px at 50% -10%, var(--brand-glow), transparent)" }}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <DemoImage alt="Pro headshot result" query="professional studio headshot, premium lighting, HD result" src="maharaj.webp" />
            <DemoImage alt="Anime style result" query="anime portrait vibrant, neon cyberpunk" src="diwali.webp" />
            <DemoImage alt="Fantasy style result" query="fantasy portrait with magical particles, cinematic lighting" />
            <DemoImage alt="Cartoon style result" query="clean cartoon vector portrait, bold lines" />
            <DemoImage alt="Background removal" query="subject with transparent background, product photo style" />
            <DemoImage alt="Cinematic color grade" query="cinematic teal and orange graded portrait" />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 md:py-20">
        <h2 className="text-center text-2xl font-semibold md:text-3xl">Loved by creators</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ["“The best AI headshots I’ve used.”", "— Mira, Designer"],
            ["“Fast, clean, and gorgeous results.”", "— Kev, Photographer"],
            ["“My go-to tool for product images.”", "— Dani, Founder"],
          ].map(([q, a]) => (
            <blockquote key={q} className="rounded-xl border border-accent-foreground/10 bg-white/5 p-5 text-sm leading-relaxed">
              <p>{q}</p>
              <footer className="mt-3 text-muted-foreground">{a}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-20">
        <h2 className="text-center text-2xl font-semibold md:text-3xl">FAQ</h2>
        <div className="mx-auto mt-6 max-w-3xl divide-y divide-accent-foreground/10 rounded-xl border border-accent-foreground/10">
          {[
            ["How does it work?", "Upload an image, pick a style and settings, then generate HD results in seconds."],
            ["Do you store my images?", "You control your content. You can delete generated images anytime."],
            ["What about licensing?", "Images you generate are yours to use for personal or commercial projects."],
          ].map(([q, a]) => (
            <details key={q} className="group open:bg-white/5">
              <summary className="cursor-pointer list-none px-5 py-4 text-sm font-medium text-foreground hover:bg-white/5">
                {q}
              </summary>
              <div className="px-5 pb-5 text-sm text-muted-foreground">{a}</div>
            </details>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            to="/generate"
            className="rounded-lg bg-brand px-6 py-3 text-sm font-medium text-brand-foreground hover:opacity-90 transition"
          >
            Start creating
          </Link>
        </div>
      </section>
    </div>
  )
}
