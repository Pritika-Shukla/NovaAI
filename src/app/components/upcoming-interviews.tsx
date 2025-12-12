"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function UpcomingInterviews() {
  const interviews = [
    {
      id: 1,
      company: "TechCorp Inc",
      position: "Senior Software Engineer",
      time: "Today, 2:00 PM",
      duration: "60 min",
      type: "Technical Round",
      interviewerName: "AI Assistant",
    },
    {
      id: 2,
      company: "CloudFirst",
      position: "Full Stack Developer",
      time: "Tomorrow, 10:30 AM",
      duration: "45 min",
      type: "Behavioral Round",
      interviewerName: "AI Assistant",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Scheduled Interviews</CardTitle>
        <CardDescription>Upcoming interviews and practice sessions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {interviews.length === 0 ? (
          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
            <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <p className="text-sm text-muted-foreground">No upcoming interviews scheduled</p>
          </div>
        ) : (
          interviews.map((interview) => (
            <div key={interview.id} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-foreground">{interview.company}</p>
                  <p className="text-sm text-muted-foreground">{interview.position}</p>
                </div>
                <Badge variant="secondary">{interview.type}</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {interview.time}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {interview.duration}
                </div>
              </div>
              <Button className="w-full">Join Interview</Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
