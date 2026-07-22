import { assembleClassNames } from "@/lib/assemble-classnames";
import styles from "./RecentChallengesSkeleton.module.css";

export function RecentChallengesSkeleton() {
  return (
    <div className={styles.skeletonChallengesBox}>
      <div className={assembleClassNames(styles.skeleton, styles.skeletonChallengesIcon)} />
      <div className={assembleClassNames(styles.skeleton, styles.skeletonChallengesTitle)} />
      <div className={assembleClassNames(styles.skeleton, styles.skeletonChallengesText)} />
      <div className={assembleClassNames(styles.skeleton, styles.skeletonChallengesTextShort)} />
    </div>
  );
}
