"use client"

import { Card, CardContent } from "@/components/ui/card"
import { FileText, Clock, CheckCircle, TrendingUp } from "lucide-react"

export function QuickStats() {
  const stats = [
    {
      label: "Resumes Uploaded",
      value: "1",
      icon: FileText,
      color: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      label: "Interviews Completed",
      value: "2",
      icon: CheckCircle,
      color: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      label: "Total Practice Time",
      value: "45 min",
      icon: Clock,
      color: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      label: "Average Score",
      value: "8.5/10",
      icon: TrendingUp,
      color: "bg-primary/10",
      iconColor: "text-primary",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
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
