import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";
import { decodeJwt } from "jose";

const FORTYTWO_AUTH_URL = 'https://api.intra.42.fr/oauth/authorize';
const TOKEN_REFRESH_URL = 'https://api.intra.42.fr/oauth/token';
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second
const TOKEN_EXPIRY = 7200; // 2 hours in seconds

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

interface JWTPayload {
  accessToken?: string;
  refreshToken?: string;
  exp?: number;
  [key: string]: unknown;
}

interface RefreshResult {
  tokens: TokenPair;
  response: NextResponse;
}

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
}

interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax' | 'strict' | 'none';
  path: string;
  domain?: string;
  expires?: Date;
}

const createSecureCookie = (
  name: string,
  value: string,
  expires?: Date
): { name: string; value: string; options: CookieOptions } => ({
  name,
  value,
  options: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    domain: process.env.NODE_ENV === 'production' ? undefined : 'localhost',
    ...(expires && { expires })
  }
});

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
    const sessionPayload = decodeJwt(sessionCookie.value);

    if (sessionPayload.exp && sessionPayload.exp < Math.floor(Date.now() / 1000)) {
      const result = await refreshAndUpdateSession(sessionPayload as JWTPayload, secret);
      if (!result) return null;

      const { payload: newSessionPayload } = await jose.jwtVerify(result.tokens.accessToken, secret);
      const { payload: userPayload } = await jose.jwtVerify(userCookie.value, secret);

      return {
        ...userPayload,
        accessToken: newSessionPayload.accessToken as string
      };
    }

    const { payload: verifiedSessionPayload } = await jose.jwtVerify(sessionCookie.value, secret);
    const { payload: userPayload } = await jose.jwtVerify(userCookie.value, secret);

    if (!verifiedSessionPayload.accessToken) {
      return null;
    }

    return {
      ...userPayload,
      accessToken: verifiedSessionPayload.accessToken as string
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Session verification failed:', errorMessage);
    return null;
  }
}

export async function refreshToken(token: string, retryCount = 0): Promise<string | null> {
  try {
    const response = await fetch(TOKEN_REFRESH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        client_id: process.env.FORTYTWO_CLIENT_ID,
        client_secret: process.env.FORTYTWO_CLIENT_SECRET,
        refresh_token: token,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error('Token refresh failed:', error);

      if (response.status === 401 || response.status === 403) {
        return null;
      }

      if (retryCount < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));
        return await refreshToken(token, retryCount + 1);
      }

      return null;
    }

    const data = await response.json() as TokenResponse;
    if (!data.access_token) {
      console.error('No access token in refresh response');
      return null;
    }

    return data.access_token;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error refreshing token:', errorMessage);

    if (retryCount < MAX_RETRIES) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));
      return await refreshToken(token, retryCount + 1);
    }

    return null;
  }
}

export async function refreshAndUpdateSession(payload: JWTPayload, secret: Uint8Array): Promise<RefreshResult | null> {
  if (!payload.refreshToken) {
    console.error('No refresh token available');
    return null;
  }

  const newToken = await refreshToken(payload.refreshToken);
  if (!newToken) {
    console.error('Failed to refresh token');
    return null;
  }

  try {
    const newPayload = {
      ...payload,
      accessToken: newToken,
      exp: Math.floor(Date.now() / 1000) + TOKEN_EXPIRY,
    };

    const newSessionToken = await new jose.SignJWT(newPayload)
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('2h')
      .sign(secret);

    const response = NextResponse.next();
    const cookie = createSecureCookie("session", newSessionToken);
    response.cookies.set(cookie.name, cookie.value, cookie.options);

    return {
      tokens: {
        accessToken: newToken,
        refreshToken: payload.refreshToken
      },
      response
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error creating new session token:', errorMessage);
    return null;
  }
}

export async function getToken(request: NextRequest): Promise<TokenPair | null> {
  const sessionCookie = request.cookies.get("session");
  if (!sessionCookie) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const payload = decodeJwt(sessionCookie.value);

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      const result = await refreshAndUpdateSession(payload as JWTPayload, secret);
      return result?.tokens ?? null;
    }

    const { payload: verifiedPayload } = await jose.jwtVerify(sessionCookie.value, secret);

    return {
      accessToken: verifiedPayload.accessToken as string,
      refreshToken: verifiedPayload.refreshToken as string
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Token verification failed:', errorMessage);
    return null;
  }
}

export async function setToken(token: string) {
  const response = NextResponse.json({ success: true });
  const cookie = createSecureCookie("session", token);
  response.cookies.set(cookie.name, cookie.value, cookie.options);
  return response;
}

export async function clearToken() {
  const response = NextResponse.json({ success: true });
  const cookie = createSecureCookie("session", "", new Date(0));
  response.cookies.set(cookie.name, cookie.value, cookie.options);
  return response;
}
