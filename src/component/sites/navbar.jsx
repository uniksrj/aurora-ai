"use client"

import { Link, useLocation } from "react-router"
import { useState } from "react"
import { cn } from "../../utils/utils"
import ThemeToggle from "../themetoggle"

const links = [
    { to: "/", label: "Home" },
    { to: "/generate", label: "Generate" },
    { to: "/pricing", label: "Pricing" },
    { to: "/about", label: "About / FAQ" },
    { to: "/contact", label: "Contact" },
]

export default function Navbar() {
    const location = useLocation()
    const [open, setOpen] = useState(false)

    return (
        <header className="fixed inset-x-0 top-0 z-50">
            <div className="mx-auto max-w-7xl">
                <div className="m-3 rounded-xl border border-white/10 bg-background/50 backdrop-blur-xl">
                    <nav className="flex items-center justify-between px-4 py-3">
                        <Link to="/" className="flex items-center gap-2">
                            <span
                                className="h-2 w-2 rounded-full bg-brand-glow shadow-[0_0_24px_6px_var(--brand-glow)]"
                                aria-hidden
                            />
                            <span className="text-sm font-semibold tracking-wider text-primary">AURORA AI</span>
                        </Link>

                        <button
                            onClick={() => setOpen(!open)}
                            className="md:hidden rounded-md border border-white/10 px-3 py-2 text-sm text-muted-foreground hover:text-primary transition"
                            aria-expanded={open}
                            aria-controls="mobile-nav"
                            aria-label="Toggle navigation"
                        >
                            Menu
                        </button>

                        <ul className="hidden md:flex items-center gap-1">
                            {links.map((l) => (
                                <li key={l.to}>
                                    <Link
                                        to={l.to}
                                        className={cn(
                                            "rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-primary transition-colors",
                                            location.pathname === l.to && "text-primary",
                                        )}
                                    >
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link
                                    to="/generate"
                                    className="ml-2 rounded-lg bg-brand text-brand-foreground px-4 py-2 text-sm font-medium hover:opacity-90 transition"
                                >
                                    Try it now
                                </Link>
                            </li>
                             <li>
                                <Link
                                    to="/login"
                                    onClick={() => setOpen(false)}
                                    className="block text-center rounded-lg bg-brand text-brand-foreground px-4 py-2 text-sm font-medium hover:opacity-90 transition"
                                >
                                   Login
                                </Link>
                            </li>
                             <li>
                                <Link
                                    to="/signup"
                                    onClick={() => setOpen(false)}
                                    className="block text-center rounded-lg bg-brand text-brand-foreground px-4 py-2 text-sm font-medium hover:opacity-90 transition"
                                >
                                  SignUp
                                </Link>
                            </li>
                             <li className="flex justify-center">
                                <ThemeToggle />
                            </li>
                        </ul>
                    </nav>

                    <div id="mobile-nav" className={cn("md:hidden px-4 pb-4", open ? "block" : "hidden")}>
                        <ul className="grid gap-2">
                            {links.map((l) => (
                                <li key={l.to}>
                                    <Link
                                        to={l.to}
                                        onClick={() => setOpen(false)}
                                        className={cn(
                                            "block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-primary transition-colors",
                                            location.pathname === l.to && "text-primary",
                                        )}
                                    >
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link
                                    to="/generate"
                                    onClick={() => setOpen(false)}
                                    className="block text-center rounded-lg bg-brand text-brand-foreground px-4 py-2 text-sm font-medium hover:opacity-90 transition"
                                >
                                    Try it now
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/login"
                                    onClick={() => setOpen(false)}
                                    className="block text-center rounded-lg bg-brand text-brand-foreground px-4 py-2 text-sm font-medium hover:opacity-90 transition"
                                >
                                   Login
                                </Link>
                            </li>
                             <li>
                                <Link
                                    to="/signup"
                                    onClick={() => setOpen(false)}
                                    className="block text-center rounded-lg bg-brand text-brand-foreground px-4 py-2 text-sm font-medium hover:opacity-90 transition"
                                >
                                  SignUp
                                </Link>
                            </li>
                            <li className="flex justify-center">
                                <ThemeToggle />
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    )
}
