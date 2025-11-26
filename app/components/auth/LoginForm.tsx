"use client";

import { useAuthStore } from "@/stores/authStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import { GoogleAuthButton } from "./GoogleAuthButton";
import PasswordIcon from "../../icons/password.svg";
import EmailIcon from "../../icons/email.svg";
import styles from "./AuthForm.module.css";

export function LoginForm() {
  const router = useRouter();
  const { login, googleAuth, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

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
    clearError();

    if (!validate()) {
      return;
    }

    try {
      await login({ email, password });
      router.push("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleGoogleSuccess = (code: string) => {
    googleAuth(code)
      .then(() => {
        router.push("/dashboard");
      })
      .catch(() => {
        console.error("ERROR WITH GOOGLE LOGIN");
      });
  };

  return (
    <div className={styles.leftSide}>
      <div className={styles.formContainer}>
        <header>
          <h1>Log In</h1>
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="ui-link">
              Sign up for free.
            </Link>
          </p>
        </header>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <GoogleAuthButton onSuccess={handleGoogleSuccess} onError={() => console.error("ERROR WITH GOOGLE LOGIN")}>
            Log In with Google
          </GoogleAuthButton>

          <div className={styles.divider}>OR</div>

          {error && (
            <div id="success-message" className={styles.successMessage} style={{ display: "block" }}>
              {error}
            </div>
          )}

          <div className="ui-form-field-large">
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
            <div className="ui-form-field-large" id="password-field">
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
                  }}
                  required
                />
              </div>
              {validationErrors.password && (
                <div id="password-error-message" className="ui-form-field-error-message" style={{ display: "block" }}>
                  {validationErrors.password}
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
