import { getSession } from "@/lib/auth";
import { sendDiscordErrorNotification } from "@/lib/utils";
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return new NextResponse(null, { status: 401 });
    }
    return NextResponse.json(session);
  } catch (error) {
    await sendDiscordErrorNotification(`Session verification error: ${error instanceof Error ? error.message : String(error)}`);
    return new NextResponse(null, { status: 500 });
  }
}
