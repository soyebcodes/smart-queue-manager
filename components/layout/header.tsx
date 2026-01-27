"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function Header() {
const router = useRouter();

const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
};

  return (
    <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40 fixed top-0 right-0 left-0 lg:left-64 z-20 backdrop-blur-md">
      <div className="w-full flex-1">
        <h1 className="font-semibold text-lg">Dashboard</h1>
      </div>
      <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
          <LogOut className="h-4 w-4" />
      </Button>
    </header>
  );
}
