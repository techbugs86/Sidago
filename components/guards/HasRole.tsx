"use client";

import { useAuth } from "@/providers/AuthProvider";

export function HasRole({
  name,
  children,
  fallback = null,
}: {
  name: string | string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { user } = useAuth();

  if (!user) return fallback;

  const roles = Array.isArray(name) ? name : [name];
  if (!roles.includes(user.role)) {
    return fallback;
  }

  return <>{children}</>;
}
