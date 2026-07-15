"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useAuthStore } from "@/lib/auth/authStore";
import { ApiError } from "@/lib/api/client";
import { OTPInput } from "@/components/ui/OTPInput";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("auth.twoFactorSetup");
  const tCommon = useTranslations("common");
  const tShared = useTranslations("auth.twoFactor");
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
        setError(errorData?.error?.message || tShared("invalidCode"));
      } else {
        setError(tShared("verificationFailed"));
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
            <p className={styles.instructionsHeading}>{t("instructionsHeading")}</p>
          </header>

          <div className={styles.qrCodeWrapper}>
            <QRCodeSVG value={provisioningUri} size={200} level="M" />
          </div>

          <p className={styles.instructions}>{t("appsHint")}</p>

          <div>
            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.otpSection}>
              <label>{t("codeLabel")}</label>
              <OTPInput value={otpCode} onChange={handleOtpChange} disabled={isLoading} hasError={!!error} autoFocus />
            </div>

            {isLoading && <p className={styles.verifyingText}>{tCommon("verifying")}</p>}

            <div className={styles.actions}>
              <button
                type="button"
                onClick={onCancel}
                className="ui-btn ui-btn-large ui-btn-secondary"
                style={{ width: "100%" }}
                disabled={isLoading}
              >
                {tShared("cancel")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
