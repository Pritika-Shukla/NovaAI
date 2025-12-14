"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Video, FileText } from "lucide-react"

export function CandidateQueue() {
  const candidates = [
    {
      id: 1,
      name: "Sarah Johnson",
      position: "Senior Developer",
      status: "Ready",
      uploadTime: "2 hours ago",
      initials: "SJ",
    },
    {
      id: 2,
      name: "Alex Chen",
      position: "Product Manager",
      status: "Scheduled",
      uploadTime: "1 day ago",
      initials: "AC",
    },
    {
      id: 3,
      name: "Maria Garcia",
      position: "UX Designer",
      status: "In Progress",
      uploadTime: "30 mins ago",
      initials: "MG",
    },
    {
      id: 4,
      name: "James Wilson",
      position: "Data Scientist",
      status: "Ready",
      uploadTime: "3 hours ago",
      initials: "JW",
    },
  ]

  const statusColors = {
    Ready: "bg-green-500/10 text-green-700",
    Scheduled: "bg-blue-500/10 text-blue-700",
    "In Progress": "bg-amber-500/10 text-amber-700",
    Completed: "bg-gray-500/10 text-gray-700",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Candidate Queue</CardTitle>
        <CardDescription>Recently uploaded resumes waiting for interviews</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <Avatar>
                  <AvatarFallback>{candidate.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{candidate.name}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="w-3 h-3" />
                    {candidate.position} • {candidate.uploadTime}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={statusColors[candidate.status as keyof typeof statusColors]}>
                  {candidate.status}
                </Badge>
                <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                  <Video className="w-4 h-4" />
                  Start
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
