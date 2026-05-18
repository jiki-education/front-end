import CategoryRow from "./CategoryRow";
import FeatureRow, { CellValue } from "./FeatureRow";
import PlanPrice from "./PlanPrice";
import styles from "./PremiumPage.module.css";
import { FEATURE_CATEGORIES } from "./pricing.data";

export default function PricingTable() {
  return (
    <>
      <div className={`${styles["pricing-table-wrapper"]} ${styles["pricing-table-desktop"]}`}>
        <div className={styles["table-header-row"]}>
          <div className={styles["col-feature-header"]}>
            <div>
              <div className={styles["compare-plans-title"]}>Compare plans</div>
              <p className={styles["compare-plans-desc"]}>
                Here&apos;s what&apos;s included in each plan,
                <br />
                so you can choose with confidence.
              </p>
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
          <div key={category.label}>
            <CategoryRow label={category.label} />
            {category.features.map((feature, i) => (
              <FeatureRow
                key={i}
                title={feature.title}
                desc={feature.desc}
                free={feature.free}
                premium={feature.premium}
              />
            ))}
          </div>
        ))}
      </div>

      <div className={styles["pricing-cards-mobile"]}>
        <div className={styles["mobile-intro"]}>
          <h2 className={styles["compare-plans-title"]}>Compare plans</h2>
          <p className={styles["compare-plans-desc"]}>
            Here&apos;s what&apos;s included in each plan, so you can choose with confidence.
          </p>
        </div>

        <PlanCard variant="free" />
        <PlanCard variant="premium" />
      </div>
    </>
  );
}

function PlanCard({ variant }: { variant: "free" | "premium" }) {
  const cardClass = variant === "premium" ? styles["plan-card-premium"] : styles["plan-card-free"];

  return (
    <section className={`${styles["plan-card"]} ${cardClass}`}>
      <header className={styles["plan-card-header"]}>
        <PlanPrice variant={variant} />
      </header>

      <div className={styles["plan-card-body"]}>
        {FEATURE_CATEGORIES.map((category) => (
          <div key={category.label} className={styles["plan-card-category"]}>
            <div className={styles["plan-card-category-label"]}>{category.label}</div>
            <ul className={styles["plan-card-feature-list"]}>
              {category.features.map((feature, i) => (
                <li key={i} className={styles["plan-card-feature"]}>
                  <div className={styles["plan-card-feature-text"]}>
                    <span className={styles["feature-title"]}>{feature.title}</span>
                    <span className={styles["feature-desc"]}>{feature.desc}</span>
                  </div>
                  <div className={styles["plan-card-feature-value"]}>
                    <CellValue value={variant === "free" ? feature.free : feature.premium} variant={variant} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
