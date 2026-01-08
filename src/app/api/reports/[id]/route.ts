import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await getAuthenticatedUser();
    
    if ("error" in authResult) {
      return authResult.error;
    }

    const { user } = authResult;
    const { id } = await params;
    const serviceSupabase = createServiceClient();

    // Fetch specific interview feedback
    const { data: feedback, error } = await serviceSupabase
      .from('interview_feedback')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error || !feedback) {
      return NextResponse.json(
        { error: "Report not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      report: feedback,
    });
  } catch (error) {
    console.error("Error fetching report:", error);
    return NextResponse.json(
      { error: "Failed to fetch report" },
      { status: 500 }
    );
  }
}

