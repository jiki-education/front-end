"use client";

import { hideModal } from "../store";
import type { BadgeModalData } from "@/app/(app)/achievements/badgeData";
import styles from "./BadgeModal.module.css";
import { BadgeIcon } from "@/components/BadgeIcon";

interface FlipBadgeModalProps {
  badgeData: BadgeModalData;
  onClose?: () => void;
}

export function FlipBadgeModal({ badgeData, onClose }: FlipBadgeModalProps) {
  return (
    <div className={styles.flipModalContainer}>
      <div className={styles.flipModalCard}>
        <div className={styles.flipModalFront}>
          {/* New Badge Tag */}
          <div className={styles.flipModalNewTag}>New Badge!</div>

          {/* Badge Icon */}
          <div className={styles.flipModalIcon}>
            <BadgeIcon slug={badgeData.slug} width={80} height={80} />
          </div>

          {/* Title and Date */}
          <h2 className={styles.flipModalTitle}>{badgeData.title}</h2>
          <div className={styles.flipModalDate}>{badgeData.date}</div>

          {/* Description */}
          <p className={styles.flipModalDescription}>{badgeData.description}</p>

          {/* Community Stat Box */}
          <div className={styles.flipModalStatBox}>
            <div className={styles.flipModalStatLabel}>Community Stat</div>
            <div className={styles.flipModalStatValue}>{badgeData.stat}</div>
          </div>

          {/* Action Button */}
          <div className={styles.flipModalButtonWrapper}>
            <button
              onClick={() => {
                onClose?.();
                hideModal();
              }}
              className={styles.flipModalClose}
            >
              Keep Going!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
