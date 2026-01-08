"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { HeaderProps } from "@/types"

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <div className="bg-card border-b border-border px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
      <div className="flex items-center gap-2 sm:gap-4 flex-1">
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden">
          <Menu className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="hidden lg:flex">
          <Menu className="w-5 h-5" />
        </Button>
        <h1 className="text-lg sm:text-xl font-semibold text-foreground">Dashboard</h1>
      </div>
    </div>
  )
}
