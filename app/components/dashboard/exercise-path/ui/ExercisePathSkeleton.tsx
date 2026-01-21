import { assembleClassNames } from "@/lib/assemble-classnames";
import styles from "./ExercisePathSkeleton.module.css";

const SKELETON_LEVELS = [
  { cardsCount: 4, hasMilestone: true },
  { cardsCount: 4, hasMilestone: true },
  { cardsCount: 2, hasMilestone: false }
];

export function ExercisePathSkeleton() {
  const renderSkeletonCard = (isFeatured: boolean = false) => (
    <div className={assembleClassNames(isFeatured && styles.skeletonCardFeatured, styles.skeletonCard)}>
      <div className={assembleClassNames(styles.skeleton, styles.skeletonIcon)} />
      <div className={styles.skeletonContent}>
        <div className={assembleClassNames(styles.skeleton, styles.skeletonBadge)} />
        <div className={assembleClassNames(styles.skeleton, styles.skeletonTitle)} />
        <div className={assembleClassNames(styles.skeleton, styles.skeletonText)} />
      </div>
    </div>
  );

  let isFirstCard = true;

  return (
    <div className={styles.learningPath}>
      {/* Start Card Skeleton */}
      <div className={styles.skeletonStartCard}>
        <div className={assembleClassNames(styles.skeleton, styles.skeletonStartPill)} />
      </div>

      {/* Levels with cards and milestones */}
      {SKELETON_LEVELS.map((level, levelIndex) => (
        <div key={levelIndex}>
          {Array.from({ length: level.cardsCount }).map((_, cardIndex) => {
            const isFeatured = isFirstCard;
            isFirstCard = false;
            return <div key={cardIndex}>{renderSkeletonCard(isFeatured)}</div>;
          })}
          {level.hasMilestone && <div className={assembleClassNames(styles.skeleton, styles.skeletonMilestone)} />}
        </div>
      ))}
    </div>
  );
}
