"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, Calendar, Briefcase, ListOrdered } from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Appointments",
    href: "/appointments",
    icon: Calendar,
  },
  {
    title: "Queue",
    href: "/queue",
    icon: ListOrdered,
  },
  {
    title: "Staff",
    href: "/staff",
    icon: Users,
  },
  {
    title: "Services",
    href: "/services",
    icon: Briefcase,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden border-r bg-card lg:block w-64 h-full fixed left-0 top-0 bottom-0 z-30">
      <div className="flex flex-col gap-2 h-full">
        <div className="flex h-[60px] items-center px-6">
          <Link className="flex items-center gap-2 font-semibold" href="/">
            <span className="">Smart Queue</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-4 text-sm font-medium">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
              >
                  <span className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground",
                    pathname === item.href ? "bg-muted text-foreground font-medium" : ""
                  )}>
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
             {/* Footer content if needed */}
        </div>
      </div>
    </div>
  );
}
