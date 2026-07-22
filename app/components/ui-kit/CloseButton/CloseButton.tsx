import type { ButtonHTMLAttributes } from "react";
import { useTranslations } from "next-intl";
import styles from "./CloseButton.module.css";

interface CloseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "light" | "glass";
  size?: "default" | "small";
}

export function CloseButton({ variant = "default", size = "default", className = "", ...props }: CloseButtonProps) {
  const t = useTranslations("common.closeButton");
  const sizeClass = size === "small" ? styles.small : "";
  const variantClass = variant === "light" ? styles.light : variant === "glass" ? styles.glass : "";

  return (
    <button
      className={`${styles.closeButton} ${variantClass} ${sizeClass} ${className}`}
      aria-label={t("label")}
      {...props}
    >
      ×
    </button>
  );
}
