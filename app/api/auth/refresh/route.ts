import { NextRequest, NextResponse } from 'next/server';
import { getToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const tokens = await getToken(request);
    if (!tokens) {
      return NextResponse.json({ error: 'No token found' }, { status: 401 });
    }

    const response = NextResponse.json({ accessToken: tokens.accessToken });
    return response;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
