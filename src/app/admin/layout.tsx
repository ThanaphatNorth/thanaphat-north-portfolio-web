import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase-server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  // If not authenticated and not on login page, redirect to login
  // The login page has its own layout check
  if (!user) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
