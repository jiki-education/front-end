"use client";

import { useTranslations } from "next-intl";
import { hideModal } from "../store";
import styles from "./InfoModal.module.css";

interface InfoModalProps {
  title?: string;
  content?: string | React.ReactNode;
  buttonText?: string;
}

export function InfoModal({ title, content = "", buttonText }: InfoModalProps) {
  const t = useTranslations("modals.info");
  return (
    <div className={styles.body}>
      <h2 className={styles.title}>{title ?? t("defaultTitle")}</h2>
      <div className={styles.content}>{typeof content === "string" ? <p>{content}</p> : content}</div>
      <div className={styles.buttonRow}>
        <button onClick={hideModal} className={styles.button}>
          {buttonText ?? t("defaultButton")}
        </button>
      </div>
    </div>
  );
}
