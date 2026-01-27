import { supabase } from "./supabase";

export interface Appointment {
  id: string;
  customer_name: string;
  service_id: string;
  staff_id?: string | null;
  date: string;
  start_time: string;
  end_time: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  notes?: string;
  created_at: string;
  // Joins
  staff?: { name: string };
  services?: { name: string; duration: number };
}

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
  return data as Appointment[];
}

export async function createAppointment(input: {
  customer_name: string;
  service_id: string;
  staff_id?: string | null;
  date: string;
  start_time: string;
  end_time: string;
  status?: string;
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
      status: input.status || "SCHEDULED",
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
  // Logic: An appointment overlaps if (StartA < EndB) and (EndA > StartB)
  const { data } = await supabase
    .from("appointments")
    .select("id")
    .eq("staff_id", staffId)
    .eq("date", date)
    .eq("status", "SCHEDULED") // Only count scheduled appointments
    .lt("start_time", end)
    .gt("end_time", start)
    .limit(1);

  return data && data.length > 0;
}

// capacity check
export async function staffLoad(staffId: string, date: string) {
  const { count } = await supabase
    .from("appointments")
    .select("*", { count: "exact", head: true })
    .eq("staff_id", staffId)
    .eq("date", date)
    .eq("status", "SCHEDULED");

  return count || 0;
}

// Alias for compatibility
export const getStaffLoad = staffLoad;
