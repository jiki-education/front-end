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

export function SignupForm() {
  const router = useRouter();
  const { signup, googleAuth, isLoading, clearError } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [hasAuthError, setHasAuthError] = useState(false);
  const [authErrorField, setAuthErrorField] = useState<string | null>(null);

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
    setHasAuthError(false);
    setAuthErrorField(null);

    if (!validate()) {
      // Don't set auth error for validation errors - let validation errors handle their own styling
      return;
    }

    try {
      await signup({
        email,
        password,
        password_confirmation: password
      });
      router.push("/dashboard");
    } catch (err) {
      console.error("Signup failed:", err);
      // For signup errors, assume it's usually about email already existing
      setHasAuthError(true);
      setAuthErrorField("email");
    }
  };

  const handleGoogleSuccess = (code: string) => {
    googleAuth(code)
      .then(() => {
        router.push("/dashboard");
      })
      .catch(() => {
        console.error("ERROR WITH GOOGLE SIGNUP");
      });
  };

  return (
    <div className={styles.leftSide}>
      <div className={styles.formContainer}>
        <header>
          <h1>Sign Up</h1>
          <p>
            Already got an account?{" "}
            <Link href="/auth/login" className="ui-link">
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
