"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { HeaderProps } from "@/types"

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <Button variant="ghost" size="icon" onClick={onMenuClick}>
          <Menu className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
