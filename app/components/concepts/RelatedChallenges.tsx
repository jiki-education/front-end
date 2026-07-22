import { ChallengeIcon } from "@/components/icons/ChallengeIcon";
import type { ChallengeStatus } from "@/lib/api/challenges";
import type { ChallengeInfo } from "@/types/concepts";
import { useTranslations } from "next-intl";
import Link from "next/link";
import styles from "./RelatedExercises.module.css";

interface RelatedChallengesProps {
  challenges: ChallengeInfo[];
  getStatus: (slug: string) => ChallengeStatus | "locked";
}

export function RelatedChallenges({ challenges, getStatus }: RelatedChallengesProps) {
  const t = useTranslations("concepts.relatedChallenges");
  if (challenges.length === 0) {
    return null;
  }

  return (
    <div className={styles.card}>
      <h3 className={styles.header}>{t("heading")}</h3>
      <p className={styles.description}>{t("description")}</p>
      <div className={styles.list}>
        {challenges.map((p) => (
          <ChallengeItem key={p.slug} challenge={p} status={getStatus(p.slug)} />
        ))}
      </div>
    </div>
  );
}

function ChallengeItem({ challenge, status }: { challenge: ChallengeInfo; status: ChallengeStatus | "locked" }) {
  const t = useTranslations("concepts.relatedChallenges");
  const stateClass = statusToClass(status);
  const className = `${styles.item} ${stateClass}`;

  if (status === "locked") {
    return (
      <span className={className} title={t("locked")}>
        <ChallengeIcon slug={challenge.slug} width={48} height={48} />
        <span className={styles.itemName}>{challenge.title}</span>
      </span>
    );
  }

  return (
    <Link href={`/challenges/${challenge.slug}`} className={className}>
      <ChallengeIcon slug={challenge.slug} width={48} height={48} />
      <span className={styles.itemName}>{challenge.title}</span>
    </Link>
  );
}

function statusToClass(status: ChallengeStatus | "locked"): string {
  switch (status) {
    case "completed":
      return styles.completed;
    case "started":
      return styles.inProgress;
    case "unlocked":
      return styles.available;
    case "locked":
      return styles.locked;
    default:
      status satisfies never;
      return styles.available;
  }
}
