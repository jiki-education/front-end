/* eslint-disable @next/next/no-img-element */
"use client";

import { hideModal } from "../store";
import type { BadgeModalData } from "@/app/(app)/achievements/badgeData";
import styles from "./BadgeModal.module.css";
import { useState } from "react";

interface BadgeModalProps {
  badgeData: BadgeModalData;
}

const FALLBACK_IMAGE = "/static/About-Us-1--Streamline-Manila.png";

export function BadgeModal({ badgeData }: BadgeModalProps) {
  const [imageSrc, setImageSrc] = useState(badgeData.icon);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
      setImageSrc(FALLBACK_IMAGE);
    }
  };

  return (
    <div className={styles.modalContainer}>
      {/* Modal Header */}
      <div className={styles.modalHeader}>
        <div className={`${styles.modalBadgeIcon} ${styles[badgeData.color]}`}>
          <img src={imageSrc} alt={badgeData.title} onError={handleImageError} />
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
