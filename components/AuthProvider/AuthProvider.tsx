"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { checkSession, getMe } from "@/lib/api/clientApi";
import { useRouter, usePathname } from "next/navigation";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [loading, setLoading] = useState(true);
  const { setUser, clearAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function initAuth() {
      try {
        const sessionValid = await checkSession();

        if (sessionValid) {
          const user = await getMe();
          setUser(user);
          if (
            pathname.startsWith("/sign-in") ||
            pathname.startsWith("/sign-up")
          ) {
            router.push("/");
          }
        } else {
          clearAuth();
          if (
            pathname.startsWith("/profile") ||
            pathname.startsWith("/notes")
          ) {
            router.push("/sign-in");
          }
        }
      } catch {
        clearAuth();
        if (pathname.startsWith("/profile") || pathname.startsWith("/notes")) {
          router.push("/sign-in");
        }
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, [pathname, setUser, clearAuth, router]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
          fontSize: "1.2rem",
        }}
      >
        Loading...
      </div>
    );
  }
  return <>{children}</>;
}
