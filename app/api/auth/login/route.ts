import { NextRequest, NextResponse } from "next/server";
import { api } from "@/lib/api/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();


    const res = await api.post("/auth/login", body, { withCredentials: true });

    const setCookieHeader = res.headers["set-cookie"];
    const response = NextResponse.json(res.data, { status: 200 });

    if (setCookieHeader) {
      response.headers.set("set-cookie", setCookieHeader as unknown as string);
    }

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Login failed" }, { status: 401 });
  }
}
