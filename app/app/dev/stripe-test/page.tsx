"use client";

/**
 * Stripe Test Page
 * Development-only page for testing Stripe subscription flows
 */

import { useEffect } from "react";
import { extractAndClearSessionId, verifyPaymentSession } from "@/lib/subscriptions/verification";
import { useAuthStore } from "@/stores/authStore";
import toast from "react-hot-toast";
import { AuthenticatedSection } from "./components/AuthenticatedSection";

export default function StripeTestPage() {
  const { user, isAuthenticated, isLoading: isAuthLoading, error: authError, login, refreshUser } = useAuthStore();

  // Refresh user data on mount to get latest subscription status
  useEffect(() => {
    if (user) {
      void refreshUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only on mount - we don't want to re-run when user or refreshUser changes

  // Check for success parameter from payment redirect
  useEffect(() => {
    // Only process if user is authenticated
    if (!isAuthenticated || !user) {
      return;
    }

    const sessionId = extractAndClearSessionId();

    if (sessionId) {
      // Verify the checkout session and sync subscription
      async function verifyAndRefresh(id: string) {
        toast.loading("Verifying payment...");
        const result = await verifyPaymentSession(id);
        toast.dismiss();

        if (result.success) {
          toast.success("Payment verified! Refreshing user data...");
          await refreshUser();
        } else {
          toast.error(`Failed to verify payment: ${result.error}`);
        }
      }

      void verifyAndRefresh(sessionId);
    }
  }, [isAuthenticated, user, refreshUser]);

  const handleLogin = async () => {
    try {
      await login({
        email: "ihid@jiki.io",
        password: "password"
      });
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Stripe Subscription Test</h1>

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
  authError: string | null;
  onLogin: () => void;
}) {
  if (isAuthenticated && user) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-green-800">
          <strong>✅ Logged in as:</strong> {user.email}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-3 text-yellow-900">Authentication Required</h2>
      <p className="text-yellow-800 mb-4">You need to be logged in to test Stripe subscription flows.</p>
      {authError && (
        <p className="text-red-600 mb-4">
          <strong>Error:</strong> {authError}
        </p>
      )}
      <button
        onClick={onLogin}
        disabled={isAuthLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isAuthLoading ? "Logging in..." : "Login as ihid@jiki.io"}
      </button>
    </div>
  );
}
