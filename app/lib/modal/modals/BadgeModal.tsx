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
  );
}
