import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Note, CreateNotePayload } from "@/types/note";
import type { User } from "@/types/user";

// === 🔧 Axios Instance ===
export const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "https://notehub-api.goit.study/api",
  withCredentials: true,
});

// === 🧠 Auth ===
export async function login(email: string, password: string): Promise<User> {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
}

export async function register(email: string, password: string): Promise<User> {
  const res = await api.post("/auth/register", { email, password });
  return res.data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function checkSession(): Promise<User | null> {
  const res = await api.get("/auth/session");
  return res.data || null;
}

export async function getMe(): Promise<User> {
  const res = await api.get("/users/me");
  return res.data;
}

export async function updateMe(data: { username: string }): Promise<User> {
  const res = await api.patch("/users/me", data);
  return res.data;
}

// === 🗒️ Notes ===
export interface FetchNotesResponse {
  totalPages: number;
  notes: Note[];
}

// ✅ NoteHub API повертає саме { notes, totalPages }
export async function fetchNotes(
  search = "",
  page = 1,
  tag?: string
): Promise<FetchNotesResponse> {
  const params = new URLSearchParams({
    search,
    page: page.toString(),
    perPage: "12",
  });

  if (tag && tag !== "All") params.append("tag", tag);

  const res = await api.get(`/notes?${params.toString()}`);
  return res.data;
}

export async function fetchNoteById(id: string): Promise<Note | null> {
  try {
    const res = await api.get(`/notes/${id}`);
    return res.data;
  } catch {
    return null;
  }
}

export async function createNote(data: CreateNotePayload): Promise<Note> {
  const res = await api.post("/notes", data);
  return res.data;
}

export async function updateNote(
  id: string,
  data: Partial<CreateNotePayload>
): Promise<Note> {
  const res = await api.patch(`/notes/${id}`, data);
  return res.data;
}

export async function deleteNote(id: string): Promise<void> {
  await api.delete(`/notes/${id}`);
}

// === ⚡ React Query Hooks ===
export function useNotes(search = "", page = 1, tag?: string) {
  return useQuery<FetchNotesResponse>({
    queryKey: ["notes", search, page, tag],
    queryFn: () => fetchNotes(search, page, tag),
  });
}

export function useNote(id: string) {
  return useQuery<Note | null>({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    enabled: !!id,
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newNote: CreateNotePayload) => createNote(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}
