"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useAuthStore } from "@/lib/auth/authStore";
import { ApiError } from "@/lib/api/client";
import { OTPInput } from "@/components/ui/OTPInput";
import authStyles from "./AuthForm.module.css";
import styles from "./TwoFactorVerifyForm.module.css";

interface TwoFactorVerifyFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  onSessionExpired: () => void;
}

export function TwoFactorVerifyForm({ onSuccess, onCancel, onSessionExpired }: TwoFactorVerifyFormProps) {
  const { verify2FA, isLoading } = useAuthStore();
  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      return;
    }

    setError(null);
    try {
      await verify2FA(otpCode);
      onSuccess();
    } catch (err) {
      console.error("2FA verification failed:", err);
      if (err instanceof ApiError) {
        const errorData = err.data as { error?: { type?: string; message?: string } } | undefined;
        if (errorData?.error?.type === "session_expired") {
          onSessionExpired();
          return;
        }
        setError(errorData?.error?.message || "Invalid verification code");
      } else {
        setError("Verification failed. Please try again.");
      }
      setOtpCode("");
    }
  };

  return (
    <div className={authStyles.leftSide}>
      <div className={authStyles.formContainer}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1>Two-Factor Authentication</h1>
            <p>Enter the 6-digit code from your authenticator app.</p>
          </header>

          <form onSubmit={handleSubmit}>
            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.otpSection}>
              <label>Verification code</label>
              <OTPInput value={otpCode} onChange={setOtpCode} disabled={isLoading} hasError={!!error} autoFocus />
            </div>

            <div className={styles.actions}>
              <button
                type="submit"
                className="ui-btn ui-btn-large ui-btn-primary"
                style={{ width: "100%" }}
                disabled={isLoading || otpCode.length !== 6}
              >
                {isLoading ? "Verifying..." : "Verify"}
              </button>

              <button
                type="button"
                onClick={onCancel}
                className="ui-btn ui-btn-large ui-btn-secondary"
                style={{ width: "100%" }}
                disabled={isLoading}
              >
                Cancel and sign in again
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
