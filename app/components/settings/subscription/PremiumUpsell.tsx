import { useState } from "react";
import CheckmarkCircle from "@/icons/checkmark-circle.svg";
import styles from "./PremiumUpsell.module.css";

interface PremiumUpsellProps {
  onUpgrade: () => void | Promise<void>;
  isLoading?: boolean;
  className?: string;
}

interface Feature {
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    title: "Unlimited AI help",
    description: "Get personalised guidance from Jiki whenever you're stuck"
  },
  {
    title: "Unlimited content",
    description: "Access all exercises, projects, and learning paths"
  },
  {
    title: "Certificates",
    description: "Earn shareable certificates when you complete courses"
  },
  {
    title: "Ad-free",
    description: "Enjoy a distraction-free learning experience"
  }
];

export default function PremiumUpsell({
  onUpgrade,
  isLoading: externalLoading = false,
  className = ""
}: PremiumUpsellProps) {
  const [internalLoading, setInternalLoading] = useState(false);
  const isLoading = externalLoading || internalLoading;

  const handleUpgrade = async () => {
    setInternalLoading(true);
    try {
      await onUpgrade();
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <div className={`${styles.premiumUpsell} ${className}`}>
      <h2 className={styles.premiumUpsellHeadline}>
        Unlock a <span className={styles.highlight}>better</span> way to learn
      </h2>
      <p className={styles.premiumUpsellSubtitle}>
        You&apos;re currently on the Free plan. Upgrade to Premium to unlock:
      </p>

      <div className={styles.premiumUpsellFeatures}>
        {features.map((feature, index) => (
          <div key={index} className={styles.premiumFeature}>
            <CheckmarkCircle />
            <div>
              <strong>{feature.title}:</strong> {feature.description}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.premiumUpsellCard}>
        <div className={styles.premiumUpsellCardInfo}>
          <h3 className={styles.premiumUpsellTitle}>Jiki Premium</h3>
          <div className={styles.premiumUpsellPricing}>
            <div className={styles.premiumUpsellPrice}>
              <span className={styles.amount}>$3.99</span>
              <span className={styles.period}>/month</span>
            </div>
            <p className={styles.premiumUpsellNote}>That&apos;s only $0.13 a day</p>
          </div>
        </div>
        <button
          className={`ui-btn ui-btn-primary ui-btn-purple ui-btn-default ${isLoading ? "ui-btn-loading" : ""}`}
          onClick={handleUpgrade}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Upgrade to Premium"}
        </button>
      </div>
    </div>
  );
}
