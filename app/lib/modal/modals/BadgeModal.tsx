"use client";

import { hideModal } from "../store";
import type { BadgeModalData } from "@/app/(app)/achievements/badgeData";
import styles from "./BadgeModal.module.css";
import { BadgeIcon } from "@/components/BadgeIcon";

interface BadgeModalProps {
  badgeData: BadgeModalData;
}

export function BadgeModal({ badgeData }: BadgeModalProps) {
  return (
    <div className={styles.modalContainer}>
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

        {/* Community Stat Box */}
        <div className={styles.modalStatBox}>
          <div className={styles.modalStatLabel}>Community Stat</div>
          <div className={styles.modalStatValue}>{badgeData.stat}</div>
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
