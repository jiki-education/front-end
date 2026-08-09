"use client";

/**
 * Google OAuth Test Page
 * Development-only page for testing Google OAuth flows
 */

import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { useAuthStore } from "@/lib/auth/authStore";
import { useState } from "react";
import styles from "./page.module.css";

export default function GoogleOAuthTestPage() {
  const {
    user,
    isAuthenticated,
    isLoading: isAuthLoading,
    error: authError,
    login,
    logout,
    googleLogin
  } = useAuthStore();
  const [oauthError, setOauthError] = useState<string | null>(null);

  // Handle Google OAuth login success
  const handleGoogleLoginSuccess = async (code: string) => {
    setOauthError(null);
    try {
      const result = await googleLogin(code);
      // Dev page doesn't need full 2FA UI - just log the response
      if (result.status !== "success") {
        console.debug("2FA required:", result.status);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Google authentication failed";
      setOauthError(errorMessage);
      console.error("Google OAuth error:", error);
    }
  };

  // Handle Google OAuth login error
  const handleGoogleLoginError = () => {
    setOauthError("Google login failed");
  };

  // Handle traditional email/password login for testing
  const handleTraditionalLogin = async () => {
    try {
      await login(
        {
          email: "ihid@jiki.io",
          password: "password"
        },
        "dev-stub-token"
      );
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <div>
          <h1 className={styles.title}>Google OAuth Test</h1>
          <p className={styles.subtitle}>Test Google Sign-In integration with Jiki backend</p>
        </div>

        {/* Environment Info */}
        <div className={styles.envCard}>
          <h2 className={styles.envTitle}>Environment</h2>
          <div className={styles.envBody}>
            <p>
              <strong>Google Client ID:</strong>{" "}
              {process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID
                ? `${process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID.substring(0, 20)}...`
                : "Not configured"}
            </p>
            <p>
              <strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL || "http://localhost:3060"}
            </p>
          </div>
        </div>

        {/* Auth Status */}
        <AuthStatusSection
          isAuthenticated={isAuthenticated}
          user={user}
          isAuthLoading={isAuthLoading}
          authError={authError}
          onTraditionalLogin={handleTraditionalLogin}
          onLogout={handleLogout}
        />

        {/* Google OAuth Section */}
        <div className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>Google OAuth Sign-In</h2>

          {oauthError && (
            <div className={styles.oauthErrorBox}>
              <p className={styles.oauthErrorText}>
                <strong>OAuth Error:</strong> {oauthError}
              </p>
            </div>
          )}

          <div className={styles.sectionBody}>
            <p className={styles.mutedText}>Click the button below to test Google Sign-In:</p>

            <div className={styles.buttonWrap}>
              <GoogleAuthButton onSuccess={handleGoogleLoginSuccess} onError={handleGoogleLoginError}>
                Sign in with Google
              </GoogleAuthButton>
            </div>

            {isAuthenticated && (
              <p className={styles.linkedNote}>
                ✓ You are already authenticated. Click above to test account linking or logout first to test new account
                creation.
              </p>
            )}
          </div>
        </div>

        {/* User Details */}
        {isAuthenticated && user && <UserDetailsSection user={user} />}

        {/* Test Instructions */}
        <div className={styles.scenariosCard}>
          <h2 className={styles.sectionTitle}>Test Scenarios</h2>
          <div className={styles.scenariosBody}>
            <TestScenario
              title="1. New User Sign-Up"
              description="Click 'Sign in with Google' with a Google account that hasn't been used on Jiki before. Should create a new account."
            />
            <TestScenario
              title="2. Existing User Login"
              description="Click 'Sign in with Google' with a Google account that's already registered. Should login successfully."
            />
            <TestScenario
              title="3. Account Linking"
              description="First login with email/password, then click 'Sign in with Google' with the same email address. Backend should link the accounts."
            />
            <TestScenario
              title="4. Token Storage"
              description="After successful login, check sessionStorage for 'jiki_auth_token' and cookies for refresh token."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-components
function AuthStatusSection({
  isAuthenticated,
  user,
  isAuthLoading,
  authError,
  onTraditionalLogin,
  onLogout
}: {
  isAuthenticated: boolean;
  user: { email: string; name: string | null } | null;
  isAuthLoading: boolean;
  authError: unknown;
  onTraditionalLogin: () => void;
  onLogout: () => void;
}) {
  if (isAuthLoading) {
    return (
      <div className={styles.loadingCard}>
        <p className={styles.mutedText}>Checking authentication...</p>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className={styles.authCard}>
        <div className={styles.authRow}>
          <div>
            <p className={styles.authName}>
              <strong>✓ Authenticated as:</strong> {user.name || user.email}
            </p>
            <p className={styles.authEmail}>Email: {user.email}</p>
          </div>
          <button onClick={onLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.unauthCard}>
      <h2 className={styles.unauthTitle}>Not Authenticated</h2>
      <p className={styles.unauthText}>
        You can test Google OAuth while logged out (new account) or logged in (account linking).
      </p>
      {authError != null && (
        <p className={styles.authErrorText}>
          <strong>Auth Error:</strong> {String(authError)}
        </p>
      )}
      <button onClick={onTraditionalLogin} className={styles.loginButton}>
        Login as ihid@jiki.io (for testing)
      </button>
    </div>
  );
}

function UserDetailsSection({ user }: { user: unknown }) {
  return (
    <div className={styles.sectionCard}>
      <h2 className={styles.sectionTitle}>User Details</h2>
      <pre className={styles.detailsPre}>
        <code>{JSON.stringify(user, null, 2)}</code>
      </pre>
    </div>
  );
}

function TestScenario({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h3 className={styles.scenarioTitle}>{title}</h3>
      <p className={styles.scenarioDescription}>{description}</p>
    </div>
  );
}
