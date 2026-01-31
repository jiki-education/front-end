"use client";

import { ApiError } from "@/lib/api/client";
import { useAuthStore } from "@/lib/auth/authStore";
import { useAuth } from "@/lib/auth/useAuth";
import { buildUrlWithReturnTo } from "@/lib/auth/return-to";
import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";
import EmailIcon from "@/icons/email.svg";
import PasswordIcon from "@/icons/password.svg";
import styles from "./AuthForm.module.css";
import { CheckInboxMessage } from "./CheckInboxMessage";
import { GoogleAuthButton } from "./GoogleAuthButton";

export function SignupForm() {
  const { signup, isLoading } = useAuthStore();
  const { handleAuthResponse, handleGoogleSuccess, googleAuthError, returnTo, TwoFactorForm } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [hasAuthError, setHasAuthError] = useState(false);
  const [authErrorField, setAuthErrorField] = useState<string | null>(null);
  const [signupSuccessEmail, setSignupSuccessEmail] = useState<string | null>(null);

  const validate = () => {
    const errors: Record<string, string> = {};

    if (!email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setHasAuthError(false);
    setAuthErrorField(null);

    if (!validate()) {
      return;
    }

    try {
      const user = await signup({
        email,
        password,
        password_confirmation: password
      });

      if (user.email_confirmed) {
        handleAuthResponse({ status: "success", user });
      } else {
        setSignupSuccessEmail(email);
      }
    } catch (err) {
      console.error("Signup failed:", err);

      if (err instanceof ApiError) {
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

  if (signupSuccessEmail) {
    return <CheckInboxMessage email={signupSuccessEmail} />;
  }

  return (
    <div className={styles.leftSide}>
      <div className={styles.formContainer}>
        <header>
          <h1>Sign Up</h1>
          <p>
            Already got an account?{" "}
            <Link href={buildUrlWithReturnTo("/auth/login", returnTo)} className="ui-link">
              Log in
            </Link>
            .
          </p>
        </header>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <GoogleAuthButton onSuccess={handleGoogleSuccess} onError={() => console.error("ERROR WITH GOOGLE SIGNUP")}>
            Sign Up with Google
          </GoogleAuthButton>

          <div className={styles.divider}>OR</div>

          <div
            className={`ui-form-field-large ${validationErrors.email || (hasAuthError && authErrorField === "email") ? "ui-form-field-error" : ""}`}
          >
            <label htmlFor="signup-email">Email</label>
            <div>
              <EmailIcon />
              <input
                type="email"
                id="signup-email"
                placeholder="Enter your email address"
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
                This email is already registered
              </div>
            )}
          </div>

          <div
            className={`ui-form-field-large ${validationErrors.password ? "ui-form-field-error" : ""}`}
            id="password-field"
            style={{ marginBottom: "8px" }}
          >
            <label htmlFor="signup-password">Password</label>
            <div>
              <PasswordIcon />
              <input
                type="password"
                id="signup-password"
                placeholder="Enter your password"
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

          <button
            type="submit"
            id="submit-btn"
            className="ui-btn ui-btn-large ui-btn-primary submit-btn"
            style={{ width: "100%" }}
            disabled={isLoading}
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>

          <div className={styles.footerLinks}>
            <p>
              Didn&apos;t receive your confirmation email?{" "}
              <Link href="/auth/resend-confirmation" className="ui-link">
                Resend it.
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
