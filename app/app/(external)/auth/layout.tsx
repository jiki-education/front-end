"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";

export default function AuthExternalLayout({ children }: { children: React.ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return children; // Gracefully fallback without Google OAuth
  }

  return <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>;
}
