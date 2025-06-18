import { NextRequest, NextResponse } from 'next/server';
import { getToken, refreshToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const token = await getToken(request);
    if (!token) {
      return NextResponse.json({ error: 'No token found' }, { status: 401 });
    }

    const newToken = await refreshToken(token);
    if (!newToken) {
      return NextResponse.json({ error: 'Failed to refresh token' }, { status: 401 });
    }

    return NextResponse.json({ accessToken: newToken });
  } catch (error) {
    console.error('Error refreshing token:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
