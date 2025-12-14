"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { QuickStats } from "@/components/quick-stats"
import { InterviewHistory } from "@/components/interview-history"
import { UpcomingInterviews } from "@/components/upcoming-interviews"
import { ResumeUploadModal } from "@/components/resume-upload-modal"
import { InterviewRoom } from "@/components/interview-room"
import { ReportsList} from "@/components/reports-list"

interface DashboardContentProps {
  activeTab: string
}

export function DashboardContent({ activeTab }: DashboardContentProps) {
  const [showUploadModal, setShowUploadModal] = useState(false)

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Welcome to Your Interview Prep</h1>
              <p className="text-muted-foreground mt-1">
                Prepare for your upcoming interviews with AI-powered practice sessions.
              </p>
            </div>

            <QuickStats />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <UpcomingInterviews />
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Preparation Tips</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm">Before Your Interview:</h3>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                        <li>Ensure good lighting and clear background</li>
                        <li>Test your microphone and camera</li>
                        <li>Review your resume</li>
                        <li>Prepare examples of your work</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <button className="w-full justify-center" onClick={() => setShowUploadModal(true)}>
                      Update Resume
                    </button>
                    <button   className="w-full justify-center bg-transparent">
                      Start Interview
                    </button>
                    <button  className="w-full justify-center bg-transparent">
                      View My Reports
                    </button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )

      case "upload":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Resume</h1>
              <p className="text-muted-foreground mt-1">Upload or update your resume for interviews.</p>
            </div>
            <ResumeUploadModal isOpen={true} onClose={() => {}} />
          </div>
        )

      case "interview":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Interview Practice Room</h1>
              <p className="text-muted-foreground mt-1">
                Join an AI interview session to practice and improve your skills.
              </p>
            </div>
            <InterviewRoom />
          </div>
        )

      case "reports":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Interview Reports</h1>
              <p className="text-muted-foreground mt-1">
                AI-generated feedback and performance analysis from your interviews.
              </p>
            </div>
            <ReportsList />
          </div>
        )

      case "history":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Interview History</h1>
              <p className="text-muted-foreground mt-1">Review all your past interview sessions and progress.</p>
            </div>
            <InterviewHistory />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">{renderContent()}</div>
      {activeTab !== "upload" && (
        <ResumeUploadModal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} />
      )}
    </div>
  )
}
