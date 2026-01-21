import { assembleClassNames } from "@/lib/assemble-classnames";
import styles from "./RecentProjectsSkeleton.module.css";

export function RecentProjectsSkeleton() {
  return (
    <div className={styles.skeletonProjectsBox}>
      <div className={assembleClassNames(styles.skeleton, styles.skeletonProjectsIcon)} />
      <div className={assembleClassNames(styles.skeleton, styles.skeletonProjectsTitle)} />
      <div className={assembleClassNames(styles.skeleton, styles.skeletonProjectsText)} />
      <div className={assembleClassNames(styles.skeleton, styles.skeletonProjectsTextShort)} />
    </div>
  );
}
