import { getSession } from "@/lib/auth";
import { sendDiscordErrorNotification } from "@/lib/utils";
import { NextResponse } from 'next/server';

export async function GET() {
  // Return mock session in development
  if (process.env.NODE_ENV !== 'production') {
    return NextResponse.json({
      user: {
        id: 1,
        login: 'dev_user',
        first_name: 'Dev',
        last_name: 'User',
        image: {
          link: 'https://via.placeholder.com/150'
        }
      },
      accessToken: 'dev_mock_token',
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    });
  }

  try {
    const session = await getSession();
    if (!session) {
      return new NextResponse(null, { status: 401 });
    }

    // Check if session was refreshed and needs cookie update
    if (session._newSessionToken) {
      const { _newSessionToken, ...sessionData } = session;
      const response = NextResponse.json(sessionData);
      response.cookies.set("session", _newSessionToken, {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        path: "/",
        maxAge: 24 * 60 * 60,
        sameSite: "lax",
        domain: process.env.NODE_ENV === "production" ? undefined : "localhost"
      });
      return response;
    }

    return NextResponse.json(session);
  } catch (error) {
    await sendDiscordErrorNotification(`Session verification error: ${error instanceof Error ? error.message : String(error)}`);
    return new NextResponse(null, { status: 500 });
  }
}
