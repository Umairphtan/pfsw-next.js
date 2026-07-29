import { NextResponse, type NextRequest } from "next/server";

// IMPORTANT: this is a heuristic, not real auth enforcement.
// Middleware runs on the edge and has no access to the in-memory access
// token or the ability to verify the backend's JWT (no shared secret here).
// All it can see is whether a "refreshToken" cookie exists.
// Real protection still happens server-side: every actual API call is
// verified by the backend's isAuthenticated middleware.
// This just avoids flashing a protected page before redirecting.

const PROTECTED_PATHS = ["/profile"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));
  if (!isProtected) return NextResponse.next();

  const hasRefreshCookie = request.cookies.has("refreshToken");

  if (!hasRefreshCookie) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*"],
};