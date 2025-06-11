import { getAuthUrl } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const redirectUri = process.env.NEXT_PUBLIC_URL + '/api/auth/callback';
    const url = await getAuthUrl(redirectUri);
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json(
      { error: 'Failed to generate auth URL' },
      { status: 500 }
    );
  }
}
