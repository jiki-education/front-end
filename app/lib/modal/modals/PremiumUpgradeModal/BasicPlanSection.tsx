import { useTranslations } from "next-intl";
import Image from "next/image";
import { staticAsset } from "@/lib/static-asset";
import styles from "./PremiumUpgradeModal.module.css";

export function BasicPlanSection() {
  const t = useTranslations("modals.premiumUpgrade.basic");
  const basicFeatures = [t("feature1"), t("feature2"), t("feature3")];

  return (
    <div className={styles.leftSide}>
      <div className={styles.headingRow}>
        <Image
          className={styles.headingJiki}
          src={staticAsset("images/misc/jiki-flying.webp")}
          alt=""
          width={71}
          height={69}
        />
        <h1 className={styles.mainHeading}>
          {t.rich("headline", {
            highlight: (chunks) => <span className={styles.highlight}>{chunks}</span>,
            br: () => <br />
          })}
        </h1>
      </div>
      <p className={styles.mainSubheading}>{t.rich("subheading", { strong: (chunks) => <strong>{chunks}</strong> })}</p>

      <div className={styles.planSection}>
        <h2 className={styles.planName}>{t("planName")}</h2>
        <p className={styles.planPrice}>{t("planPrice")}</p>
        <ul className={styles.planFeatures}>
          {basicFeatures.map((feature, index) => (
            <li key={index}>
              <CheckIcon />
              {feature}
            </li>
          ))}
        </ul>
        <p className={styles.planNote}>{t("note")}</p>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
