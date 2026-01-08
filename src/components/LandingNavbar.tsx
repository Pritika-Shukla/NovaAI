"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { Sparkles, User as UserIcon, LogOut, ChevronDown } from "lucide-react"
import { logout } from "@/app/(auth)/login/actions"
import toast from "react-hot-toast"

export function LandingNavbar() {
  const [user, setUser] = useState<User | null>(null)
  const [mounted, setMounted] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setMounted(true)
    })
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      cancelAnimationFrame(frameId)
      subscription.unsubscribe()
    }
  }, [])

  // Close menu when clicking outside
  useEffect(() => {
    if (!showUserMenu) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.user-menu-container')) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showUserMenu])

  const handleGetStarted = () => {
    if (user) {
      router.push("/dashboard")
    } else {
      router.push("/signup")
    }
  }

  const handleLogout = async () => {
    try {
      const result = await logout()
      if (result.success) {
        toast.success(result.message || "Successfully signed out!")
        setShowUserMenu(false)
        router.push("/")
        router.refresh()
      } else {
        toast.error(result.error || "Failed to sign out. Please try again.")
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.")
    }
  }

  const getUserDisplayName = () => {
    if (!user) return ""
    const name = user.user_metadata?.full_name || 
                 user.user_metadata?.name || 
                 user.user_metadata?.display_name
    if (name) return name
    // Fall back to email
    return user.email?.split("@")[0] || user.email || "User"
  }

  const getUserEmail = () => {
    return user?.email || ""
  }

  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-xl font-bold text-foreground">
              NovaAI
            </Link>
            <div className="flex items-center gap-3">
              <div className="h-9 w-20 bg-muted animate-pulse rounded-lg" />
              <div className="h-9 w-20 bg-muted animate-pulse rounded-lg" />
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold transition-opacity hover:opacity-80"
          >
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              NovaAI
            </span>
          </Link>

          {/* Navigation Links & Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dashboard
                </Link>
                {/* User Menu */}
                <div className="relative user-menu-container">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 hover:bg-primary/20 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <UserIcon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="hidden min-[375px]:block text-left min-w-0">
                        <div className="text-sm font-medium text-foreground truncate max-w-[120px] sm:max-w-none">
                          {getUserDisplayName()}
                        </div>
                        <div className="hidden sm:block text-xs text-muted-foreground truncate">
                          {getUserEmail()}
                        </div>
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowUserMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 rounded-lg border border-border bg-card shadow-lg z-50">
                        <div className="p-2">
                          <div className="px-3 py-2 border-b border-border">
                            <div className="text-sm font-medium text-card-foreground">
                              {getUserDisplayName()}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {getUserEmail()}
                            </div>
                          </div>
                          <Link
                            href="/dashboard"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-card-foreground hover:bg-primary/10 rounded-md transition-colors"
                          >
                            <UserIcon className="h-4 w-4" />
                            Dashboard
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-card-foreground hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors"
                          >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/signup">
                  <Button
                    size="sm"
                    className="h-9 px-4 text-sm bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Sign Up
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-9 px-4 text-sm border-primary/30 bg-primary/5 hover:bg-primary/10"
                  >
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

