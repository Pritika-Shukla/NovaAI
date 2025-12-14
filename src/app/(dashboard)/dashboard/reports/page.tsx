"use client"

import { ReportsList } from "@/components/reports-list"

export default function ReportsPage() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Interview Reports</h1>
            <p className="text-muted-foreground mt-1">
              AI-generated feedback and performance analysis from your interviews.
            </p>
          </div>
          <ReportsList />
        </div>
      </div>
    </div>
  )
}
