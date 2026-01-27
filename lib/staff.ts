import { supabase } from "./supabase";

export async function getStaff() {
  const { data, error } = await supabase
    .from("staff")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}

export async function createStaff(input: {
  name: string;
  service_type: string;
  daily_capacity: number;
  status: "AVAILABLE" | "ON_LEAVE";
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("staff").insert({
    ...input,
    user_id: user.id,
  });

  if (error) throw error;
}
