import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Code not found" }, { status: 400 });
  }

  try {
    console.log("Starting OAuth callback process...");
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
    console.log("Token received successfully");

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
    console.log("User profile fetched:", {
      login: userProfile.login,
      id: userProfile.id,
    });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const alg = "HS256";

    const sessionToken = await new jose.SignJWT({
      accessToken: tokenData.access_token,
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

    console.log("Tokens created successfully");

    const response = NextResponse.redirect(new URL("/", req.url));
    const cookieOptions = {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      path: "/",
      maxAge: 24 * 60 * 60, // 24 hours in seconds
      sameSite: "lax" as const,
      domain: process.env.NODE_ENV === "production" ? undefined : "localhost"
    };

    console.log("Setting cookies with options:", cookieOptions);
    response.cookies.set("session", sessionToken, cookieOptions);
    response.cookies.set("user", userToken, cookieOptions);
    console.log("Cookies set successfully");

    await new Promise(resolve => setTimeout(resolve, 100));

    return response;
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
