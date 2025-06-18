import { NextRequest, NextResponse } from 'next/server';
import { getToken, refreshAndUpdateSession } from '@/lib/auth';
import * as jose from 'jose';
import { JWTPayload } from 'jose';

export async function POST(request: NextRequest) {
  try {
    const tokens = await getToken(request);
    if (!tokens) {
      return NextResponse.json({ error: 'No token found' }, { status: 401 });
    }

    // If we got here, the token was refreshed and we have a new session
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jose.jwtVerify(request.cookies.get("session")!.value, secret);

    const refreshResult = await refreshAndUpdateSession(payload as JWTPayload, secret);
    if (!refreshResult) {
      return NextResponse.json({ error: 'Failed to refresh token' }, { status: 401 });
    }

    // Merge the JSON response with the cookie from refreshAndUpdateSession
    const response = NextResponse.json({ accessToken: refreshResult.tokens.accessToken });
    response.cookies.set(refreshResult.response.cookies.get("session")!);

    return response;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
