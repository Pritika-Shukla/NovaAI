"use client"

import { ReportsList } from "@/components/reports-list"

export default function ReportsPage() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="p-4 sm:p-6">
        <div className="space-y-4 sm:space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">My Interview Reports</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              AI-generated feedback and performance analysis from your interviews.
            </p>
          </div>
          <ReportsList />
        </div>
      </div>
    </div>
  )
}
