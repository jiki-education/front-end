"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/auth/authStore";
import type { LoginResponse } from "@/types/auth";
import { TwoFactorSetupForm } from "@/components/auth/TwoFactorSetupForm";
import { TwoFactorVerifyForm } from "@/components/auth/TwoFactorVerifyForm";

type TwoFactorState = { type: "none" } | { type: "setup"; provisioningUri: string } | { type: "verify" };

interface UseAuthOptions {
  onSuccess: () => void;
}

interface UseAuthReturn {
  handleAuthResponse: (result: LoginResponse) => void;
  handleGoogleAuth: (code: string) => Promise<void>;
  googleAuthError: string | null;
  TwoFactorForm: React.ReactNode | null;
}

export function useAuth({ onSuccess }: UseAuthOptions): UseAuthReturn {
  const { googleLogin } = useAuthStore();
  const [twoFactorState, setTwoFactorState] = useState<TwoFactorState>({ type: "none" });
  const [googleAuthError, setGoogleAuthError] = useState<string | null>(null);

  const handleAuthResponse = (result: LoginResponse) => {
    if (result.status === "success") {
      onSuccess();
      return;
    }

    if (result.status === "2fa_setup_required") {
      setTwoFactorState({ type: "setup", provisioningUri: result.provisioning_uri });
      return;
    }

    // 2fa_required
    setTwoFactorState({ type: "verify" });
  };

  const handleGoogleAuth = async (code: string) => {
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
  };

  let TwoFactorForm: React.ReactNode | null = null;

  if (twoFactorState.type === "setup") {
    TwoFactorForm = (
      <TwoFactorSetupForm
        provisioningUri={twoFactorState.provisioningUri}
        onSuccess={onSuccess}
        onCancel={handleTwoFactorCancel}
        onSessionExpired={handleSessionExpired}
      />
    );
  } else if (twoFactorState.type === "verify") {
    TwoFactorForm = (
      <TwoFactorVerifyForm
        onSuccess={onSuccess}
        onCancel={handleTwoFactorCancel}
        onSessionExpired={handleSessionExpired}
      />
    );
  }

  return {
    handleAuthResponse,
    handleGoogleAuth,
    googleAuthError,
    TwoFactorForm
  };
}
