"use client";

/**
 * Stripe Test Page
 * Development-only page for testing Stripe subscription flows
 */

import { useAuthStore } from "@/lib/auth/authStore";
import { useEffect } from "react";
import { AuthenticatedSection } from "./components/AuthenticatedSection";
import styles from "./page.module.css";

export default function StripeTestPage() {
  const { user, isAuthenticated, isLoading: isAuthLoading, error: authError, login, refreshUser } = useAuthStore();

  // Refresh user data on mount to get latest subscription status
  useEffect(() => {
    if (user) {
      void refreshUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only on mount - we don't want to re-run when user or refreshUser changes

  // Note: Checkout return handling is now done globally by CheckoutReturnHandler

  const handleLogin = async () => {
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

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Stripe Subscription Test</h1>

        <AuthSection
          isAuthenticated={isAuthenticated}
          user={user}
          isAuthLoading={isAuthLoading}
          authError={authError}
          onLogin={handleLogin}
        />

        {isAuthenticated && user && <AuthenticatedSection user={user} refreshUser={refreshUser} />}
      </div>
    </div>
  );
}

// Sub-components
function AuthSection({
  isAuthenticated,
  user,
  isAuthLoading,
  authError,
  onLogin
}: {
  isAuthenticated: boolean;
  user: { email: string } | null;
  isAuthLoading: boolean;
  authError: unknown;
  onLogin: () => void;
}) {
  if (isAuthenticated && user) {
    return (
      <div className={styles.authBoxSuccess}>
        <p className={styles.authSuccessText}>
          <strong>✅ Logged in as:</strong> {user.email}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.authBoxPrompt}>
      <h2 className={styles.authTitle}>Authentication Required</h2>
      <p className={styles.authText}>You need to be logged in to test Stripe subscription flows.</p>
      {authError != null && (
        <p className={styles.authError}>
          <strong>Error:</strong> {String(authError)}
        </p>
      )}
      <button onClick={onLogin} disabled={isAuthLoading} className={styles.loginButton}>
        {isAuthLoading ? "Logging in..." : "Login as ihid@jiki.io"}
      </button>
    </div>
  );
}
