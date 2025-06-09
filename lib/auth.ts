import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const FORTYTWO_AUTH_URL = 'https://api.intra.42.fr/oauth/authorize';
const FORTYTWO_TOKEN_URL = 'https://api.intra.42.fr/oauth/token';

export interface FortyTwoToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  created_at: number;
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

export async function getToken(code: string, redirectUri: string): Promise<FortyTwoToken> {
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: process.env.FORTYTWO_CLIENT_ID!,
    client_secret: process.env.FORTYTWO_CLIENT_SECRET!,
    code,
    redirect_uri: redirectUri,
  });

  const response = await fetch(FORTYTWO_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error_description || error.error || 'Failed to get access token');
  }

  return response.json();
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "42",
      name: "42",
      credentials: {
        code: { label: "Code", type: "text" },
        redirectUri: { label: "Redirect URI", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.code || !credentials?.redirectUri) {
          return null;
        }

        try {
          const token = await getToken(credentials.code, credentials.redirectUri);
          return {
            id: "42",
            accessToken: token.access_token,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
