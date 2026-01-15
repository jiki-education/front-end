"use client";

import { hideModal } from "../store";
import type { BadgeModalData } from "@/app/(app)/achievements/badgeData";
import styles from "./BadgeModal.module.css";
import { useState } from "react";
import Image from "next/image";

interface FlipBadgeModalProps {
  badgeData: BadgeModalData;
  onClose?: () => void;
}

const FALLBACK_IMAGE = "/static/images/achievement-icons/About-Us-1--Streamline-Manila.png";

export function FlipBadgeModal({ badgeData, onClose }: FlipBadgeModalProps) {
  const [imageSrc, setImageSrc] = useState(badgeData.icon);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
      setImageSrc(FALLBACK_IMAGE);
    }
  };

  return (
    <div className={styles.flipModalContainer}>
      <div className={styles.flipModalCard}>
        <div className={styles.flipModalFront}>
          {/* New Badge Tag */}
          <div className={styles.flipModalNewTag}>New Badge!</div>

          {/* Badge Icon */}
          <div className={styles.flipModalIcon}>
            <Image src={imageSrc} alt={badgeData.title} width={80} height={80} onError={handleImageError} />
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
