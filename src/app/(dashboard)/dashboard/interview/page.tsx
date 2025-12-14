"use client"

import { InterviewRoom } from "@/components/interview-room"

export default function InterviewPage() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Interview Practice Room</h1>
            <p className="text-muted-foreground mt-1">
              Join an AI interview session to practice and improve your skills.
            </p>
          </div>
          <InterviewRoom />
        </div>
      </div>
    </div>
  )
}
