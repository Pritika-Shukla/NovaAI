"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Eye, Loader2, TrendingUp } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { jsPDF } from "jspdf"
import type { Interview } from "@/types"

export function InterviewHistory() {
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchInterviews()
  }, [])

  const fetchInterviews = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/reports", {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        throw new Error(`Failed to fetch interviews: ${response.statusText}`)
      }
      const data = await response.json()
      
      // Ensure we have valid data structure and sort by date
      if (data.reports && Array.isArray(data.reports)) {
        // Sort by created_at descending (newest first)
        const sortedReports = data.reports.sort((a: Interview, b: Interview) => {
          const dateA = new Date(a.created_at).getTime()
          const dateB = new Date(b.created_at).getTime()
          return dateB - dateA
        })
        setInterviews(sortedReports)
      } else {
        console.warn("Invalid data structure received:", data)
        setInterviews([])
      }
    } catch (error) {
      console.error("Error fetching interviews:", error)
      setInterviews([])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return "Invalid Date"
      }
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Invalid Date"
    }
  }

  const calculateDuration = (interview: Interview): string => {
    if (interview.transcript && interview.transcript.length > 0) {
      // Try to get timestamps from transcript
      const timestamps = interview.transcript
        .map((msg) => msg.timestamp)
        .filter((ts): ts is string => !!ts && ts !== '')
        .map((ts) => {
          try {
            return new Date(ts).getTime()
          } catch {
            return null
          }
        })
        .filter((ts): ts is number => ts !== null && !isNaN(ts))
        .sort((a, b) => a - b)
      
      if (timestamps.length >= 2) {
        const durationMs = timestamps[timestamps.length - 1] - timestamps[0]
        const durationMinutes = Math.max(1, Math.round(durationMs / (1000 * 60)))
        if (durationMinutes < 60) {
          return `${durationMinutes} min`
        } else {
          const hours = Math.floor(durationMinutes / 60)
          const mins = durationMinutes % 60
          return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
        }
      }
      
      // If we have transcript but no valid timestamps, estimate based on message count
      // Average interview: ~2-3 minutes per exchange (question + answer)
      const messageCount = interview.transcript.length
      const estimatedMinutes = Math.max(1, Math.min(60, Math.ceil(messageCount / 2)))
      return `${estimatedMinutes} min`
    }
    
    // If no transcript, try to estimate from created_at if available
    if (interview.created_at) {
      // Default estimate for interviews without transcript data
      return "~5 min"
    }
    
    return "N/A"
  }

  const generatePDF = (interview: Interview) => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 20
    let yPosition = margin

    const addText = (text: string, fontSize: number, isBold = false) => {
      doc.setFontSize(fontSize)
      doc.setFont("helvetica", isBold ? "bold" : "normal")
      
      const lines = doc.splitTextToSize(text, pageWidth - 2 * margin)
      lines.forEach((line: string) => {
        if (yPosition > pageHeight - margin) {
          doc.addPage()
          yPosition = margin
        }
        doc.text(line, margin, yPosition)
        yPosition += fontSize * 0.5
      })
      yPosition += 5
    }

    addText("Interview Feedback Report", 20, true)
    yPosition += 5
    addText(`Date: ${formatDate(interview.created_at)}`, 12)
    yPosition += 10

    if (interview.overall_rating) {
      addText(`Overall Rating: ${interview.overall_rating}/10`, 14, true)
      yPosition += 10
    }

    if (interview.recommendation) {
      addText(`Recommendation: ${interview.recommendation}`, 14, true)
      yPosition += 10
    }

    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("Detailed Feedback:", margin, yPosition)
    yPosition += 8

    const cleanFeedback = interview.feedback
      .replace(/\*\*/g, "")
      .replace(/#{1,6}\s/g, "")
      .replace(/\n{3,}/g, "\n\n")

    addText(cleanFeedback, 10)

    doc.save(`interview-${interview.id}.pdf`)
  }

  const viewDetails = (interview: Interview) => {
    setSelectedInterview(interview)
  }

  const calculateAverageScore = (): number => {
    const ratings = interviews
      .map((i) => i.overall_rating)
      .filter((r): r is number => r !== null)
    if (ratings.length === 0) return 0
    return ratings.reduce((a, b) => a + b, 0) / ratings.length
  }

  const averageScore = calculateAverageScore()

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (interviews.length === 0) {
    return (
      <Card>
        <CardContent>
          <p className="text-center text-muted-foreground py-2">
            No interviews completed yet. Start your first interview to see your history here.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      {/* Average Score Summary */}
      {interviews.length > 0 && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Overall Performance
            </CardTitle>
            <CardDescription>Average score across all interviews</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <p className="text-sm font-medium text-foreground">Average Score</p>
                  <p className="text-sm font-bold text-foreground">
                    {averageScore.toFixed(1)}/10
                  </p>
                </div>
                <Progress value={averageScore * 10} className="h-2" />
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="bg-muted p-2 rounded">
                  <p className="text-muted-foreground text-xs">Total Interviews</p>
                  <p className="font-semibold">{interviews.length}</p>
                </div>
                <div className="bg-muted p-2 rounded">
                  <p className="text-muted-foreground text-xs">With Ratings</p>
                  <p className="font-semibold">
                    {interviews.filter((i) => i.overall_rating !== null).length}
                  </p>
                </div>
                <div className="bg-muted p-2 rounded">
                  <p className="text-muted-foreground text-xs">Latest</p>
                  <p className="font-semibold">
                    {interviews.length > 0 ? formatDate(interviews[0].created_at) : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Your Interview History</CardTitle>
          <CardDescription>All your past interviews and feedback</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Interview #</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Duration</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Score</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Recommendation</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {interviews.map((interview, index) => (
                  <tr key={interview.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-foreground">Interview #{index + 1}</p>
                        <p className="text-xs text-muted-foreground">Technical Interview</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {formatDate(interview.created_at)}
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {calculateDuration(interview)}
                    </td>
                    <td className="py-3 px-4">
                      {interview.overall_rating ? (
                        <Badge className="bg-primary/10 text-primary">
                          {interview.overall_rating.toFixed(1)}/10
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">Pending</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {interview.recommendation ? (
                        <Badge variant="secondary">{interview.recommendation}</Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">Pending</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="gap-1"
                          onClick={() => viewDetails(interview)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="gap-1"
                          onClick={() => generatePDF(interview)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {interviews.map((interview, index) => (
              <div key={interview.id} className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-foreground">Interview #{index + 1}</p>
                    <p className="text-xs text-muted-foreground">Technical Interview</p>
                  </div>
                  {interview.overall_rating ? (
                    <Badge className="bg-primary/10 text-primary">
                      {interview.overall_rating.toFixed(1)}/10
                    </Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">Pending</span>
                  )}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="text-foreground">{formatDate(interview.created_at)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="text-foreground">{calculateDuration(interview)}</span>
                  </div>
                  {interview.recommendation && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Recommendation:</span>
                      <Badge variant="secondary">{interview.recommendation}</Badge>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => viewDetails(interview)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => generatePDF(interview)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      {selectedInterview && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedInterview(null)}
        >
          <div
            className="bg-card border border-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                  Interview Details
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedInterview(null)}
                  className="text-lg sm:text-xl"
                >
                  ×
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Overall Performance
                  </h3>
                  <div className="space-y-2">
                    <p className="text-foreground">
                      <span className="font-medium">Duration:</span> {calculateDuration(selectedInterview)}
                    </p>
                    {selectedInterview.overall_rating && (
                      <p className="text-foreground">
                        <span className="font-medium">Rating:</span> {selectedInterview.overall_rating.toFixed(1)}/10
                      </p>
                    )}
                    {selectedInterview.recommendation && (
                      <p className="text-foreground">
                        <span className="font-medium">Recommendation:</span> {selectedInterview.recommendation}
                      </p>
                    )}
                    {(selectedInterview.technical_knowledge_score !== null || 
                      selectedInterview.communication_score !== null || 
                      selectedInterview.problem_solving_score !== null) && (
                      <div className="mt-3 space-y-1">
                        <p className="text-sm font-medium text-foreground">Detailed Scores:</p>
                        {selectedInterview.technical_knowledge_score !== null && (
                          <p className="text-sm text-foreground">
                            Technical: {selectedInterview.technical_knowledge_score.toFixed(1)}/10
                          </p>
                        )}
                        {selectedInterview.communication_score !== null && (
                          <p className="text-sm text-foreground">
                            Communication: {selectedInterview.communication_score.toFixed(1)}/10
                          </p>
                        )}
                        {selectedInterview.problem_solving_score !== null && (
                          <p className="text-sm text-foreground">
                            Problem Solving: {selectedInterview.problem_solving_score.toFixed(1)}/10
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Detailed Feedback
                  </h3>
                  <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap bg-muted p-4 rounded-lg">
                    {selectedInterview.feedback}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Interview Transcript
                  </h3>
                  <div className="bg-muted p-4 rounded-lg max-h-60 overflow-auto space-y-2">
                    {selectedInterview.transcript.map((msg, idx) => (
                      <div key={idx} className="text-sm">
                        <span className="font-semibold text-primary">
                          {msg.role === "assistant" ? "Interviewer" : "You"}:
                        </span>{" "}
                        <span className="text-foreground">{msg.content}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    onClick={() => generatePDF(selectedInterview)}
                    className="flex-1"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/dashboard/reports`)}
                    className="flex-1"
                  >
                    View Full Report
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedInterview(null)}
                    className="flex-1"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

