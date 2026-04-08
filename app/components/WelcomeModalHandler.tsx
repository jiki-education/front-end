"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/auth/authStore";
import { showWelcomeModal } from "@/lib/modal";

const WELCOME_SEEN_KEY = "jiki_welcome_seen";

/**
 * Shows the welcome video modal once per user (tracked via localStorage).
 * Intended for early superusers. Will be replaced by a DB flag once
 * the onboarding flow is built out.
 */
export function WelcomeModalHandler() {
  const { hasCheckedAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!hasCheckedAuth || !isAuthenticated) {
      return;
    }

    const hasSeen = localStorage.getItem(WELCOME_SEEN_KEY);
    if (hasSeen) {
      return;
    }

    localStorage.setItem(WELCOME_SEEN_KEY, "true");
    showWelcomeModal();
  }, [hasCheckedAuth, isAuthenticated]);

  return null;
}
