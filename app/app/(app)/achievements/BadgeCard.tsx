/* eslint-disable @next/next/no-img-element */
import styles from "./BadgeCard.module.css";
import { useState } from "react";
import type { BadgeData } from "@/lib/api/badges";
import { isNewBadge, isEarnedBadge, getBadgeDate, getBadgeColor, getBadgeIconSrc } from "./lib/badgeUtils";

interface BadgeCardProps {
  badge: BadgeData;
  onClick?: (badgeId: string) => void;
  isSpinning?: boolean;
  showNewRibbon?: boolean;
}

const FALLBACK_IMAGE = "/static/images/achievement-icons/About-Us-1--Streamline-Manila.png";

export function BadgeCard({ badge, onClick, isSpinning = false, showNewRibbon = false }: BadgeCardProps) {
  const [imageSrc, setImageSrc] = useState(getBadgeIconSrc(badge));
  const [imageError, setImageError] = useState(false);

  const isNew = isNewBadge(badge);
  const isEarned = isEarnedBadge(badge);
  const badgeDate = getBadgeDate(badge);
  const badgeColor = getBadgeColor(badge);

  const handleClick = () => {
    if (isEarned && onClick) {
      onClick(badge.id.toString());
    }
  };

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
      setImageSrc(FALLBACK_IMAGE);
    }
  };

  const getClassNames = () => {
    const classNames = [styles.badgeCard];

    if (isEarned) {
      classNames.push(styles.earned);

      // Apply amber theme for recently revealed badges
      if (showNewRibbon) {
        classNames.push(styles.amber);
      } else {
        classNames.push(styles[badgeColor]);
      }

      if (isNew) {
        classNames.push(styles.new);
        if (isSpinning) {
          classNames.push(styles.spinning);
        }
      }
    }

    if (!isEarned) {
      classNames.push(styles.locked);
    }

    return classNames.join(" ");
  };

  return (
    <div
      className={getClassNames()}
      data-type="achievement"
      onClick={handleClick}
      style={{ cursor: isEarned ? "pointer" : "default" }}
    >
      {showNewRibbon && !isSpinning && <div className={styles.newRibbon}>NEW</div>}

      {isEarned && isNew && (
        <>
          <div className={styles.cardBack}></div>
          <div className={styles.cardFront}>
            <div className={styles.shimmerOverlay}></div>
            <div className={styles.badgeIconWrapper}>
              <img src={imageSrc} alt={badge.name} onError={handleImageError} />
              <div className={styles.badgeRibbon}></div>
            </div>
            <div className={styles.badgeTitle}>{badge.name}</div>
            <div className={styles.badgeSubtitle}>{badge.description}</div>
            <div className={styles.badgeDate}>{badgeDate}</div>
          </div>
        </>
      )}

      {(!isEarned || !isNew) && (
        <>
          <div className={styles.badgeIconWrapper}>
            <img src={imageSrc} alt={badge.name} onError={handleImageError} />
            <div className={styles.badgeRibbon}></div>
          </div>
          <div className={styles.badgeTitle}>{badge.name}</div>
          <div className={styles.badgeSubtitle}>{badge.description}</div>
          <div className={styles.badgeDate}>{badgeDate}</div>
        </>
      )}
    </div>
  );
}
