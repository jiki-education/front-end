"use client";

import type { BadgeModalData } from "@/app/(app)/achievements/badgeData";
import { BadgeIcon } from "@/components/icons/BadgeIcon";
import { CloseButton } from "@/components/ui-kit";
import { hideModal } from "../store";
import styles from "./BadgeModal.module.css";

interface BadgeModalProps {
  badgeData: BadgeModalData;
}

export function BadgeModal({ badgeData }: BadgeModalProps) {
  return (
    <div className={styles.modalContainer}>
      <CloseButton onClick={hideModal} className="absolute top-[16px] right-[16px]" variant="default" />
      {/* Modal Header */}
      <div className={styles.modalHeader}>
        <div className={`${styles.modalBadgeIcon} ${styles[badgeData.color]}`}>
          <BadgeIcon slug={badgeData.slug} />
        </div>
        <h2 className={styles.modalTitle}>{badgeData.title}</h2>
        <div className={styles.modalDate}>{badgeData.date}</div>
      </div>

      {/* Modal Body */}
      <div className={styles.modalBody}>
        <p className={styles.modalDescription}>{badgeData.description}</p>

        {/* Fun Fact Box */}
        <div className={styles.modalStatBox}>
          <div className={styles.modalStatLabel}>Fun Fact</div>
          <div className={styles.modalStatValue}>{badgeData.funFact}</div>
        </div>
      </div>

      {/* Action Button */}
      <div className={styles.modalButtonWrapper}>
        <button onClick={hideModal} className={styles.closeButton}>
          Keep Going!
        </button>
      </div>
    </div>
  );
}
