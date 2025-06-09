import { NextResponse } from 'next/server';

export async function GET() {
  const response = NextResponse.redirect(new URL('/auth', process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'));
  response.cookies.set('user', '', { path: '/', expires: new Date(0), sameSite: 'lax' });
  response.cookies.set('session', '', { path: '/', expires: new Date(0), sameSite: 'lax' });
  return response;
}
