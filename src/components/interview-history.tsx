"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Eye } from "lucide-react"

export function InterviewHistory() {
  const interviews = [
    {
      id: 1,
      company: "Google",
      position: "Software Engineer",
      interviewDate: "Dec 10, 2024",
      score: "8.5/10",
      type: "Technical",
      duration: "60 min",
    },
    {
      id: 2,
      company: "Meta",
      position: "Full Stack Engineer",
      interviewDate: "Dec 9, 2024",
      score: "7.8/10",
      type: "Behavioral",
      duration: "45 min",
    },
    {
      id: 3,
      company: "Amazon",
      position: "Backend Developer",
      interviewDate: "Dec 8, 2024",
      score: "8.2/10",
      type: "System Design",
      duration: "75 min",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Interview History</CardTitle>
        <CardDescription>All your past interviews and feedback</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Company</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Position</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Score</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {interviews.map((interview) => (
                <tr key={interview.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-foreground">{interview.company}</p>
                      <p className="text-xs text-muted-foreground">{interview.type}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{interview.position}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{interview.interviewDate}</td>
                  <td className="py-3 px-4">
                    <Badge className="bg-primary/10 text-primary">{interview.score}</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" className="gap-1">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="gap-1">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
