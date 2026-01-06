import styles from "./BadgeCard.module.css";
import { useState } from "react";

interface BadgeCardProps {
  badge: {
    id: string;
    title: string;
    subtitle: string;
    iconSrc: string;
    iconAlt: string;
    state: "earned" | "locked";
    color?: "pink" | "gold" | "purple" | "teal" | "blue" | "green";
    isNew?: boolean;
    date: string;
  };
  onClick?: (badgeId: string) => void;
}

const FALLBACK_IMAGE = "/static/About-Us-1--Streamline-Manila.png";

export function BadgeCard({ badge, onClick }: BadgeCardProps) {
  const [imageSrc, setImageSrc] = useState(badge.iconSrc);
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    if (badge.state === "earned" && onClick) {
      onClick(badge.id);
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

    if (badge.state === "earned") {
      classNames.push(styles.earned);
      if (badge.color) {
        classNames.push(styles[badge.color]);
      }
      if (badge.isNew) {
        classNames.push(styles.new);
      }
    }

    if (badge.state === "locked") {
      classNames.push(styles.locked);
    }

    return classNames.join(" ");
  };

  return (
    <div
      className={getClassNames()}
      data-type="achievement"
      onClick={handleClick}
      style={{ cursor: badge.state === "earned" ? "pointer" : "default" }}
    >
      {badge.isNew && badge.state === "earned" && <div className={styles.newRibbon}>NEW</div>}

      {badge.state === "earned" && badge.isNew && (
        <>
          <div className={styles.cardBack}></div>
          <div className={styles.cardFront}>
            <div className={styles.shimmerOverlay}></div>
            <div className={styles.badgeIconWrapper}>
              <img src={imageSrc} alt={badge.iconAlt} onError={handleImageError} />
            </div>
            <div className={styles.badgeTitle}>{badge.title}</div>
            <div className={styles.badgeSubtitle}>{badge.subtitle}</div>
            <div className={styles.badgeDate}>{badge.date}</div>
          </div>
        </>
      )}

      {(badge.state === "locked" || (badge.state === "earned" && !badge.isNew)) && (
        <>
          <div className={styles.badgeIconWrapper}>
            <img src={imageSrc} alt={badge.iconAlt} onError={handleImageError} />
          </div>
          <div className={styles.badgeTitle}>{badge.title}</div>
          <div className={styles.badgeSubtitle}>{badge.subtitle}</div>
          <div className={styles.badgeDate}>{badge.date}</div>
        </>
      )}
    </div>
  );
}
