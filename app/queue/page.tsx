"use client";

import { useEffect, useState } from "react";
import { getQueue } from "@/lib/queue";
import { assignFromQueue } from "@/lib/assign";

export default function QueuePage() {
  const [queue, setQueue] = useState<any[]>([]);

  async function loadQueue() {
    const data = await getQueue();
    setQueue(data);
  }

  useEffect(() => {
    loadQueue();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Waiting Queue</h1>

      <button
        onClick={async () => {
          await assignFromQueue();
          loadQueue();
        }}
        className="bg-black text-white px-4 py-2 mt-4"
      >
        Assign From Queue
      </button>

      <ul className="mt-6 space-y-2">
        {queue.map((q, index) => (
          <li key={q.id} className="border p-2">
            #{index + 1} — {q.appointments.customer_name} —{" "}
            {q.appointments.date} — {q.appointments.start_time}
          </li>
        ))}
      </ul>
    </div>
  );
}
