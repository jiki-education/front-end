import conceptStyles from "@/app/styles/modules/concepts.module.css";
import styles from "./LoadingStates.module.css";

interface LoadingSkeletonProps {
  withSidebar: boolean;
}

export function LoadingSkeleton({ withSidebar }: LoadingSkeletonProps) {
  const containerClasses = withSidebar ? styles.withSidebar : styles.fullWidth;

  return (
    <div className={containerClasses} data-testid="loading-skeleton" data-variant={withSidebar ? "sidebar" : "full"}>
      <div className={styles.pulse}>
        <div className={styles.headerGroup}>
          <div className={styles.barA}></div>
          <div className={styles.barB}></div>
          <div className={styles.barC}></div>
        </div>
        <div className={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.card} data-testid="skeleton-card">
              <div className={styles.cardTitle}></div>
              <div className={styles.cardLines}>
                <div className={styles.lineFull}></div>
                <div className={styles.lineShort}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function InlineLoading() {
  return (
    <div className={styles.inlineWrap} data-testid="inline-loading">
      <div className={styles.inlineBadge}>
        <svg className={styles.spinner} data-testid="loading-spinner" fill="none" viewBox="0 0 24 24">
          <circle className={styles.spinnerTrack} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className={styles.spinnerHead}
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        Loading...
      </div>
    </div>
  );
}

export function ConceptCardsLoadingSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className={conceptStyles.conceptsGrid}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.placeholderCard}>
          <div className={styles.placeholderIcon}></div>
          <div className={styles.placeholderContent}>
            <div className={styles.placeholderTitle}></div>
            <div className={styles.placeholderDescription}></div>
            <div className={styles.placeholderDescription2}></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ConceptArticleSkeleton() {
  return (
    <div className={styles.leafBody}>
      {[100, 90, 95, 80, 85, 60].map((w, i) => (
        <div
          key={i}
          className={styles.shimmer}
          style={{ height: 14, width: `${w}%`, animationDelay: `${i * 0.05}s` }}
        />
      ))}
    </div>
  );
}

export function ConceptLeafPageSkeleton() {
  return (
    <div className={styles.leafGrid}>
      <div className={styles.leafMain}>
        <div className={`${styles.shimmer} ${styles.placeholderBreadcrumb}`}></div>
        <div className={`${styles.shimmer} ${styles.leafHero}`}></div>
        <div className={styles.leafBody}>
          {[100, 90, 95, 80, 85, 60].map((w, i) => (
            <div
              key={i}
              className={styles.shimmer}
              style={{ height: 14, width: `${w}%`, animationDelay: `${i * 0.05}s` }}
            />
          ))}
        </div>
      </div>
      <div className={styles.leafAside}>
        <div className={`${styles.shimmer} ${styles.leafSidebarBlock}`}></div>
        <div className={`${styles.shimmer} ${styles.leafSidebarBlock}`}></div>
        <div className={`${styles.shimmer} ${styles.leafSidebarBlock}`}></div>
      </div>
    </div>
  );
}
