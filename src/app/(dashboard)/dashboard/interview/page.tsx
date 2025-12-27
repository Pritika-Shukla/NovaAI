"use client";
import { useState, useEffect, useRef } from "react";
import Vapi from '@vapi-ai/web';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Repeat, LogOut, Code, Video, VideoOff, Mic, MicOff } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

interface ResumeData {
  user_id: string;
  file_name: string;
  file_path: string;
  resume_analysis: unknown;
  downloadUrl?: string;
  created_at?: string;
  updated_at?: string;
}

interface UploadResponse {
  resume: ResumeData | null;
  error?: string;
}

interface Message {
  role: string;
  content: string;
}

interface AssistantConfig {
  model?: {
    provider?: string;
    model?: string;
    messages?: Message[];
  };
  [key: string]: unknown;
}

export default function InterviewPage() {
  const [resumeAnalysis, setResumeAnalysis] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [userStream, setUserStream] = useState<MediaStream | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/upload", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const result: UploadResponse = await response.json();
        setResumeAnalysis(result.resume?.resume_analysis || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
        console.error("Error fetching upload data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Get user info
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  // Initialize camera and mic when interview starts
  useEffect(() => {
    if (!isConnected) {
      // Clean up stream when disconnected
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
        setUserStream(null);
      }
      return;
    }

    const initMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        streamRef.current = stream;
        setUserStream(stream);
        // Set initial states based on what we got
        const videoTrack = stream.getVideoTracks()[0];
        const audioTrack = stream.getAudioTracks()[0];
        if (videoTrack) setCameraEnabled(videoTrack.enabled);
        if (audioTrack) setMicEnabled(audioTrack.enabled);
      } catch (err) {
        console.error("Error accessing media devices:", err);
        // If user denies permission, disable the controls
        setCameraEnabled(false);
        setMicEnabled(false);
      }
    };

    initMedia();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
        setUserStream(null);
      }
    };
  }, [isConnected]);

  // Update stream when camera/mic state changes
  useEffect(() => {
    if (!userStream) return;

    userStream.getVideoTracks().forEach(track => {
      track.enabled = cameraEnabled;
    });
    userStream.getAudioTracks().forEach(track => {
      track.enabled = micEnabled;
    });
  }, [cameraEnabled, micEnabled, userStream]);

  useEffect(() => {
    if (!resumeAnalysis) return;

    const vapiInstance = new Vapi(process.env.NEXT_PUBLIC_VAPI_KEY!);
    setVapi(vapiInstance);

    const assistantConfig: AssistantConfig = {
      model: {
        provider: "openai",
        model: "gpt-4.1-mini",
        messages: [{ 
          role: "system", 
          content: `Here is the candidate resume. Use this as the ONLY source of truth for the interview:
          ${resumeAnalysis}
          
          You are an AI technical interviewer from a fast-paced tech startup.
          
          Your job:
          - Conduct a real-world technical interview.
          - Ask practical questions only related to techstack no project question.
          - Evaluate answers like a strict senior engineer.
          
          Interview behavior:
          4. Ask ONE technical question at a time.
          5. Questions must be strictly based on the candidate's projects and tech stack from the resume.
          6. Do NOT ask theory, definition, or "explain X" questions.
          7. Do NOT ask resume or behavioral questions.
          
          Answer evaluation rules (MANDATORY, AFTER EVERY ANSWER):
          
          Respond in this exact structure — NO extra text:
          
          2. **Correct way to answer**
             - Provide detailed interview answer.
          
          Teaching constraints:
          - Do NOT deeply explain why the candidate was wrong.
          - Teach by showing the correct answer, not by long criticism.
          
          Tone:
          - Direct
          - Professional
          - Startup-style
          - No compliments
          - No motivational talk
          - No filler
          
          End behavior:
          - Continue asking questions until the interview is explicitly stopped.
          `}],
      },
    };

    // Event listeners
    vapiInstance.on('call-start', () => setIsConnected(true));
    vapiInstance.on('call-end', () => {
      setIsConnected(false);
      setIsSpeaking(false);
      // Clean up media stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
        setUserStream(null);
      }
    });
    vapiInstance.on('speech-start', () => setIsSpeaking(true));
    vapiInstance.on('speech-end', () => setIsSpeaking(false));
    vapiInstance.on('message', (message: any) => {
      if (message.type === 'transcript' && message.role === 'assistant') {
        // Extract question from assistant messages
        const text = message.transcript || message.text || message.content || '';
        if (text && text.length > 10) {
          // Only update if it looks like a question (contains question mark or is a new statement)
          if (text.includes('?') || text.length > 20) {
            setCurrentQuestion(text);
          }
        }
      }
      // Handle function calls if they come through the message event
      if (message.type === 'function-call') {
        console.log('Function call:', message);
      }
    });
    vapiInstance.on('error', console.error);

    return () => {
      vapiInstance.stop();
    };
  }, [resumeAnalysis]);


  const startCall = () => {
    if (!vapi) return;
    
    const assistantConfig: AssistantConfig = {
      model: {
        provider: "openai",
        model: "gpt-4.1-mini",
        messages: [{ 
          role: "system", 
          content: `Here is the candidate resume. Use this as the ONLY source of truth for the interview:
          ${resumeAnalysis}
          
          You are an AI technical interviewer from a fast-paced tech startup.
          
          Your job:
          - Conduct a real-world technical interview.
          - Ask practical questions only related to techstack no project question.
          - Evaluate answers like a strict senior engineer.
          
          Interview behavior:
          4. Ask ONE technical question at a time.
          5. Questions must be strictly based on the candidate's projects and tech stack from the resume.
          6. Do NOT ask theory, definition, or "explain X" questions.
          7. Do NOT ask resume or behavioral questions.
          
          Answer evaluation rules (MANDATORY, AFTER EVERY ANSWER):
          
          Respond in this exact structure — NO extra text:
          
          2. **Correct way to answer**
             - Provide detailed interview answer.
          
          Teaching constraints:
          - Do NOT deeply explain why the candidate was wrong.
          - Teach by showing the correct answer, not by long criticism.
          
          Tone:
          - Direct
          - Professional
          - Startup-style
          - No compliments
          - No motivational talk
          - No filler
          
          End behavior:
          - Continue asking questions until the interview is explicitly stopped.
          `}],
      },
    };
    
    (vapi.start as (config: AssistantConfig) => void)(assistantConfig);
  };

  const endCall = () => {
    vapi?.stop();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setUserStream(null);
    }
    router.push('/dashboard');
  };

  const repeatQuestion = () => {
    // This would trigger the AI to repeat the last question
    // For now, we'll just log it
    console.log("Repeat question requested");
  };

  const toggleCamera = () => {
    setCameraEnabled(!cameraEnabled);
  };

  const toggleMic = () => {
    setMicEnabled(!micEnabled);
  };

  const getUserName = () => {
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
    if (user?.email) return user.email.split('@')[0];
    return "You";
  };

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Grid background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, oklch(0.3 0 0) 1px, transparent 1px),
              linear-gradient(to bottom, oklch(0.3 0 0) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
              H
            </div>
            <h1 className="text-xl font-semibold text-foreground">Frontend Developer Interview</h1>
            <Code className="w-6 h-6 text-primary" />
          </div>
          <Button variant="outline" className="border-primary/30">
            Technical Interview
          </Button>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 gap-8">
          {/* Two Panels */}
          <div className="flex gap-8 w-full max-w-6xl">
            {/* AI Interviewer Panel */}
            <div className="flex-1 flex flex-col items-center justify-center bg-card border border-border rounded-xl p-8 relative">
              <h2 className="text-lg font-semibold text-card-foreground mb-6">AI Interviewer</h2>
              
              {/* Avatar with sound waves */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center relative shadow-lg">
                  <MessageSquare className="w-16 h-16 text-primary-foreground" />
                  
                  {/* Sound waves animation */}
                  {isSpeaking && (
                    <>
                      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-foreground/60 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                      <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-foreground/40 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                      <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary-foreground/20 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                    </>
                  )}
                </div>
                
                {/* Badges */}
                <div className="absolute -bottom-1 -right-1 flex gap-1">
                  <Badge className="w-7 h-7 rounded-full bg-blue-500 text-white p-0 flex items-center justify-center text-xs font-bold border-2 border-card">
                    S
                  </Badge>
                  <Badge className="w-7 h-7 rounded-full bg-yellow-500 text-white p-0 flex items-center justify-center text-xs font-bold border-2 border-card">
                    A
                  </Badge>
                </div>
              </div>
            </div>

            {/* User Panel */}
            <div className="flex-1 flex flex-col items-center justify-center bg-card border border-border rounded-xl p-8">
              <h2 className="text-lg font-semibold text-card-foreground mb-6">
                {getUserName()} (You)
              </h2>
              
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-border shadow-lg">
                  <AvatarImage src={user?.user_metadata?.avatar_url} alt={getUserName()} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold">
                    {getUserName().charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                {/* Camera/Mic Controls */}
                {isConnected && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                    <Button
                      size="icon"
                      variant={cameraEnabled ? "default" : "destructive"}
                      onClick={toggleCamera}
                      className="w-10 h-10 rounded-full"
                    >
                      {cameraEnabled ? (
                        <Video className="w-4 h-4" />
                      ) : (
                        <VideoOff className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant={micEnabled ? "default" : "destructive"}
                      onClick={toggleMic}
                      className="w-10 h-10 rounded-full"
                    >
                      {micEnabled ? (
                        <Mic className="w-4 h-4" />
                      ) : (
                        <MicOff className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Question Box */}
          <div className="w-full max-w-4xl bg-card border border-border rounded-xl p-6">
            <div className="text-center">
              {currentQuestion ? (
                <p className="text-lg text-card-foreground">
                  {currentQuestion.split('**').map((part, i) => 
                    i % 2 === 1 ? (
                      <strong key={i} className="text-primary font-semibold">{part}</strong>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )}
                </p>
              ) : (
                <p className="text-lg text-muted-foreground">
                  {isConnected 
                    ? "Listening..." 
                    : "Ready to start the interview. Click 'Start Interview' to begin."}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center items-center">
            {isConnected && (
              <Button
                variant="secondary"
                size="lg"
                onClick={repeatQuestion}
                disabled={!currentQuestion}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-6"
              >
                <Repeat className="w-4 h-4 mr-2" />
                Repeat
              </Button>
            )}
            
            {isConnected ? (
              <Button
                variant="destructive"
                size="lg"
                onClick={endCall}
                className="bg-destructive text-white hover:bg-destructive/90 px-6"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Leave interview
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={startCall}
                disabled={loading || !resumeAnalysis}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
              >
                Start Interview
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
