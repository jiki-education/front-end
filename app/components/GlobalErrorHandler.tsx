"use client";

import { useEffect } from "react";
import { useErrorHandlerStore } from "@/lib/api/errorHandlerStore";
import { showModal, hideModal } from "@/lib/modal";
import { AuthenticationError, NetworkError, RateLimitError } from "@/lib/api/client";

export function GlobalErrorHandler() {
  const { criticalError } = useErrorHandlerStore();

  useEffect(() => {
    if (!criticalError) {
      // No error - hide any error modal that might be showing
      hideModal();
      return;
    }

    // Authentication error - show session expired modal
    if (criticalError instanceof AuthenticationError) {
      showModal("session-expired-modal", {
        error: criticalError,
        dismissible: false // Cannot be closed by user
      });
      return;
    }

    // Rate limit error - show rate limit modal with countdown
    if (criticalError instanceof RateLimitError) {
      showModal("rate-limit-modal", {
        error: criticalError,
        dismissible: false // Cannot be closed by user
      });
      return;
    }

    // Network error - show network error modal
    if (criticalError instanceof NetworkError) {
      showModal("network-error-modal", {
        error: criticalError,
        dismissible: false // Cannot be closed by user
      });
      return;
    }
  }, [criticalError]);

  return null; // This component renders nothing
}
