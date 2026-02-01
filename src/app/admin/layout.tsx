"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AdminNavigation } from "@/components/layout/AdminNavigation";

// Authentication is handled by middleware.ts
// This layout wraps admin pages with navigation (except login page)
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Check if we're on the login page - don't show AdminNavigation
  const isLoginPage = pathname === "/admin/login" || pathname === "/admin/login/";
  
  // Debug logging
  useEffect(() => {
    console.log("[ADMIN LAYOUT] ========================================");
    console.log("[ADMIN LAYOUT] Pathname:", pathname);
    console.log("[ADMIN LAYOUT] Is login page:", isLoginPage);
  }, [pathname, isLoginPage]);
  
  // For login page, render without navigation wrapper
  if (isLoginPage) {
    console.log("[ADMIN LAYOUT] Rendering without AdminNavigation (login page)");
    return <>{children}</>;
  }

  console.log("[ADMIN LAYOUT] Rendering with AdminNavigation");
  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation />
      {children}
    </div>
  );
}
