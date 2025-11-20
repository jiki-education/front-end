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
    <button
      type="button"
      onClick={() => login()}
      className="w-full px-20 py-16 border-2 border-[#e2e8f0] rounded-xl text-[17px] font-medium text-[#1a365d] bg-white shadow-sm transition-all duration-300 flex items-center justify-center gap-3 hover:border-[#3b82f6] hover:shadow-lg hover:shadow-blue-100 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      <GoogleIcon />
      {children}
    </button>
  );
}

export function GoogleAuthButton(props: GoogleAuthButtonProps) {
  // Don't render if Google OAuth client ID is not configured
  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    return null;
  }

  return <GoogleAuthButtonInner {...props} />;
}
