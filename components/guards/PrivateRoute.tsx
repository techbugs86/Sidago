"use client";

import { useAuth } from "@/providers/AuthProvider";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading, navigations } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const hasAccessToRoute = navigations.some((nav) => nav.href === pathname);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
      return;
    }

    if (!isLoading && user && !hasAccessToRoute) {
      router.replace("/403"); // or /dashboard fallback
    }
  }, [user, isLoading, hasAccessToRoute, router]);

  if (isLoading) return null;

  if (!user) return null;

  if (!hasAccessToRoute) return null;

  return <>{children}</>;
}
