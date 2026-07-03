import Link from "next/link";
import styles from "./CTABlock.module.css";

interface CTABlockProps {
  variant: "minimal" | "gradient";
  title: string;
  subtitle: string;
  buttonText: string;
  buttonHref: string;
}

export default function CTABlock({ variant, title, subtitle, buttonText, buttonHref }: CTABlockProps) {
  if (variant === "minimal") {
    return (
      <div className={styles.minimal}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
        <Link href={buttonHref} className={styles.button}>
          <span>{buttonText}</span>
          <span className={styles.arrow}>→</span>
        </Link>
      </div>
    );
  }

  // Gradient variant
  return (
    <div className={styles.gradientOuter}>
      <div className={styles.gradientInner}>
        <h2 className={styles.gradientTitle}>{title}</h2>
        <p className={styles.gradientSubtitle}>{subtitle}</p>
        <Link href={buttonHref} className={styles.gradientButton}>
          {buttonText}
        </Link>
      </div>
    </div>
  );
}
