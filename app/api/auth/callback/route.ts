import { sendDiscordErrorNotification } from "@/lib/utils";
import * as jose from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    await sendDiscordErrorNotification("Code not found in callback");
    return NextResponse.json({ error: "Code not found" }, { status: 400 });
  }

  try {
    const tokenResponse = await fetch("https://api.intra.42.fr/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Host: "api.intra.42.fr",
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        client_id: process.env.FORTYTWO_CLIENT_ID,
        client_secret: process.env.FORTYTWO_CLIENT_SECRET,
        redirect_uri: process.env.NEXT_PUBLIC_URL + '/api/auth/callback',
        code,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error("Error fetching token:", errorData);
      await sendDiscordErrorNotification(`Failed to fetch token: ${JSON.stringify(errorData)}`);
      return NextResponse.json(
        { error: "Failed to fetch token" },
        { status: 500 }
      );
    }

    const tokenData = await tokenResponse.json();

    const userProfileResponse = await fetch("https://api.intra.42.fr/v2/me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userProfileResponse.ok) {
      const errorData = await userProfileResponse.json();
      console.error("Error fetching user profile:", errorData);
      await sendDiscordErrorNotification(`Failed to fetch user profile: ${JSON.stringify(errorData)}`);
      return NextResponse.json(
        { error: "Failed to fetch user profile" },
        { status: 500 }
      );
    }

    const userProfile = await userProfileResponse.json();

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const alg = "HS256";

    const sessionToken = await new jose.SignJWT({
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      accessTokenExpiresAt: new Date(Date.now() + (tokenData.expires_in * 1000)).toISOString(),
    })
      .setProtectedHeader({ alg })
      .setExpirationTime("24h")
      .sign(secret);

    const userToken = await new jose.SignJWT({
      profile_picture: userProfile.image.link,
      login: userProfile.login,
      displayname: userProfile.displayname,
      id: userProfile.id,
      created_at: userProfile.created_at,
    })
      .setProtectedHeader({ alg })
      .setExpirationTime("24h")
      .sign(secret);

    const response = NextResponse.redirect(new URL("/", req.url));
    const cookieOptions = {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      path: "/",
      maxAge: 24 * 60 * 60, // 24 hours in seconds
      sameSite: "lax" as const,
      domain: process.env.NODE_ENV === "production" ? undefined : "localhost"
    };

    response.cookies.set("session", sessionToken, cookieOptions);
    response.cookies.set("user", userToken, cookieOptions);

    await new Promise(resolve => setTimeout(resolve, 100));

    return response;
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    await sendDiscordErrorNotification(`Unexpected error in auth callback: ${error instanceof Error ? error.message : String(error)}`);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
