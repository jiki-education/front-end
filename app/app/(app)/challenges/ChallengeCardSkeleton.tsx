import styles from "./ChallengeCardSkeleton.module.css";

export function ChallengeCardSkeleton() {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonBadge} />
      <div className={styles.skeletonIcon} />
      <div className={styles.skeletonTitle} />
      <div className={styles.skeletonProgressBar} />
    </div>
  );
}

export function ChallengeCardsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(265px,1fr))] gap-28">
      {Array.from({ length: 6 }).map((_, i) => (
        <ChallengeCardSkeleton key={i} />
      ))}
    </div>
  );
}
