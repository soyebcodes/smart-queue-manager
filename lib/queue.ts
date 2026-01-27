import { supabase } from "./supabase";

export async function addToQueue(appointmentId: string) {
  const { error } = await supabase
    .from("waiting_queue")
    .insert({ appointment_id: appointmentId });

  if (error) throw error;
}

export async function getQueue() {
  const { data, error } = await supabase
    .from("waiting_queue")
    .select(
      `
      id,
      created_at,
      appointments (
        id,
        customer_name,
        date,
        start_time,
        end_time,
        services (required_staff_type)
      )
    `,
    )
    .order("created_at");

  if (error) throw error;
  return data;
}

// remove item from queue
export async function removeFromQueue(queueId: string) {
  const { error } = await supabase
    .from("waiting_queue")
    .delete()
    .eq("id", queueId);

  if (error) throw error;
}
