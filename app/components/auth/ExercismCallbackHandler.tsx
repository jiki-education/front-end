"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/auth/authStore";
import { useAuth } from "@/lib/auth/useAuth";
import { consumeExercismCallback } from "@/lib/auth/exercism";
import { AuthErrorCard } from "./AuthErrorCard";
import { AuthPendingMessage } from "./AuthPendingMessage";

export function ExercismCallbackHandler() {
  const searchParams = useSearchParams();
  const { exercismLogin } = useAuthStore();
  const { handleAuthResponse, TwoFactorForm } = useAuth();

  const [error, setError] = useState<string | null>(null);
  // Authorization codes are single-use, so guard against double execution
  // (e.g. React strict mode running effects twice in development)
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (hasStartedRef.current) {
      return;
    }
    hasStartedRef.current = true;

    const callback = consumeExercismCallback(searchParams.get("code"), searchParams.get("state"));
    if (callback.status === "error") {
      setError(callback.message);
      return;
    }

    const completeLogin = async () => {
      try {
        const result = await exercismLogin(callback.code, callback.codeVerifier);
        handleAuthResponse(result);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Exercism authentication failed";
        setError(message);
      }
    };

    void completeLogin();
  }, [searchParams, exercismLogin, handleAuthResponse]);

  if (TwoFactorForm) {
    return TwoFactorForm;
  }

  if (error) {
    return <AuthErrorCard title="Sign in failed" message={error} ctaHref="/auth/login" ctaText="Back to log in" />;
  }

  return <AuthPendingMessage title="Signing you in..." description="Please wait while we sign you in with Exercism." />;
}
