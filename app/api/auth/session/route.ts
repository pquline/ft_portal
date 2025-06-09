import { NextResponse } from 'next/server';
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return new NextResponse(null, { status: 401 });
    }
    return NextResponse.json(session);
  } catch (error) {
    console.error("Session error:", error);
    return new NextResponse(null, { status: 500 });
  }
}
