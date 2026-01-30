import Image from "next/image";
import { PRICING_TIERS } from "@/lib/pricing";
import styles from "./PremiumUpgradeModal.module.css";

interface PremiumPlanSectionProps {
  user: any;
  isLoading: boolean;
  onUpgrade: () => void;
}

const premiumTier = PRICING_TIERS.premium;

const premiumFeatures = [
  "Unlimited AI support from Jiki",
  "Unlimited exercises and projects",
  "Earn certificates for courses",
  "Ad-free learning experience",
  "Early access to new features"
];

export function PremiumPlanSection({ user, isLoading, onUpgrade }: PremiumPlanSectionProps) {
  const dailyPrice = (premiumTier.price / 30).toFixed(2);

  return (
    <div className={styles.rightSide}>
      <h2 className={styles.premiumName}>Jiki {premiumTier.name}</h2>
      <div className={styles.premiumPrice}>
        <span className={styles.amount}>${premiumTier.price}</span>
        <span className={styles.period}>/month</span>
      </div>
      <p className={styles.annualNote}>(That&apos;s only ${dailyPrice} a day)</p>

      <button
        className="ui-btn ui-btn-default ui-btn-primary ui-btn-purple mb-24 w-full"
        onClick={onUpgrade}
        disabled={isLoading}
      >
        <Image
          src={user?.avatar || "/static/icons/concepts/fallback.svg"}
          alt="User"
          className={styles.buttonAvatar}
          width={24}
          height={24}
        />
        {isLoading ? "Processing..." : "Upgrade to Premium"}
      </button>

      <ul className={styles.premiumFeatures}>
        {premiumFeatures.map((feature, index) => (
          <li key={index}>
            <PremiumCheckIcon />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

function PremiumCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.15" />
      <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
