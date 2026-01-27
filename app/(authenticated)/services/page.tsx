"use client";

import { useEffect, useState } from "react";
import { getServices, createService } from "@/lib/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Briefcase } from "lucide-react";
import { logActivity } from "@/lib/logs";

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("30");
  const [requiredStaffType, setRequiredStaffType] = useState("Doctor");
  const [loading, setLoading] = useState(false);

  async function loadServices() {
    try {
        const data = await getServices();
        setServices(data || []);
    } catch (e) {
        console.error("Failed to load services", e);
    }
  }

  async function handleAdd() {
    if (!name) return;
    setLoading(true);
    await createService({
      name,
      duration: parseInt(duration),
      required_staff_type: requiredStaffType,
    });
    await logActivity(`Created new service: ${name} (${duration} min)`);
    setName("");
    setLoading(false);
    loadServices();
  }

  useEffect(() => {
    loadServices();
  }, []);

  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
         <h2 className="text-3xl font-bold tracking-tight">Services</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Add New Service</CardTitle>
                <CardDescription>Define services that can be booked.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Service Name</label>
                    <Input 
                        placeholder="General Consultation" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                    />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Duration (min)</label>
                         <div className="relative h-10 w-full">
                            <select
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                            >
                                <option value="15">15 mins</option>
                                <option value="30">30 mins</option>
                                <option value="45">45 mins</option>
                                <option value="60">60 mins</option>
                            </select>
                         </div>
                    </div>
                     <div className="space-y-2">
                        <label className="text-sm font-medium">Required Role</label>
                        <div className="relative h-10 w-full">
                            <select
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                                value={requiredStaffType}
                                onChange={(e) => setRequiredStaffType(e.target.value)}
                            >
                                <option value="Doctor">Doctor</option>
                                <option value="Consultant">Consultant</option>
                                <option value="Support Agent">Support Agent</option>
                                <option value="Stylist">Stylist</option>
                                <option value="Technician">Technician</option>
                            </select>
                        </div>
                    </div>
                 </div>
                <Button onClick={handleAdd} disabled={loading} className="w-full">
                    {loading ? "Creating..." : "Create Service"}
                </Button>
            </CardContent>
        </Card>
      </div>

      <Card>
          <CardHeader>
              <CardTitle>Available Services</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Service Name</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Required Staff</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                     {services.length === 0 ? (
                        <TableRow>
                           <TableCell colSpan={3} className="text-center h-48">
                               <div className="flex flex-col items-center justify-center text-muted-foreground">
                                   <Briefcase className="h-8 w-8 mb-2 opacity-20" />
                                   <p>No services defined.</p>
                                   <p className="text-xs">Create services to enable booking.</p>
                               </div>
                           </TableCell>
                        </TableRow>
                    ) : (
                        services.map((s) => (
                            <TableRow key={s.id}>
                                <TableCell className="font-medium">{s.name}</TableCell>
                                <TableCell>{s.duration} mins</TableCell>
                                <TableCell>{s.required_staff_type}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
          </CardContent>
      </Card>
    </div>
  );
}
