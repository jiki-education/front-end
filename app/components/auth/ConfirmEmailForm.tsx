"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { confirmEmail as confirmEmailApi } from "@/lib/auth/service";
import { useAuthStore } from "@/lib/auth/authStore";
import { AuthErrorCard } from "./AuthErrorCard";
import { AuthPendingMessage } from "./AuthPendingMessage";
import { EmailConfirmedMessage } from "./EmailConfirmedMessage";

export function ConfirmEmailForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [status, setStatus] = useState<"confirming" | "success" | "error">("confirming");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    const doConfirmEmail = async () => {
      try {
        const user = await confirmEmailApi(token);
        setUser(user);
        setStatus("success");

        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } catch {
        setStatus("error");
      }
    };

    void doConfirmEmail();
  }, [token, router, setUser]);

  if (status === "confirming") {
    return (
      <AuthPendingMessage
        title="Confirming your email..."
        description="Please wait while we confirm your email address."
      />
    );
  }

  if (status === "success") {
    return <EmailConfirmedMessage />;
  }

  return (
    <AuthErrorCard
      title="Link expired"
      message="This confirmation link is no longer valid. Request a new one to continue."
      ctaHref="/auth/resend-confirmation"
      ctaText="Resend confirmation email"
    />
  );
}
