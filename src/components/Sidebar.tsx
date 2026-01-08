"use client"
import { LayoutDashboard, Upload, Video, FileText, History, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { logout } from "@/app/(auth)/login/actions"
import { useState } from "react"
import toast from "react-hot-toast"
import type { SidebarProps } from "@/types"

export function Sidebar({ open, setOpen }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  
  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const result = await logout()
      
      if (result.success) {
        toast.success(result.message || 'Successfully signed out!')
        router.push('/login')
        router.refresh()
      } else {
        toast.error(result.error || 'Failed to sign out. Please try again.')
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoggingOut(false)
    }
  }
  
  const menuItems = [
    { id: "dashboard", label: "My Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { id: "upload", label: "My Resume", icon: Upload, href: "/dashboard/upload" },
    { id: "interview", label: "Start Interview", icon: Video, href: "/dashboard/interview" },
    { id: "reports", label: "My Reports", icon: FileText, href: "/dashboard/reports" },
    { id: "history", label: "Interview History", icon: History, href: "/dashboard/history" },
  ]

  return (
    <div
      className={`${
        open ? "w-64" : "w-20"
      } bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col overflow-hidden`}
    >
      {/* Logo */}
      <div className="h-16 border-b border-sidebar-border flex items-center justify-center px-4">
        <div className={`${open ? "block" : "hidden"} text-lg font-bold text-sidebar-primary`}>Interview Prep</div>
        <div
          className={`${open ? "hidden" : "block"} w-10 h-10 rounded-lg bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-bold`}
        >
          IP
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-6 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className={`${open ? "block" : "hidden"}`}>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-sidebar-border p-4 space-y-2">
        <Button 
          variant="ghost" 
          className="w-full justify-start" 
          size="sm"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut className="w-4 h-4" />
          {open && <span className="ml-3">{isLoggingOut ? 'Signing out...' : 'Logout'}</span>}
        </Button>
      </div>
    </div>
  )
}
