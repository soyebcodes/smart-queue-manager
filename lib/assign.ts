import { supabase } from "./supabase";
import { hasConflict } from "./appointments";
import { getQueue, removeFromQueue } from "./queue";
import { logActivity } from "./logs";

export async function assignFromQueue() {
  const queue = await getQueue();
  if (!queue.length) return;

  const queueItem: any = queue[0];
  const appointment = Array.isArray(queueItem.appointments) 
    ? queueItem.appointments[0] 
    : queueItem.appointments;

  if (!appointment) return;

  const service = Array.isArray(appointment.services) 
    ? appointment.services[0] 
    : appointment.services;

  if (!service) return;

  const { data: staffList, error } = await supabase
    .from("staff")
    .select("*")
    .eq("service_type", service.required_staff_type)
    .eq("status", "AVAILABLE");

  if (error) throw error;

  for (const staff of staffList || []) {
    const conflict = await hasConflict(
      staff.id,
      appointment.date,
      appointment.start_time,
      appointment.end_time || appointment.start_time, // Fallback if end_time missing
    );

    if (!conflict) {
      // assign staff
      await supabase
        .from("appointments")
        .update({ staff_id: staff.id })
        .eq("id", appointment.id);

      // remove from queue
      await removeFromQueue(queueItem.id);

      // log activity
      await logActivity(
        `Appointment for "${appointment.customer_name}" auto-assigned to ${staff.name}.`,
      );

      break;
    }
  }
}
