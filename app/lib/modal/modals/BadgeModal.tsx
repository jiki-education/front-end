"use client";

import type { BadgeModalData } from "@/app/(app)/achievements/badgeData";
import { BadgeIcon } from "@/components/icons/BadgeIcon";
import { CloseButton } from "@/components/ui-kit";
import { hideModal } from "../store";
import styles from "./BadgeModal.module.css";
import { assembleClassNames } from "../../assemble-classnames";

interface BadgeModalProps {
  badgeData: BadgeModalData;
  firstTime: boolean;
  onClose?: () => void;
}

export function BadgeModal({ badgeData, firstTime, onClose }: BadgeModalProps) {
  const handleClose = () => {
    onClose?.();
    hideModal();
  };

  return (
    <div className={assembleClassNames(styles.container, firstTime ? styles.firstTime : "")}>
      <CloseButton onClick={handleClose} className="absolute top-[16px] right-[16px]" variant="default" />
      <div className={styles.content}>
        <div className={`${styles.badgeIcon} ${styles[badgeData.color]}`}>
          <BadgeIcon slug={badgeData.slug} />
        </div>

        <h2 className={styles.title}>{badgeData.title}</h2>

        <p className={styles.description}>{badgeData.description}</p>

        {/* Fun Fact Box */}
        <div className={styles.factLabel}>Fun Fact</div>
        <div className={styles.factValue}>{badgeData.funFact}</div>

        {/* Action Button */}
        <button onClick={hideModal} className="ui-btn ui-btn-xlarge ui-btn-for-colorful-background w-[100%]">
          Keep Going!
        </button>
      </div>
    </div>
  );
}
