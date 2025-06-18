import { NextRequest, NextResponse } from 'next/server';
import { getToken, refreshToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const tokens = await getToken(request);
    if (!tokens) {
      return NextResponse.json({ error: 'No token found' }, { status: 401 });
    }

    const newToken = await refreshToken(tokens.refreshToken);
    if (!newToken) {
      return NextResponse.json({ error: 'Failed to refresh token' }, { status: 401 });
    }

    const response = NextResponse.json({ accessToken: newToken });

    response.cookies.set({
      name: 'session',
      value: newToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
