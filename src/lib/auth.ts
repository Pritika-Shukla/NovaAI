import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

export async function getAuthenticatedUser(): Promise<
  | { user: User; supabase: Awaited<ReturnType<typeof createClient>> }
  | { error: NextResponse }
> {
  const supabase = await createClient();

  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { user, supabase };
}

