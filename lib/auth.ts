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
  _newSessionToken?: string;
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

export async function refreshToken(refreshToken: string): Promise<{ access_token: string; refresh_token: string } | null> {
  try {
    const tokenResponse = await fetch("https://api.intra.42.fr/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Host: "api.intra.42.fr",
      },
      body: JSON.stringify({
        grant_type: "refresh_token",
        client_id: process.env.FORTYTWO_CLIENT_ID,
        client_secret: process.env.FORTYTWO_CLIENT_SECRET,
        refresh_token: refreshToken,
      }),
    });

    if (!tokenResponse.ok) {
      return null;
    }

    return await tokenResponse.json();
  } catch {
    return null;
  }
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

    if (sessionPayload.refreshToken && sessionPayload.accessTokenExpiresAt) {
      const expiresAt = new Date(sessionPayload.accessTokenExpiresAt as string);
      const now = new Date();

      if (expiresAt.getTime() - now.getTime() < 5 * 60 * 1000) {
        const refreshedTokens = await refreshToken(sessionPayload.refreshToken as string);
        if (refreshedTokens) {
          const newSessionToken = await new jose.SignJWT({
            accessToken: refreshedTokens.access_token,
            refreshToken: refreshedTokens.refresh_token,
            accessTokenExpiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours
          })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("24h")
            .sign(secret);

          return {
            ...userPayload,
            accessToken: refreshedTokens.access_token,
            _newSessionToken: newSessionToken // Flag to indicate session needs updating
          };
        }
      }
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
