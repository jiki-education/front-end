import CategoryRow from "./CategoryRow";
import FeatureRow from "./FeatureRow";
import PlanPrice from "./PlanPrice";
import styles from "./PremiumPage.module.css";
import { FEATURE_CATEGORIES } from "./pricing.data";

export default function PricingTable() {
  return (
    <div className={styles["pricing-table-wrapper"]}>
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
  );
}
