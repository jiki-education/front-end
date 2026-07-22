"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { confirmEmail as confirmEmailApi } from "@/lib/auth/service";
import { useAuthStore } from "@/lib/auth/authStore";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import { AuthErrorCard } from "./AuthErrorCard";
import { AuthPendingMessage } from "./AuthPendingMessage";
import { EmailConfirmedMessage } from "./EmailConfirmedMessage";

export function ConfirmEmailForm() {
  const t = useTranslations("auth.confirmEmail");
  const routes = useLocaleRoutes();
  const dashboardPath = routes.dashboard();
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
          router.push(dashboardPath);
        }, 2000);
      } catch {
        setStatus("error");
      }
    };

    void doConfirmEmail();
  }, [token, router, setUser, dashboardPath]);

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
      ctaHref={routes.authResendConfirmation()}
      ctaText={t("errorCta")}
    />
  );
}
