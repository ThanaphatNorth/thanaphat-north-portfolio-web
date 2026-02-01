// Simple layout for login page - no auth checks here to prevent redirect loops
// Auth is handled by middleware.ts
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
