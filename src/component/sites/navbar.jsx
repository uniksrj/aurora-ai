"use client"

import { Link, useLocation, useNavigate } from "react-router"
import { useState } from "react"
import { cn } from "../../utils/utils"
import ThemeToggle from "../themetoggle"
import { useAuth } from "../../context/AuthContext"

const links = [
    { to: "/", label: "Home" },
    { to: "/generate", label: "Generate" },
    { to: "/pricing", label: "Pricing" },
    { to: "/about", label: "About / FAQ" },
    { to: "/contact", label: "Contact" },
]

export default function Navbar() {
    const location = useLocation()
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const { currentUser, logout } = useAuth()

    const handleLogout = async () => {
        try {
            await logout()
            setOpen(false)
            navigate('/')
        } catch (error) {
            console.error('Failed to log out:', error)
        }
    }

    // Get user from localStorage as fallback
    const getUserFromStorage = () => {
        try {
            const savedUser = localStorage.getItem('currentUser')
            return savedUser ? JSON.parse(savedUser) : null
        } catch {
            return null
        }
    }

    const user = currentUser || getUserFromStorage()

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

                            {user ? (
                                // User is logged in - show user menu
                                <>
                                    <li>
                                        <Link
                                            to="/generate"
                                            className="ml-2 rounded-lg bg-brand text-brand-foreground px-4 py-2 text-sm font-medium hover:opacity-90 transition"
                                        >
                                            Try it now
                                        </Link>
                                    </li>
                                    <li className="relative group">
                                        <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                                            {user.photoURL ? (
                                                <img
                                                    src={user.photoURL}
                                                    alt={user.displayName || 'User'}
                                                    className="w-6 h-6 rounded-full"
                                                />
                                            ) : (
                                                <div className="w-6 h-6 rounded-full bg-brand flex items-center justify-center text-xs text-white">
                                                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <span>{user.displayName || user.email?.split('@')[0]}</span>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        <div className="absolute right-0 mt-2 w-48 rounded-lg border border-white/10 bg-background/90 backdrop-blur-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                            <div className="p-2">
                                                <div className="px-3 py-2 text-sm border-b border-white/10">
                                                    <p className="font-medium">{user.displayName || 'User'}</p>
                                                    <p className="text-muted-foreground text-xs">{user.email}</p>
                                                </div>
                                                
                                                <button
                                                    onClick={handleLogout}
                                                    className="block w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-primary transition-colors rounded-lg"
                                                >
                                                    Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                </>
                            ) : (
                                // User is not logged in - show auth buttons
                                <>
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
                                            className="rounded-lg px-4 py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            Login
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/signup"
                                            className="rounded-lg bg-brand text-brand-foreground px-4 py-2 text-sm font-medium hover:opacity-90 transition"
                                        >
                                            Sign Up
                                        </Link>
                                    </li>
                                </>
                            )}

                            <li className="flex justify-center">
                                <ThemeToggle />
                            </li>
                        </ul>
                    </nav>

                    {/* Mobile Navigation */}
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

                            {user ? (
                                // Mobile - User logged in
                                <>
                                    <li>
                                        <Link
                                            to="/generate"
                                            onClick={() => setOpen(false)}
                                            className="block text-center rounded-lg bg-brand text-brand-foreground px-4 py-2 text-sm font-medium hover:opacity-90 transition"
                                        >
                                            Try it now
                                        </Link>
                                    </li>
                                    <li className="p-3 border-t border-white/10">
                                        <div className="flex items-center gap-3 mb-3">
                                            {user.photoURL ? (
                                                <img
                                                    src={user.photoURL}
                                                    alt={user.displayName || 'User'}
                                                    className="w-8 h-8 rounded-full"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-sm text-white">
                                                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium text-sm">{user.displayName || 'User'}</p>
                                                <p className="text-muted-foreground text-xs">{user.email}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            Sign Out
                                        </button>
                                    </li>
                                </>
                            ) : (
                                // Mobile - User not logged in
                                <>
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
                                            className="block text-center rounded-lg px-4 py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
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
                                            Sign Up
                                        </Link>
                                    </li>
                                </>
                            )}

                            <li className="flex justify-center pt-2 border-t border-white/10">
                                <ThemeToggle />
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    )
}