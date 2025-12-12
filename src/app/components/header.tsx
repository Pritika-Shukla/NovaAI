"use client"

import { Menu, Bell, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <Button variant="ghost" size="icon" onClick={onMenuClick}>
          <Menu className="w-5 h-5" />
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon">
          <Bell className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <User className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
