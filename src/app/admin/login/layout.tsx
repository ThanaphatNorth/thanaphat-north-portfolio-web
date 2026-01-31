import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase-server";

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  // If already authenticated, redirect to admin dashboard
  if (user) {
    redirect("/admin");
  }

  return <>{children}</>;
}
