"use client"

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-accent-foreground/10">
      <div className="mx-auto max-w-7xl px-4 py-10 grid gap-6 md:grid-cols-3">
        <div>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Aurora AI</p>
          <p className="mt-2 text-sm text-muted-foreground/80">Beautiful AI images at your fingertips.</p>
        </div>
        <div className="text-sm space-y-2">
          <a
            href="https://twitter.com"
            className="text-muted-foreground hover:text-primary transition"
            aria-label="Twitter"
          >
            Twitter
          </a>
          <br />
          <a
            href="https://instagram.com"
            className="text-muted-foreground hover:text-primary transition"
            aria-label="Instagram"
          >
            Instagram
          </a>
          <br />
          {/* <a
            href="https://github.com"
            className="text-muted-foreground hover:text-primary transition"
            aria-label="GitHub"
          >
            GitHub
          </a> */}
        </div>
        <div className="text-sm space-y-2">
          <a href="/terms" className="text-muted-foreground hover:text-primary transition">
            Terms
          </a>
          <br />
          <a href="/privacy" className="text-muted-foreground hover:text-primary transition">
            Privacy
          </a>
          <br />
          <a href="/contact" className="text-muted-foreground hover:text-primary transition">
            Support
          </a>
        </div>
      </div>
    </footer>
  )
}
