import * as jose from 'jose';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

async function sendDiscordErrorNotification(errorMessage: string) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL_ERROR;

  if (!webhookUrl) {
    console.error("Discord webhook URL not configured");
    return;
  }

  const embed = {
    title: "⚠️ **ft_portal** ⚠️",
    color: 0xFF0000,
    description: "JWT verification failed in middleware.",
    fields: [{
      name: "Error Details",
      value: errorMessage,
      inline: false
    }],
    timestamp: new Date().toISOString()
  };

  const payload = { embeds: [embed] };
  const headers = { "Content-Type": "application/json" };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(payload)
    });

    if (response.status !== 204) {
      console.error(`Failed to send error notification. Status code: ${response.status}`);
    }
  } catch (error) {
    console.error("Failed to send error notification:", error);
  }
}

export async function middleware(req: NextRequest) {
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
      const { payload } = await jose.jwtVerify(sessionCookie.value, secret);

      if (!payload.accessToken) {
        throw new Error("Invalid session payload");
      }

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
      await sendDiscordErrorNotification(`Session JWT verification failed: ${error instanceof Error ? error.message : String(error)}`);
      // Clear invalid cookies
      const response = NextResponse.redirect(new URL('/auth', req.url));
      response.cookies.delete('session');
      response.cookies.delete('user');
      return response;
    }
  }

  if (userCookie?.value) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jose.jwtVerify(userCookie.value, secret);

      if (!payload.login || !payload.id) {
        throw new Error("Invalid user payload");
      }

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
      await sendDiscordErrorNotification(`User JWT verification failed: ${error instanceof Error ? error.message : String(error)}`);
      // Clear invalid cookies
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
