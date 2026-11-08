import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import CheckmarkCircle from "@/icons/checkmark-circle.svg";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import { staticAsset } from "@/lib/static-asset";
import type { SubscriptionDetails } from "@/types/subscription";
import { useSubscriptionPrice } from "./useSubscriptionPrice";
import styles from "./BenefitSection.module.css";

interface BenefitSectionProps {
  isCancelling?: boolean;
  subscription?: SubscriptionDetails | null;
  onResubscribe?: () => void;
  className?: string;
}

export default function BenefitSection({
  isCancelling = false,
  subscription = null,
  onResubscribe,
  className = ""
}: BenefitSectionProps) {
  if (isCancelling) {
    return <CancellingBenefitSection subscription={subscription} onResubscribe={onResubscribe} className={className} />;
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

// A legacy subscriber who has scheduled a cancellation. Resubscribing
// reactivates the same subscription at its own price.
function CancellingBenefitSection({
  subscription,
  onResubscribe,
  className = ""
}: {
  subscription: SubscriptionDetails | null;
  onResubscribe?: () => void;
  className?: string;
}) {
  const t = useTranslations("settings.benefits");
  const price = useSubscriptionPrice(subscription);
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
            {price
              ? t.rich("resubscribeAtPrice", {
                  price,
                  strong: (chunks) => <span className={styles.price}>{chunks}</span>
                })
              : t("resubscribeWithoutPrice")}
          </p>
        </div>
        <button
          className={`ui-btn ui-btn-default ui-btn-primary ui-btn-purple ${styles.resubscribeButton}`}
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
