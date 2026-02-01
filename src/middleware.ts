import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log("[MIDDLEWARE] ========================================");
  console.log("[MIDDLEWARE] Pathname:", pathname);
  
  // Check if this is the login page (handle with or without trailing slash)
  const isLoginPage = pathname === "/admin/login" || pathname === "/admin/login/";
  
  console.log("[MIDDLEWARE] Is login page:", isLoginPage);
  
  // Skip auth check entirely for login page to prevent any redirect loops
  if (isLoginPage) {
    console.log("[MIDDLEWARE] Skipping auth check for login page - returning next()");
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("[MIDDLEWARE] User from getUser():", user ? `Found (id: ${user.id})` : "null");

  // Handle protected admin routes (login page already handled above)
  if (pathname.startsWith("/admin")) {
    console.log("[MIDDLEWARE] This is an admin route");
    if (!user) {
      // Not authenticated, redirect to login
      console.log("[MIDDLEWARE] No user - REDIRECTING to /admin/login");
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    console.log("[MIDDLEWARE] User authenticated - allowing access");
  }

  console.log("[MIDDLEWARE] Returning supabaseResponse");
  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pdf)$).*)",
  ],
};
