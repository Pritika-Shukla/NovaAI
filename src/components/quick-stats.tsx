"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Clock, CheckCircle, TrendingUp } from "lucide-react"

export function QuickStats() {
  const [stats, setStats] = useState({
    resumesUploaded: 0,
    interviewsCompleted: 0,
    totalPracticeTime: "0 min",
    averageScore: "0.0",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      
      // Fetch interview reports
      const reportsResponse = await fetch("/api/reports")
      const reportsData = await reportsResponse.ok ? await reportsResponse.json() : { reports: [] }
      const reports = reportsData.reports || []

      // Fetch resume data
      const resumeResponse = await fetch("/api/upload")
      const resumeData = await resumeResponse.ok ? await resumeResponse.json() : { resume: null }
      const hasResume = !!resumeData.resume

      // Calculate stats
      const interviewsCompleted = reports.length
      
      // Calculate average score
      const ratings = reports
        .map((r: { overall_rating: number | null }) => r.overall_rating)
        .filter((r: number | null): r is number => r !== null)
      const averageScore = ratings.length > 0
        ? (ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length).toFixed(1)
        : "0.0"

      // Calculate practice time from transcript timestamps
      let totalMinutes = 0
      reports.forEach((report: { transcript?: Array<{ timestamp?: string }>; created_at?: string }) => {
        if (report.transcript && report.transcript.length > 0) {
          const timestamps = report.transcript
            .map((msg) => msg.timestamp)
            .filter((ts): ts is string => !!ts)
            .map((ts) => new Date(ts).getTime())
            .sort((a, b) => a - b)
          
          if (timestamps.length >= 2) {
            // Calculate duration from first to last message
            const durationMs = timestamps[timestamps.length - 1] - timestamps[0]
            const durationMinutes = Math.max(1, Math.round(durationMs / (1000 * 60)))
            totalMinutes += durationMinutes
          } else if (report.created_at) {
            // Fallback: estimate based on transcript length (roughly 2 minutes per message)
            const estimatedMinutes = Math.max(5, Math.min(60, report.transcript.length * 2))
            totalMinutes += estimatedMinutes
          } else {
            // Default: 30 minutes per interview
            totalMinutes += 30
          }
        } else {
          // No transcript, use default estimate
          totalMinutes += 30
        }
      })

      const hours = Math.floor(totalMinutes / 60)
      const minutes = totalMinutes % 60
      const totalPracticeTime = hours > 0 
        ? `${hours}h ${minutes}m` 
        : `${minutes} min`

      setStats({
        resumesUploaded: hasResume ? 1 : 0,
        interviewsCompleted,
        totalPracticeTime,
        averageScore,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const statsData = [
    {
      label: "Resumes Uploaded",
      value: loading ? "..." : stats.resumesUploaded.toString(),
      icon: FileText,
      color: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      label: "Interviews Completed",
      value: loading ? "..." : stats.interviewsCompleted.toString(),
      icon: CheckCircle,
      color: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      label: "Total Practice Time",
      value: loading ? "..." : stats.totalPracticeTime,
      icon: Clock,
      color: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      label: "Average Score",
      value: loading ? "..." : `${stats.averageScore}/10`,
      icon: TrendingUp,
      color: "bg-primary/10",
      iconColor: "text-primary",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className={`${stat.iconColor} w-5 h-5`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
