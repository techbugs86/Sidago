"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { UserRole } from "@/lib/navigation";

export interface MeResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
}

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => api.get<MeResponse>("/auth/me"),
    retry: false,
  });
}
