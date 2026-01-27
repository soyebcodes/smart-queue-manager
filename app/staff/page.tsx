"use client";

import { useEffect, useState } from "react";
import { getStaff, createStaff } from "@/lib/staff";

export default function StaffPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [serviceType, setServiceType] = useState("Doctor");

  async function loadStaff() {
    const data = await getStaff();
    setStaff(data);
  }

  async function handleAdd() {
    await createStaff({
      name,
      service_type: serviceType,
      daily_capacity: 5,
      status: "AVAILABLE",
    });
    setName("");
    loadStaff();
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadStaff();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Staff</h1>

      <div className="flex gap-2">
        <input
          className="border p-2"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select
          className="border p-2"
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
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
        {staff.map((s) => (
          <li key={s.id} className="border p-2">
            {s.name} — {s.service_type} — {s.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
