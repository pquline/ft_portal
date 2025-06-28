import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  // Return mock user in development
  if (process.env.NODE_ENV !== 'production') {
    return NextResponse.json({
      user: {
        id: 1,
        login: 'dev_user',
        first_name: 'Dev',
        last_name: 'User',
        image: {
          link: 'https://via.placeholder.com/150'
        }
      }
    });
  }

  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user");

    if (!userCookie) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const userData = jwtDecode(userCookie.value);
    return NextResponse.json({ user: userData });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
