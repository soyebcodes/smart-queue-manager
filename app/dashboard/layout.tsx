import type { Metadata } from "next";
import { Shell } from "@/components/layout/shell";

export const metadata: Metadata = {
  title: "Dashboard - Smart Queue Manager",
  description: "Manage appointments and staff",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Shell>{children}</Shell>;
}
