"use client"
import { LayoutDashboard, Upload, Video, FileText, History, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function Sidebar({ open, setOpen, activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "My Dashboard", icon: LayoutDashboard },
    { id: "upload", label: "My Resume", icon: Upload },
    { id: "interview", label: "Start Interview", icon: Video },
    { id: "reports", label: "My Reports", icon: FileText },
    { id: "history", label: "Interview History", icon: History },
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
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === item.id
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent"
            }`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span className={`${open ? "block" : "hidden"}`}>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-sidebar-border p-4 space-y-2">
        <Button variant="ghost" className="w-full justify-start" size="sm">
          <Settings className="w-4 h-4" />
          {open && <span className="ml-3">Settings</span>}
        </Button>
        <Button variant="ghost" className="w-full justify-start" size="sm">
          <LogOut className="w-4 h-4" />
          {open && <span className="ml-3">Logout</span>}
        </Button>
      </div>
    </div>
  )
}
