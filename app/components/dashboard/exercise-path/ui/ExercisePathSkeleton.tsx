import { assembleClassNames } from "@/lib/assemble-classnames";
import styles from "./ExercisePathSkeleton.module.css";
import { Fragment } from "react";

const SKELETON_LEVELS = [
  { cardsCount: 4, hasMilestone: true },
  { cardsCount: 4, hasMilestone: true },
  { cardsCount: 2, hasMilestone: false }
];

export function ExercisePathSkeleton() {
  return (
    <>
      {SKELETON_LEVELS.map((level, levelIndex) => (
        <Fragment key={levelIndex}>
          {Array.from({ length: level.cardsCount }).map((_, cardIndex) => (
            <div key={cardIndex} className={styles.skeletonCard}>
              <div className={assembleClassNames(styles.skeleton, styles.skeletonStatusBadge)} />
              <div className={assembleClassNames(styles.skeleton, styles.skeletonIcon)} />
              <div className={styles.skeletonContent}>
                <div className={assembleClassNames(styles.skeleton, styles.skeletonTypePill)} />
                <div className={assembleClassNames(styles.skeleton, styles.skeletonTitle)} />
                <div className={assembleClassNames(styles.skeleton, styles.skeletonDescriptionLine1)} />
                <div className={assembleClassNames(styles.skeleton, styles.skeletonDescriptionLine2)} />
              </div>
            </div>
          ))}
          {level.hasMilestone && <div className={assembleClassNames(styles.skeleton, styles.skeletonMilestone)} />}
        </Fragment>
      ))}
    </>
  );
}
