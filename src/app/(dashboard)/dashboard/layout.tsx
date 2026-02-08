"use client"

import { Header } from "@/components/header"
import { Sidebar } from "@/components/Sidebar"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Set sidebar to open on large screens by default
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          router.push("/")
        }
      } catch (error) {
        console.error("Error checking auth:", error)
        router.push("/")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/")
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  if (loading) {
    return (
      <div className="flex h-screen bg-background items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div 
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          sidebarOpen ? "" : "lg:ml-0"
        }`}
      >
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex-1 overflow-auto flex flex-col min-h-0">
          {children}
        </div>
      </div>
    </div>
  )
}
