"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, Calendar, Briefcase, ListOrdered } from "lucide-react";

interface SidebarProps {
  onMobileItemClick?: () => void;
}

const sidebarItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Appointments", href: "/appointments", icon: Calendar },
  { title: "Queue", href: "/queue", icon: ListOrdered },
  { title: "Staff", href: "/staff", icon: Users },
  { title: "Services", href: "/services", icon: Briefcase },
];

export function Sidebar({ onMobileItemClick }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-full h-full bg-card border-r">
      <div className="flex h-[60px] items-center px-6 border-b">
        <Link className="flex items-center gap-2 font-bold text-primary" href="/" onClick={onMobileItemClick}>
          <LayoutDashboard className="h-6 w-6" />
          <span>Smart Queue</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-6">
        <nav className="grid items-start px-4 text-sm font-medium gap-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileItemClick}
            >
                <span className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all",
                  pathname === item.href 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}>
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4 border-t italic text-[10px] text-muted-foreground text-center">
        v1.0.0 Refined Build
      </div>
    </div>
  );
}
