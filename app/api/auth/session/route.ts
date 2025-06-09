import { NextResponse } from 'next/server';
import * as jose from 'jose';

export async function GET(request: Request) {
  const session = request.headers.get('cookie')
    ?.split('; ')
    .find(row => row.startsWith('session='))
    ?.split('=')[1];

  if (!session) {
    return NextResponse.json({ error: 'No session found' }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jose.jwtVerify(session, secret);

    if (!payload.accessToken) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    return NextResponse.json({ accessToken: payload.accessToken });
  } catch (error) {
    console.error('Session verification failed:', error);
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }
}
