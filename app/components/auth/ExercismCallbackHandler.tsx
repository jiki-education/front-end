"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/auth/authStore";
import { useAuth } from "@/lib/auth/useAuth";
import { consumeExercismCallback } from "@/lib/auth/exercism";
import { AuthErrorCard } from "./AuthErrorCard";
import { AuthPendingMessage } from "./AuthPendingMessage";

export function ExercismCallbackHandler() {
  const t = useTranslations("auth.exercismCallback");
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
        const message = err instanceof Error ? err.message : t("authFailed");
        setError(message);
      }
    };

    void completeLogin();
  }, [searchParams, exercismLogin, handleAuthResponse, t]);

  if (TwoFactorForm) {
    return TwoFactorForm;
  }

  if (error) {
    return <AuthErrorCard title={t("errorTitle")} message={error} ctaHref="/auth/login" ctaText={t("errorCta")} />;
  }

  return <AuthPendingMessage title={t("pendingTitle")} description={t("pendingDescription")} />;
}
