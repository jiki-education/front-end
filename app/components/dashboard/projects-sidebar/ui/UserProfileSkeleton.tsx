import { assembleClassNames } from "@/lib/assemble-classnames";
import styles from "./UserProfileSkeleton.module.css";

export function UserProfileSkeleton() {
  return (
    <div className={styles.skeletonProfileCard}>
      <div className={styles.skeletonProfileHeader}>
        <div className={assembleClassNames(styles.skeleton, styles.skeletonAvatar)} />
        <div className={styles.skeletonProfileInfo}>
          <div className={assembleClassNames(styles.skeleton, styles.skeletonName)} />
          <div className={assembleClassNames(styles.skeleton, styles.skeletonHandle)} />
        </div>
        <div className={assembleClassNames(styles.skeleton, styles.skeletonStreak)} />
      </div>
      <div className={styles.skeletonBadgesSection}>
        <div className={assembleClassNames(styles.skeleton, styles.skeletonBadgesTitle)} />
        <div className={styles.skeletonBadges}>
          {[1, 2, 3, 4].map((badge) => (
            <div key={badge} className={assembleClassNames(styles.skeleton, styles.skeletonBadgeCircle)} />
          ))}
        </div>
      </div>
    </div>
  );
}
