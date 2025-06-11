import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { verifyJWT } from './lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname === "/" ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname === "/terms" ||
    pathname === "/privacy"
  ) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get("session");
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const result = await verifyJWT(sessionCookie.value);
  if (!result || !result.payload.accessToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
