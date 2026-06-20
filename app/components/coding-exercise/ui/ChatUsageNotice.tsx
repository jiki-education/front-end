"use client";

import Link from "next/link";
import type { UsageStatus } from "../lib/chatUsage";
import { FAIR_USAGE_ARTICLE_PATH, usageLimitText, usageWarningText } from "../lib/chatUsage";
import styles from "./ChatUsageNotice.module.css";

interface ChatUsageNoticeProps {
  status: UsageStatus | null;
}

// Soft usage messaging shown under the composer: a "getting close" warning as
// the user approaches their limit, then a terminal "limit reached" notice once
// they hit the cap (the composer is disabled separately by ChatInputArea).
export default function ChatUsageNotice({ status }: ChatUsageNoticeProps) {
  if (!status || (!status.warning && !status.atCap)) {
    return null;
  }

  const text = status.atCap ? usageLimitText(status.scope, status.limit) : usageWarningText(status);

  return (
    <div className={`${styles.bar} ${status.atCap ? styles.cap : ""}`}>
      <span className={styles.text}>{text}</span>{" "}
      <Link href={FAIR_USAGE_ARTICLE_PATH} target="_blank" rel="noopener noreferrer" className={styles.link}>
        Learn More
      </Link>
    </div>
  );
}
