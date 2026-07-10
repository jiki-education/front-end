import { ChallengeIcon } from "@/components/icons/ChallengeIcon";
import LockIcon from "@/icons/lock.svg";
import { type ChallengeData } from "@/lib/api/challenges";
import { showPremiumUpgradeModal } from "@/lib/modal/app";
import styles from "./ChallengeCard.module.css";

interface PremiumChallengeCardProps {
  challenge: ChallengeData & {
    iconUrl?: string;
    skills?: string;
  };
}

export function PremiumChallengeCard({ challenge }: PremiumChallengeCardProps) {
  const handleClick = () => {
    showPremiumUpgradeModal("locked_challenge", {
      contextType: "challenge",
      contextSlug: challenge.slug
    });
  };

  return (
    <button type="button" onClick={handleClick} className={styles.cardButton}>
      <div className={styles.card} data-state="premium-locked">
        <div className={styles.statusBadge}>
          <LockIcon className={styles.statusBadgeIcon} />
          Premium Only
        </div>
        <div className={styles.hero}>
          <div className={styles.challengeIcon}>
            <ChallengeIcon slug={challenge.slug} />
          </div>
          <div className={styles.challengeTitle}>{challenge.title}</div>
          <div className={styles.challengeKind}>Coding Challenge</div>
        </div>
        <div className={styles.content}>
          <div className={styles.challengeTitle}>{challenge.title}</div>
          <div className={styles.description}>{challenge.description}</div>
          {challenge.skills && (
            <div className={styles.statsRow}>
              <span className={styles.skills}>{challenge.skills}</span>
            </div>
          )}
        </div>
        <div className={styles.actionLink}></div>
      </div>
    </button>
  );
}
