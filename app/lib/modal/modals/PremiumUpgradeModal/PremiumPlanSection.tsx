import { useTranslations } from "next-intl";
import Image from "next/image";
import { PremiumPrice, PremiumDailyPrice } from "@/components/common/PremiumPrice";
import { staticAsset } from "@/lib/static-asset";
import styles from "./PremiumUpgradeModal.module.css";

interface PremiumPlanSectionProps {
  user: any;
  isLoading: boolean;
  onUpgrade: () => void;
}

export function PremiumPlanSection({ user, isLoading, onUpgrade }: PremiumPlanSectionProps) {
  const t = useTranslations("modals.premiumUpgrade");
  const tCommon = useTranslations("common");

  const strong = (chunks: React.ReactNode) => <strong>{chunks}</strong>;
  const premiumFeatures: React.ReactNode[] = [
    t.rich("featureLearnToBuild", { strong }),
    t.rich("featureChallenges", { strong }),
    t.rich("featureAi", { strong }),
    t.rich("featureLivestreams", { strong }),
    t.rich("featureCertificates", { strong }),
    t.rich("featureAdFree", { strong }),
    t.rich("featureEarlyAccess", { strong })
  ];

  return (
    <div className={styles.rightSide}>
      <h2 className={styles.premiumName}>{t("planName")}</h2>
      <div className={styles.premiumPrice}>
        <span className={styles.amount}>
          <PremiumPrice interval="monthly" />
        </span>
        <span className={styles.period}>{tCommon("perMonth")}</span>
      </div>
      <p className={styles.annualNote}>
        {t.rich("dailyNote", { price: () => <PremiumDailyPrice interval="monthly" /> })}
      </p>

      <button
        className={`ui-btn ui-btn-default ui-btn-primary ui-btn-purple mb-24 w-full ${isLoading ? "ui-btn-loading" : ""}`}
        onClick={onUpgrade}
        disabled={isLoading}
      >
        {!isLoading && (
          <Image
            src={user?.avatar || staticAsset("icons/user-fallback.svg")}
            alt={t("userAvatarAlt")}
            className={styles.buttonAvatar}
            width={24}
            height={24}
          />
        )}
        {isLoading ? tCommon("processing") : t("upgrade")}
      </button>

      <ul className={styles.premiumFeatures}>
        {premiumFeatures.map((feature, index) => (
          <li key={index}>
            <PremiumCheckIcon />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PremiumCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.15" />
      <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
