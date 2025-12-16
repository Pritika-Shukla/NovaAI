import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { resumeText } = await request.json();

    const prompt = `
Analyze the given resume and write a clear, concise paragraph covering the candidate’s full name, skills, years of experience, tech stack, key projects, education, weak areas, and estimated seniority level. Keep the tone professional and objective, avoid repetition, and focus only on relevant technical and professional details.

Resume:
${resumeText}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const analysis =
      response.choices[0].message.content || "No analysis generated.";

    return NextResponse.json({
       analysis,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to analyze resume" },
      { status: 500 }
    );
  }
}
