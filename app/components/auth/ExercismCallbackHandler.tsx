"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ShieldXIcon from "@/icons/shield-x.svg";
import { useAuthStore } from "@/lib/auth/authStore";
import { useAuth } from "@/lib/auth/useAuth";
import { consumeExercismCallback } from "@/lib/auth/exercism";
import styles from "./AuthForm.module.css";

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
    return <ExercismAuthErrorMessage message={error} />;
  }

  return <SigningInMessage />;
}

function SigningInMessage() {
  return (
    <div className={styles.leftSide}>
      <div className={styles.formContainer}>
        <div className={styles.confirmationMessage}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-6"></div>
          <h2>Signing you in...</h2>
          <p className={styles.confirmationCardText} style={{ marginBottom: 0 }}>
            Please wait while we sign you in with Exercism.
          </p>
        </div>
      </div>
    </div>
  );
}

function ExercismAuthErrorMessage({ message }: { message: string }) {
  return (
    <div className={styles.leftSide}>
      <div className={styles.formContainer}>
        <div className={styles.confirmationMessage}>
          <div className={styles.confirmationIconError}>
            <ShieldXIcon />
          </div>
          <h2>Sign in failed</h2>
          <div className={styles.confirmationCard}>
            <p className={styles.confirmationCardText}>{message}</p>
            <Link
              href="/auth/login"
              className="ui-btn ui-btn-large ui-btn-primary"
              style={{ display: "inline-flex", width: "100%", textDecoration: "none" }}
            >
              Back to log in
            </Link>
            <p className={styles.confirmationCardFooter}>
              Need help?{" "}
              <Link href="/articles/support" className="ui-link">
                Contact support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
