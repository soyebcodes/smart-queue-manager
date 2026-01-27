"use client";

import { useEffect, useState } from "react";
import { getServices } from "@/lib/services";
import { getStaff } from "@/lib/staff";
import { createAppointment, getAppointmentsByDate, hasConflict, getStaffLoad, Appointment } from "@/lib/appointments";
import { addToQueue } from "@/lib/queue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function AppointmentPage() {
  const [services, setServices] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  
  // Form State
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [startTime, setStartTime] = useState("09:00");
  const [customerName, setCustomerName] = useState("");
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");

  // UI State
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error' | 'warning', text: string} | null>(null);
  const [staffLoads, setStaffLoads] = useState<Record<string, number>>({});
  const [conflicts, setConflicts] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (date) {
        loadAppointments();
        // Reset staff loads on date change
        setStaffLoads({});
        setConflicts({});
    }
  }, [date]);

  useEffect(() => {
      // Whenever relevant fields change, check availability
      checkAvailability();
  }, [date, startTime, serviceId, staffList]);


  async function loadInitialData() {
    const s = await getServices();
    setServices(s || []);
    const st = await getStaff();
    setStaffList(st || []);
    loadAppointments();
  }

  async function loadAppointments() {
    if (!date) return;
    const data = await getAppointmentsByDate(date);
    setAppointments(data || []);
  }

  async function checkAvailability() {
      if (!date || !startTime || !serviceId) return;
      
      const service = services.find(s => s.id === serviceId);
      if (!service) return;

      const duration = service.duration;
      const [h, m] = startTime.split(":").map(Number);
      const endTime = `${String(h + Math.floor((m + duration) / 60)).padStart(2, "0")}:${String((m + duration) % 60).padStart(2, "0")}`;

      const loads: Record<string, number> = {};
      const conflictMap: Record<string, boolean> = {};

      for (const s of staffList) {
          if (s.service_type === service.required_staff_type) {
             const load = await getStaffLoad(s.id, date);
             const isConflict = await hasConflict(s.id, date, startTime, endTime);
             loads[s.id] = load;
             conflictMap[s.id] = isConflict;
          }
      }
      setStaffLoads(loads);
      setConflicts(conflictMap);
  }

  async function handleCreate() {
    setMessage(null);
    setLoading(true);

    try {
        const service = services.find((s) => s.id === serviceId);
        if (!service) throw new Error("Please select a service");
        if (!customerName) throw new Error("Customer name is required");

        const duration = service.duration;
        const [h, m] = startTime.split(":").map(Number);
        const endTime = `${String(h + Math.floor((m + duration) / 60)).padStart(2, "0")}:${String((m + duration) % 60).padStart(2, "0")}`;

        // Assignment Logic
        let assignedStaffId = selectedStaffId;

        // If specific staff selected, validate
        if (assignedStaffId) {
             const s = staffList.find(st => st.id === assignedStaffId);
             if (s) {
                 if (staffLoads[s.id] >= s.daily_capacity) {
                     if (!confirm(`${s.name} is fully booked (${staffLoads[s.id]}/${s.daily_capacity}). Add to queue instead?`)) {
                         setLoading(false);
                         return;
                     }
                     assignedStaffId = ""; // Send to queue
                 } else if (conflicts[s.id]) {
                      setMessage({ type: 'error', text: `${s.name} has a conflict at this time. Please choose another time or staff.` });
                      setLoading(false);
                      return;
                 }
             }
        } else {
            // Auto-assign Logic if "Any" is strictly implied? 
            // Current requirement says "Users can create appointments... When assigning staff: Show eligible staff... If no staff available: Queue".
            // So user *should* pick a staff or we try to find one?
            // Let's stick to explicit selection or "First Available" logic if we want to be smart.
            // For now, let's assume if they don't pick one, or if they pick "Auto", we try to find one.
            // BUT, let's keep it simple: User MUST pick a staff from the list which shows availability, OR the system handles "Queue" implicitly if none picked?
            // Requirement 4: "When assigning staff... If no staff is available... Queue".
            
            // Let's default to: If user picks a staff, we try that. If they don't, we look for one.
            const availableStaff = staffList.filter(s => 
                s.service_type === service.required_staff_type && 
                s.status === "AVAILABLE" &&
                !conflicts[s.id] &&
                (staffLoads[s.id] || 0) < s.daily_capacity
            );

            if (availableStaff.length > 0) {
                assignedStaffId = availableStaff[0].id;
                setMessage({ type: 'success', text: `Auto-assigned to ${availableStaff[0].name}` });
            } else {
                assignedStaffId = ""; // No one available
            }
        }

        if (assignedStaffId) {
            await createAppointment({
                customer_name: customerName,
                service_id: serviceId,
                staff_id: assignedStaffId,
                date,
                start_time: startTime,
                end_time: endTime,
            });
            if (!message) setMessage({ type: 'success', text: "Appointment scheduled successfully!" });
        } else {
             const appt = await createAppointment({
                customer_name: customerName,
                service_id: serviceId,
                staff_id: null,
                date,
                start_time: startTime,
                end_time: endTime,
            });
            await addToQueue(appt.id);
            setMessage({ type: 'warning', text: "No staff available. Added to Waiting Queue." });
        }

        setCustomerName("");
        loadAppointments();
        checkAvailability();

    } catch (e: any) {
        setMessage({ type: 'error', text: e.message });
    } finally {
        setLoading(false);
    }
  }

  // Filter staff by service type for the dropdown
  const eligibleStaff = serviceId 
    ? staffList.filter(s => s.service_type === services.find(srv => srv.id === serviceId)?.required_staff_type)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h2 className="text-3xl font-bold tracking-tight">Appointments</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
         {/* Booking Form */}
         <Card className="lg:col-span-1 h-fit">
            <CardHeader>
                <CardTitle>Book Appointment</CardTitle>
                <CardDescription>Schedule a new service.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Customer Name</label>
                    <Input 
                        placeholder="Customer Name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                    />
                </div>
                
                <div className="space-y-2">
                    <label className="text-sm font-medium">Service</label>
                    <div className="relative h-10 w-full">
                       <select
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
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
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                     <div className="space-y-2">
                        <label className="text-sm font-medium">Date</label>
                        <Input 
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Time</label>
                        <Input 
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                        />
                    </div>
                </div>

                {/* Staff Selection with Status */}
                {eligibleStaff.length > 0 && (
                     <div className="space-y-2">
                        <label className="text-sm font-medium">Assign Staff (Optional)</label>
                        <div className="space-y-2 border rounded-md p-2 max-h-48 overflow-y-auto">
                            <div 
                                className={`flex items-center justify-between p-2 rounded cursor-pointer text-sm ${selectedStaffId === "" ? "bg-accent" : "hover:bg-muted"}`}
                                onClick={() => setSelectedStaffId("")}
                            >
                                <span>Auto-assign / First Available</span>
                            </div>
                            {eligibleStaff.map(s => {
                                const load = staffLoads[s.id] || 0;
                                const isFull = load >= s.daily_capacity;
                                const isConflict = conflicts[s.id];
                                let statusColor = "text-green-600";
                                let statusText = `${load}/${s.daily_capacity}`;
                                
                                if (isConflict) {
                                    statusColor = "text-red-600";
                                    statusText = "Conflict";
                                } else if (isFull) {
                                    statusColor = "text-orange-600";
                                    statusText = "Full";
                                }

                                return (
                                    <div 
                                        key={s.id}
                                        className={`flex items-center justify-between p-2 rounded cursor-pointer text-sm ${selectedStaffId === s.id ? "bg-accent" : "hover:bg-muted"}`}
                                        onClick={() => setSelectedStaffId(s.id)}
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-medium">{s.name}</span>
                                            {isConflict && <span className="text-xs text-red-500">Already booked at time</span>}
                                        </div>
                                        <span className={`text-xs font-bold ${statusColor}`}>
                                            {statusText}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
                
                {message && (
                    <div className={`p-3 rounded-md text-sm ${
                        message.type === 'error' ? 'bg-red-100 text-red-800' : 
                        message.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                    }`}>
                        {message.text}
                    </div>
                )}

                <Button onClick={handleCreate} disabled={loading} className="w-full">
                    {loading ? "Scheduling..." : "Schedule Appointment"}
                </Button>
            </CardContent>
         </Card>

         {/* Calendar/List View */}
         <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Schedule for {date}</CardTitle>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Time</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead>Staff</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {appointments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24">No appointments for this date.</TableCell>
                            </TableRow>
                        ) : (
                            appointments.map((appt) => (
                                <TableRow key={appt.id}>
                                    <TableCell>{appt.start_time} - {appt.end_time}</TableCell>
                                    <TableCell className="font-medium">{appt.customer_name}</TableCell>
                                    <TableCell>{appt.services?.name}</TableCell>
                                    <TableCell>{appt.staff?.name || <Badge variant="destructive">Unassigned</Badge>}</TableCell>
                                    <TableCell>
                                         <Badge variant={
                                             appt.status === 'SCHEDULED' ? 'default' :
                                             appt.status === 'COMPLETED' ? 'secondary' :
                                             'destructive'
                                         }>
                                            {appt.status}
                                         </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                 </Table>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
