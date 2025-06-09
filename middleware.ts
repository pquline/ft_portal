import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  console.log("\nMiddleware called for path:", path);
  console.log("Request URL:", req.url);
  console.log("All cookies:", req.cookies.getAll());

  if (
    path === '/auth' ||
    path.startsWith('/api/auth') ||
    path.startsWith('/_next') ||
    path === '/favicon.ico' ||
    path === '/manifest.json' ||
    path.endsWith('.png') ||
    path.endsWith('.ico')
  ) {
    console.log("Allowing access to:", path);
    return NextResponse.next();
  }

  const sessionCookie = req.cookies.get('session');
  const userCookie = req.cookies.get('user');

  console.log("Session cookie found:", !!sessionCookie);
  console.log("User cookie found:", !!userCookie);

  if (path.startsWith('/api/')) {
    if (!sessionCookie?.value && !userCookie?.value) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
    return NextResponse.next();
  }

  if (sessionCookie?.value) {
    try {
      console.log("Verifying session JWT...");
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jose.jwtVerify(sessionCookie.value, secret);
      console.log("Session JWT verification successful");
      console.log("Session payload:", payload);

      const response = NextResponse.next();

      response.cookies.set('session', sessionCookie.value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        domain: process.env.NODE_ENV === 'production' ? undefined : 'localhost'
      });

      if (userCookie?.value) {
        response.cookies.set('user', userCookie.value, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          domain: process.env.NODE_ENV === 'production' ? undefined : 'localhost'
        });
      }

      console.log("Cookies preserved in response");
      return response;
    } catch (error) {
      console.error("Session JWT verification failed:", error);
    }
  }

  if (userCookie?.value) {
    try {
      console.log("Verifying user JWT...");
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jose.jwtVerify(userCookie.value, secret);
      console.log("User JWT verification successful");
      console.log("User payload:", {
        login: payload.login,
        id: payload.id,
        exp: payload.exp
      });

      const response = NextResponse.next();

      response.cookies.set('user', userCookie.value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        domain: process.env.NODE_ENV === 'production' ? undefined : 'localhost'
      });

      if (sessionCookie?.value) {
        response.cookies.set('session', sessionCookie.value, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          domain: process.env.NODE_ENV === 'production' ? undefined : 'localhost'
        });
      }

      console.log("Cookies preserved in response");
      return response;
    } catch (error) {
      console.error("User JWT verification failed:", error);
    }
  }

  console.log('No valid session found, redirecting to /auth');
  const response = NextResponse.redirect(new URL('/auth', req.url));
  response.cookies.delete('session');
  response.cookies.delete('user');
  return response;
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
