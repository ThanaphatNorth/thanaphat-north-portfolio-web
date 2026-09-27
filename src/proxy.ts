import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isAdminEmail } from "@/lib/admin";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Login page is public; skipping it avoids redirect loops.
  if (pathname === "/admin/login" || pathname === "/admin/login/") {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

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
          supabaseResponse = NextResponse.next({ request });
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

  // Being signed in is not enough: only allow-listed admin emails get in.
  if (!user || !isAdminEmail(user.email)) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = user ? "?error=not_admin" : "";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  // Only admin routes need a session check; public pages stay free of auth round-trips.
  matcher: ["/admin/:path*"],
};
