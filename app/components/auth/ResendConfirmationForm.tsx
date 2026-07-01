"use client";

import { useAuthStore } from "@/lib/auth/authStore";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import EmailIcon from "../../icons/email.svg";
import styles from "./AuthForm.module.css";

export function ResendConfirmationForm() {
  const t = useTranslations("auth.resendConfirmation");
  const tc = useTranslations("auth");
  const { resendConfirmation, isLoading, error, clearError } = useAuthStore();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");

  const validate = () => {
    const errors: Record<string, string> = {};

    if (!email) {
      errors.email = tc("fields.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = t("emailInvalid");
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
      await resendConfirmation(email);
      setSuccessMessage(t("successMessage"));
      setEmail("");
    } catch (err) {
      console.error("Resend confirmation failed:", err);
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
          {error && (
            <div className={styles.successMessage} style={{ display: "block" }}>
              {error}
            </div>
          )}

          {successMessage && (
            <div className={styles.successMessage} style={{ display: "block" }}>
              {successMessage}
            </div>
          )}

          <div className="ui-form-field-large" id="email-field" style={{ marginBottom: "8px" }}>
            <label htmlFor="confirmation-email">{tc("fields.emailLabel")}</label>
            <div>
              <EmailIcon />
              <input
                type="email"
                id="confirmation-email"
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

          <button
            type="submit"
            id="submit-btn"
            className="ui-btn ui-btn-large ui-btn-primary"
            style={{ width: "100%" }}
            disabled={isLoading}
          >
            {isLoading ? t("submitting") : t("submit")}
          </button>

          <div className={styles.footerLinks}>
            <p>
              {t("confirmedPrompt")}
              <Link href="/auth/login" className="ui-link">
                {t("loginLink")}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
