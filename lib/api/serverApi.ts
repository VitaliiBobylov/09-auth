import { cookies } from "next/headers";
import { api } from "@/lib/api/api";
import { User } from "@/types/user";
import { Note } from "@/types/note";
import { AxiosResponse } from "axios";

export async function getMeServer(): Promise<User> {
  const cookieStore = await cookies();

  const res = await api.get<User>("/users/me", {
    headers: { Cookie: cookieStore.toString() },
    withCredentials: true,
  });
  return res.data;
}

export async function checkSessionServer(): Promise<AxiosResponse<User>> {
  const cookieStore = await cookies();

  const res = await api.get<User>("/auth/session", {
    headers: { Cookie: cookieStore.toString() },
    withCredentials: true,
  });
  return res;
}

export async function fetchNotesServer(
  search = "",
  page = 1,
  tag?: string
): Promise<{ totalPages: number; notes: Note[] }> {
  const cookieStore = await cookies();
  const params = new URLSearchParams({
    search,
    page: page.toString(),
    perPage: "12",
  });
  if (tag && tag !== "All") params.append("tag", tag);

  const res = await api.get<{ totalPages: number; notes: Note[] }>(
    `/notes?${params.toString()}`,
    {
      headers: { Cookie: cookieStore.toString() },
      withCredentials: true,
    }
  );
  return res.data;
}

export async function fetchNoteByIdServer(id: string): Promise<Note> {
  const cookieStore = await cookies();

  const res = await api.get<Note>(`/notes/${id}`, {
    headers: { Cookie: cookieStore.toString() },
    withCredentials: true,
  });
  return res.data;
}