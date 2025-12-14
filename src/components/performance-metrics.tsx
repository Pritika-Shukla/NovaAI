"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function PerformanceMetrics() {
  const metrics = [
    { label: "Communication", value: 82 },
    { label: "Technical Skills", value: 76 },
    { label: "Problem Solving", value: 88 },
    { label: "Cultural Fit", value: 79 },
    { label: "Experience", value: 85 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
        <CardDescription>Average scores across all interviews</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{metric.label}</span>
              <span className="text-sm text-muted-foreground">{metric.value}%</span>
            </div>
            <Progress value={metric.value} />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
