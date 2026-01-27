import { supabase } from "./supabase";

export interface ActivityLog {
    id: string;
    user_id: string;
    message: string;
    created_at: string;
}

export async function logActivity(message: string) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from("activity_logs").insert({
      user_id: user.id,
      message,
    });
  } catch (err) {
    console.error("logActivity Error:", err);
  }
}

export async function getLogs() {
  const { data, error } = await supabase
    .from("activity_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) throw error;
  return (data || []) as ActivityLog[];
}
