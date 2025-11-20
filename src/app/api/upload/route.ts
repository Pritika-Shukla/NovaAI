import { NextRequest, NextResponse } from "next/server";
import { extractText } from "unpdf";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file = data.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const uint8Array = new Uint8Array(bytes);

    const result = await extractText(uint8Array);

    return NextResponse.json({ text: result.text });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Failed to parse PDF file";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
