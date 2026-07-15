"use client";

import { ApiError } from "@/lib/api/client";
import { useAuthStore } from "@/lib/auth/authStore";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import { useTurnstile } from "@/lib/turnstile/useTurnstile";
import { useTranslations } from "next-intl";
import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";
import EmailIcon from "../../icons/email.svg";
import styles from "./AuthForm.module.css";

export function ForgotPasswordForm() {
  const t = useTranslations("auth.forgotPassword");
  const tc = useTranslations("auth");
  const tCommon = useTranslations("common");
  const routes = useLocaleRoutes();
  const { requestPasswordReset, isLoading } = useAuthStore();
  const turnstile = useTurnstile();

  const [email, setEmail] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);

  const validate = () => {
    const errors: Record<string, string> = {};

    if (!email) {
      errors.email = tc("fields.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = tCommon("validation.emailInvalid");
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setCaptchaError(false);

    if (!validate()) {
      return;
    }

    let token: string;
    setVerifying(true);
    try {
      token = await turnstile.execute();
    } catch (err) {
      console.error("Turnstile failed:", err);
      setCaptchaError(true);
      setVerifying(false);
      return;
    }

    try {
      await requestPasswordReset(email, token);
      setVerifying(false);
      setSuccessMessage(t("successMessage"));
      setEmail("");
    } catch (err) {
      setVerifying(false);
      console.error("Password reset request failed:", err);
      if (
        err instanceof ApiError &&
        err.status === 403 &&
        (err.data as { error?: { type?: string } } | undefined)?.error?.type === "invalid_captcha"
      ) {
        setCaptchaError(true);
      }
    }
  };

  return (
    <div className={styles.leftSide}>
      <div className={styles.formContainer}>
        <header>
          <h1>{t("title")}</h1>
          <p>{t("subtitle")}</p>
        </header>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {successMessage && (
            <div className={styles.successMessage} style={{ display: "block" }}>
              {successMessage}
            </div>
          )}

          <div className="ui-form-field-large" id="email-field" style={{ marginBottom: "8px" }}>
            <label htmlFor="reset-email">{tc("fields.emailLabel")}</label>
            <div>
              <EmailIcon />
              <input
                type="email"
                id="reset-email"
                placeholder={tc("fields.emailPlaceholder")}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (validationErrors.email) {
                    setValidationErrors({ ...validationErrors, email: "" });
                  }
                }}
                required
              />
            </div>
            {validationErrors.email && (
              <div id="email-error-message" className="ui-form-field-error-message" style={{ display: "block" }}>
                {validationErrors.email}
              </div>
            )}
          </div>

          {captchaError && <div className={styles.errorMessage}>{tc("captchaError.generic")}</div>}

          <button
            type="submit"
            id="submit-btn"
            className="ui-btn ui-btn-large ui-btn-primary"
            style={{ width: "100%" }}
            disabled={isLoading || verifying}
          >
            {isLoading ? tCommon("sending") : verifying ? tCommon("verifying") : t("submit")}
          </button>

          <div className={styles.footerLinks}>
            <p>
              {t.rich("remembered", {
                link: (chunks) => (
                  <Link href={routes.authLogin()} className="ui-link">
                    {chunks}
                  </Link>
                )
              })}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
