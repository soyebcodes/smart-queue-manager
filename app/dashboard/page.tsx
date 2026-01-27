"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, CalendarCheck, AlertCircle } from "lucide-react";
// We will implement real data fetching in later chunks or refine it here.
// For now, let's setup the UI structure as per requirements.

export default function DashboardPage() {
    // Mock data for UI development
    const stats = [
        {
            title: "Total Appointments",
            value: "12",
            description: "Scheduled for today",
            icon: CalendarCheck,
        },
        {
            title: "Pending",
            value: "4",
            description: "Yet to be served",
            icon: Clock,
        },
        {
            title: "Completed",
            value: "8",
            description: "Successfully served",
            icon: Users,
        },
        {
            title: "Waiting Queue",
            value: "3",
            description: "People waiting",
            icon: AlertCircle,
        }
    ];

    const staffLoad = [
        { name: "Riya", current: 4, max: 5, status: "OK" },
        { name: "Farhan", current: 5, max: 5, status: "Booked" },
        { name: "Alex", current: 2, max: 5, status: "OK" },
    ];

    const logs = [
        "12:10 PM — Appointment moved from queue to Farhan.",
        "11:45 AM — Appointment for 'John Doe' auto-assigned to Riya.",
        "11:30 AM — New appointment scheduled for Alice.",
        "11:15 AM — Staff member 'Farhan' marked as 'Booked'.",
        "10:00 AM — System started."
    ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Staff Load Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                {staffLoad.map((staff, i) => (
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
            <div className="space-y-4">
                {logs.map((log, i) => (
                    <div key={i} className="text-sm text-gray-600 dark:text-gray-300 border-l-2 border-gray-200 pl-3 py-1">
                        {log}
                    </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
