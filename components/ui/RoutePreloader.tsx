"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Preloader } from "./Preloader";
import { useAuth } from "@/providers/AuthProvider";

const MIN_ROUTE_LOADING_MS = 450;

export function RoutePreloader({
  minDurationMs = MIN_ROUTE_LOADING_MS,
}: {
  minDurationMs?: number;
}) {
  const pathname = usePathname();
  const { isLoading } = useAuth();
  const [routeLoading, setRouteLoading] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setRouteLoading(true);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setRouteLoading(false);
    }, minDurationMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [pathname, minDurationMs]);

  const show = isLoading || routeLoading;

  const text = useMemo(() => {
    if (isLoading) return "Checking your session";
    return "Loading page";
  }, [isLoading]);

  if (!show) return null;

  return <Preloader text={text} fullScreen />;
}
