import { api } from "./api";
import { User } from "@/types/user";
import axios from "axios";

export async function login(email: string, password: string): Promise<User> {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
}

export async function register(email: string, password: string): Promise<User> {
  try {
    const res = await api.post(
      "/auth/register",
      { email, password },
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new Error(
        err.response?.data?.message || "Registration failed. Try again."
      );
    }
    throw new Error("Registration failed. Try again.");
  }
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
