import { NextRequest, NextResponse } from 'next/server';
import { getToken, refreshAndUpdateSession, createSecureCookie } from '@/lib/auth';
import * as jose from 'jose';

export async function POST(request: NextRequest) {
  try {
    const tokens = await getToken(request);
    if (!tokens) {
      return NextResponse.json({ error: 'No token found' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const sessionCookie = request.cookies.get('session');

    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'No session found' }, { status: 401 });
    }

    const payload = jose.decodeJwt(sessionCookie.value);
    const refreshResult = await refreshAndUpdateSession(payload, secret);

    if (!refreshResult) {
      return NextResponse.json({ error: 'Failed to refresh token' }, { status: 401 });
    }

    const response = NextResponse.json({
      accessToken: refreshResult.tokens.accessToken
    });

    const cookie = createSecureCookie(
      "session",
      refreshResult.response.cookies.get('session')?.value || ''
    );
    response.cookies.set(cookie.name, cookie.value, cookie.options);

    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error refreshing token:', errorMessage);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
