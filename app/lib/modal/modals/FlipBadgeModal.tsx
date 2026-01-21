"use client";

import type { BadgeModalData } from "@/app/(app)/achievements/badgeData";
import { BadgeIcon } from "@/components/icons/BadgeIcon";
import { hideModal } from "../store";
import styles from "./BadgeModal.module.css";

interface FlipBadgeModalProps {
  badgeData: BadgeModalData;
  onClose?: () => void;
}

export function FlipBadgeModal({ badgeData, onClose }: FlipBadgeModalProps) {
  return (
    <div className={styles.flipContainer}>
      <div className={styles.flipCard}>
        <div className={styles.flipFront}>
          {/* New Badge Tag */}
          <div className={styles.flipNewTag}>New Badge!</div>

          {/* Badge Icon */}
          <div className={styles.flipIcon}>
            <BadgeIcon slug={badgeData.slug} width={80} height={80} />
          </div>

          {/* Title and Date */}
          <h2 className={styles.flipTitle}>{badgeData.title}</h2>
          <div className={styles.flipDate}>{badgeData.date}</div>

          {/* Description */}
          <p className={styles.flipDescription}>{badgeData.description}</p>

          {/* Fun Fact Box */}
          <div className={styles.flipFactBox}>
            <div className={styles.flipFactLabel}>Fun Fact</div>
            <div className={styles.flipFactValue}>{badgeData.funFact}</div>
          </div>

          {/* Action Button */}
          <div className={styles.flipButtonWrapper}>
            <button
              onClick={() => {
                onClose?.();
                hideModal();
              }}
              className={styles.flipClose}
            >
              Keep Going!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
