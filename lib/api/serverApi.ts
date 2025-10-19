import { cookies } from "next/headers";
import { User } from "@/types/user";

const BASE_URL = "https://notehub-api.goit.study";

export async function getMeServer(): Promise<User | null> {
  const cookieStore = cookies();
  const res = await fetch(`${BASE_URL}/users/me`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
    credentials: "include",
  });

  if (!res.ok) return null;
  return res.json();
}

export async function checkSessionServer(): Promise<User | null> {
  const cookieStore = cookies();
  const res = await fetch(`${BASE_URL}/auth/session`, {
    headers: { Cookie: cookieStore.toString() },
    credentials: "include",
  });

  if (!res.ok) return null;
  return res.json();
}

export async function fetchNotesServer(search = "", page = 1, tag?: string) {
  const cookieStore = cookies();
  const params = new URLSearchParams({
    search,
    page: page.toString(),
    perPage: "12",
  });
  if (tag && tag !== "All") params.append("tag", tag);

  const res = await fetch(`${BASE_URL}/notes?${params}`, {
    headers: { Cookie: cookieStore.toString() },
    credentials: "include",
  });

  if (!res.ok) return [];
  return res.json();
}

export async function fetchNoteByIdServer(id: string) {
  const cookieStore = cookies();
  const res = await fetch(`${BASE_URL}/notes/${id}`, {
    headers: { Cookie: cookieStore.toString() },
    credentials: "include",
  });

  if (!res.ok) return null;
  return res.json();
}
