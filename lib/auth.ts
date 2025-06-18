import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

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

export async function getSession() {
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

    return {
      ...userPayload,
      accessToken: sessionPayload.accessToken
    };
  } catch {
    return null;
  }
}

export async function refreshToken(refreshToken: string): Promise<string | null> {
  try {
    const response = await fetch('https://api.intra.42.fr/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        client_id: process.env.FORTYTWO_CLIENT_ID,
        client_secret: process.env.FORTYTWO_CLIENT_SECRET,
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}

export async function getToken(request: NextRequest) {
  const sessionCookie = request.cookies.get("session");
  if (!sessionCookie) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jose.jwtVerify(sessionCookie.value, secret);

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      if (payload.refreshToken) {
        const newToken = await refreshToken(payload.refreshToken as string);
        if (newToken) {
          const newPayload = {
            ...payload,
            accessToken: newToken,
            exp: Math.floor(Date.now() / 1000) + 7200, // 2 hours from now
          };

          const newSessionToken = await new jose.SignJWT(newPayload)
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('2h')
            .sign(secret);

          const response = NextResponse.next();
          response.cookies.set({
            name: "session",
            value: newSessionToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
          });

          return {
            accessToken: newToken,
            refreshToken: payload.refreshToken
          };
        }
      }
      return null;
    }

    return {
      accessToken: payload.accessToken as string,
      refreshToken: payload.refreshToken as string
    };
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
