import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
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
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password");
  const isApiRoute = pathname.startsWith("/api");

  if (isApiRoute) {
    return supabaseResponse;
  }

  if (isAuthRoute) {
    if (user) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return supabaseResponse;
  }

  // Protección de rutas: si no hay usuario logueado en ruta no pública
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // TODO: RBAC (Role Based Access Control) using user metadata
  // e.g. user.user_metadata?.role === 'ADMIN'

  return supabaseResponse;
}
