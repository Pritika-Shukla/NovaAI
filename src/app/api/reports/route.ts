import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET(request: NextRequest) {
  try {
    const authResult = await getAuthenticatedUser();
    
    if ("error" in authResult) {
      return authResult.error;
    }

    const { user } = authResult;
    const serviceSupabase = createServiceClient();

    // Fetch all interview feedback for the user
    const { data: feedbacks, error } = await serviceSupabase
      .from('interview_feedback')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching feedback:", error);
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        return NextResponse.json(
          { 
            error: "Database table not found. Please create the interview_feedback table in Supabase.",
            details: error.message 
          },
          { status: 500 }
        );
      }
      return NextResponse.json(
        { 
          error: "Failed to fetch reports",
          details: error.message 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      reports: feedbacks || [],
    });
  } catch (error) {
    console.error("Error in reports endpoint:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}

