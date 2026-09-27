"use client";

import { usePathname } from "next/navigation";
import { AdminNavigation } from "@/components/layout/AdminNavigation";

// Authentication is handled by src/proxy.ts (session + admin allow-list)
// This layout wraps admin pages with navigation (except login page)
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Check if we're on the login page - don't show AdminNavigation
  const isLoginPage = pathname === "/admin/login" || pathname === "/admin/login/";

  // For login page, render without navigation wrapper
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation />
      {children}
    </div>
  );
}
