"use client";

import { ApiError } from "@/lib/api/client";
import { readAttribution } from "@/lib/attribution";
import { useAuthStore } from "@/lib/auth/authStore";
import { useAuth } from "@/lib/auth/useAuth";
import { buildUrlWithReturnTo } from "@/lib/auth/return-to";
import { detectSeedLocale } from "@/lib/i18n/detectSeedLocale";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import { useTurnstile } from "@/lib/turnstile/useTurnstile";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import EmailIcon from "@/icons/email.svg";
import PasswordIcon from "@/icons/password.svg";
import styles from "./AuthForm.module.css";
import { ExercismAuthButton } from "./ExercismAuthButton";
import { GoogleAuthButton } from "./GoogleAuthButton";

export function SignupForm() {
  const t = useTranslations("auth.signup");
  const tc = useTranslations("auth");
  const activeLocale = useLocale();
  const routes = useLocaleRoutes();
  const { signup, isLoading } = useAuthStore();
  const { handleAuthResponse, handleGoogleSuccess, googleAuthError, returnTo, TwoFactorForm } = useAuth();
  const turnstile = useTurnstile();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [hasAuthError, setHasAuthError] = useState(false);
  const [authErrorField, setAuthErrorField] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);

  const validate = () => {
    const errors: Record<string, string> = {};

    if (!email) {
      errors.email = tc("fields.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = tc("fields.emailInvalid");
    }

    if (!password) {
      errors.password = tc("fields.passwordRequired");
    } else if (password.length < 6) {
      errors.password = tc("fields.passwordMinLength");
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setHasAuthError(false);
    setAuthErrorField(null);
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
      const seedLocale = detectSeedLocale(activeLocale);
      const user = await signup(
        {
          email,
          password,
          password_confirmation: password,
          ...(seedLocale ? { locale: seedLocale } : {}),
          attribution: readAttribution()
        },
        token
      );

      if (user.email_confirmed) {
        handleAuthResponse({ status: "success", user });
      } else {
        try {
          localStorage.setItem("just_signed_up_email", email);
        } catch {
          // Storage may be disabled — the check-email page will fall back gracefully.
        }
        router.push(routes.authCheckEmail());
      }
    } catch (err) {
      setVerifying(false);
      console.error("Signup failed:", err);

      if (err instanceof ApiError) {
        if (
          err.status === 403 &&
          (err.data as { error?: { type?: string } } | undefined)?.error?.type === "invalid_captcha"
        ) {
          setCaptchaError(true);
          return;
        }
        // Handle specific HTTP status codes
        if (err.status === 409 || err.status === 422) {
          // 409 Conflict or 422 Unprocessable Entity - likely email already exists
          setHasAuthError(true);
          setAuthErrorField("email");
        }
        // For other API errors (500, 503, etc.), don't show field-specific error
      }
      // For network errors or other non-API errors, don't show field-specific error
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
            {t("haveAccountPrefix")}
            <Link href={buildUrlWithReturnTo(routes.authLogin(), returnTo)} className="ui-link">
              {t("loginLink")}
            </Link>
            .
          </p>
        </header>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className={styles.oauthButtons}>
            <GoogleAuthButton onSuccess={handleGoogleSuccess} onError={() => console.error("ERROR WITH GOOGLE SIGNUP")}>
              {tc("oauth.useGoogle")}
            </GoogleAuthButton>
            <ExercismAuthButton onError={() => console.error("ERROR WITH EXERCISM SIGNUP")}>
              {tc("oauth.useExercism")}
            </ExercismAuthButton>
          </div>

          <div className={styles.divider}>{tc("oauth.divider")}</div>

          <div
            className={`ui-form-field-large ${validationErrors.email || (hasAuthError && authErrorField === "email") ? "ui-form-field-error" : ""}`}
          >
            <label htmlFor="signup-email">{tc("fields.emailLabel")}</label>
            <div>
              <EmailIcon />
              <input
                type="email"
                id="signup-email"
                placeholder={tc("fields.emailPlaceholder")}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (validationErrors.email) {
                    setValidationErrors({ ...validationErrors, email: "" });
                  }
                  if (hasAuthError && authErrorField === "email") {
                    setHasAuthError(false);
                    setAuthErrorField(null);
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
            {hasAuthError && authErrorField === "email" && !validationErrors.email && (
              <div className="ui-form-field-error-message" style={{ display: "block" }}>
                {t("emailAlreadyRegistered")}
              </div>
            )}
          </div>

          <div
            className={`ui-form-field-large ${validationErrors.password ? "ui-form-field-error" : ""}`}
            id="password-field"
            style={{ marginBottom: "8px" }}
          >
            <label htmlFor="signup-password">{tc("fields.passwordLabel")}</label>
            <div>
              <PasswordIcon />
              <input
                type="password"
                id="signup-password"
                placeholder={tc("fields.passwordPlaceholder")}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (validationErrors.password) {
                    setValidationErrors({ ...validationErrors, password: "" });
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
            {googleAuthError && (
              <div className="ui-form-field-error-message" style={{ display: "block" }}>
                {googleAuthError}
              </div>
            )}
          </div>

          {captchaError && <div className={styles.errorMessage}>{tc("captchaError.signup")}</div>}

          <button
            type="submit"
            id="submit-btn"
            className="ui-btn ui-btn-large ui-btn-primary submit-btn"
            style={{ width: "100%" }}
            disabled={isLoading || verifying}
          >
            {isLoading ? t("submitting") : verifying ? t("verifying") : t("submit")}
          </button>

          <div className={styles.footerLinks}>
            <p>
              {t("resendPrompt")}
              <Link href={routes.authResendConfirmation()} className="ui-link">
                {t("resendLink")}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
