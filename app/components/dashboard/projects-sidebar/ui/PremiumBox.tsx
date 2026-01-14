import styles from "../projects-sidebar.module.css";

interface PremiumBoxProps {
  onUpgradeClick?: () => void;
}

export function PremiumBox({ onUpgradeClick }: PremiumBoxProps) {
  return (
    <div className={styles.premiumBox}>
      {/* Premium Icon */}
      <div className={styles.premiumIcon}>⭐</div>

      {/* Title */}
      <div className={styles.premiumTitle}>Never get stuck</div>

      {/* Description */}
      <div className={styles.premiumText}>
        Jiki&apos;s friendly AI will support you while you learn to code. Blah blah blah.
      </div>

      {/* Upgrade Button */}
      <button onClick={onUpgradeClick} className={styles.upgradeBtn}>
        Try Jiki AI for free
      </button>
    </div>
  );
}
