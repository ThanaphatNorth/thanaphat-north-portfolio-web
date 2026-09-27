/**
 * Admin allow-list — app layer. Keep in lockstep with the DB layer:
 * every email here must also be a row in public.admin_users
 * (supabase/migrations/20260928000000_admin_only_writes.sql), otherwise the
 * dashboard opens but every write is rejected by RLS.
 *
 * Admin allow-list. Set ADMIN_EMAILS (comma-separated) in the environment.
 * Falls back to ADMIN_EMAIL, then to the site owner's address, so an unset env
 * never opens the dashboard to every signed-in Supabase user.
 */
const FALLBACK_ADMIN = "north.thanaphat@gmail.com";

export function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || FALLBACK_ADMIN;
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAdminEmails().includes(email.toLowerCase());
}
