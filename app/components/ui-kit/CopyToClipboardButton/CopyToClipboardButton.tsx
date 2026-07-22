"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "../Icon";
import styles from "./CopyToClipboardButton.module.css";

interface CopyToClipboardButtonProps {
  textToCopy: string;
  className?: string;
}

export function CopyToClipboardButton({ textToCopy, className }: CopyToClipboardButtonProps) {
  const [justCopied, setJustCopied] = useState(false);
  const t = useTranslations("common.copyButton");

  const handleClick = useCallback(() => {
    navigator.clipboard.writeText(textToCopy).catch((err: unknown) => {
      console.error("Clipboard write failed:", err);
      // Fallback for non-secure contexts (http, older browsers).
      const textarea = document.createElement("textarea");
      textarea.value = textToCopy;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
      } catch (fallbackErr) {
        console.error("Clipboard fallback failed:", fallbackErr);
      }
      document.body.removeChild(textarea);
    });
    setJustCopied(true);
  }, [textToCopy]);

  useEffect(() => {
    if (!justCopied) {
      return;
    }
    const timer = setTimeout(() => setJustCopied(false), 1000);
    return () => clearTimeout(timer);
  }, [justCopied]);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className ? `${styles.button} ${className}` : styles.button}
      aria-label={t("label")}
    >
      <div className={styles.text}>{textToCopy}</div>
      <span className={styles.icon}>
        <Icon name="clipboard" size={24} alt={t("label")} />
      </span>
      {justCopied ? <span className={styles.message}>{t("copied")}</span> : null}
    </button>
  );
}
