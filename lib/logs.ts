import { supabase } from "./supabase";

export interface ActivityLog {
    id: string;
    user_id: string;
    message: string;
    created_at: string;
}

export async function logActivity(message: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return; // Or consider logging system events as null user if db allows

  await supabase.from("activity_logs").insert({
    user_id: user.id,
    message,
  });
}

export async function getLogs() {
  const { data, error } = await supabase
    .from("activity_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) throw error;
  return data as ActivityLog[];
}
