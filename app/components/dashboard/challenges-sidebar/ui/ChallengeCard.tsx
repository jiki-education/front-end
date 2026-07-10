import { ChallengeIcon } from "@/components/icons/ChallengeIcon";
import type { ChallengeData } from "@/lib/api/challenges";
import Link from "next/link";
import styles from "../challenges-sidebar.module.css";

interface ChallengeCardProps {
  challenge: ChallengeData;
}

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  const getStatusText = () => {
    switch (challenge.status) {
      case "locked":
        return "Locked";
      case "unlocked":
        return "Not started";
      case "started":
        return "In progress";
      case "completed":
        return "Completed";
      case undefined:
      default:
        return "Available";
    }
  };

  return (
    <Link href={`/challenges/${challenge.slug}`} className={styles.statCard} data-status={challenge.status}>
      <div className={styles.statCardEmoji}>
        <ChallengeIcon slug={challenge.slug} width="100%" height="100%" />
      </div>

      <div className={styles.statCardTitle}>{challenge.title}</div>

      <div className={styles.statCardProgress}>{getStatusText()}</div>

      <div className={styles.cardProgressBar}>
        <div
          className={styles.cardProgressFill}
          style={{
            width: challenge.status === "completed" ? "100%" : challenge.status === "started" ? "50%" : "0%"
          }}
        />
      </div>
    </Link>
  );
}
