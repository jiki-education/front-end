import { ChallengeIcon } from "@/components/icons/ChallengeIcon";
import { useTranslations } from "next-intl";
import styles from "./ChallengesUpsellCard.module.css";

interface ChallengesUpsellCardProps {
  onUpgradeClick: () => void;
}

export function ChallengesUpsellCard({ onUpgradeClick }: ChallengesUpsellCardProps) {
  const t = useTranslations("dashboard.challengesSidebar.upsell");
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
      <div className={styles.title}>{t("title")}</div>
      <div className={styles.subtitle}>{t("description")}</div>
    </div>
  );
}
