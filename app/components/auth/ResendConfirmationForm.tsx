"use client";

import { useAuthStore } from "@/stores/authStore";
import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";
import EmailIcon from "../../icons/email.svg";
import "./login-form.css";

export function ResendConfirmationForm() {
  const { resendConfirmation, isLoading, error, clearError } = useAuthStore();

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
      await resendConfirmation(email);
      setSuccessMessage("If an account with that email exists, you&apos;ll receive confirmation instructions shortly.");
      setEmail("");
    } catch (err) {
      console.error("Resend confirmation failed:", err);
    }
  };

  return (
    <div className="left-side">
      <div className="form-container">
        <div className="form-header">
          <h1 className="form-title">Resend confirmation instructions</h1>
          <p className="form-subtitle">
            Not received a confirmation email? Use the form below and we&apos;ll send you another.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {error && (
            <div className="success-message" style={{ display: "block" }}>
              {error}
            </div>
          )}

          {successMessage && (
            <div className="success-message" style={{ display: "block" }}>
              {successMessage}
            </div>
          )}

          <div className="ui-form-field-large" id="email-field" style={{ marginBottom: "8px" }}>
            <label htmlFor="confirmation-email">Email</label>
            <div>
              <EmailIcon />
              <input
                type="email"
                id="confirmation-email"
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
            className="ui-btn-large ui-btn-primary"
            style={{ width: "100%" }}
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Resend confirmation instructions"}
          </button>

          <div className="footer-links">
            <p>
              Already confirmed?{" "}
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
