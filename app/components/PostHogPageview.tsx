"use client";

import { useAuthStore } from "@/lib/auth/authStore";
import { initPostHog, posthog } from "@/lib/posthog";
import { useEffect } from "react";

export default function PostHogPageview() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      posthog.opt_out_capturing();
      return;
    }
    initPostHog();
    posthog.opt_in_capturing();
  }, [isAuthenticated]);

  return null;
}
