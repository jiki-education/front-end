import { BadgeIcon } from "@/components/icons/BadgeIcon";
import { BadgeNewLabel } from "@/components/ui/BadgeNewLabel";
import type { BadgeData } from "@/lib/api/badges";
import styles from "./BadgeCard.module.css";
import { getBadgeColor, getBadgeDate, isEarnedBadge, isNewBadge } from "./lib/badgeUtils";

interface BadgeCardProps {
  badge: BadgeData;
  onClick?: (badgeId: string) => void;
  isSpinning?: boolean;
  showNewRibbon?: boolean;
}

export function BadgeCard({ badge, onClick, isSpinning = false, showNewRibbon = false }: BadgeCardProps) {
  const isNew = isNewBadge(badge);
  const isEarned = isEarnedBadge(badge);
  const badgeDate = getBadgeDate(badge);
  const badgeColor = getBadgeColor(badge);

  const handleClick = () => {
    if (isEarned && onClick) {
      onClick(badge.id.toString());
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
      {showNewRibbon && !isSpinning && <BadgeNewLabel className={styles.newRibbon} />}

      {isEarned && isNew && (
        <>
          <div className={styles.cardBack}></div>
          <div className={styles.cardFront}>
            <div className={styles.shimmerOverlay}></div>
            <div className={styles.badgeIconWrapper}>
              <BadgeIcon slug={badge.slug} />
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
            <BadgeIcon slug={badge.slug} />
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
