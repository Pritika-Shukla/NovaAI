"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Menu, X, User, LogOut, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { logout } from "@/app/(auth)/login/actions"
import toast from "react-hot-toast"

const navItems = [
  { label: "Features", href: "#features" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Contact", href: "#contact" },
]

export function Navbar() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [mounted, setMounted] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!userMenuOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest(".user-menu-container")) setUserMenuOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [userMenuOpen])

  const handleLogout = async () => {
    try {
      const result = await logout()
      if (result.success) {
        toast.success(result.message ?? "Signed out.")
        setUserMenuOpen(false)
        setMobileMenuOpen(false)
        router.push("/")
        router.refresh()
      } else {
        toast.error(result.error ?? "Sign out failed.")
      }
    } catch {
      toast.error("Something went wrong.")
    }
  }

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.user_metadata?.display_name ||
    user?.email?.split("@")[0] ||
    user?.email ||
    "User"

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl"
    >
      <nav
        ref={navRef}
        className="relative flex items-center justify-between px-4 py-3 rounded-full bg-zinc-900/40 backdrop-blur-md border border-zinc-800"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
            <span className="text-zinc-950 font-bold text-sm">N</span>
          </div>
          <span className="font-semibold text-white hidden sm:block">NovaAI</span>
        </Link>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex items-center gap-1 relative">
          {navItems.map((item, index) => (
            <Link
              key={item.label}
              href={item.href}
              className="relative px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {hoveredIndex === index && (
                <motion.div
                  layoutId="navbar-hover"
                  className="absolute inset-0 bg-zinc-800 rounded-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* CTA Buttons / User Menu */}
        <div className="hidden md:flex items-center gap-3">
          {mounted && user ? (
            <div className="relative user-menu-container">
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-zinc-200 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-zinc-300" />
                </div>
                <span className="text-sm font-medium text-white max-w-[100px] truncate">{displayName}</span>
              </button>
              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" aria-hidden onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl z-50 py-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="shimmer-btn bg-white text-zinc-950 hover:bg-zinc-200 rounded-full px-4">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-zinc-400 hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 mt-2 p-4 rounded-2xl bg-zinc-900/95 backdrop-blur-md border border-zinc-800"
        >
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-4 py-3 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <hr className="border-zinc-800 my-2" />
            {mounted && user ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-4 py-3 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-3 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="justify-start w-full text-zinc-400 hover:text-white">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="shimmer-btn bg-white text-zinc-950 hover:bg-zinc-200 rounded-full w-full">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}
