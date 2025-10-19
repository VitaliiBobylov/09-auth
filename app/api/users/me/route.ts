import { NextResponse } from "next/server";
import { api } from "@/lib/api/api";

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";

    const res = await api.get("/users/me", {
      headers: { Cookie: cookieHeader },
      withCredentials: true,
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
