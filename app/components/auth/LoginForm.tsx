"use client";

import { ApiError, AuthenticationError } from "@/lib/api/client";
import { useAuthStore } from "@/lib/auth/authStore";
import { buildUrlWithReturnTo } from "@/lib/auth/return-to";
import { useAuth } from "@/lib/auth/useAuth";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import { useTurnstile } from "@/lib/turnstile/useTurnstile";
import { useTranslations } from "next-intl";
import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";
import EmailIcon from "../../icons/email.svg";
import PasswordIcon from "../../icons/password.svg";
import styles from "./AuthForm.module.css";
import { ExercismAuthButton } from "./ExercismAuthButton";
import { GoogleAuthButton } from "./GoogleAuthButton";

export function LoginForm() {
  const t = useTranslations("auth.login");
  const tc = useTranslations("auth");
  const tCommon = useTranslations("common");
  const routes = useLocaleRoutes();
  const { login, isLoading } = useAuthStore();
  const { handleAuthResponse, handleGoogleSuccess, googleAuthError, returnTo, TwoFactorForm } = useAuth();
  const turnstile = useTurnstile();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [hasAuthError, setHasAuthError] = useState(false);
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);

  const validate = () => {
    const errors: Record<string, string> = {};

    if (!email) {
      errors.email = tc("fields.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = tCommon("validation.emailInvalid");
    }

    if (!password) {
      errors.password = tCommon("validation.passwordRequired");
    } else if (password.length < 6) {
      errors.password = tCommon("validation.passwordMinLength");
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setHasAuthError(false);
    setUnconfirmedEmail(null);
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
      const result = await login({ email, password }, token);
      handleAuthResponse(result);
    } catch (err) {
      setVerifying(false);
      console.error("Login failed:", err);
      if (
        err instanceof ApiError &&
        err.status === 403 &&
        (err.data as { error?: { type?: string } } | undefined)?.error?.type === "invalid_captcha"
      ) {
        setCaptchaError(true);
        return;
      }
      if (err instanceof AuthenticationError) {
        // Check if the error is specifically for unconfirmed email
        const errorData = err.data as { error?: { type?: string; email?: string } } | undefined;
        if (errorData?.error?.type === "unconfirmed") {
          setUnconfirmedEmail(errorData.error.email || email);
        } else {
          setHasAuthError(true);
        }
      }
      // If not an AuthenticationError, it's likely a network/server error
      // Don't show field-specific error for those cases
    }
  };

  if (TwoFactorForm) {
    return TwoFactorForm;
  }

  return (
    <div className={styles.leftSide}>
      <div className={styles.formContainer}>
        <header>
          <h1>{t("title")}</h1>
          <p>
            {t.rich("noAccount", {
              link: (chunks) => (
                <Link href={buildUrlWithReturnTo(routes.authSignup(), returnTo)} className="ui-link">
                  {chunks}
                </Link>
              )
            })}
          </p>
        </header>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className={styles.oauthButtons}>
            <GoogleAuthButton onSuccess={handleGoogleSuccess} onError={() => console.error("ERROR WITH GOOGLE LOGIN")}>
              {tc("oauth.useGoogle")}
            </GoogleAuthButton>
            <ExercismAuthButton onError={() => console.error("ERROR WITH EXERCISM LOGIN")}>
              {tc("oauth.useExercism")}
            </ExercismAuthButton>
          </div>

          <div className={styles.divider}>{tc("oauth.divider")}</div>

          <div className={`ui-form-field-large ${hasAuthError || unconfirmedEmail ? "ui-form-field-error" : ""}`}>
            <label htmlFor="login-email">{tc("fields.emailLabel")}</label>
            <div>
              <EmailIcon />
              <input
                type="email"
                id="login-email"
                placeholder={tc("fields.emailPlaceholder")}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (validationErrors.email) {
                    setValidationErrors({ ...validationErrors, email: "" });
                  }
                  if (hasAuthError) {
                    setHasAuthError(false);
                  }
                  if (unconfirmedEmail) {
                    setUnconfirmedEmail(null);
                  }
                }}
                required
              />
            </div>
            {validationErrors.email && (
              <div className="ui-form-field-error-message" style={{ display: "block" }}>
                {validationErrors.email}
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "8px" }}>
            <div
              className={`ui-form-field-large ${hasAuthError || unconfirmedEmail ? "ui-form-field-error" : ""}`}
              id="password-field"
            >
              <label htmlFor="login-password">{tc("fields.passwordLabel")}</label>
              <div>
                <PasswordIcon />
                <input
                  type="password"
                  id="login-password"
                  placeholder={tc("fields.passwordPlaceholder")}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (validationErrors.password) {
                      setValidationErrors({ ...validationErrors, password: "" });
                    }
                    if (hasAuthError) {
                      setHasAuthError(false);
                    }
                    if (unconfirmedEmail) {
                      setUnconfirmedEmail(null);
                    }
                  }}
                  required
                />
              </div>
              {validationErrors.password && (
                <div id="password-error-message" className="ui-form-field-error-message" style={{ display: "block" }}>
                  {validationErrors.password}
                </div>
              )}
              {hasAuthError && !validationErrors.password && (
                <div className="ui-form-field-error-message" style={{ display: "block" }}>
                  {t("invalidCredentials")}
                </div>
              )}
              {unconfirmedEmail && (
                <div className="ui-form-field-error-message" style={{ display: "block" }}>
                  {t.rich("unconfirmed", {
                    link: (chunks) => (
                      <Link
                        href={`${routes.authResendConfirmation()}?email=${encodeURIComponent(unconfirmedEmail)}`}
                        className="ui-link"
                      >
                        {chunks}
                      </Link>
                    )
                  })}
                </div>
              )}
              {googleAuthError && (
                <div className="ui-form-field-error-message" style={{ display: "block" }}>
                  {googleAuthError}
                </div>
              )}
            </div>

            <div className={styles.forgotPassword}>
              <Link href={routes.authForgotPassword()} className="ui-link">
                {t("forgotPassword")}
              </Link>
            </div>
          </div>

          {captchaError && <div className={styles.errorMessage}>{tc("captchaError.login")}</div>}

          <button
            type="submit"
            id="submit-btn"
            className="ui-btn ui-btn-large ui-btn-primary"
            style={{ width: "100%" }}
            disabled={isLoading || verifying}
          >
            {isLoading ? t("submitting") : verifying ? tCommon("verifying") : t("submit")}
          </button>

          <div className={styles.footerLinks}>
            <p>
              {t.rich("resend", {
                link: (chunks) => (
                  <Link href={routes.authResendConfirmation()} className="ui-link">
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
