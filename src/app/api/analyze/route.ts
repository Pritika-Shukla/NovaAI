import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
    try {
        const { resumeText } = await request.json();
        
        const prompt = `
Extract the following from this resume and return ONLY valid JSON:
- Full name
- Skills (list)
- Experience (years)
- Tech stack
- Project summaries
- Education
- Weak areas
- Estimated seniority (beginner / intermediate / advanced)

Resume:
${resumeText}
`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }
        });

        const rawContent = response.choices[0].message.content || "{}";
        const data = JSON.parse(rawContent);

        return NextResponse.json({
            ...data,
            rawResponse: rawContent
        });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { error: "Failed to analyze resume" },
            { status: 500 }
        );
    }
}