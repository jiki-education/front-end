import Image from "next/image";
import CheckmarkCircle from "@/icons/checkmark-circle.svg";
import { PremiumPrice } from "@/components/common/PremiumPrice";
import styles from "./BenefitSection.module.css";

interface BenefitSectionProps {
  isCancelling?: boolean;
  onResubscribe?: () => void;
  className?: string;
}

interface Benefit {
  title: string;
  description: string;
}

const BENEFITS: Benefit[] = [
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
  },
  {
    title: "Priority support",
    description: "Get faster responses when you need help"
  },
  {
    title: "Early access",
    description: "Be the first to try new features and content"
  }
];

export default function BenefitSection({ isCancelling = false, onResubscribe, className = "" }: BenefitSectionProps) {
  if (isCancelling) {
    return <CancellingBenefitSection onResubscribe={onResubscribe} className={className} />;
  }

  return <ActiveBenefitSection className={className} />;
}

function ActiveBenefitSection({ className = "" }: { className?: string }) {
  return (
    <div className={`${styles.benefitsSection} ${className}`}>
      <div className={styles.benefitsHeader}>
        <Image
          src="/static/images/misc/splash.png"
          alt=""
          width={60}
          height={60}
          className={`${styles.splashDecoration} ${styles.splashLeft}`}
        />
        <h3>
          You&apos;re enjoying <span className={styles.gradientText}>Premium</span> benefits
        </h3>
        <Image
          src="/static/images/misc/splash.png"
          alt=""
          width={60}
          height={60}
          className={`${styles.splashDecoration} ${styles.splashRight}`}
        />
      </div>
      <p className={styles.benefitsSubtitle}>Here&apos;s what you&apos;re unlocking every day</p>

      <BenefitsList />

      <p className={styles.benefitsFooter}>
        {/* TODO: Replace placeholder links with real URLs or remove until available */}
        Got a question? Learn more about <a href="#">what&apos;s included</a> or <a href="#">contact support</a>.
      </p>
    </div>
  );
}

function CancellingBenefitSection({
  onResubscribe,
  className = ""
}: {
  onResubscribe?: () => void;
  className?: string;
}) {
  return (
    <div className={`${styles.benefitsSection} ${className}`}>
      <div className={styles.benefitsHeader}>
        <h3>
          Don&apos;t lose your <span className={styles.gradientText}>Premium</span> benefits
        </h3>
      </div>
      <p className={styles.benefitsSubtitle}>Here&apos;s what you&apos;ll miss when your access ends</p>

      <BenefitsList />

      <div className={styles.resubscribeCta}>
        <div className={styles.resubscribeCtaContent}>
          <h4>Keep learning without limits</h4>
          <p>
            Resubscribe now for just{" "}
            <span className={styles.price}>
              <PremiumPrice interval="monthly" />
              /month
            </span>{" "}
            and continue your coding journey with Jiki&apos;s support.
          </p>
        </div>
        <button
          className="ui-btn ui-btn-default ui-btn-primary ui-btn-purple whitespace-nowrap"
          onClick={onResubscribe}
        >
          Resubscribe to Premium
        </button>
      </div>
    </div>
  );
}

function BenefitsList() {
  return (
    <div className={styles.premiumBenefits}>
      {BENEFITS.map((benefit) => (
        <div key={benefit.title} className={styles.premiumBenefit}>
          <CheckmarkCircle />
          <div>
            <strong>{benefit.title}:</strong> {benefit.description}
          </div>
        </div>
      ))}
    </div>
  );
}
