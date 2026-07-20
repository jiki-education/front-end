"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import type { UsageStatus } from "../lib/chatUsage";
import { FAIR_USAGE_ARTICLE_SLUG } from "../lib/chatUsage";
import styles from "./ChatUsageNotice.module.css";

interface ChatUsageNoticeProps {
  status: UsageStatus | null;
}

// Soft usage messaging shown under the composer: a "getting close" warning as
// the user approaches their limit, then a terminal "limit reached" notice once
// they hit the cap (the composer is disabled separately by ChatInputArea).
export default function ChatUsageNotice({ status }: ChatUsageNoticeProps) {
  const t = useTranslations("codingExercise.chatUsageNotice");
  const routes = useLocaleRoutes();

  if (!status || (!status.warning && !status.atCap)) {
    return null;
  }

  const text = status.atCap
    ? status.scope === "monthly"
      ? t("limitReached.monthly", { limit: status.limit })
      : t("limitReached.daily", { limit: status.limit })
    : status.scope === "monthly"
      ? t("warning.monthly", { used: status.used, limit: status.limit })
      : t("warning.daily", { used: status.used, limit: status.limit });

  return (
    <div className={`${styles.bar} ${status.atCap ? styles.cap : ""}`}>
      <span className={styles.text}>{text}</span>{" "}
      <Link
        href={routes.article(FAIR_USAGE_ARTICLE_SLUG)}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
      >
        {t("learnMore")}
      </Link>
    </div>
  );
}
