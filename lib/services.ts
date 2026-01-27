import { supabase } from "./supabase";

export async function getServices() {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}

export async function createService(input: {
  name: string;
  duration: number;
  required_staff_type: string;
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("services").insert({
    ...input,
    user_id: user.id,
  });

  if (error) throw error;
}
