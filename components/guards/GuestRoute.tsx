"use client";

import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard"); // or role-based redirect
    }
  }, [user, isLoading, router]);

  if (isLoading) return null;

  if (user) return null;

  return <>{children}</>;
}
