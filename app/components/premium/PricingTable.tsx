import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import CategoryRow from "./CategoryRow";
import FeatureRow, { CellValue } from "./FeatureRow";
import PlanPrice from "./PlanPrice";
import styles from "./PremiumPage.module.css";
import { FEATURE_CATEGORIES } from "./pricing.data";

export default function PricingTable() {
  const t = useTranslations("premium.table");
  const tc = useTranslations("premium.categories");
  const tf = useTranslations("premium.features");
  return (
    <>
      <div className={`${styles["pricing-table-wrapper"]} ${styles["pricing-table-desktop"]}`}>
        <div className={styles["table-header-row"]}>
          <div className={styles["col-feature-header"]}>
            <div>
              <div className={styles["compare-plans-title"]}>{t("comparePlans")}</div>
              <p className={styles["compare-plans-desc"]}>{t("comparePlansDesc")}</p>
            </div>
          </div>
          <div className={styles["col-free-header"]}>
            <PlanPrice variant="free" />
          </div>
          <div className={styles["col-premium-header"]}>
            <PlanPrice variant="premium" />
          </div>
        </div>

        {FEATURE_CATEGORIES.map((category) => (
          <div key={category.labelKey}>
            <CategoryRow label={tc(category.labelKey as Parameters<typeof tc>[0])} />
            {category.features.map((feature, i) => (
              <FeatureRow
                key={i}
                title={tf(feature.titleKey as Parameters<typeof tf>[0])}
                desc={tf(feature.descKey as Parameters<typeof tf>[0])}
                free={feature.free}
                premium={feature.premium}
              />
            ))}
          </div>
        ))}
      </div>

      <div className={styles["pricing-mobile"]}>
        <div className={styles["mobile-intro"]}>
          <h2 className={styles["compare-plans-title"]}>{t("comparePlans")}</h2>
          <p className={styles["compare-plans-desc"]}>{t("comparePlansDesc")}</p>
        </div>

        <div className={styles["mobile-plans-header"]}>
          <div className={styles["mobile-plan-summary"]}>
            <PlanPrice variant="free" />
          </div>
          <div className={`${styles["mobile-plan-summary"]} ${styles["mobile-plan-summary-premium"]}`}>
            <PlanPrice variant="premium" />
          </div>
        </div>

        <div className={styles["mobile-feature-list"]}>
          {FEATURE_CATEGORIES.map((category) => (
            <section key={category.labelKey} className={styles["mobile-category"]}>
              <h3 className={styles["mobile-category-label"]}>{tc(category.labelKey as Parameters<typeof tc>[0])}</h3>
              <ul className={styles["mobile-feature-items"]}>
                {category.features.map((feature, i) => (
                  <li key={i} className={styles["mobile-feature-item"]}>
                    <div className={styles["mobile-feature-text"]}>
                      <span className={styles["feature-title"]}>
                        {tf(feature.titleKey as Parameters<typeof tf>[0])}
                      </span>
                      <span className={styles["feature-desc"]}>{tf(feature.descKey as Parameters<typeof tf>[0])}</span>
                    </div>
                    <div className={styles["mobile-feature-badges"]}>
                      <PlanBadge variant="free" value={feature.free} />
                      <PlanBadge variant="premium" value={feature.premium} />
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}

function PlanBadge({ variant, value }: { variant: "free" | "premium"; value: boolean | string }): ReactNode {
  const tb = useTranslations("premium.planBadge");
  const label = variant === "free" ? tb("free") : tb("premium");
  const badgeClass = variant === "free" ? styles["plan-badge-free"] : styles["plan-badge-premium"];
  const layoutClass = typeof value === "string" ? styles["plan-badge-stacked"] : styles["plan-badge-inline"];

  return (
    <div className={`${styles["plan-badge"]} ${badgeClass} ${layoutClass}`}>
      <span className={styles["plan-badge-label"]}>{label}</span>
      <span className={styles["plan-badge-value"]}>
        <CellValue value={value} variant={variant} />
      </span>
    </div>
  );
}
