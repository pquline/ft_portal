import * as jose from "jose";
import { NextRequest, NextResponse } from "next/server";
import { createSecureCookie } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
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
      exp: Math.floor(Date.now() / 1000) + 7200, // 2 hours
    })
      .setProtectedHeader({ alg })
      .setExpirationTime("2h")
      .sign(secret);

    const userToken = await new jose.SignJWT({
      profile_picture: userProfile.image.link,
      login: userProfile.login,
      displayname: userProfile.displayname,
      id: userProfile.id,
      created_at: userProfile.created_at,
    })
      .setProtectedHeader({ alg })
      .setExpirationTime("2h")
      .sign(secret);

    const response = NextResponse.redirect(new URL("/", req.url));

    const sessionCookie = createSecureCookie("session", sessionToken);
    const userCookie = createSecureCookie("user", userToken);

    response.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.options);
    response.cookies.set(userCookie.name, userCookie.value, userCookie.options);

    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("An unexpected error occurred:", errorMessage);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
