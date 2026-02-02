"use client";

import { useState } from "react";
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

  const handleSubmit = async (code: string) => {
    if (code.length !== 6 || isLoading) {
      return;
    }

    setError(null);
    try {
      await verify2FA(code);
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

  const handleOtpChange = (value: string) => {
    setOtpCode(value);
    if (value.length === 6) {
      void handleSubmit(value);
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

          <div>
            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.otpSection}>
              <label>Verification code</label>
              <OTPInput value={otpCode} onChange={handleOtpChange} disabled={isLoading} hasError={!!error} autoFocus />
            </div>

            {isLoading && <p className={styles.verifyingText}>Verifying...</p>}

            <div className={styles.actions}>
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
          </div>
        </div>
      </div>
    </div>
  );
}
