"use client";

import { useGoogleLogin } from "@react-oauth/google";
import GoogleIcon from "@/icons/google.svg";

interface GoogleAuthButtonProps {
  children: React.ReactNode;
  onSuccess: (code: string) => void;
  onError?: () => void;
}

function GoogleAuthButtonInner({ children, onSuccess, onError }: GoogleAuthButtonProps) {
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      onSuccess(codeResponse.code);
    },
    onError,
    flow: "auth-code"
  });

  return (
    <button type="button" onClick={() => login()} className="ui-btn ui-btn-tertiary">
      <GoogleIcon />
      {children}
    </button>
  );
}

export function GoogleAuthButton(props: GoogleAuthButtonProps) {
  // Don't render if Google OAuth client ID is not configured
  if (!process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID) {
    return null;
  }

  return <GoogleAuthButtonInner {...props} />;
}
