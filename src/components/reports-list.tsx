"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Eye, TrendingUp, Loader2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { jsPDF } from "jspdf"
import type { Report } from "@/types"

export function ReportsList() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/reports")
      if (!response.ok) throw new Error("Failed to fetch reports")
      const data = await response.json()
      setReports(data.reports || [])
    } catch (error) {
      console.error("Error fetching reports:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const calculateDuration = (report: Report): string => {
    if (report.transcript && report.transcript.length > 0) {
      const timestamps = report.transcript
        .map((msg) => msg.timestamp)
        .filter((ts): ts is string => !!ts)
        .map((ts) => new Date(ts).getTime())
        .sort((a, b) => a - b)
      
      if (timestamps.length >= 2) {
        const durationMs = timestamps[timestamps.length - 1] - timestamps[0]
        const durationMinutes = Math.round(durationMs / (1000 * 60))
        if (durationMinutes < 60) {
          return `${durationMinutes} min`
        } else {
          const hours = Math.floor(durationMinutes / 60)
          const mins = durationMinutes % 60
          return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
        }
      }
    }
    if (report.transcript && report.transcript.length > 0) {
      const estimatedMinutes = Math.max(5, Math.min(60, report.transcript.length * 2))
      return `${estimatedMinutes} min`
    }
    return "N/A"
  }

  const calculateTotalPracticeTime = (reports: Report[]): string => {
    let totalMinutes = 0
    reports.forEach((report) => {
      if (report.transcript && report.transcript.length > 0) {
        const timestamps = report.transcript
          .map((msg) => msg.timestamp)
          .filter((ts): ts is string => !!ts)
          .map((ts) => new Date(ts).getTime())
          .sort((a, b) => a - b)
        
        if (timestamps.length >= 2) {
          const durationMs = timestamps[timestamps.length - 1] - timestamps[0]
          const durationMinutes = Math.max(1, Math.round(durationMs / (1000 * 60)))
          totalMinutes += durationMinutes
        } else {
          const estimatedMinutes = Math.max(5, Math.min(60, report.transcript.length * 2))
          totalMinutes += estimatedMinutes
        }
      } else {
        totalMinutes += 30
      }
    })

    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
    }
    return `${minutes} min`
  }

  const calculateAverage = (reports: Report[]) => {
    const ratings = reports
      .map((r) => r.overall_rating)
      .filter((r): r is number => r !== null)
    if (ratings.length === 0) return 0
    return ratings.reduce((a, b) => a + b, 0) / ratings.length
  }

  const generatePDF = (report: Report) => {
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

    // Title
    addText("Interview Feedback Report", 20, true)
    yPosition += 5

    // Date
    addText(`Date: ${formatDate(report.created_at)}`, 12)
    yPosition += 10

    // Overall Rating
    if (report.overall_rating) {
      addText(`Overall Rating: ${report.overall_rating}/10`, 14, true)
      yPosition += 10
    }

    // Recommendation
    if (report.recommendation) {
      addText(`Recommendation: ${report.recommendation}`, 14, true)
      yPosition += 10
    }

    // Scores
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("Scores:", margin, yPosition)
    yPosition += 8

    doc.setFont("helvetica", "normal")
    if (report.technical_knowledge_score !== null) {
      addText(`Technical Knowledge: ${report.technical_knowledge_score}/10`, 11)
    }
    if (report.communication_score !== null) {
      addText(`Communication: ${report.communication_score}/10`, 11)
    }
    if (report.problem_solving_score !== null) {
      addText(`Problem Solving: ${report.problem_solving_score}/10`, 11)
    }
    yPosition += 10

    // Feedback
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("Detailed Feedback:", margin, yPosition)
    yPosition += 8

    const cleanFeedback = report.feedback
      .replace(/\*\*/g, "")
      .replace(/#{1,6}\s/g, "")
      .replace(/\n{3,}/g, "\n\n")

    addText(cleanFeedback, 10)

    doc.save(`interview-feedback-${report.id}.pdf`)
  }

  const averageScore = calculateAverage(reports)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (reports.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground py-8">
            No interview reports yet. Complete an interview to see your feedback here.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Your Progress
          </CardTitle>
          <CardDescription>Performance trend across all interviews</CardDescription>
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
                <p className="text-muted-foreground text-xs">Interviews</p>
                <p className="font-semibold">{reports.length}</p>
              </div>
              <div className="bg-muted p-2 rounded">
                <p className="text-muted-foreground text-xs">Total Practice</p>
                <p className="font-semibold">{calculateTotalPracticeTime(reports)}</p>
              </div>
              <div className="bg-muted p-2 rounded">
                <p className="text-muted-foreground text-xs">Latest</p>
                <p className="font-semibold">
                  {reports.length > 0 ? formatDate(reports[0].created_at) : "No interviews"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Reports */}
      {reports.map((report) => (
        <Card key={report.id}>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-foreground">
                    Interview #{reports.indexOf(report) + 1}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Technical Interview
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-muted-foreground">
                      {formatDate(report.created_at)}
                    </p>
                    <span className="text-xs text-muted-foreground">•</span>
                    <p className="text-xs text-muted-foreground">
                      {calculateDuration(report)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {report.overall_rating ? (
                    <>
                      <div className="text-3xl font-bold text-primary">
                        {report.overall_rating.toFixed(1)}
                      </div>
                      <p className="text-xs text-muted-foreground">/10</p>
                    </>
                  ) : (
                    <div className="text-sm text-muted-foreground">Pending</div>
                  )}
                </div>
              </div>

              {/* Scores Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {report.technical_knowledge_score !== null && (
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">Technical</p>
                    <p className="text-lg font-semibold text-foreground">
                      {report.technical_knowledge_score.toFixed(1)}/10
                    </p>
                  </div>
                )}
                {report.communication_score !== null && (
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">Communication</p>
                    <p className="text-lg font-semibold text-foreground">
                      {report.communication_score.toFixed(1)}/10
                    </p>
                  </div>
                )}
                {report.problem_solving_score !== null && (
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">Problem Solving</p>
                    <p className="text-lg font-semibold text-foreground">
                      {report.problem_solving_score.toFixed(1)}/10
                    </p>
                  </div>
                )}
                {report.recommendation && (
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">Recommendation</p>
                    <p className="text-lg font-semibold text-foreground">
                      {report.recommendation}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => setSelectedReport(report)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => generatePDF(report)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Detail Modal */}
      {selectedReport && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedReport(null)}
        >
          <div
            className="bg-card border border-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">
                  Interview Feedback Details
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedReport(null)}
                >
                  ×
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Overall Performance
                  </h3>
                  {selectedReport.overall_rating && (
                    <p className="text-foreground">
                      Rating: {selectedReport.overall_rating}/10
                    </p>
                  )}
                  {selectedReport.recommendation && (
                    <p className="text-foreground">
                      Recommendation: {selectedReport.recommendation}
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Detailed Feedback
                  </h3>
                  <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap bg-muted p-4 rounded-lg">
                    {selectedReport.feedback}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Interview Transcript
                  </h3>
                  <div className="bg-muted p-4 rounded-lg max-h-60 overflow-auto space-y-2">
                    {selectedReport.transcript.map((msg, idx) => (
                      <div key={idx} className="text-sm">
                        <span className="font-semibold text-primary">
                          {msg.role === "assistant" ? "Interviewer" : "You"}:
                        </span>{" "}
                        <span className="text-foreground">{msg.content}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => generatePDF(selectedReport)}
                    className="flex-1"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedReport(null)}
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
    </div>
  )
}
