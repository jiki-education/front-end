"use client";

import type { BadgeModalData } from "@/app/(app)/achievements/badgeData";
import { BadgeIcon } from "@/components/icons/BadgeIcon";
import { hideModal } from "../store";
import styles from "./BadgeModal.module.css";

interface BadgeModalProps {
  badgeData: BadgeModalData;
}

export function BadgeModal({ badgeData }: BadgeModalProps) {
  return (
    <div className={styles.container}>
      {/* Modal Header */}
      <div className={styles.header}>
        <div className={`${styles.badgeIcon} ${styles[badgeData.color]}`}>
          <BadgeIcon slug={badgeData.slug} />
        </div>
        <h2 className={styles.title}>{badgeData.title}</h2>
        <div className={styles.date}>{badgeData.date}</div>
      </div>

      {/* Modal Body */}
      <div className={styles.body}>
        <p className={styles.description}>{badgeData.description}</p>

        {/* Fun Fact Box */}
        <div className={styles.factBox}>
          <div className={styles.factLabel}>Fun Fact</div>
          <div className={styles.factValue}>{badgeData.funFact}</div>
        </div>
      </div>

      {/* Action Button */}
      <div className={styles.buttonWrapper}>
        <button onClick={hideModal} className="ui-btn ui-btn-large ui-btn-primary w-[100%]">
          Keep Going!
        </button>
      </div>
    </div>
  );
}
