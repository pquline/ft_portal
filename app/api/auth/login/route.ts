import { NextResponse } from 'next/server';
import { getAuthUrl } from '@/lib/auth';

export async function GET() {
  try {
    const redirectUri = process.env.NEXT_PUBLIC_URL + '/api/auth/callback';
    const url = await getAuthUrl(redirectUri);
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to generate auth URL' },
      { status: 500 }
    );
  }
}
