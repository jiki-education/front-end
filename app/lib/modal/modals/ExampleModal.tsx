"use client";

import { useTranslations } from "next-intl";
import { hideModal } from "../store";
import styles from "./ExampleModal.module.css";

interface ExampleModalProps {
  title?: string;
  message?: string;
}

export function ExampleModal({ title, message }: ExampleModalProps) {
  const t = useTranslations("modals.example");
  const tCommon = useTranslations("common");
  return (
    <div className={styles.body}>
      <h2 className={styles.title}>{title ?? t("defaultTitle")}</h2>
      <p className={styles.message}>{message ?? t("defaultMessage")}</p>
      <div className={styles.buttonRow}>
        <button onClick={hideModal} className={styles.buttonSecondary}>
          {tCommon("cancel")}
        </button>
        <button
          onClick={() => {
            // Example modal action would go here
            hideModal();
          }}
          className={styles.buttonPrimary}
        >
          {tCommon("confirm")}
        </button>
      </div>
    </div>
  );
}
