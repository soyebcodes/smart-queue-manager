"use client";

import { useEffect, useState } from "react";
import { getServices } from "@/lib/services";
import { getStaff } from "@/lib/staff";
import { createAppointment } from "@/lib/appointments";
import { addToQueue } from "@/lib/queue";
import { hasConflict, getStaffLoad } from "@/lib/appointments";

export default function AppointmentPage() {
  const [services, setServices] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [customerName, setCustomerName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      setServices(await getServices());
      setStaff(await getStaff());
    }
    load();
  }, []);

  async function handleCreate() {
    setMessage("");

    // find service duration
    const service = services.find((s) => s.id === serviceId);
    if (!service) return;

    const duration = service.duration;
    const [h, m] = startTime.split(":").map(Number);
    const endTime = `${String(h + Math.floor((m + duration) / 60)).padStart(2, "0")}:${String((m + duration) % 60).padStart(2, "0")}`;

    // Find eligible staff
    const eligible = staff.filter(
      (s) =>
        s.service_type === service.required_staff_type &&
        s.status === "AVAILABLE",
    );

    // Try to assign staff
    for (const s of eligible) {
      const conflict = await hasConflict(s.id, date, startTime, endTime);
      const load = await getStaffLoad(s.id, date);

      if (!conflict && load < s.daily_capacity) {
        await createAppointment({
          customer_name: customerName,
          service_id: serviceId,
          staff_id: s.id,
          date,
          start_time: startTime,
          end_time: endTime,
        });
        setMessage(`Assigned to ${s.name}`);
        return;
      }
    }

    // If no staff assigned → add to queue
    const appointment = await createAppointment({
      customer_name: customerName,
      service_id: serviceId,
      staff_id: null,
      date,
      start_time: startTime,
      end_time: endTime,
    });

    await addToQueue(appointment.id);
    setMessage("No staff available. Added to queue.");
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Create Appointment</h1>

      <input
        className="border p-2"
        placeholder="Customer Name"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
      />

      <select
        className="border p-2"
        value={serviceId}
        onChange={(e) => setServiceId(e.target.value)}
      >
        <option value="">Select Service</option>
        {services.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} ({s.duration} min)
          </option>
        ))}
      </select>

      <input
        className="border p-2"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <input
        className="border p-2"
        type="time"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
      />

      <button onClick={handleCreate} className="bg-black text-white px-4 py-2">
        Create Appointment
      </button>

      {message && <div className="mt-4 text-green-600">{message}</div>}
    </div>
  );
}
