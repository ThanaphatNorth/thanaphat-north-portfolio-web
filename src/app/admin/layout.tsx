// Authentication is handled by middleware.ts
// This layout just wraps admin pages
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
