import styles from "../ChallengesSidebar.module.css";

export function EmptyChallengesState() {
  return (
    <div className={styles.challengesEmptyState}>
      <div className={styles.challengesEmptyIcon}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="challengeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#a855f7" }} />
              <stop offset="100%" style={{ stopColor: "#3b82f6" }} />
            </linearGradient>
          </defs>
          <path d="M24 4L6 14V34L24 44L42 34V14L24 4Z" stroke="url(#challengeGradient)" strokeWidth="2.5" fill="none" />
          <path
            d="M24 22V32M24 22L14 16M24 22L34 16"
            stroke="url(#challengeGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="24" cy="32" r="3" fill="url(#challengeGradient)" />
          <circle cx="14" cy="16" r="3" fill="url(#challengeGradient)" />
          <circle cx="34" cy="16" r="3" fill="url(#challengeGradient)" />
        </svg>
      </div>
      <div className={styles.challengesEmptyTitle}>Challenges await!</div>
      <p className={styles.challengesEmptyText}>
        Complete exercises to unlock real coding challenges. Build games, apps, and tools that bring your skills to
        life.
      </p>
    </div>
  );
}
