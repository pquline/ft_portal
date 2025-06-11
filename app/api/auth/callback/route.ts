import * as jose from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/auth", process.env.NEXT_PUBLIC_URL || "http://localhost:3000"));
  }

  try {
    console.log("Starting OAuth callback process...");
    const tokenResponse = await fetch("https://api.intra.42.fr/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        client_id: process.env.FORTYTWO_CLIENT_ID,
        client_secret: process.env.FORTYTWO_CLIENT_SECRET,
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_URL}/api/auth/callback`,
      }),
    });

    if (!tokenResponse.ok) {
      return NextResponse.redirect(new URL("/auth", process.env.NEXT_PUBLIC_URL || "http://localhost:3000"));
    }

    const { access_token } = await tokenResponse.json();
    console.log("Token received successfully");

    const userProfileResponse = await fetch("https://api.intra.42.fr/v2/me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!userProfileResponse.ok) {
      return NextResponse.redirect(new URL("/auth", process.env.NEXT_PUBLIC_URL || "http://localhost:3000"));
    }

    const userProfile = await userProfileResponse.json();
    console.log("User profile fetched:", {
      login: userProfile.login,
      id: userProfile.id,
    });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const sessionToken = await new jose.SignJWT({ accessToken: access_token })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(secret);

    const userToken = await new jose.SignJWT({
      id: userProfile.id,
      login: userProfile.login,
      email: userProfile.email,
      image: userProfile.image?.link,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(secret);

    console.log("Tokens created successfully");

    const response = NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_URL || "http://localhost:3000"));
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
    return NextResponse.redirect(new URL("/auth", process.env.NEXT_PUBLIC_URL || "http://localhost:3000"));
  }
}
