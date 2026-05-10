"use client";

import { PublicPremiumPrice } from "./PublicPremiumPrice";
import styles from "./PremiumPage.module.css";

interface Props {
  variant: "free" | "premium";
}

export default function PlanPrice({ variant }: Props) {
  const isFree = variant === "free";

  return (
    <>
      <div className={`${styles["plan-name"]} ${isFree ? styles["plan-name-free"] : styles["plan-name-premium"]}`}>
        {isFree ? "Basic" : "Premium"}
      </div>

      {isFree ? (
        <div className={styles["plan-price"]}>
          <span className={`${styles["price-amount"]} ${styles["price-amount-free"]}`}>Free</span>
        </div>
      ) : (
        <div className={styles["plan-price"]}>
          <span className={`${styles["price-amount"]} ${styles["price-amount-premium"]}`}>
            <PublicPremiumPrice />
          </span>
        </div>
      )}

      {!isFree && <div className={styles["price-period"]}>per month</div>}
    </>
  );
}
