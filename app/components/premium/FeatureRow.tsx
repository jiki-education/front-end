import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import styles from "./PremiumPage.module.css";

interface Props {
  title: ReactNode;
  desc: string;
  // A boolean for tick/cross, or a value-key resolved under premium.values.
  free: boolean | string;
  premium: boolean | string;
}

export function CellValue({ value, variant }: { value: boolean | string; variant: "free" | "premium" }) {
  const tv = useTranslations("premium.values");
  const tt = useTranslations("premium.table");

  if (typeof value === "string") {
    const cls = variant === "free" ? styles["feature-value-free"] : styles["feature-value-premium"];
    return <span className={cls}>{tv(value as Parameters<typeof tv>[0])}</span>;
  }

  if (value) {
    const cls = variant === "free" ? styles["check-yes-free"] : styles["check-yes-premium"];
    return (
      <span className={`${styles["check-yes"]} ${cls}`}>
        <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </span>
    );
  }

  return <span className={styles["check-no"]}>{tt("checkNo")}</span>;
}

export default function FeatureRow({ title, desc, free, premium }: Props) {
  return (
    <div className={styles["feature-row"]}>
      <div className={styles["feature-name"]}>
        <span className={styles["feature-title"]}>{title}</span>
        <span className={styles["feature-desc"]}>{desc}</span>
      </div>
      <div className={styles["feature-check"]}>
        <CellValue value={free} variant="free" />
      </div>
      <div className={styles["feature-check-premium"]}>
        <CellValue value={premium} variant="premium" />
      </div>
    </div>
  );
}
