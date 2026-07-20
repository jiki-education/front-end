import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import CheckmarkCircle from "@/icons/checkmark-circle.svg";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import { staticAsset } from "@/lib/static-asset";
import { PremiumPrice } from "@/components/common/PremiumPrice";
import styles from "./BenefitSection.module.css";

interface BenefitSectionProps {
  isCancelling?: boolean;
  onResubscribe?: () => void;
  className?: string;
}

export default function BenefitSection({ isCancelling = false, onResubscribe, className = "" }: BenefitSectionProps) {
  if (isCancelling) {
    return <CancellingBenefitSection onResubscribe={onResubscribe} className={className} />;
  }

  return <ActiveBenefitSection className={className} />;
}

function ActiveBenefitSection({ className = "" }: { className?: string }) {
  const t = useTranslations("settings.benefits");
  const routes = useLocaleRoutes();
  return (
    <div className={`${styles.benefitsSection} ${className}`}>
      <div className={styles.benefitsHeader}>
        <Image
          src={staticAsset("images/misc/splash.png")}
          alt=""
          width={60}
          height={60}
          className={`${styles.splashDecoration} ${styles.splashLeft}`}
        />
        <h3>
          {t.rich("activeHeading", { highlight: (chunks) => <span className={styles.gradientText}>{chunks}</span> })}
        </h3>
        <Image
          src={staticAsset("images/misc/splash.png")}
          alt=""
          width={60}
          height={60}
          className={`${styles.splashDecoration} ${styles.splashRight}`}
        />
      </div>
      <p className={styles.benefitsSubtitle}>{t("activeSubtitle")}</p>

      <BenefitsList />

      <p className={styles.benefitsFooter}>
        {t.rich("footer", {
          includedLink: (chunks) => <Link href={routes.premium()}>{chunks}</Link>,
          supportLink: (chunks) => <Link href={routes.article("support")}>{chunks}</Link>
        })}
      </p>
    </div>
  );
}

function CancellingBenefitSection({
  onResubscribe,
  className = ""
}: {
  onResubscribe?: () => void;
  className?: string;
}) {
  const t = useTranslations("settings.benefits");
  const tCommon = useTranslations("common");
  return (
    <div className={`${styles.benefitsSection} ${className}`}>
      <div className={styles.benefitsHeader}>
        <h3>
          {t.rich("cancellingHeading", {
            highlight: (chunks) => <span className={styles.gradientText}>{chunks}</span>
          })}
        </h3>
      </div>
      <p className={styles.benefitsSubtitle}>{t("cancellingSubtitle")}</p>

      <BenefitsList />

      <div className={styles.resubscribeCta}>
        <div className={styles.resubscribeCtaContent}>
          <h4>{t("resubscribeTitle")}</h4>
          <p>
            {t.rich("resubscribe", {
              price: () => (
                <span className={styles.price}>
                  <PremiumPrice interval="monthly" />
                  {tCommon("perMonth")}
                </span>
              )
            })}
          </p>
        </div>
        <button
          className="ui-btn ui-btn-default ui-btn-primary ui-btn-purple whitespace-nowrap"
          onClick={onResubscribe}
        >
          {t("resubscribeButton")}
        </button>
      </div>
    </div>
  );
}

function BenefitsList() {
  const tBenefits = useTranslations("premium.benefits");
  const benefits = [
    { title: tBenefits("unlimitedAiTitle"), description: tBenefits("unlimitedAiDescription") },
    { title: tBenefits("unlimitedContentTitle"), description: tBenefits("unlimitedContentDescription") },
    { title: tBenefits("certificatesTitle"), description: tBenefits("certificatesDescription") },
    { title: tBenefits("adFreeTitle"), description: tBenefits("adFreeDescription") },
    { title: tBenefits("prioritySupportTitle"), description: tBenefits("prioritySupportDescription") },
    { title: tBenefits("earlyAccessTitle"), description: tBenefits("earlyAccessDescription") }
  ];
  return (
    <div className={styles.premiumBenefits}>
      {benefits.map((benefit) => (
        <div key={benefit.title} className={styles.premiumBenefit}>
          <CheckmarkCircle />
          <div>
            <strong>{benefit.title}:</strong> {benefit.description}
          </div>
        </div>
      ))}
    </div>
  );
}
