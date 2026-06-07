"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/auth/authStore";
import { showWelcomeModal } from "@/lib/modal";
import { checkSeenFlag, setSeenFlag } from "@/lib/api/seen-flags";

const WELCOME_SEEN_KEY = "welcome_modal";

/**
 * Shows the welcome video modal once per user, tracked via the seen-flags API
 * (with a localStorage cache).
 */
export function WelcomeModalHandler() {
  const { hasCheckedAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!hasCheckedAuth || !isAuthenticated) {
      return;
    }

    void (async () => {
      const seen = await checkSeenFlag(WELCOME_SEEN_KEY);
      if (seen) {
        return;
      }

      void setSeenFlag(WELCOME_SEEN_KEY);
      showWelcomeModal();
    })();
  }, [hasCheckedAuth, isAuthenticated]);

  return null;
}
