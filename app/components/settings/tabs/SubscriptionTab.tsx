"use client";

import { useTranslations } from "next-intl";
import type { User } from "@/types/auth";
import SubscriptionErrorBoundary from "../subscription/SubscriptionErrorBoundary";
import SubscriptionSection from "../subscription/SubscriptionSection";

interface SubscriptionTabProps {
  user: User | null;
  refreshUser: () => Promise<void>;
}

export default function SubscriptionTab({ user, refreshUser }: SubscriptionTabProps) {
  const t = useTranslations("settings.errorBoundary");
  const tCommon = useTranslations("common");
  return (
    <SubscriptionErrorBoundary
      messages={{
        title: t("title"),
        messagePart1: t("messagePart1"),
        messagePart2: t("messagePart2"),
        refresh: t("refresh"),
        tryAgain: tCommon("tryAgain"),
        detailsSummary: t("detailsSummary")
      }}
    >
      <SubscriptionSection user={user} refreshUser={refreshUser} />
    </SubscriptionErrorBoundary>
  );
}
