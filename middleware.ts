import * as jose from 'jose';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  if (process.env.NODE_ENV !== 'production') {
    return NextResponse.next();
  }

  const path = req.nextUrl.pathname;

  if (
    path === '/auth' ||
    path.startsWith('/api/auth') ||
    path.startsWith('/_next') ||
    path === '/favicon.ico' ||
    path === '/manifest.json' ||
    path.endsWith('.png') ||
    path.endsWith('.ico')
  ) {
    return NextResponse.next();
  }

  const sessionCookie = req.cookies.get('session');
  const userCookie = req.cookies.get('user');

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
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jose.jwtVerify(sessionCookie.value, secret);

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

      return response;
    } catch (error) {
      console.error("Session JWT verification failed:", error);
      const response = NextResponse.redirect(new URL('/auth', req.url));
      response.cookies.delete('session');
      response.cookies.delete('user');
      return response;
    }
  }

  if (userCookie?.value) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jose.jwtVerify(userCookie.value, secret);

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

      return response;
    } catch (error) {
      console.error("User JWT verification failed:", error);
      const response = NextResponse.redirect(new URL('/auth', req.url));
      response.cookies.delete('session');
      response.cookies.delete('user');
      return response;
    }
  }

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
