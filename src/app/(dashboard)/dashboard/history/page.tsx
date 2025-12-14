"use client"

import { InterviewHistory } from "@/components/interview-history"

export default function HistoryPage() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Interview History</h1>
            <p className="text-muted-foreground mt-1">Review all your past interview sessions and progress.</p>
          </div>
          <InterviewHistory />
        </div>
      </div>
    </div>
  )
}
