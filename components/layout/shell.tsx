"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { cn } from "@/lib/utils";

export function Shell({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background font-sans">
      {/* Mobile Sidebar Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden transition-opacity",
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      
      {/* Sidebar - Fixed on mobile, Static on desktop */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform lg:translate-x-0 lg:relative lg:inset-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar onMobileItemClick={() => setIsMobileMenuOpen(false)} />
      </aside>

      <div className="flex flex-col flex-1 w-full min-h-screen">
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
