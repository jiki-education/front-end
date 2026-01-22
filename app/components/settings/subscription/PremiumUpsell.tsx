import { useState } from "react";
import styles from "./PremiumUpsell.module.css";

interface PremiumUpsellProps {
  onUpgrade: () => void | Promise<void>;
  isLoading?: boolean;
  className?: string;
}

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
        <div className={styles.premiumFeature}>
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#9333ea" fillOpacity="0.15"/>
            <path d="M8 12L11 15L16 9" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <strong>Unlimited AI help:</strong> Get personalised guidance from Jiki whenever you&apos;re stuck
          </div>
        </div>
        <div className={styles.premiumFeature}>
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#9333ea" fillOpacity="0.15"/>
            <path d="M8 12L11 15L16 9" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <strong>Unlimited content:</strong> Access all exercises, projects, and learning paths
          </div>
        </div>
        <div className={styles.premiumFeature}>
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#9333ea" fillOpacity="0.15"/>
            <path d="M8 12L11 15L16 9" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <strong>Certificates:</strong> Earn shareable certificates when you complete courses
          </div>
        </div>
        <div className={styles.premiumFeature}>
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#9333ea" fillOpacity="0.15"/>
            <path d="M8 12L11 15L16 9" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <strong>Ad-free:</strong> Enjoy a distraction-free learning experience
          </div>
        </div>
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