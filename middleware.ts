import * as jose from 'jose';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { refreshAndUpdateSession } from './lib/auth';

const PUBLIC_PATHS = [
  '/auth',
  '/api/auth',
  '/_next',
  '/favicon.ico',
  '/manifest.json',
  '.png',
  '.ico'
] as const;

const isPublicPath = (path: string): boolean => {
  return PUBLIC_PATHS.some(publicPath =>
    path === publicPath ||
    path.startsWith(publicPath) ||
    path.endsWith(publicPath)
  );
};

const createAuthRedirect = (req: NextRequest): NextResponse => {
  const response = NextResponse.redirect(new URL('/auth', req.url));
  response.cookies.delete('session');
  response.cookies.delete('user');
  return response;
};

const createUnauthorizedResponse = (): NextResponse => {
  return new NextResponse(
    JSON.stringify({ error: 'Unauthorized' }),
    {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};

const setSecureCookie = (
  response: NextResponse,
  name: string,
  value: string
): void => {
  response.cookies.set(name, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    domain: process.env.NODE_ENV === 'production' ? undefined : 'localhost'
  });
};

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (isPublicPath(path)) {
    return NextResponse.next();
  }

  const sessionCookie = req.cookies.get('session');
  const userCookie = req.cookies.get('user');

  if (path.startsWith('/api/')) {
    if (!sessionCookie?.value && !userCookie?.value) {
      return createUnauthorizedResponse();
    }
    return NextResponse.next();
  }

  if (sessionCookie?.value) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const payload = jose.decodeJwt(sessionCookie.value);

      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        const refreshResult = await refreshAndUpdateSession(payload, secret);
        if (refreshResult) {
          const response = NextResponse.next();
          setSecureCookie(response, 'session', refreshResult.tokens.accessToken);
          return response;
        }
        return createAuthRedirect(req);
      }

      const { payload: verifiedPayload } = await jose.jwtVerify(sessionCookie.value, secret);
      const response = NextResponse.next();

      if (sessionCookie.value !== verifiedPayload.accessToken) {
        setSecureCookie(response, 'session', sessionCookie.value);
      }

      if (userCookie?.value) {
        setSecureCookie(response, 'user', userCookie.value);
      }

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Session verification failed:', errorMessage);
      return createAuthRedirect(req);
    }
  }

  return createAuthRedirect(req);
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
