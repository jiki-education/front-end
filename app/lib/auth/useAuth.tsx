"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toastError } from "@/lib/toast";
import { useAuthStore } from "@/lib/auth/authStore";
import { storeReturnTo, getPostAuthRedirect } from "@/lib/auth/return-to";
import { hardNavigate } from "@/lib/auth/hardNavigate";
import type { LoginResponse } from "@/types/auth";
import { TwoFactorSetupForm } from "@/components/auth/TwoFactorSetupForm";
import { TwoFactorVerifyForm } from "@/components/auth/TwoFactorVerifyForm";

type TwoFactorState = { type: "none" } | { type: "setup"; provisioningUri: string } | { type: "verify" };

interface UseAuthReturn {
  handleAuthResponse: (result: LoginResponse) => void;
  handleGoogleSuccess: (code: string) => Promise<void>;
  googleAuthError: string | null;
  returnTo: string | null;
  TwoFactorForm: React.ReactNode | null;
}

export function useAuth(): UseAuthReturn {
  const searchParams = useSearchParams();
  const { googleLogin } = useAuthStore();

  const [twoFactorState, setTwoFactorState] = useState<TwoFactorState>({ type: "none" });
  const [googleAuthError, setGoogleAuthError] = useState<string | null>(null);

  const returnTo = searchParams.get("return_to");

  // Store return_to in sessionStorage on mount so it persists across page navigations
  useEffect(() => {
    storeReturnTo(returnTo);
  }, [returnTo]);

  // A full document load, for an external return_to and for /dashboard alike.
  // This page was rendered for an anonymous visitor in the URL's locale; the
  // login has just changed both, and a client-side push would keep that shell
  // (see hardNavigate).
  const redirectAfterAuth = () => {
    hardNavigate(getPostAuthRedirect(returnTo));
  };

  const handleAuthResponse = (result: LoginResponse) => {
    if (result.status === "success") {
      redirectAfterAuth();
      return;
    }

    if (result.status === "2fa_setup_required") {
      setTwoFactorState({ type: "setup", provisioningUri: result.provisioning_uri });
      return;
    }

    // 2fa_required
    setTwoFactorState({ type: "verify" });
  };

  const handleGoogleSuccess = async (code: string) => {
    setGoogleAuthError(null);
    try {
      const result = await googleLogin(code);
      handleAuthResponse(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Google authentication failed";
      setGoogleAuthError(message);
    }
  };

  const handleTwoFactorCancel = () => {
    setTwoFactorState({ type: "none" });
  };

  const handleSessionExpired = () => {
    setTwoFactorState({ type: "none" });
    toastError("auth.sessionExpired");
  };

  let TwoFactorForm: React.ReactNode | null = null;

  if (twoFactorState.type === "setup") {
    TwoFactorForm = (
      <TwoFactorSetupForm
        provisioningUri={twoFactorState.provisioningUri}
        onSuccess={redirectAfterAuth}
        onCancel={handleTwoFactorCancel}
        onSessionExpired={handleSessionExpired}
      />
    );
  } else if (twoFactorState.type === "verify") {
    TwoFactorForm = (
      <TwoFactorVerifyForm
        onSuccess={redirectAfterAuth}
        onCancel={handleTwoFactorCancel}
        onSessionExpired={handleSessionExpired}
      />
    );
  }

  return {
    handleAuthResponse,
    handleGoogleSuccess,
    googleAuthError,
    returnTo,
    TwoFactorForm
  };
}
