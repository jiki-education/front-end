import { useTranslations } from "next-intl";
import HeaderLayout from "../layout/HeaderLayout";
import CtaSection from "./CtaSection";
import FaqSection from "./FaqSection";
import styles from "./PremiumPage.module.css";
import PricingTable from "./PricingTable";

export function PremiumPage() {
  const t = useTranslations("premium.page");
  return (
    <HeaderLayout>
      <div className={styles["page-wrapper"]}>
        <header className={styles["page-header"]}>
          <h1 className={styles.heading}>{t("heading")}</h1>
          <p className={styles.subheading}>{t("subheading")}</p>
        </header>

        <div className={styles["main-content"]}>
          <PricingTable />
        </div>

        <FaqSection />

        <div className={styles["main-content"]}>
          <CtaSection />
        </div>
      </div>
    </HeaderLayout>
  );
}
