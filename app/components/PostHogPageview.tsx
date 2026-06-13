"use client";

import { useAuthStore } from "@/lib/auth/authStore";
import { initPostHog, posthog } from "@/lib/posthog";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function PostHogPageview() {
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) return;

    initPostHog();
    if (!pathname || pathname === lastPath.current) return;
    lastPath.current = pathname;
    posthog.capture("$pageview", { $pathname: pathname });
  }, [pathname, isAuthenticated]);

  return null;
}
