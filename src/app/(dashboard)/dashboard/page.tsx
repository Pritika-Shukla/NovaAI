"use client"

import { Header } from "@/app/components/header"
import { Sidebar } from "@/app/components/Sidebar"
import { DashboardContent } from "@/app/components/dashboard-content"
import { useState } from "react"

export default function Page() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="flex h-screen bg-background">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <DashboardContent activeTab={activeTab} />
      </div>
    </div>
  )
}
