import * as jose from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const FORTYTWO_AUTH_URL = 'https://api.intra.42.fr/oauth/authorize';

export async function getAuthUrl(redirectUri: string): Promise<string> {
  const params = new URLSearchParams({
    client_id: process.env.FORTYTWO_CLIENT_ID!,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'public',
  });

  return `${FORTYTWO_AUTH_URL}?${params.toString()}`;
}

export async function verifyJWT(token: string): Promise<jose.JWTVerifyResult | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    return await jose.jwtVerify(token, secret);
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");
  const userCookie = cookieStore.get("user");

  if (!sessionCookie || !userCookie) {
    return null;
  }

  const sessionResult = await verifyJWT(sessionCookie.value);
  const userResult = await verifyJWT(userCookie.value);

  if (!sessionResult || !userResult || !sessionResult.payload.accessToken) {
    return null;
  }

  return {
    ...userResult.payload,
    accessToken: sessionResult.payload.accessToken
  };
}

export async function getToken(request: NextRequest) {
  const sessionCookie = request.cookies.get("session");
  if (!sessionCookie) return null;

  const result = await verifyJWT(sessionCookie.value);
  return result?.payload.accessToken as string | null;
}

export async function setToken(token: string) {
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: "token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  return response;
}

export async function clearToken() {
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: "token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });
  return response;
}
