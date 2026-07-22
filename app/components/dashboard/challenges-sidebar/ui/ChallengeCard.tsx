import { ChallengeIcon } from "@/components/icons/ChallengeIcon";
import type { ChallengeData } from "@/lib/api/challenges";
import { useTranslations } from "next-intl";
import Link from "next/link";
import styles from "../ChallengesSidebar.module.css";

interface ChallengeCardProps {
  challenge: ChallengeData;
}

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  const t = useTranslations("dashboard.challengesSidebar.challengeCard.status");
  const getStatusText = () => {
    switch (challenge.status) {
      case "locked":
        return t("locked");
      case "unlocked":
        return t("notStarted");
      case "started":
        return t("inProgress");
      case "completed":
        return t("completed");
      case undefined:
      default:
        return t("available");
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
