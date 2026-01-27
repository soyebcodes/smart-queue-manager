"use client";

import { useEffect, useState } from "react";
import { getServices, createService } from "@/lib/services";

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState(30);
  const [staffType, setStaffType] = useState("Doctor");

  async function loadServices() {
    const data = await getServices();
    setServices(data);
  }

  async function handleAdd() {
    await createService({
      name,
      duration,
      required_staff_type: staffType,
    });
    setName("");
    loadServices();
  }

  useEffect(() => {
    loadServices();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Services</h1>

      <div className="flex gap-2 flex-wrap">
        <input
          className="border p-2"
          placeholder="Service name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select
          className="border p-2"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
        >
          <option value={15}>15 min</option>
          <option value={30}>30 min</option>
          <option value={60}>60 min</option>
        </select>

        <select
          className="border p-2"
          value={staffType}
          onChange={(e) => setStaffType(e.target.value)}
        >
          <option>Doctor</option>
          <option>Consultant</option>
          <option>Support Agent</option>
        </select>

        <button onClick={handleAdd} className="bg-black text-white px-4">
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {services.map((s) => (
          <li key={s.id} className="border p-2">
            {s.name} — {s.duration} min — {s.required_staff_type}
          </li>
        ))}
      </ul>
    </div>
  );
}
