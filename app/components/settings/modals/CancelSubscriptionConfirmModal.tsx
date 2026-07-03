"use client";

import { useTranslations } from "next-intl";
import { hideModal, showModal } from "@/lib/modal/store";
import ExclamationCircleIcon from "@/icons/exclamation-circle.svg";
import TickCircleIcon from "@/icons/tick-circle.svg";
import styles from "./CancelSubscriptionModal.module.css";

interface CancelSubscriptionConfirmModalProps {
  onConfirmCancel: () => Promise<void>;
  premiumEndDate: string;
}

export function CancelSubscriptionConfirmModal({
  onConfirmCancel,
  premiumEndDate
}: CancelSubscriptionConfirmModalProps) {
  const t = useTranslations("settings.cancelConfirm");
  const handleKeepSubscription = () => {
    hideModal();
  };

  const handleCancelSubscription = async () => {
    await onConfirmCancel();
    showModal("cancel-subscription-success-modal", { premiumEndDate });
  };

  return (
    <div className={styles.content}>
      <div className={`${styles.icon} ${styles.iconWarning}`}>
        <ExclamationCircleIcon />
      </div>
      <h3 className={styles.title}>{t("title")}</h3>
      <p className={styles.message}>{t("message")}</p>

      <BenefitsPanel />

      <div className={styles.buttons}>
        <button className="ui-btn ui-btn-default ui-btn-primary ui-btn-purple" onClick={handleKeepSubscription}>
          {t("keep")}
        </button>
        <button className="ui-btn ui-btn-default ui-btn-tertiary" onClick={handleCancelSubscription}>
          {t("cancel")}
        </button>
      </div>
    </div>
  );
}

function BenefitsPanel() {
  const t = useTranslations("settings.cancelConfirm");
  const benefits = [t("benefit1"), t("benefit2"), t("benefit3"), t("benefit4")];
  return (
    <div className={styles.benefitsPanel}>
      <h4 className={styles.benefitsTitle}>{t("benefitsTitle")}</h4>
      {benefits.map((benefit) => (
        <div key={benefit} className={styles.benefitItem}>
          <TickCircleIcon />
          <span>{benefit}</span>
        </div>
      ))}
    </div>
  );
}
