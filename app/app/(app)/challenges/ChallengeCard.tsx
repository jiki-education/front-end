import { ChallengeIcon } from "@/components/icons/ChallengeIcon";
import { type ChallengeData } from "@/lib/api/challenges";
import Link from "next/link";
import styles from "./ChallengeCard.module.css";

interface ChallengeCardProps {
  challenge: ChallengeData & {
    progress?: number; // 0-100 percentage
    iconUrl?: string;
    skills?: string;
  };
}
export function ChallengeCard({ challenge }: ChallengeCardProps) {
  const isClickable = challenge.status !== "locked";
  const progress = challenge.progress ?? 0;

  // Map status to display text to match HTML examples
  const statusConfig = {
    locked: { text: "Locked" },
    unlocked: { text: "Not started" },
    started: { text: "In Progress" },
    completed: { text: "Completed" }
  };

  // Map status to CSS data-state values
  const dataStateMap = {
    locked: "locked",
    unlocked: undefined, // No data-state for unlocked (default styling)
    started: "in-progress",
    completed: "complete"
  };

  const currentStatus = challenge.status ? statusConfig[challenge.status] : statusConfig.unlocked;
  const dataState = challenge.status ? dataStateMap[challenge.status] : undefined;

  const cardContent = (
    <div
      className={styles.card}
      data-state={dataState}
      style={{ "--target-width": `${progress}%` } as React.CSSProperties}
    >
      <div className={styles.statusBadge}>{currentStatus.text}</div>
      <div className={styles.hero}>
        <div className={styles.challengeIcon}>
          <ChallengeIcon slug={challenge.slug} />
        </div>
        <div className={styles.challengeTitle}>{challenge.title}</div>
        {challenge.status === "started" || challenge.status === "completed" ? (
          <div className={styles.progressBar}>
            <div className={styles.progressFill}></div>
          </div>
        ) : (
          <div className={styles.challengeKind}>Coding Challenge</div>
        )}
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
      {isClickable && <div className={styles.actionLink}></div>}
    </div>
  );

  if (!isClickable) {
    return cardContent;
  }

  return <Link href={`/challenges/${challenge.slug}`}>{cardContent}</Link>;
}
