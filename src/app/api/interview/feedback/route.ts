import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getAuthenticatedUser } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/service";
import type { TranscriptMessage } from "@/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const authResult = await getAuthenticatedUser();
    
    if ("error" in authResult) {
      return authResult.error;
    }

    const { user } = authResult;
    const { transcript, resumeAnalysis } = await request.json();

    if (!transcript || !Array.isArray(transcript) || transcript.length === 0) {
      return NextResponse.json(
        { error: "Transcript is required and must be a non-empty array" },
        { status: 400 }
      );
    }

    const transcriptText = transcript
      .map((msg: TranscriptMessage) => {
        const role = msg.role === "assistant" ? "Interviewer" : "Candidate";
        return `${role}: ${msg.content}`;
      })
      .join("\n\n");

    const prompt = `You are an expert technical interview evaluator. Analyze the following interview transcript and provide comprehensive feedback.

Resume Context:
${resumeAnalysis ? JSON.stringify(resumeAnalysis) : "No resume context available"}

Interview Transcript:
${transcriptText}

Please provide detailed feedback in the following structure:

1. **Overall Performance**
   - Overall rating (1-10)
   - Summary of candidate's performance

2. **Technical Knowledge**
   - Strengths demonstrated
   - Areas that need improvement
   - Depth of understanding shown

3. **Communication Skills**
   - Clarity of explanations
   - Ability to articulate technical concepts
   - Response structure and organization

4. **Problem-Solving Approach**
   - How the candidate approached questions
   - Logical thinking demonstrated
   - Areas for improvement

5. **Key Strengths**
   - List 3-5 main strengths

6. **Areas for Improvement**
   - List 3-5 areas that need work
   - Specific recommendations


Keep the feedback professional, constructive, and specific. Reference actual examples from the transcript where possible.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const feedback = response.choices[0].message.content || "No feedback generated.";

    const overallRatingMatch = feedback.match(/Overall rating[:\s]*(\d+(?:\.\d+)?)/i) || 
                               feedback.match(/rating[:\s]*(\d+(?:\.\d+)?)\s*\/\s*10/i);
    const overallRating = overallRatingMatch ? parseFloat(overallRatingMatch[1]) : null;

    const recommendationMatch = feedback.match(/Recommendation[:\s]*\n?\s*[-*]?\s*(Hire|Maybe|No Hire|Strong Hire|Weak Hire)/i);
    const recommendation = recommendationMatch ? recommendationMatch[1] : null;

    const technicalMatch = feedback.match(/Technical[^:]*:?\s*(\d+(?:\.\d+)?)/i);
    const communicationMatch = feedback.match(/Communication[^:]*:?\s*(\d+(?:\.\d+)?)/i);
    const problemSolvingMatch = feedback.match(/Problem[-\s]*Solving[^:]*:?\s*(\d+(?:\.\d+)?)/i);

    const technicalScore = technicalMatch ? parseFloat(technicalMatch[1]) : null;
    const communicationScore = communicationMatch ? parseFloat(communicationMatch[1]) : null;
    const problemSolvingScore = problemSolvingMatch ? parseFloat(problemSolvingMatch[1]) : null;

    const serviceSupabase = createServiceClient();
    const { data: feedbackData, error: dbError } = await serviceSupabase
      .from('interview_feedback')
      .insert({
        user_id: user.id,
        transcript: transcript,
        feedback: feedback,
        resume_analysis: resumeAnalysis || null,
        overall_rating: overallRating,
        technical_knowledge_score: technicalScore,
        communication_score: communicationScore,
        problem_solving_score: problemSolvingScore,
        recommendation: recommendation,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Error saving feedback to database:", dbError);
      if (dbError.code === '42P01' || dbError.message?.includes('does not exist')) {
        console.error("Table 'interview_feedback' does not exist. Please run the SQL migration.");
      }
    }

    return NextResponse.json({
      feedback,
      feedbackId: feedbackData?.id || null,
      transcriptLength: transcript.length,
      overallRating,
      recommendation,
    });
  } catch (error) {
    console.error("Error generating feedback:", error);
    return NextResponse.json(
      { error: "Failed to generate feedback" },
      { status: 500 }
    );
  }
}

