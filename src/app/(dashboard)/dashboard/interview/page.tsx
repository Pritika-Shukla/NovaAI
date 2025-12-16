"use client";
import { useState, useEffect } from "react";
import VapiWidget from "@/components/VapiWidget";

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

export default function VapiPage() {
  const [resumeAnalysis, setResumeAnalysis] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        
        // Extract only the resume analysis
        setResumeAnalysis(result.resume?.resume_analysis || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
        console.error("Error fetching upload data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Talk to AI</h1>
      <VapiWidget 
        apiKey={process.env.NEXT_PUBLIC_VAPI_KEY!}
        assistantId={process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID!}
        theme="dark"
        mode="voice"
        assistantConfig={{
          model: {
            provider: "openai",
            model: "gpt-4.1-mini",
            messages: [{ role: "system", content: 
              `Here is the candidate resume. Use this as the ONLY source of truth for the interview:
              ${resumeAnalysis}
              
              You are an AI technical interviewer from a fast-paced tech startup.
              
              Your job:
              - Conduct a real-world technical interview.
              - Ask practical questions  only related to techstack no project question.
              - Evaluate answers like a strict senior engineer.
              
              Interview behavior:
              4. Ask ONE technical question at a time.
              5. Questions must be strictly based on the candidate’s projects and tech stack from the resume.
              6. Do NOT ask theory, definition, or “explain X” questions.
              7. Do NOT ask resume or behavioral questions.
              
              Answer evaluation rules (MANDATORY, AFTER EVERY ANSWER):
              
              Respond in this exact structure — NO extra text:
              
          
              
              2. **Correct way to answer**
                 - Provide detailedinterview answer.
               
              
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
        }}
      />
    </div>
  );
}
