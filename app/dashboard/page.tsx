"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, CalendarCheck, AlertCircle } from "lucide-react";
import { getLogs, ActivityLog } from "@/lib/logs";
import { getAppointmentsByDate } from "@/lib/appointments";
import { getQueue } from "@/lib/queue";
import { getStaff } from "@/lib/staff";

export default function DashboardPage() {
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        completed: 0,
        queue: 0
    });
    const [staffLoad, setStaffLoad] = useState<any[]>([]);
    const [logs, setLogs] = useState<ActivityLog[]>([]);

    useEffect(() => {
        loadDashboardData();
    }, []);

    async function loadDashboardData() {
        const today = new Date().toISOString().split("T")[0];
        
        // 1. Logs
        const logsData = await getLogs();
        setLogs(logsData || []);

        // 2. Queue
        const queueData = await getQueue();
        const queueCount = queueData ? queueData.length : 0;

        // 3. Appointments
        const appts = await getAppointmentsByDate(today);
        if (appts) {
            setStats({
                total: appts.length,
                pending: appts.filter(a => a.status === 'SCHEDULED').length,
                completed: appts.filter(a => a.status === 'COMPLETED').length,
                queue: queueCount
            });
        }

        // 4. Staff Load (Approximate for Overview)
        const staffData = await getStaff();
        if (staffData && appts) {
            const loads = staffData.map((s: any) => {
                const count = appts.filter(a => a.staff_id === s.id && a.status === 'SCHEDULED').length; // Simplification
                return {
                    name: s.name,
                    current: count,
                    max: s.daily_capacity,
                    status: count >= s.daily_capacity ? "Booked" : "OK"
                };
            });
            setStaffLoad(loads);
        }
    }

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto my-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
              <CalendarCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Scheduled for today</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Yet to be served</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
              <p className="text-xs text-muted-foreground">Successfully served</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Waiting Queue</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.queue}</div>
              <p className="text-xs text-muted-foreground">People waiting</p>
            </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Staff Load Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                {staffLoad.length === 0 ? <p className="text-sm text-gray-500">No active staff found.</p> : staffLoad.map((staff, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                        <div className="font-medium">{staff.name}</div>
                        <div className="flex items-center gap-2">
                            <span className={`text-sm ${staff.current >= staff.max ? "text-red-500 font-bold" : "text-green-600"}`}>
                                {staff.current} / {staff.max}
                            </span>
                             <span className={`text-xs px-2 py-1 rounded-full ${staff.status === "Booked" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                                {staff.status}
                             </span>
                        </div>
                    </div>
                ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[300px] overflow-y-auto">
                {logs.length === 0 ? <p className="text-sm text-gray-500">No activity logs yet.</p> : logs.map((log) => (
                    <div key={log.id} className="text-sm text-gray-600 dark:text-gray-300 border-l-2 border-primary/20 pl-3 py-1">
                        <span className="block font-xs text-gray-400 mb-0.5">{new Date(log.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        {log.message}
                    </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
