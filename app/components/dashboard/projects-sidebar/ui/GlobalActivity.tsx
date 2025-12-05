import { GlobalActivity as GlobalActivityType } from "../lib/mockData";
import styles from "../projects-sidebar.module.css";

interface GlobalActivityProps {
  activity: GlobalActivityType;
}

export function GlobalActivity({ activity }: GlobalActivityProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className={styles.presenceCard}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.globeIcon}>🌍</div>
        <div className={styles.headerText}>
          <h3>Global Activity</h3>
          <p>People learning right now</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statBox}>
          <div className={styles.number}>
            {formatNumber(activity.codingNow)}
          </div>
          <div className={styles.label}>Coding Now</div>
        </div>
        <div className={styles.statBox}>
          <div className={styles.number}>
            {activity.thisWeek}
          </div>
          <div className={styles.label}>This Week</div>
        </div>
      </div>
    </div>
  );
}