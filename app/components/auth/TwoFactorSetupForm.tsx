"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useAuthStore } from "@/lib/auth/authStore";
import { ApiError } from "@/lib/api/client";
import { OTPInput } from "@/components/ui/OTPInput";
import authStyles from "./AuthForm.module.css";
import styles from "./TwoFactorSetupForm.module.css";

interface TwoFactorSetupFormProps {
  provisioningUri: string;
  onSuccess: () => void;
  onCancel: () => void;
  onSessionExpired: () => void;
}

export function TwoFactorSetupForm({
  provisioningUri,
  onSuccess,
  onCancel,
  onSessionExpired
}: TwoFactorSetupFormProps) {
  const { setup2FA, isLoading } = useAuthStore();
  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (code: string) => {
    if (code.length !== 6 || isLoading) {
      return;
    }

    setError(null);
    try {
      await setup2FA(code);
      onSuccess();
    } catch (err) {
      console.error("2FA setup failed:", err);
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
            {/* <h1>Set Up Two-Factor Authentication</h1> */}
            <p className="font-semibold">Scan the QR code with your authenticator app to secure your account.</p>
          </header>

          <div className={styles.qrCodeWrapper}>
            <QRCodeSVG value={provisioningUri} size={200} level="M" />
          </div>

          <p className={styles.instructions}>
            Use Google Authenticator, 1Password, Authy, or a similar app to scan the code above.
          </p>

          <div>
            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.otpSection}>
              <label>Enter the 6-digit code from your app</label>
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
