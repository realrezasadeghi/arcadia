import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware — Route Guard
 *
 * صفحات public: /login، /register
 * همه مسیرهای دیگر نیاز به احراز هویت دارند.
 *
 * چون توکن در localStorage است (client-side)، از یک cookie ساده
 * به نام `is_authenticated` برای بررسی server-side استفاده می‌کنیم.
 * این cookie هنگام login در http-client تنظیم می‌شود.
 */

const PUBLIC_PATHS = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // مسیرهای public — همیشه مجاز
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  if (isPublic) return NextResponse.next();

  // static assets و api routes — رد شوند
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const isAuthenticated = request.cookies.has("is_authenticated");

  if (!isAuthenticated) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
