import { supabase } from "./supabase";

export async function getAppointmentsByDate(date: string) {
  const { data, error } = await supabase
    .from("appointments")
    .select(
      `
      *,
      staff(name),
      services(name, duration)
    `,
    )
    .eq("date", date)
    .order("start_time");

  if (error) throw error;
  return data;
}

export async function createAppointment(input: {
  customer_name: string;
  service_id: string;
  staff_id?: string | null;
  date: string;
  start_time: string;
  end_time: string;
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("appointments")
    .insert({
      ...input,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// conflict detection
export async function hasConflict(
  staffId: string,
  date: string,
  start: string,
  end: string,
) {
  const { data } = await supabase
    .from("appointments")
    .select("id")
    .eq("staff_id", staffId)
    .eq("date", date)
    .lt("start_time", end)
    .gt("end_time", start)
    .limit(1);

  return data && data.length > 0;
}

// capicity check
export async function staffLoad(staffId: string, date: string) {
  const { count } = await supabase
    .from("appointments")
    .select("*", { count: "exact", head: true })
    .eq("staff_id", staffId)
    .eq("date", date)
    .eq("status", "SCHEDULED");

  return count || 0;
}
