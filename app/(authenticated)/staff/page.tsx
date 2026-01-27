"use client";

import { useEffect, useState } from "react";
import { getStaff, createStaff } from "@/lib/staff";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { logActivity } from "@/lib/logs";

export default function StaffPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [serviceType, setServiceType] = useState("Doctor");
  const [loading, setLoading] = useState(false);

  async function loadStaff() {
    try {
      const data = await getStaff();
      setStaff(data || []);
    } catch (error) {
       console.error("Failed to load staff", error);
    }
  }

  async function handleAdd() {
    if (!name) return;
    setLoading(true);
    await createStaff({
      name,
      service_type: serviceType,
      daily_capacity: 5,
      status: "AVAILABLE",
    });
    await logActivity(`Added new staff member: ${name} (${serviceType})`);
    setName("");
    setLoading(false);
    loadStaff();
  }

  useEffect(() => {
    loadStaff();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
         <h2 className="text-3xl font-bold tracking-tight">Staff Management</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
         {/* Create Staff Form */}
         <Card>
            <CardHeader>
                <CardTitle>Add New Staff</CardTitle>
                <CardDescription>Create a new staff member and assign their role.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input 
                        placeholder="John Doe" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Service Type</label>
                    <div className="relative h-10 w-full">
                       <select
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                        value={serviceType}
                        onChange={(e) => setServiceType(e.target.value)}
                      >
                        <option value="Doctor">Doctor</option>
                        <option value="Consultant">Consultant</option>
                        <option value="Support Agent">Support Agent</option>
                        <option value="Stylist">Stylist</option>
                        <option value="Technician">Technician</option>
                      </select>
                      {/* Chevron down icon could be added here for better UI */}
                    </div>
                </div>
                <Button onClick={handleAdd} disabled={loading} className="w-full">
                    {loading ? "Adding..." : "Add Staff Member"}
                </Button>
            </CardContent>
         </Card>

         {/* Info Card or Stats could go here, for now placeholder or nothing */}
      </div>

      <Card>
          <CardHeader>
              <CardTitle>Staff List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {staff.length === 0 ? (
                        <TableRow>
                           <TableCell colSpan={4} className="text-center h-48">
                               <div className="flex flex-col items-center justify-center text-muted-foreground">
                                   <Users className="h-8 w-8 mb-2 opacity-20" />
                                   <p>No staff members found.</p>
                                   <p className="text-xs">Add your first staff member to get started.</p>
                               </div>
                           </TableCell>
                        </TableRow>
                    ) : (
                        staff.map((s) => (
                            <TableRow key={s.id}>
                                <TableCell className="font-medium">{s.name}</TableCell>
                                <TableCell>{s.service_type}</TableCell>
                                <TableCell>{s.daily_capacity} / day</TableCell>
                                <TableCell>
                                    <Badge variant={s.status === "AVAILABLE" ? "default" : "secondary"}>
                                        {s.status}
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
  );
}
