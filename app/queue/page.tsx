"use client";

import { useEffect, useState } from "react";
import { getQueue, removeFromQueue } from "@/lib/queue";
import { getStaff } from "@/lib/staff";
import { hasConflict, getStaffLoad } from "@/lib/appointments";
import { supabase } from "@/lib/supabase"; // Direct for update to avoid big refactor
import { logActivity } from "@/lib/logs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function QueuePage() {
  const [queue, setQueue] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const q = await getQueue();
    setQueue(q || []);
    const s = await getStaff();
    setStaff(s || []);
  }

  async function assignToStaff(queueItem: any, staffId: string) {
      if (!confirm(`Assign ${queueItem.appointments.customer_name} to this staff member?`)) return;

      setLoading(true);
      try {
          // 1. Update Appointment with Staff ID
          const { error } = await supabase
            .from("appointments")
            .update({ staff_id: staffId })
            .eq("id", queueItem.appointments.id);
          
          if (error) throw error;

          // 2. Remove from Queue
          await removeFromQueue(queueItem.id);

          // 3. Log
          const staffMember = staff.find(s => s.id === staffId);
          await logActivity(`Moved ${queueItem.appointments.customer_name} from queue to ${staffMember?.name || 'Staff'}`);

          alert("Assigned successfully!");
          loadData();
      } catch (e: any) {
          alert("Error: " + e.message);
      } finally {
          setLoading(false);
      }
  }

  // Helper to find eligible staff for a queued item
  const getEligibleStaff = (serviceRequiredType: string) => {
      return staff.filter(s => s.service_type === serviceRequiredType && s.status === 'AVAILABLE');
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
         <h2 className="text-3xl font-bold tracking-tight">Waiting Queue</h2>
         <Button variant="outline" onClick={loadData}>Refresh Queue</Button>
      </div>

      <Card>
          <CardHeader>
              <CardTitle>Current Queue</CardTitle>
              <CardDescription>Appointments waiting for assignment. Ordered by time.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Position</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Required Service</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                     {queue.length === 0 ? (
                        <TableRow>
                           <TableCell colSpan={5} className="text-center h-24">Queue is empty.</TableCell>
                        </TableRow>
                    ) : (
                        queue.map((item, index) => {
                            const availableStaff = getEligibleStaff(item.appointments.services?.required_staff_type);

                            return (
                                <TableRow key={item.id}>
                                    <TableCell className="font-bold">#{index + 1}</TableCell>
                                    <TableCell>{item.appointments.customer_name}</TableCell>
                                    <TableCell>
                                        {item.appointments.date} <br/>
                                        <span className="text-xs text-muted-foreground">{item.appointments.start_time}</span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{item.appointments.services?.required_staff_type || 'General'}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-2">
                                            {availableStaff.length > 0 ? (
                                                <div className="flex items-center gap-2">
                                                    <select 
                                                        className="h-8 rounded-md border text-xs"
                                                        onChange={(e) => {
                                                            if(e.target.value) assignToStaff(item, e.target.value);
                                                            e.target.value = ""; // Reset
                                                        }}
                                                    >
                                                        <option value="">Assign to...</option>
                                                        {availableStaff.map(s => (
                                                            <option key={s.id} value={s.id}>{s.name} ({s.daily_capacity} cap)</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-red-500">No staff available</span>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    )}
                </TableBody>
            </Table>
          </CardContent>
      </Card>
    </div>
  );
}
