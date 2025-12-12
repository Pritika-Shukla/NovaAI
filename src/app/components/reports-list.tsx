"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Eye, TrendingUp } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface Report {
  id: string
  companyName: string
  position: string
  date: string
  overallScore: number
  technicalSkills: number
  communication: number
  problemSolving: number
  culturalFit: number
}

export function ReportsList() {
  const reports: Report[] = [
    {
      id: "1",
      companyName: "Google",
      position: "Software Engineer",
      date: "2024-12-10",
      overallScore: 8.2,
      technicalSkills: 8.5,
      communication: 8.0,
      problemSolving: 8.2,
      culturalFit: 7.8,
    },
    {
      id: "2",
      companyName: "Meta",
      position: "Backend Engineer",
      date: "2024-12-08",
      overallScore: 7.9,
      technicalSkills: 7.8,
      communication: 8.2,
      problemSolving: 7.5,
      culturalFit: 8.1,
    },
    {
      id: "3",
      companyName: "Amazon",
      position: "Full Stack Developer",
      date: "2024-12-05",
      overallScore: 8.4,
      technicalSkills: 8.6,
      communication: 8.2,
      problemSolving: 8.5,
      culturalFit: 8.0,
    },
  ]

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
                <p className="text-sm font-bold text-foreground">8.2/10</p>
              </div>
              <Progress value={82} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-muted p-2 rounded">
                <p className="text-muted-foreground text-xs">Interviews</p>
                <p className="font-semibold">3</p>
              </div>
              <div className="bg-muted p-2 rounded">
                <p className="text-muted-foreground text-xs">Total Practice</p>
                <p className="font-semibold">3h 15m</p>
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
                  <h3 className="font-semibold text-lg text-foreground">{report.companyName}</h3>
                  <p className="text-sm text-muted-foreground">{report.position}</p>
                  <p className="text-xs text-muted-foreground mt-1">{report.date}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">{report.overallScore}</div>
                  <p className="text-xs text-muted-foreground">/10</p>
                </div>
              </div>

              {/* Scores Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Technical</p>
                  <p className="text-lg font-semibold text-foreground">{report.technicalSkills}/10</p>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Communication</p>
                  <p className="text-lg font-semibold text-foreground">{report.communication}/10</p>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Problem Solving</p>
                  <p className="text-lg font-semibold text-foreground">{report.problemSolving}/10</p>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Cultural Fit</p>
                  <p className="text-lg font-semibold text-foreground">{report.culturalFit}/10</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
