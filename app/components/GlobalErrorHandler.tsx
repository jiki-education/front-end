"use client";

import { useEffect } from "react";
import { useErrorHandlerStore } from "@/lib/api/errorHandlerStore";
import { AuthenticationError, NetworkError, RateLimitError } from "@/lib/api/client";
import { showModal, hideModal } from "@/lib/modal";

export function GlobalErrorHandler() {
  const { criticalError } = useErrorHandlerStore();

  // Handle modal display based on error type
  useEffect(() => {
    if (criticalError instanceof NetworkError) {
      showModal("connection-error-modal");
    } else if (criticalError instanceof AuthenticationError) {
      showModal("auth-error-modal");
    } else if (criticalError instanceof RateLimitError) {
      showModal("rate-limit-modal", { retryAfterSeconds: criticalError.retryAfterSeconds });
    } else {
      // Hide any open modal when there's no error
      hideModal();
    }
  }, [criticalError]);

  return null;
}
