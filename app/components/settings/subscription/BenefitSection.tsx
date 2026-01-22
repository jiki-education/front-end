import Image from "next/image";
import CheckmarkCircle from "@/icons/checkmark-circle.svg";
import styles from "./BenefitSection.module.css";

interface BenefitSectionProps {
  className?: string;
}

interface Benefit {
  title: string;
  description: string;
}

const benefits: Benefit[] = [
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

export default function BenefitSection({ className = "" }: BenefitSectionProps) {
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

      <div className={styles.premiumBenefits}>
        {benefits.map((benefit, index) => (
          <div key={index} className={styles.premiumBenefit}>
            <CheckmarkCircle />
            <div>
              <strong>{benefit.title}:</strong> {benefit.description}
            </div>
          </div>
        ))}
      </div>

      <p className={styles.benefitsFooter}>
        {/* TODO: Replace placeholder links with real URLs or remove until available */}
        Got a question? Learn more about <a href="#">what&apos;s included</a> or <a href="#">contact support</a>.
      </p>
    </div>
  );
}
