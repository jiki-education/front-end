import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import styles from "./SubscriptionButton.module.css";

interface SubscriptionButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

export default function SubscriptionButton({
  children,
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  className = "",
  onClick,
  ariaLabel,
  ariaDescribedBy
}: SubscriptionButtonProps) {
  const t = useTranslations("common");
  const isDisabled = disabled || loading;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`${styles.button} ${styles[variant]} ${styles[size]} focus-ring ${className}`}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-busy={loading}
    >
      {loading && (
        <div className={styles.loadingContent}>
          <div className={styles.spinner} role="status" aria-label={t("loading")} />
          <span>{t("loading")}</span>
        </div>
      )}
      {!loading && children}
    </button>
  );
}
