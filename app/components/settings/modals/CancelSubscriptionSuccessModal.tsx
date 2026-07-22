"use client";

import { useTranslations } from "next-intl";
import { hideModal } from "@/lib/modal/store";
import TickCircleIcon from "@/icons/tick-circle.svg";
import styles from "./CancelSubscriptionModal.module.css";

interface CancelSubscriptionSuccessModalProps {
  premiumEndDate: string;
}

export function CancelSubscriptionSuccessModal({ premiumEndDate }: CancelSubscriptionSuccessModalProps) {
  const t = useTranslations("settings.cancelSuccess");
  const handleClose = () => {
    hideModal();
  };

  return (
    <div className={styles.content}>
      <div className={`${styles.icon} ${styles.iconSuccess}`}>
        <TickCircleIcon />
      </div>
      <h3 className={styles.title}>{t("title")}</h3>
      <p className={styles.message}>{t("message")}</p>

      <div className={styles.confirmationDate}>
        <div className={styles.dateLabel}>{t("accessUntil")}</div>
        <div className={styles.dateValue}>{premiumEndDate}</div>
      </div>

      <p className={styles.resubscribeNote}>{t("resubscribeNote")}</p>

      <div className={styles.buttons}>
        <button className="ui-btn ui-btn-default ui-btn-primary" onClick={handleClose}>
          {t("gotIt")}
        </button>
      </div>
    </div>
  );
}
