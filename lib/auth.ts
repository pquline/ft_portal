import * as jose from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const FORTYTWO_AUTH_URL = 'https://api.intra.42.fr/oauth/authorize';

export interface SessionData {
  accessToken: string;
  login?: string;
  displayname?: string;
  id?: number;
  profile_picture?: string;
  created_at?: string;
}

export async function getAuthUrl(redirectUri: string): Promise<string> {
  const params = new URLSearchParams({
    client_id: process.env.FORTYTWO_CLIENT_ID!,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'public',
  });

  return `${FORTYTWO_AUTH_URL}?${params.toString()}`;
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");
  const userCookie = cookieStore.get("user");

  if (!sessionCookie || !userCookie) {
    return null;
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload: sessionPayload } = await jose.jwtVerify(sessionCookie.value, secret);
    const { payload: userPayload } = await jose.jwtVerify(userCookie.value, secret);

    if (!sessionPayload.accessToken) {
      return null;
    }

    const now = Math.floor(Date.now() / 1000);
    if (sessionPayload.exp && sessionPayload.exp < now) {
      return null;
    }

    return {
      ...userPayload,
      accessToken: sessionPayload.accessToken as string
    };
  } catch {
    return null;
  }
}

export async function getToken(request: NextRequest) {
  const sessionCookie = request.cookies.get("session");
  if (!sessionCookie) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jose.jwtVerify(sessionCookie.value, secret);
    return payload.accessToken as string;
  } catch {
    return null;
  }
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
