import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { parse } from "cookie";

const BASE_URL = "https://notehub-api.goit.study";
const PRIVATE_ROUTES = ["/profile", "/notes"];
const PUBLIC_ROUTES = ["/sign-in", "/sign-up"];

async function refreshSession(refreshToken: string | undefined) {
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${BASE_URL}/auth/session`, {
      headers: { Cookie: `refreshToken=${refreshToken}` },
      credentials: "include",
    });
    if (!res.ok) return null;

    const setCookie = res.headers.get("set-cookie");
    return setCookie ? parse(setCookie) : null;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  const { pathname } = req.nextUrl;

  let isAuthenticated = false;

  if (accessToken) {
    isAuthenticated = true;
  } else if (refreshToken) {
    const newTokens = await refreshSession(refreshToken);
    if (newTokens?.accessToken) {
      isAuthenticated = true;

      const response = NextResponse.next();
      if (newTokens.accessToken)
        response.cookies.set("accessToken", newTokens.accessToken, {
          path: "/",
          httpOnly: true,
        });
      if (newTokens.refreshToken)
        response.cookies.set("refreshToken", newTokens.refreshToken, {
          path: "/",
          httpOnly: true,
        });
      return response;
    }
  }

  if (
    !isAuthenticated &&
    PRIVATE_ROUTES.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (
    isAuthenticated &&
    PUBLIC_ROUTES.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
