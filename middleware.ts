import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PRIVATE_ROUTES = ["/profile", "/notes"];
const PUBLIC_ROUTES = ["/sign-in", "/sign-up"];

const BASE_URL = "https://notehub-api.goit.study";

async function checkSession(refreshToken: string | undefined) {
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${BASE_URL}/auth/session`, {
      headers: { Cookie: `refreshToken=${refreshToken}` },
      credentials: "include",
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const { pathname } = req.nextUrl;

  let isAuthenticated = false;

  if (accessToken) {
    isAuthenticated = true;
  } else if (refreshToken) {
    isAuthenticated = await checkSession(refreshToken);
  }

  if (isAuthenticated) {
    if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL("/profile", req.url));
    }
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    if (PRIVATE_ROUTES.some((route) => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/notes/:path*",
    "/profile",
    "/notes",
    "/sign-in",
    "/sign-up",
  ],
};
