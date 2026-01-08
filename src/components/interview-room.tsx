"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Video, Mic, MicOff, Phone, AlertCircle } from "lucide-react"
import { useState } from "react"

export function InterviewRoom() {
  const [isRecording, setIsRecording] = useState(false)
  const [micOn, setMicOn] = useState(true)
  const [videoOn, setVideoOn] = useState(true)
  const [interviewActive, setInterviewActive] = useState(false)

  if (!interviewActive) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Start Interview Practice</CardTitle>
          <CardDescription>Join an AI-powered interview session</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted p-6 rounded-lg space-y-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-foreground">Before You Start</h3>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                  <li>Ensure your camera and microphone are working</li>
                  <li>Find a quiet, well-lit space</li>
                  <li>Have your resume ready</li>
                  <li>Sit up straight and maintain good eye contact with the camera</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Interview Type</p>
              <select className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground">
                <option>Technical Interview</option>
                <option>Behavioral Interview</option>
                <option>System Design</option>
              </select>
            </div>
          </div>

          <Button className="w-full" size="lg" onClick={() => setInterviewActive(true)}>
            Start Interview Now
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Main Interview Video Area */}
      <Card>
        <CardHeader>
          <CardTitle>Interview in Progress</CardTitle>
          <CardDescription>Interview with AI Assistant</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Video Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Your Video */}
              <div className="bg-muted rounded-lg aspect-video flex items-center justify-center border-2 border-primary">
                <div className="text-center">
                  <Video className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Your Camera</p>
                </div>
              </div>

              {/* AI Interviewer */}
              <div className="bg-muted rounded-lg aspect-video flex items-center justify-center">
                <div className="text-center">
                  <Video className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">AI Interviewer</p>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4 flex-wrap">
              <Button size="lg" variant={videoOn ? "default" : "destructive"} onClick={() => setVideoOn(!videoOn)}>
                <Video className="w-5 h-5 mr-2" />
                {videoOn ? "Stop Video" : "Start Video"}
              </Button>
              <Button size="lg" variant={micOn ? "default" : "destructive"} onClick={() => setMicOn(!micOn)}>
                {micOn ? <Mic className="w-5 h-5 mr-2" /> : <MicOff className="w-5 h-5 mr-2" />}
                {micOn ? "Mute" : "Unmute"}
              </Button>
              <Button
                size="lg"
                variant={isRecording ? "destructive" : "secondary"}
                onClick={() => setIsRecording(!isRecording)}
              >
                {isRecording ? "Stop Recording" : "Start Recording"}
              </Button>
              <Button size="lg" variant="destructive" onClick={() => setInterviewActive(false)}>
                <Phone className="w-5 h-5 mr-2" />
                End Interview
              </Button>
            </div>

            {/* Recording Status */}
            {isRecording && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-destructive animate-pulse" />
                <span className="text-sm text-destructive-foreground">Recording in progress...</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Interview Support */}
      <Card>
        <CardHeader>
          <CardTitle>Interview Support</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tips" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tips">Tips</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="tips" className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="bg-muted p-3 rounded-lg">
                  <p className="font-semibold text-foreground">Active Question</p>
                  <p className="text-muted-foreground mt-1">Tell us about your most complex project...</p>
                </div>
                <div className="bg-primary/10 border border-primary/30 p-3 rounded-lg">
                  <p className="text-primary text-xs font-semibold">SUGGESTION</p>
                  <p className="text-primary text-sm mt-1">
                    Take a moment to structure your answer: situation, task, action, result
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              <textarea
                placeholder="Take notes about the interview..."
                className="w-full h-32 p-3 border border-border rounded-lg bg-background text-foreground resize-none"
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
