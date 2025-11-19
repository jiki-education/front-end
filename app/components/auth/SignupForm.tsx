"use client";

import { useAuthStore } from "@/stores/authStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import PasswordIcon from "../../icons/password.svg";
import EmailIcon from "../../icons/email.svg";
import "./login-form.css";

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function SignupForm() {
  const router = useRouter();
  const { signup, googleAuth, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const googleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => {
      googleAuth(codeResponse.code)
        .then(() => {
          router.push("/dashboard");
        })
        .catch(() => {
          console.error("ERROR WITH GOOGLE SIGNUP");
        });
    },
    onError: () => console.error("ERROR WITH GOOGLE SIGNUP"),
    flow: "auth-code"
  });

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

  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    return null;
  }

  return (
    <div className="left-side">
      <div className="form-container">
        <div className="form-header">
          <h1 className="form-title">Sign Up</h1>
          <p className="form-subtitle">
            Already got an account?{" "}
            <Link href="/auth/login" className="ui-link">
              Log in
            </Link>
            .
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <button
            type="button"
            className="ui-btn-large ui-btn-tertiary google-btn"
            style={{ width: "100%" }}
            onClick={() => googleLogin()}
          >
            <GoogleIcon />
            Sign Up with Google
          </button>

          <div className="divider">
            <div className="divider-line"></div>
            <span className="divider-text">OR</span>
            <div className="divider-line"></div>
          </div>

          {error && (
            <div className="success-message" style={{ display: "block" }}>
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
