"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { confirmEmail as confirmEmailApi } from "@/lib/auth/service";
import { useAuthStore } from "@/lib/auth/authStore";
import { AuthErrorCard } from "./AuthErrorCard";
import { AuthPendingMessage } from "./AuthPendingMessage";
import { EmailConfirmedMessage } from "./EmailConfirmedMessage";

export function ConfirmEmailForm() {
  const t = useTranslations("auth.confirmEmail");
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
    return <AuthPendingMessage title={t("pendingTitle")} description={t("pendingDescription")} />;
  }

  if (status === "success") {
    return <EmailConfirmedMessage />;
  }

  return (
    <AuthErrorCard
      title={t("errorTitle")}
      message={t("errorMessage")}
      ctaHref="/auth/resend-confirmation"
      ctaText={t("errorCta")}
    />
  );
}
