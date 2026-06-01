"use client";

import { ApiError } from "@/lib/api/client";
import { useAuthStore } from "@/lib/auth/authStore";
import { useTurnstile } from "@/lib/turnstile/useTurnstile";
import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";
import EmailIcon from "../../icons/email.svg";
import styles from "./AuthForm.module.css";

export function ForgotPasswordForm() {
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
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address";
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
      setSuccessMessage("If an account with that email exists, you'll receive reset instructions shortly.");
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
          <h1>Forgot your password?</h1>
          <p>If you&apos;ve forgotten your password, use the form below to request a link to change it.</p>
        </header>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {successMessage && (
            <div className={styles.successMessage} style={{ display: "block" }}>
              {successMessage}
            </div>
          )}

          <div className="ui-form-field-large" id="email-field" style={{ marginBottom: "8px" }}>
            <label htmlFor="reset-email">Email</label>
            <div>
              <EmailIcon />
              <input
                type="email"
                id="reset-email"
                placeholder="Enter your email address"
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

          {captchaError && (
            <div className={styles.errorMessage}>
              Our systems tried to determine whether you were a bot or a human, but couldn&apos;t. Please try again
              using the button below.
            </div>
          )}

          <button
            type="submit"
            id="submit-btn"
            className="ui-btn ui-btn-large ui-btn-primary"
            style={{ width: "100%" }}
            disabled={isLoading || verifying}
          >
            {isLoading ? "Sending..." : verifying ? "Verifying..." : "Send Reset Link"}
          </button>

          <div className={styles.footerLinks}>
            <p>
              Remembered your password?{" "}
              <Link href="/auth/login" className="ui-link">
                Log in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
