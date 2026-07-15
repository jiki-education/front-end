import { useTranslations } from "next-intl";
import Image from "next/image";
import { PremiumPrice, PremiumDailyPrice } from "@/components/common/PremiumPrice";
import styles from "./PremiumUpgradeModal.module.css";

interface PremiumPlanSectionProps {
  user: any;
  isLoading: boolean;
  onUpgrade: () => void;
}

export function PremiumPlanSection({ user, isLoading, onUpgrade }: PremiumPlanSectionProps) {
  const t = useTranslations("modals.premiumUpgrade");
  const tCommon = useTranslations("common");

  const premiumFeatures: React.ReactNode[] = [
    <>
      {t("featureLearnToBuildPrefix")}
      <strong>{t("featureLearnToBuild")}</strong>
    </>,
    <>
      {t("featureChallengesPrefix")}
      <strong>{t("featureChallenges")}</strong>
    </>,
    <>
      {t("featureAiPrefix")}
      <strong>{t("featureAi")}</strong>
      {t("featureAiSuffix")}
    </>,
    <>
      {t("featureLivestreamsPrefix")}
      <strong>{t("featureLivestreams")}</strong>
      {t("featureLivestreamsSuffix")}
    </>,
    <>
      {t("featureCertificatesPrefix")}
      <strong>{t("featureCertificates")}</strong>
      {t("featureCertificatesSuffix")}
    </>,
    <>
      <strong>{t("featureAdFree")}</strong>
      {t("featureAdFreeSuffix")}
    </>,
    <>
      <strong>{t("featureEarlyAccess")}</strong>
      {t("featureEarlyAccessSuffix")}
    </>
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
        {t("dailyNotePrefix")}
        <PremiumDailyPrice interval="monthly" />
        {t("dailyNoteSuffix")}
      </p>

      <button
        className={`ui-btn ui-btn-default ui-btn-primary ui-btn-purple mb-24 w-full ${isLoading ? "ui-btn-loading" : ""}`}
        onClick={onUpgrade}
        disabled={isLoading}
      >
        {!isLoading && (
          <Image
            src={user?.avatar || "/static/icons/user-fallback.svg"}
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
