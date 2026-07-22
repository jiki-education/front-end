"use client";

import { useTranslations } from "next-intl";
import styles from "./SessionExpiredModal.module.css";

interface SessionExpiredModalProps {
  error?: Error;
}

export function SessionExpiredModal({ error: _error }: SessionExpiredModalProps) {
  const t = useTranslations("modals.sessionExpired");
  const tCommon = useTranslations("common");
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className={styles.body}>
      <h2 className={styles.title}>{t("title")}</h2>
      <p className={styles.description}>{t("description")}</p>
      <div className={styles.buttonRow}>
        <button onClick={handleReload} className={`${styles.button} focus-ring`}>
          {tCommon("reloadPage")}
        </button>
      </div>
    </div>
  );
}
