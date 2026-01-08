"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, AlertCircle, Video } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import toast from "react-hot-toast"

export function UpcomingInterviews() {
  const [recentInterviews, setRecentInterviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
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

  useEffect(() => {
    fetchRecentInterviews()
  }, [])

  const fetchRecentInterviews = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/reports")
      if (response.ok) {
        const data = await response.json()
        const recent = (data.reports || []).slice(0, 2)
        setRecentInterviews(recent)
      }
    } catch (error) {
      console.error("Error fetching recent interviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Recent Interviews</CardTitle>
          <CardDescription>Recent interview sessions and practice</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Recent Interviews</CardTitle>
        <CardDescription>Recent interview sessions and practice</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentInterviews.length === 0 ? (
          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
            <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                No interviews completed yet. Start your first practice interview!
              </p>
              <Button
                className="mt-3"
                onClick={handleStartInterview}
              >
                <Video className="w-4 h-4 mr-2" />
                Start Interview
              </Button>
            </div>
          </div>
        ) : (
          <>
            {recentInterviews.map((interview) => (
              <div key={interview.id} className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-foreground">
                      Interview #{recentInterviews.indexOf(interview) + 1}
                    </p>
                    <p className="text-sm text-muted-foreground">Technical Interview</p>
                  </div>
                  <Badge variant="secondary">
                    {interview.overall_rating
                      ? `${interview.overall_rating.toFixed(1)}/10`
                      : "Completed"}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(interview.created_at)}
                  </div>
                  {interview.recommendation && (
                    <div className="flex items-center gap-1">
                      <Badge variant="outline">{interview.recommendation}</Badge>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.push("/dashboard/reports")}
                  >
                    View Report
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleStartInterview}
                  >
                    Start New Interview
                  </Button>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              className="w-full"
              onClick={handleStartInterview}
            >
              <Video className="w-4 h-4 mr-2" />
              Start New Interview
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
