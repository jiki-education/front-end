"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/auth/authStore";
import { showWelcomeModal } from "@/lib/modal";
import { checkFlag, setFlag } from "@/lib/api/flags";

const WELCOME_FLAG_KEY = "welcome_modal";

/**
 * Shows the welcome video modal once per user, tracked via the flags API
 * (with a localStorage cache).
 */
export function WelcomeModalHandler() {
  const { hasCheckedAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!hasCheckedAuth || !isAuthenticated) {
      return;
    }

    void (async () => {
      const flagged = await checkFlag(WELCOME_FLAG_KEY);
      if (flagged) {
        return;
      }

      void setFlag(WELCOME_FLAG_KEY);
      showWelcomeModal();
    })();
  }, [hasCheckedAuth, isAuthenticated]);

  return null;
}
