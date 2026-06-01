import ClockIcon from "@/icons/clock.svg";
import styles from "./ComingSoonCard.module.css";

export function ComingSoonCard() {
  return (
    <div className={styles.card}>
      <div className={styles.badge}>
        <ClockIcon />
      </div>
      <div className={styles.outer}>
        <div className={styles.inner}>
          <div className={styles.title}>More Lessons Coming Soon</div>
          <div className={styles.subtitle}>
            We&apos;re busy finalising the next lessons. Check back soon to continue your journey!
          </div>
        </div>
      </div>
    </div>
  );
}
