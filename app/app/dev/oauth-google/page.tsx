"use client";

/**
 * Google OAuth Test Page
 * Development-only page for testing Google OAuth flows
 */

import { useAuthStore } from "@/stores/authStore";
import { googleLogin } from "@/lib/auth/service";
import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import { useState } from "react";
import toast from "react-hot-toast";

export default function GoogleOAuthTestPage() {
  const { user, isAuthenticated, isLoading: isAuthLoading, error: authError, login, logout } = useAuthStore();
  const [oauthError, setOauthError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle Google OAuth login success
  const handleGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      setOauthError("No credential received from Google");
      toast.error("No credential received from Google");
      return;
    }

    setIsProcessing(true);
    setOauthError(null);

    try {
      toast.loading("Authenticating with Google...");
      const loggedInUser = await googleLogin(credentialResponse.credential);

      // Update auth store state directly
      useAuthStore.setState({
        user: loggedInUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        hasCheckedAuth: true
      });

      toast.dismiss();
      toast.success(`Welcome ${loggedInUser.name || loggedInUser.email}!`);
    } catch (error) {
      toast.dismiss();
      const errorMessage = error instanceof Error ? error.message : "Google authentication failed";
      setOauthError(errorMessage);
      toast.error(errorMessage);
      console.error("Google OAuth error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Google OAuth login error
  const handleGoogleLoginError = () => {
    setOauthError("Google login failed");
    toast.error("Google login failed");
  };

  // Handle traditional email/password login for testing
  const handleTraditionalLogin = async () => {
    try {
      await login({
        email: "ihid@jiki.io",
        password: "password"
      });
      toast.success("Logged in successfully!");
    } catch (err) {
      console.error("Login failed:", err);
      toast.error("Login failed");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Logout failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Google OAuth Test</h1>
          <p className="text-gray-600 mt-2">Test Google Sign-In integration with Jiki backend</p>
        </div>

        {/* Environment Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h2 className="font-semibold text-blue-900 mb-2">Environment</h2>
          <div className="text-sm text-blue-800 space-y-1">
            <p>
              <strong>Google Client ID:</strong>{" "}
              {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
                ? `${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID.substring(0, 20)}...`
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
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Google OAuth Sign-In</h2>

          {oauthError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-800">
                <strong>OAuth Error:</strong> {oauthError}
              </p>
            </div>
          )}

          <div className="space-y-4">
            <p className="text-gray-600">Click the button below to test Google Sign-In:</p>

            <div className="max-w-md">
              <GoogleLogin onSuccess={handleGoogleLoginSuccess} onError={handleGoogleLoginError} />
            </div>

            {isProcessing && (
              <div className="flex items-center text-blue-600">
                <Spinner className="mr-2" />
                <span>Processing authentication...</span>
              </div>
            )}

            {isAuthenticated && (
              <p className="text-sm text-green-600">
                ✓ You are already authenticated. Click above to test account linking or logout first to test new account
                creation.
              </p>
            )}
          </div>
        </div>

        {/* User Details */}
        {isAuthenticated && user && <UserDetailsSection user={user} />}

        {/* Test Instructions */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test Scenarios</h2>
          <div className="space-y-3 text-sm">
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
  authError: string | null;
  onTraditionalLogin: () => void;
  onLogout: () => void;
}) {
  if (isAuthLoading) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-gray-600">Checking authentication...</p>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-green-800">
              <strong>✓ Authenticated as:</strong> {user.name || user.email}
            </p>
            <p className="text-sm text-green-700 mt-1">Email: {user.email}</p>
          </div>
          <button
            onClick={onLogout}
            className="px-3 py-1 text-sm bg-green-700 text-white rounded hover:bg-green-800 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-3 text-yellow-900">Not Authenticated</h2>
      <p className="text-yellow-800 mb-4">
        You can test Google OAuth while logged out (new account) or logged in (account linking).
      </p>
      {authError && (
        <p className="text-red-600 mb-4">
          <strong>Auth Error:</strong> {authError}
        </p>
      )}
      <button
        onClick={onTraditionalLogin}
        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Login as ihid@jiki.io (for testing)
      </button>
    </div>
  );
}

function UserDetailsSection({ user }: { user: unknown }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">User Details</h2>
      <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
        <code>{JSON.stringify(user, null, 2)}</code>
      </pre>
    </div>
  );
}

function TestScenario({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-600 ml-4">{description}</p>
    </div>
  );
}

// Loading Components
function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      width="20"
      height="20"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}
