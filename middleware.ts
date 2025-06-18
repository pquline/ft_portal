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
      statusText: 'Unauthorized',
      headers: {
        'Content-Type': 'application/json',
        'WWW-Authenticate': 'Bearer',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    }
  );
};

const setSecureCookie = (
  response: NextResponse,
  name: string,
  value: string
): void => {
  if (value.length > 4096) {
    console.error(`Cookie ${name} exceeds size limit`);
    return;
  }

  response.cookies.set(name, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    domain: process.env.NODE_ENV === 'production' ? undefined : 'localhost'
  });
};

const logSecurityEvent = (event: string, data: Record<string, unknown>) => {
  console.error(`[SECURITY] ${event}:`, {
    timestamp: new Date().toISOString(),
    ...data
  });
};

const TOKEN_REFRESH_THRESHOLD = 300;

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (isPublicPath(path)) {
    return NextResponse.next();
  }

  const sessionCookie = req.cookies.get('session');
  const userCookie = req.cookies.get('user');

  if (path.startsWith('/api/')) {
    if (!sessionCookie?.value && !userCookie?.value) {
      logSecurityEvent('Unauthorized API access', { path });
      return createUnauthorizedResponse();
    }
    return NextResponse.next();
  }

  if (sessionCookie?.value) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jose.jwtVerify(sessionCookie.value, secret);

      if (payload.exp &&
          (payload.exp < Math.floor(Date.now() / 1000) ||
           payload.exp < Math.floor(Date.now() / 1000) + TOKEN_REFRESH_THRESHOLD)) {
        const userId = payload.sub as string;
        const refreshResult = await refreshAndUpdateSession(payload as jose.JWTPayload, secret, userId);
        if (refreshResult) {
          const response = NextResponse.next();
          setSecureCookie(response, 'session', refreshResult.response.cookies.get('session')?.value || '');
          if (userCookie?.value) {
            setSecureCookie(response, 'user', userCookie.value);
          }
          return response;
        }
        logSecurityEvent('Token refresh failed', { userId });
        return createAuthRedirect(req);
      }

      const response = NextResponse.next();
      if (userCookie?.value) {
        setSecureCookie(response, 'user', userCookie.value);
      }

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logSecurityEvent('Session verification failed', {
        error: errorMessage,
        path
      });
      return createAuthRedirect(req);
    }
  }

  logSecurityEvent('No session cookie', { path });
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
