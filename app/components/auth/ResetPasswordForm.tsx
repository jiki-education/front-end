"use client";

import { useAuthStore } from "@/lib/auth/authStore";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import PasswordIcon from "../../icons/password.svg";
import styles from "./AuthForm.module.css";

export function ResetPasswordForm() {
  const t = useTranslations("auth.resetPassword");
  const tCommon = useTranslations("common");
  const routes = useLocaleRoutes();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword, isLoading, error, clearError } = useAuthStore();

  const [token] = useState(() => searchParams.get("reset_password_token") || searchParams.get("token") || "");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");

  const validate = () => {
    const errors: Record<string, string> = {};

    if (!token) {
      errors.token = t("tokenMissing");
    }

    if (!password) {
      errors.password = tCommon("validation.passwordRequired");
    } else if (password.length < 6) {
      errors.password = tCommon("validation.passwordMinLength");
    }

    if (!passwordConfirmation) {
      errors.passwordConfirmation = t("confirmationRequired");
    } else if (password !== passwordConfirmation) {
      errors.passwordConfirmation = tCommon("validation.passwordsNoMatch");
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    setSuccessMessage("");

    if (!validate()) {
      return;
    }

    try {
      await resetPassword({
        reset_password_token: token,
        password,
        password_confirmation: passwordConfirmation
      });
      setSuccessMessage(t("successMessage"));

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push(routes.authLogin());
      }, 3000);
    } catch (err) {
      console.error("Password reset failed:", err);
    }
  };

  // Show error if no token is provided
  if (!token) {
    return (
      <div className={styles.leftSide}>
        <div className={styles.formContainer}>
          <header>
            <h1>{t("invalidTitle")}</h1>
          </header>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className={styles.errorMessage}>{t("invalidMessage")}</div>
            <div className={styles.footerLinks}>
              <p>
                <Link href={routes.authForgotPassword()} className="ui-link">
                  {t("requestNewLink")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.leftSide}>
      <div className={styles.formContainer}>
        <header>
          <h1>{t("title")}</h1>
          <p>{t("subtitle")}</p>
        </header>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {error && <div className={styles.errorMessage}>{error}</div>}

          {successMessage && (
            <div className={styles.successMessage} style={{ display: "block" }}>
              {successMessage}
            </div>
          )}

          <div className="ui-form-field-large" style={{ marginBottom: "8px" }}>
            <label htmlFor="password">{t("newPasswordLabel")}</label>
            <div>
              <PasswordIcon />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                placeholder={t("newPasswordPlaceholder")}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (validationErrors.password) {
                    setValidationErrors({ ...validationErrors, password: "" });
                  }
                }}
              />
            </div>
            {validationErrors.password && (
              <div className="ui-form-field-error-message" style={{ display: "block" }}>
                {validationErrors.password}
              </div>
            )}
          </div>

          <div className="ui-form-field-large" style={{ marginBottom: "8px" }}>
            <label htmlFor="passwordConfirmation">{t("confirmPasswordLabel")}</label>
            <div>
              <PasswordIcon />
              <input
                id="passwordConfirmation"
                name="passwordConfirmation"
                type="password"
                autoComplete="new-password"
                required
                value={passwordConfirmation}
                placeholder={t("confirmPasswordPlaceholder")}
                onChange={(e) => {
                  setPasswordConfirmation(e.target.value);
                  if (validationErrors.passwordConfirmation) {
                    setValidationErrors({ ...validationErrors, passwordConfirmation: "" });
                  }
                }}
              />
            </div>
            {validationErrors.passwordConfirmation && (
              <div className="ui-form-field-error-message" style={{ display: "block" }}>
                {validationErrors.passwordConfirmation}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="ui-btn ui-btn-large ui-btn-primary"
            style={{ width: "100%" }}
            disabled={isLoading}
          >
            {isLoading ? t("submitting") : t("submit")}
          </button>

          <div className={styles.footerLinks}>
            <p>
              {t("rememberedPrefix")}
              <Link href={routes.authLogin()} className="ui-link">
                {t("signInLink")}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
