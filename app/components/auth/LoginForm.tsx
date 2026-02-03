"use client";

import { AuthenticationError } from "@/lib/api/client";
import { useAuthStore } from "@/lib/auth/authStore";
import { useAuth } from "@/lib/auth/useAuth";
import { buildUrlWithReturnTo } from "@/lib/auth/return-to";
import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";
import EmailIcon from "../../icons/email.svg";
import PasswordIcon from "../../icons/password.svg";
import styles from "./AuthForm.module.css";
import { GoogleAuthButton } from "./GoogleAuthButton";

export function LoginForm() {
  const { login, isLoading } = useAuthStore();
  const { handleAuthResponse, handleGoogleSuccess, googleAuthError, returnTo, TwoFactorForm } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [hasAuthError, setHasAuthError] = useState(false);
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null);

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
    setUnconfirmedEmail(null);

    if (!validate()) {
      return;
    }

    try {
      const result = await login({ email, password });
      handleAuthResponse(result);
    } catch (err) {
      console.error("Login failed:", err);
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
          <h1>Log In</h1>
          <p>
            Don&apos;t have an account?{" "}
            <Link href={buildUrlWithReturnTo("/auth/signup", returnTo)} className="ui-link">
              Sign up for free.
            </Link>
          </p>
        </header>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <GoogleAuthButton onSuccess={handleGoogleSuccess} onError={() => console.error("ERROR WITH GOOGLE LOGIN")}>
            Log In with Google
          </GoogleAuthButton>

          <div className={styles.divider}>OR</div>

          <div className={`ui-form-field-large ${hasAuthError || unconfirmedEmail ? "ui-form-field-error" : ""}`}>
            <label htmlFor="login-email">Email</label>
            <div>
              <EmailIcon />
              <input
                type="email"
                id="login-email"
                placeholder="Enter your email address"
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
              <label htmlFor="login-password">Password</label>
              <div>
                <PasswordIcon />
                <input
                  type="password"
                  id="login-password"
                  placeholder="Enter your password"
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
                  Invalid email or password
                </div>
              )}
              {unconfirmedEmail && (
                <div className="ui-form-field-error-message" style={{ display: "block" }}>
                  Please confirm your email before logging in.{" "}
                  <Link
                    href={`/auth/resend-confirmation?email=${encodeURIComponent(unconfirmedEmail)}`}
                    className="ui-link"
                  >
                    Resend confirmation
                  </Link>
                </div>
              )}
              {googleAuthError && (
                <div className="ui-form-field-error-message" style={{ display: "block" }}>
                  {googleAuthError}
                </div>
              )}
            </div>

            <div className={styles.forgotPassword}>
              <Link href="/auth/forgot-password" className="ui-link">
                Forgot your password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            id="submit-btn"
            className="ui-btn ui-btn-large ui-btn-primary"
            style={{ width: "100%" }}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log In"}
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
