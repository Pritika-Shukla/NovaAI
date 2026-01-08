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

    let resumeAnalysis = null;
    try {
      const analyzeResponse = await fetch(`${request.nextUrl.origin}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resumeText: result.text }),
      });

      if (analyzeResponse.ok) {
        const analysisData = await analyzeResponse.json();
        if ('rawResponse' in analysisData) {
          delete analysisData.rawResponse;
        }
        resumeAnalysis = analysisData;
      } else {
        console.error("Analysis failed, continuing without analysis");
      }
    } catch (analyzeError) {
      console.error("Error calling analyze endpoint:", analyzeError);
    }

    const fileName = `${user.id}/${Date.now()}-${file.name}`;
    
    const { error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(fileName, file, {
        contentType: file.type,
        upsert: true
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
      .upsert({
        user_id: user.id,
        file_name: file.name,
        file_path: fileName,
        resume_analysis: resumeAnalysis,
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      await supabase.storage.from('resumes').remove([fileName]);
      return NextResponse.json(
        { error: `Failed to save resume data: ${dbError.message}` },
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

export async function GET() {
  try {
    const authResult = await getAuthenticatedUser();
    
    if ("error" in authResult) {
      return authResult.error;
    }

    const { user, supabase } = authResult;
    
    const serviceSupabase = createServiceClient();
    const { data, error } = await serviceSupabase
      .from('user_resumes')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ resume: null });
      }
      
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    let downloadUrl = null;
    if (data?.file_path) {
      const { data: urlData } = supabase.storage
        .from('resumes')
        .getPublicUrl(data.file_path);
      downloadUrl = urlData.publicUrl;
    }
    
    return NextResponse.json({ 
      resume: data ? { ...data, downloadUrl } : null 
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Failed to get resume";
    console.error("Get resume error:", err);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const authResult = await getAuthenticatedUser();
    
    if ("error" in authResult) {
      return authResult.error;
    }

    const { user, supabase } = authResult;
    
    const serviceSupabase = createServiceClient();
    
    const { data: resumeData, error: fetchError } = await serviceSupabase
      .from('user_resumes')
      .select('file_path')
      .eq('user_id', user.id)
      .single();
    
    if (fetchError) {
      if (fetchError.code === "PGRST116") {
        return NextResponse.json(
          { error: "No resume found" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: fetchError.message },
        { status: 500 }
      );
    }
    
    if (resumeData?.file_path) {
      const { error: storageError } = await supabase.storage
        .from('resumes')
        .remove([resumeData.file_path]);
      
      if (storageError) {
        console.error("Storage delete error:", storageError);
      }
    }
    
    const { error: dbError } = await serviceSupabase
      .from('user_resumes')
      .delete()
      .eq('user_id', user.id);
    
    if (dbError) {
      console.error("Database delete error:", dbError);
      return NextResponse.json(
        { error: `Failed to delete resume: ${dbError.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Failed to delete resume";
    console.error("Delete resume error:", err);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}