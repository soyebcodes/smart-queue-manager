import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4">
         <Link href="/login">
            <Button variant="ghost">Login</Button>
         </Link>
      </div>
      
      <main className="w-full max-w-4xl space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Smart Appointment & Queue Manager
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Streamline your service appointments, manage staff availability, and handle customer queues efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
           <Card>
             <CardHeader>
               <CardTitle>Appointments</CardTitle>
               <CardDescription>Easy booking management</CardDescription>
             </CardHeader>
             <CardContent>
               Create, edit, and manage appointments with conflict detection and staff assignment.
             </CardContent>
           </Card>
           
           <Card>
             <CardHeader>
               <CardTitle>Staff Management</CardTitle>
               <CardDescription>Track capacity and status</CardDescription>
             </CardHeader>
             <CardContent>
               Manage staff members, their service types, and daily capacity limits effectively.
             </CardContent>
           </Card>

           <Card>
             <CardHeader>
               <CardTitle>Smart Queue</CardTitle>
               <CardDescription>Handle overflows</CardDescription>
             </CardHeader>
             <CardContent>
               Automatically queue appointments when staff are busy and assign them when available.
             </CardContent>
           </Card>
        </div>

        <div className="flex justify-center gap-4">
          <Link href="/login">
            <Button size="lg">Get Started</Button>
          </Link>
          <Button variant="outline" size="lg">View Documentation</Button>
        </div>
      </main>
    </div>
  );
}
