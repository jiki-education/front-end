"use client";

import type { BadgeModalData } from "@/app/(app)/achievements/badgeData";
import { BadgeIcon } from "@/components/icons/BadgeIcon";
import { useTranslations } from "next-intl";
import { hideModal } from "../store";
import styles from "./BadgeModal.module.css";
import { assembleClassNames } from "../../assemble-classnames";

interface BadgeModalProps {
  badgeData: BadgeModalData;
  firstTime: boolean;
  onClose?: () => void;
}

export function BadgeModal({ badgeData, firstTime, onClose }: BadgeModalProps) {
  const t = useTranslations("modals.badge");
  const handleClose = () => {
    onClose?.();
    hideModal();
  };

  return (
    <div className={assembleClassNames(styles.container, firstTime ? styles.firstTime : "")}>
      <div className={styles.content}>
        <div className={`${styles.badgeIcon} ${styles[badgeData.color]}`}>
          <BadgeIcon slug={badgeData.slug} />
        </div>

        <h2 className={styles.title}>{badgeData.title}</h2>

        <p className={styles.description}>{badgeData.description}</p>

        {/* Fun Fact Box */}
        <div className={styles.factLabel}>{t("funFact")}</div>
        <div className={styles.factValue}>{badgeData.funFact}</div>

        {/* Action Button */}
        <button onClick={handleClose} className="ui-btn ui-btn-xlarge ui-btn-for-colorful-background w-[100%]">
          {t("keepGoing")}
        </button>
      </div>
    </div>
  );
}
