"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QuickStats } from "@/components/quick-stats"
import { UpcomingInterviews } from "@/components/upcoming-interviews"
import { ResumeUploadModal } from "@/components/resume-upload-modal"
import toast from "react-hot-toast"
import { AlertCircle, Upload } from "lucide-react"

export default function DashboardPage() {
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [hasResume, setHasResume] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkResume = async () => {
      try {
        const response = await fetch("/api/upload", {
          credentials: "include",
        })
        const data = await response.json()
        setHasResume(!!data.resume)
      } catch (error) {
        console.error("Error checking resume:", error)
        setHasResume(false)
      }
    }
    checkResume()
  }, [])

  const handleStartInterview = () => {
    if (!hasResume) {
      toast.error("Please upload your resume before starting an interview")
      router.push("/dashboard/upload")
    } else {
      router.push("/dashboard/interview")
    }
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">
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
                  <Button
                    className="w-full"
                    onClick={() => setShowUploadModal(true)}
                  >
                    Update Resume
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleStartInterview}
                  >
                    {hasResume === false && (
                      <AlertCircle className="w-4 h-4 mr-2 text-destructive" />
                    )}
                    Start Interview
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push("/dashboard/reports")}
                  >
                    View My Reports
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <ResumeUploadModal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} />
    </div>
  )
}
