"use client";

import { ApiError, AuthenticationError } from "@/lib/api/client";
import { useAuthStore } from "@/lib/auth/authStore";
import { storeReturnTo, getPostAuthRedirect, buildUrlWithReturnTo } from "@/lib/auth/return-to";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { FormEvent } from "react";
import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import EmailIcon from "../../icons/email.svg";
import PasswordIcon from "../../icons/password.svg";
import styles from "./AuthForm.module.css";
import setupStyles from "./TwoFactorSetupForm.module.css";
import verifyStyles from "./TwoFactorVerifyForm.module.css";
import { GoogleAuthButton } from "./GoogleAuthButton";
import { OTPInput } from "@/components/ui/OTPInput";

// Types
type TwoFactorState = { type: "none" } | { type: "setup"; provisioningUri: string } | { type: "verify" };

interface TwoFactorSetupFormProps {
  provisioningUri: string;
  onSubmit: (code: string) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  error: string | null;
}

interface TwoFactorVerifyFormProps {
  onSubmit: (code: string) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  error: string | null;
}

// Main Component
export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, setup2FA, verify2FA, googleAuth, isLoading } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [hasAuthError, setHasAuthError] = useState(false);
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null);

  // 2FA state
  const [twoFactorState, setTwoFactorState] = useState<TwoFactorState>({ type: "none" });
  const [twoFactorError, setTwoFactorError] = useState<string | null>(null);

  const returnTo = searchParams.get("return_to");

  // Store return_to in sessionStorage on mount so it persists across page navigations
  useEffect(() => {
    storeReturnTo(returnTo);
  }, [returnTo]);

  const redirectAfterLogin = () => {
    const redirectTo = getPostAuthRedirect(returnTo);
    if (redirectTo.startsWith("http")) {
      try {
        window.location.href = redirectTo;
      } catch (redirectErr) {
        console.error("Redirect failed:", redirectErr);
        router.push("/dashboard");
      }
    } else {
      router.push(redirectTo);
    }
  };

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

      // Handle response based on status
      if (result.status === "success") {
        redirectAfterLogin();
        return;
      }

      if (result.status === "2fa_setup_required") {
        setTwoFactorState({ type: "setup", provisioningUri: result.provisioning_uri });
        return;
      }

      // Only remaining case is "2fa_required"
      setTwoFactorState({ type: "verify" });
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

  const handle2FASubmit = async (code: string) => {
    setTwoFactorError(null);
    try {
      if (twoFactorState.type === "setup") {
        await setup2FA(code);
      } else {
        await verify2FA(code);
      }
      // Success - redirect
      redirectAfterLogin();
    } catch (err) {
      console.error("2FA verification failed:", err);
      if (err instanceof ApiError) {
        const errorData = err.data as { error?: { type?: string; message?: string } } | undefined;
        if (errorData?.error?.type === "session_expired") {
          // Session expired - go back to credentials with message
          setTwoFactorState({ type: "none" });
          setTwoFactorError(null);
          setHasAuthError(true);
        } else {
          setTwoFactorError(errorData?.error?.message || "Invalid verification code");
        }
      } else {
        setTwoFactorError("Verification failed. Please try again.");
      }
    }
  };

  const handleCancel = () => {
    setTwoFactorState({ type: "none" });
    setTwoFactorError(null);
  };

  const handleGoogleSuccess = (code: string) => {
    googleAuth(code)
      .then(() => {
        redirectAfterLogin();
      })
      .catch(() => {
        console.error("ERROR WITH GOOGLE LOGIN");
      });
  };

  // Render 2FA Setup Form
  if (twoFactorState.type === "setup") {
    return (
      <div className={styles.leftSide}>
        <div className={styles.formContainer}>
          <TwoFactorSetupForm
            provisioningUri={twoFactorState.provisioningUri}
            onSubmit={handle2FASubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
            error={twoFactorError}
          />
        </div>
      </div>
    );
  }

  // Render 2FA Verify Form
  if (twoFactorState.type === "verify") {
    return (
      <div className={styles.leftSide}>
        <div className={styles.formContainer}>
          <TwoFactorVerifyForm
            onSubmit={handle2FASubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
            error={twoFactorError}
          />
        </div>
      </div>
    );
  }

  // Render Credentials Form
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

// Sub-components
function TwoFactorSetupForm({ provisioningUri, onSubmit, onCancel, isLoading, error }: TwoFactorSetupFormProps) {
  const [otpCode, setOtpCode] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      return;
    }
    await onSubmit(otpCode);
    // Clear code on error (error will be set by parent)
    setOtpCode("");
  };

  return (
    <div className={setupStyles.container}>
      <header className={setupStyles.header}>
        <h1>Set Up Two-Factor Authentication</h1>
        <p>Scan the QR code with your authenticator app to secure your account.</p>
      </header>

      <div className={setupStyles.qrCodeWrapper}>
        <QRCodeSVG value={provisioningUri} size={200} level="M" />
      </div>

      <p className={setupStyles.instructions}>
        Use Google Authenticator, 1Password, Authy, or a similar app to scan the code above.
      </p>

      <form onSubmit={handleSubmit}>
        {error && <div className={setupStyles.errorMessage}>{error}</div>}

        <div className={setupStyles.otpSection}>
          <label>Enter the 6-digit code from your app</label>
          <OTPInput value={otpCode} onChange={setOtpCode} disabled={isLoading} hasError={!!error} autoFocus />
        </div>

        <div className={setupStyles.actions}>
          <button
            type="submit"
            className="ui-btn ui-btn-large ui-btn-primary"
            style={{ width: "100%" }}
            disabled={isLoading || otpCode.length !== 6}
          >
            {isLoading ? "Verifying..." : "Verify & Complete Setup"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="ui-btn ui-btn-large ui-btn-secondary"
            style={{ width: "100%" }}
            disabled={isLoading}
          >
            Cancel and sign in again
          </button>
        </div>
      </form>
    </div>
  );
}

function TwoFactorVerifyForm({ onSubmit, onCancel, isLoading, error }: TwoFactorVerifyFormProps) {
  const [otpCode, setOtpCode] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      return;
    }
    await onSubmit(otpCode);
    // Clear code on error (error will be set by parent)
    setOtpCode("");
  };

  return (
    <div className={verifyStyles.container}>
      <header className={verifyStyles.header}>
        <h1>Two-Factor Authentication</h1>
        <p>Enter the 6-digit code from your authenticator app.</p>
      </header>

      <form onSubmit={handleSubmit}>
        {error && <div className={verifyStyles.errorMessage}>{error}</div>}

        <div className={verifyStyles.otpSection}>
          <label>Verification code</label>
          <OTPInput value={otpCode} onChange={setOtpCode} disabled={isLoading} hasError={!!error} autoFocus />
        </div>

        <div className={verifyStyles.actions}>
          <button
            type="submit"
            className="ui-btn ui-btn-large ui-btn-primary"
            style={{ width: "100%" }}
            disabled={isLoading || otpCode.length !== 6}
          >
            {isLoading ? "Verifying..." : "Verify"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="ui-btn ui-btn-large ui-btn-secondary"
            style={{ width: "100%" }}
            disabled={isLoading}
          >
            Cancel and sign in again
          </button>
        </div>
      </form>
    </div>
  );
}
