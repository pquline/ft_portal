import { getSession } from "@/lib/auth";
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return new NextResponse(null, { status: 401 });
    }
    return NextResponse.json(session);
  } catch {
    return new NextResponse(null, { status: 500 });
  }
}
