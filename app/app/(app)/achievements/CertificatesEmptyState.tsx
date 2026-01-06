import styles from "./CertificatesEmptyState.module.css";

interface CertificatesEmptyStateProps {
  show: boolean;
}

export function CertificatesEmptyState({ show }: CertificatesEmptyStateProps) {
  return (
    <div className={`${styles.certificatesEmptyState} ${show ? styles.show : ""}`}>
      <div className={styles.emptyStateWrapper}>
        <div className={styles.iconCircle}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5 13.18v4.82c0 1.1 3.13 3 7 3s7-1.9 7-3v-4.82"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2>No certificates yet</h2>
        <p>
          Complete courses to earn certificates that showcase your skills. Your certificates will appear here once
          you&apos;ve finished a course.
        </p>
      </div>
    </div>
  );
}
