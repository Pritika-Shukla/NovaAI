"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Vapi from '@vapi-ai/web';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Repeat, LogOut, Video, VideoOff, Mic, MicOff, AlertCircle, Upload, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import type { UploadResponse, TranscriptMessage, AssistantConfig } from "@/types";

export default function InterviewPage() {
  const [resumeAnalysis, setResumeAnalysis] = useState<unknown>(null);
  const [hasResume, setHasResume] = useState<boolean>(false);
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [isStartingInterview, setIsStartingInterview] = useState(false);
  const transcriptRef = useRef<TranscriptMessage[]>([]);
  const feedbackGeneratedRef = useRef<boolean>(false);
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
        setHasResume(!!result.resume);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
        console.error("Error fetching upload data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  useEffect(() => {
    if (!isConnected) {
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

  useEffect(() => {
    if (!userStream) return;

    userStream.getVideoTracks().forEach(track => {
      track.enabled = cameraEnabled;
    });
    userStream.getAudioTracks().forEach(track => {
      track.enabled = micEnabled;
    });
  }, [cameraEnabled, micEnabled, userStream]);

  // Update video element when stream changes or camera is toggled
  useEffect(() => {
    if (videoRef.current && userStream) {
      const video = videoRef.current;
      
      // Only update srcObject if it's different to avoid unnecessary re-initialization
      if (video.srcObject !== userStream) {
        video.srcObject = userStream;
      }
      
      // Ensure video plays when stream is set and camera is enabled
      if (cameraEnabled) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            // Only log if it's not a user-initiated pause
            if (err.name !== 'NotAllowedError' && err.name !== 'AbortError') {
              console.error('Error playing video:', err);
            }
          });
        }
      }
    }
  }, [userStream, cameraEnabled]);

  const generateFeedback = useCallback(async (transcriptData: TranscriptMessage[]) => {
    if (transcriptData.length === 0) return;
    
    setIsGeneratingFeedback(true);
    try {
      const response = await fetch('/api/interview/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript: transcriptData,
          resumeAnalysis,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate feedback');
      }

      const result = await response.json();
      setFeedback(result.feedback);
      
      console.log('Interview feedback generated and saved:', result.feedbackId);
    } catch (error) {
      console.error('Error generating feedback:', error);
      setError('Failed to generate feedback. Please try again.');
    } finally {
      setIsGeneratingFeedback(false);
    }
  }, [resumeAnalysis]);

  useEffect(() => {
    if (!resumeAnalysis) return;

    const vapiInstance = new Vapi(process.env.NEXT_PUBLIC_VAPI_KEY!);
    setVapi(vapiInstance);

    // Event listeners
    vapiInstance.on('call-start', () => {
      setIsConnected(true);
      setIsStartingInterview(false);
      transcriptRef.current = []; // Reset ref
      setFeedback(null); // Reset feedback
      feedbackGeneratedRef.current = false; // Reset feedback flag
    });
    vapiInstance.on('call-end', async () => {
      setIsConnected(false);
      setIsSpeaking(false);
      
      if (transcriptRef.current.length > 0 && !feedbackGeneratedRef.current) {
        feedbackGeneratedRef.current = true;
        await generateFeedback(transcriptRef.current);
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
        setUserStream(null);
      }
    });
    vapiInstance.on('speech-start', () => setIsSpeaking(true));
    vapiInstance.on('speech-end', () => setIsSpeaking(false));
    vapiInstance.on('message', (message: { type?: string; role?: string; transcript?: string; text?: string; content?: string }) => {
      if (message.type === 'transcript') {
        const text = message.transcript || message.text || message.content || '';
        const role = message.role || 'assistant';
        
        if (text && text.trim().length > 0) {
          const transcriptMessage: TranscriptMessage = {
            role,
            content: text.trim(),
            timestamp: new Date().toISOString(),
          };
          transcriptRef.current = [...transcriptRef.current, transcriptMessage];
          
          if (role === 'assistant' && text.length > 10) {
            if (text.includes('?') || text.length > 20) {
              setCurrentQuestion(text);
            }
          }
        }
      }
      if (message.type === 'function-call') {
        console.log('Function call:', message);
      }
    });
    vapiInstance.on('error', (error) => {
      console.error('Vapi error:', error);
      setIsStartingInterview(false);
    });

    return () => {
      vapiInstance.stop();
    };
  }, [resumeAnalysis, generateFeedback]);


  const startCall = () => {
    if (!vapi || isStartingInterview) return;
    
    setIsStartingInterview(true);
    
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
- Conduct a real-world technical interview focused on practical technical skills.
- Ask practical, hands-on questions related to the candidate's tech stack from their resume.
- Do NOT ask about specific projects, resume details, or behavioral questions.

Interview behavior:
1. Ask ONE technical question at a time.
2. Questions must be strictly based on the candidate's tech stack and skills listed in the resume.
3. Focus on practical, real-world scenarios and problem-solving.
4. Do NOT ask theory, definition, or "explain X" questions.
5. Do NOT ask resume or behavioral questions.
6. Ask exactly 5 technical questions total, then conclude the interview.

Response format:
- Be concise and professional.
- Ask your question directly without extra preamble.
- After the candidate answers, provide brief acknowledgment, then ask the next question.
- After the second question is answered, thank the candidate and conclude the interview.

End behavior:
- After asking and receiving answers to 5 questions, thank the candidate and end the interview.
- Do not continue asking questions beyond the 5-question limit.`}],
      },
    };
    
    (vapi.start as (config: AssistantConfig) => void)(assistantConfig);
  };

  const endCall = async () => {
    if (transcriptRef.current.length > 0 && !feedbackGeneratedRef.current) {
      feedbackGeneratedRef.current = true;
      setIsGeneratingFeedback(true);
      await generateFeedback(transcriptRef.current);
    }
    
    vapi?.stop();
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setUserStream(null);
    }
    
    setTimeout(() => {
      router.push('/dashboard');
    }, isGeneratingFeedback ? 3000 : 1000);
  };

  const repeatQuestion = () => {
    console.log("Repeat question requested");
  };

  const toggleCamera = () => {
    const newState = !cameraEnabled;
    setCameraEnabled(newState);
    
    // Update video track state
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(track => {
        track.enabled = newState;
      });
    }
    
    // Ensure video element updates and plays when camera is turned back on
    if (newState && videoRef.current && userStream) {
      const video = videoRef.current;
      // Reassign srcObject to ensure it's properly connected
      if (video.srcObject !== userStream) {
        video.srcObject = userStream;
      }
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          // Only log if it's not a user-initiated pause
          if (err.name !== 'NotAllowedError' && err.name !== 'AbortError') {
            console.error('Error playing video after enabling camera:', err);
          }
        });
      }
    }
  };

  const toggleMic = () => {
    const newState = !micEnabled;
    setMicEnabled(newState);
    
    // Update audio track state
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = newState;
      });
    }
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
        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-4 sm:py-8 gap-4 sm:gap-8 overflow-auto">
          {/* Two Panels */}
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-8 w-full max-w-6xl">
            {/* AI Interviewer Panel */}
            <div className="flex-1 flex flex-col items-center justify-center bg-card border border-border rounded-xl p-4 sm:p-8 relative min-h-[200px] sm:min-h-[300px]">
              <h2 className="text-base sm:text-lg font-semibold text-card-foreground mb-4 sm:mb-6">AI Interviewer</h2>
              
              {/* Avatar with sound waves */}
              <div className="relative">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-primary flex items-center justify-center relative shadow-lg">
                  <MessageSquare className="w-12 h-12 sm:w-16 sm:h-16 text-primary-foreground" />
                  
                  {/* Sound waves animation */}
                  {isSpeaking && (
                    <>
                      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-6 sm:h-8 bg-primary-foreground/60 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                      <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-4 sm:h-6 bg-primary-foreground/40 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                      <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1 h-3 sm:h-4 bg-primary-foreground/20 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* User Panel */}
            <div className="flex-1 flex flex-col bg-card border border-border rounded-xl overflow-hidden min-h-[200px] sm:min-h-[300px] relative">
              {/* Video Feed - always mounted when connected, just hidden when camera is off */}
              {isConnected && userStream && (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${cameraEnabled ? 'block' : 'hidden'}`}
                />
              )}
              
              {/* Overlay with name and controls - shown when video is visible */}
              {isConnected && cameraEnabled && userStream && (
                <>
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent p-3 sm:p-4 z-10">
                    <h2 className="text-sm sm:text-base font-semibold text-white truncate">
                      {getUserName()} (You)
                    </h2>
                  </div>
                  {/* Camera/Mic Controls at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 sm:p-4 flex justify-center gap-2 z-10">
                    <Button
                      size="icon"
                      variant={cameraEnabled ? "default" : "destructive"}
                      onClick={toggleCamera}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                      title={cameraEnabled ? "Turn off camera" : "Turn on camera"}
                    >
                      {cameraEnabled ? (
                        <Video className="w-3 h-3 sm:w-4 sm:h-4" />
                      ) : (
                        <VideoOff className="w-3 h-3 sm:w-4 sm:h-4" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant={micEnabled ? "default" : "destructive"}
                      onClick={toggleMic}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                      title={micEnabled ? "Mute microphone" : "Unmute microphone"}
                    >
                      {micEnabled ? (
                        <Mic className="w-3 h-3 sm:w-4 sm:h-4" />
                      ) : (
                        <MicOff className="w-3 h-3 sm:w-4 sm:h-4" />
                      )}
                    </Button>
                  </div>
                </>
              )}
              
              {/* Avatar view - shown when camera is off or not connected */}
              {(!isConnected || !cameraEnabled || !userStream) && (
                <div className="flex flex-col items-center justify-center h-full p-4 sm:p-8">
                  <h2 className="text-base sm:text-lg font-semibold text-card-foreground mb-4 sm:mb-6 truncate max-w-full px-2">
                    {getUserName()} (You)
                  </h2>
                  
                  <div className="relative">
                    <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-border shadow-lg">
                      <AvatarImage src={user?.user_metadata?.avatar_url} alt={getUserName()} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xl sm:text-2xl font-semibold">
                        {getUserName().charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Camera/Mic Controls */}
                    {isConnected && (
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        <Button
                          size="icon"
                          variant={cameraEnabled ? "default" : "destructive"}
                          onClick={toggleCamera}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                          title={cameraEnabled ? "Turn off camera" : "Turn on camera"}
                        >
                          {cameraEnabled ? (
                            <Video className="w-3 h-3 sm:w-4 sm:h-4" />
                          ) : (
                            <VideoOff className="w-3 h-3 sm:w-4 sm:h-4" />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant={micEnabled ? "default" : "destructive"}
                          onClick={toggleMic}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                          title={micEnabled ? "Mute microphone" : "Unmute microphone"}
                        >
                          {micEnabled ? (
                            <Mic className="w-3 h-3 sm:w-4 sm:h-4" />
                          ) : (
                            <MicOff className="w-3 h-3 sm:w-4 sm:h-4" />
                      )}
                    </Button>
                  </div>
                )}
              </div>
                </div>
              )}
            </div>
          </div>

          {/* Question Box */}
          <div className="w-full max-w-4xl bg-card border border-border rounded-xl p-4 sm:p-6">
            <div className="text-center">
              {!hasResume && !loading ? (
                <Card className="border-destructive/50 bg-destructive/5">
                  <CardHeader>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-destructive" />
                      <CardTitle className="text-sm sm:text-base text-destructive">Resume Not Uploaded</CardTitle>
                    </div>
                    <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                      Please upload your resume before starting an interview.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      size="lg"
                      onClick={() => router.push("/dashboard/upload")}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm sm:text-base"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Resume
                    </Button>
                  </CardContent>
                </Card>
              ) : error ? (
                <div className="text-destructive text-base sm:text-lg mb-4">
                  {error}
                </div>
              ) : isGeneratingFeedback ? (
                <p className="text-base sm:text-lg text-muted-foreground">
                  Generating feedback...
                </p>
              ) : feedback ? (
                <div className="text-left space-y-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-card-foreground mb-4">Interview Feedback</h3>
                  <div className="prose prose-sm max-w-none text-card-foreground whitespace-pre-wrap text-sm sm:text-base">
                    {feedback}
                  </div>
                </div>
              ) : currentQuestion ? (
                <p className="text-base sm:text-lg text-card-foreground px-2">
                  {currentQuestion.split('**').map((part, i) => 
                    i % 2 === 1 ? (
                      <strong key={i} className="text-primary font-semibold">{part}</strong>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )}
                </p>
              ) : (
                <p className="text-base sm:text-lg text-muted-foreground px-2">
                  {isConnected 
                    ? "Listening..." 
                    : "Ready to start the interview. Click 'Start Interview' to begin."}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full max-w-4xl px-4">
            {isConnected && (
              <Button
                variant="secondary"
                size="lg"
                onClick={repeatQuestion}
                disabled={!currentQuestion}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 sm:px-6 w-full sm:w-auto text-sm sm:text-base"
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
                className="bg-destructive text-white hover:bg-destructive/90 px-4 sm:px-6 w-full sm:w-auto text-sm sm:text-base"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Leave interview
              </Button>
            ) : hasResume && !loading ? (
              <Button
                size="lg"
                onClick={startCall}
                disabled={!resumeAnalysis || isStartingInterview}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 sm:px-8 w-full sm:w-auto text-sm sm:text-base cursor-pointer"
              >
                {isStartingInterview ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Starting...
                  </>
                ) : (
                  "Start Interview"
                )}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
