import { NextRequest, NextResponse } from "next/server";
import { extractText } from "unpdf";
import { createServiceClient } from "@/lib/supabase/service";
import { getAuthenticatedUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const authResult = await getAuthenticatedUser();
    
    if ("error" in authResult) {
      return authResult.error;
    }

    const { user, supabase } = authResult;

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

    const fileName = `${user.id}/${Date.now()}-${file.name}`;
    
    const { error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return NextResponse.json(
        { error: `Failed to upload file: ${uploadError.message}` },
        { status: 500 }
      );
    }

    const { data: urlData } = supabase.storage
      .from('resumes')
      .getPublicUrl(fileName);


    const serviceSupabase = createServiceClient();
    
    const { data: resumeData, error: dbError } = await serviceSupabase
      .from('user_resumes')
      .insert({
        user_id: user.id,
        file_name: file.name,
        file_path: fileName
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database insert error:", dbError);
      await supabase.storage.from('resumes').remove([fileName]);
      return NextResponse.json(
        { error: `Failed to save resume record: ${dbError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      text: result.text,
      resume: resumeData,
      fileUrl: urlData.publicUrl
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Failed to process file";
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}