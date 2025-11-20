"use client";

import { useAuthStore } from "@/stores/authStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import { GoogleAuthButton } from "@/components/ui/GoogleAuthButton";
import PasswordIcon from "../../icons/password.svg";
import EmailIcon from "../../icons/email.svg";
import styles from "./LoginForm.module.css";

export function SignupForm() {
  const router = useRouter();
  const { signup, googleAuth, isLoading, error, clearError } = useAuthStore();

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
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
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
      await signup({
        email,
        password,
        password_confirmation: password
      });
      router.push("/dashboard");
    } catch (err) {
      console.error("Signup failed:", err);
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
        <div className={styles.formHeader}>
          <h1 className={styles.formTitle}>Sign Up</h1>
          <p className={styles.formSubtitle}>
            Already got an account?{" "}
            <Link href="/auth/login" className="ui-link">
              Log in
            </Link>
            .
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <GoogleAuthButton onSuccess={handleGoogleSuccess} onError={() => console.error("ERROR WITH GOOGLE SIGNUP")}>
            Sign Up with Google
          </GoogleAuthButton>

          <div className={styles.divider}>
            <div className={styles.dividerLine}></div>
            <span className={styles.dividerText}>OR</span>
            <div className={styles.dividerLine}></div>
          </div>

          {error && (
            <div className={styles.successMessage} style={{ display: "block" }}>
              {error}
            </div>
          )}

          <div className="ui-form-field-large">
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

          <div className="ui-form-field-large" id="password-field" style={{ marginBottom: "8px" }}>
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
            className="ui-btn-large ui-btn-primary submit-btn"
            style={{ width: "100%" }}
            disabled={isLoading}
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>

          <div className="footer-links">
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
