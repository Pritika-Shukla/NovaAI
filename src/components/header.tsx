"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import type { HeaderProps } from "@/types"

export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname()
  
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "My Dashboard"
    if (pathname === "/dashboard/upload") return "My Resume"
    if (pathname === "/dashboard/interview") return "Start Interview"
    if (pathname === "/dashboard/reports") return "My Reports"
    if (pathname === "/dashboard/history") return "Interview History"
    return "Dashboard"
  }

  return (
    <div className="bg-card border-b border-border h-16 flex items-center px-4 sm:px-6">
      <div className="flex items-center gap-2 sm:gap-4">
       
        <h1 className="text-lg sm:text-xl font-semibold text-foreground">{getPageTitle()}</h1>
      </div>
    </div>
  )
}
