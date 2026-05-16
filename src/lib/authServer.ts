import { getSupabaseServerClient } from "@/lib/supabaseServer";

export async function getAuthenticatedUserId(request: Request) {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return "demo-user";
  }

  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : "";

  if (!token) {
    throw new Error("Authentication required.");
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    throw new Error("Invalid or expired session.");
  }

  return data.user.id;
}
