import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getAuthenticatedUser } from "@/lib/auth";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const authResult = await getAuthenticatedUser();

    if ("error" in authResult) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { resumeText } = await request.json();

    if (!resumeText) {
      return NextResponse.json(
        { error: "Resume text required" },
        { status: 400 }
      );
    }

    const prompt = `
Analyze the given resume and write a clear, concise paragraph covering the candidate’s full name, skills, years of experience, tech stack, key projects, education, weak areas, and estimated seniority level. Keep the tone professional and objective.

Resume:
${resumeText}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const analysis =
      response.choices[0].message.content ?? "No analysis generated.";

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to analyze resume" },
      { status: 500 }
    );
  }
}
