"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import AppleIcon from "@/icons/apple.svg";
import GoogleIcon from "@/icons/google.svg";
import ClipboardIcon from "@/icons/clipboard.svg";
import { CALENDAR_GOOGLE_URL, CALENDAR_WEBCAL_URL } from "@/lib/calendar/calendarSubscribeLinks";
import styles from "./CalendarSubscribeModal.module.css";

export function CalendarSubscribeModal() {
  const t = useTranslations("modals.calendarSubscribe");

  return (
    <div className={styles.body}>
      <h2 className={styles.title}>{t("title")}</h2>
      <p className={styles.description}>{t("description")}</p>

      <div className={styles.providers}>
        <a href={CALENDAR_WEBCAL_URL} className={styles.providerButton}>
          <AppleIcon className={styles.providerIcon} aria-hidden="true" />
          <span>{t("apple")}</span>
        </a>
        <a href={CALENDAR_GOOGLE_URL} target="_blank" rel="noopener noreferrer" className={styles.providerButton}>
          <GoogleIcon className={styles.providerIcon} aria-hidden="true" />
          <span>{t("google")}</span>
        </a>
      </div>

      <div className={styles.other}>
        <span className={styles.otherLabel}>{t("otherLabel")}</span>
        <p className={styles.otherHelp}>{t("otherHelp")}</p>
        <CopyLinkRow value={CALENDAR_WEBCAL_URL} copiedLabel={t("copied")} />
      </div>
    </div>
  );
}

function CopyLinkRow({ value, copiedLabel }: { value: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <div className={styles.copyRow}>
      <input className={styles.copyInput} type="text" value={value} readOnly onFocus={(e) => e.target.select()} />
      <button type="button" className={styles.copyButton} onClick={() => handleCopy(value, setCopied)}>
        <ClipboardIcon className={styles.copyIcon} aria-hidden="true" />
        {copied ? <span className={styles.copiedFlash}>{copiedLabel}</span> : null}
      </button>
    </div>
  );
}

function handleCopy(value: string, setCopied: (copied: boolean) => void) {
  navigator.clipboard
    .writeText(value)
    .catch((err: unknown) => {
      console.error("Clipboard write failed:", err);
    })
    .finally(() => setCopied(true));
}
