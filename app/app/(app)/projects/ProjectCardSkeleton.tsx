import styles from "./ProjectCardSkeleton.module.css";

export function ProjectCardSkeleton() {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonBadge} />
      <div className={styles.skeletonIcon} />
      <div className={styles.skeletonTitle} />
      <div className={styles.skeletonProgressBar} />
    </div>
  );
}

export function ProjectCardsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  );
}
