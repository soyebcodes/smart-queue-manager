import { supabase } from "./supabase";

export interface Service {
  id: string;
  name: string;
  duration: number;
  required_staff_type: string;
  created_at?: string;
}

export async function getServices() {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data as Service[];
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
