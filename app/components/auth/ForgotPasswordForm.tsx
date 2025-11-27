"use client";

import { useAuthStore } from "@/stores/authStore";
import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";
import EmailIcon from "../../icons/email.svg";
import styles from "./AuthForm.module.css";

export function ForgotPasswordForm() {
  const { requestPasswordReset, isLoading, clearError } = useAuthStore();

  const [email, setEmail] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");

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
    clearError();
    setSuccessMessage("");

    if (!validate()) {
      return;
    }

    try {
      await requestPasswordReset(email);
      setSuccessMessage("If an account with that email exists, you&apos;ll receive reset instructions shortly.");
      setEmail("");
    } catch (err) {
      console.error("Password reset request failed:", err);
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

          <button
            type="submit"
            id="submit-btn"
            className="ui-btn ui-btn-large ui-btn-primary"
            style={{ width: "100%" }}
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
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
