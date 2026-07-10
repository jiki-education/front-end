import { ChallengeIcon } from "@/components/icons/ChallengeIcon";
import styles from "./ChallengesUpsellCard.module.css";

interface ChallengesUpsellCardProps {
  onUpgradeClick: () => void;
}

export function ChallengesUpsellCard({ onUpgradeClick }: ChallengesUpsellCardProps) {
  return (
    <div
      className={styles.card}
      onClick={onUpgradeClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onUpgradeClick();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className={styles.stack}>
        <div className={styles.fanCard}>
          <ChallengeIcon slug="fallback" width={36} height={36} />
        </div>
        <div className={styles.fanCard}>
          <ChallengeIcon slug="fallback" width={36} height={36} />
        </div>
        <div className={styles.fanCard}>
          <ChallengeIcon slug="fallback" width={36} height={36} />
        </div>
        <div className={styles.fanCard}>
          <span className={styles.fanMore}>+6</span>
        </div>
      </div>
      <div className={styles.title}>New Challenges Await!</div>
      <div className={styles.subtitle}>Combine your skills and challenge yourself with Premium Challenges.</div>
    </div>
  );
}
