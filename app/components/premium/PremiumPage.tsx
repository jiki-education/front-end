"use client";

import HeaderLayout from "../layout/HeaderLayout";
import CtaSection from "./CtaSection";
import FaqSection from "./FaqSection";
import styles from "./PremiumPage.module.css";
import PricingTable from "./PricingTable";

export function PremiumPage() {
  return (
    <HeaderLayout>
      <div className={styles["page-wrapper"]}>
        <header className={styles["page-header"]}>
          <h1 className={styles.heading}>Jiki Premium</h1>
          <p className={styles.subheading}>
            Accelerate your road to job-ready. Unlock every course, every project, unlimited AI support, and everything
            else Jiki has to offer.
          </p>
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
