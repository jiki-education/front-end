import type { ButtonHTMLAttributes } from "react";
import styles from "./CloseButton.module.css";

interface CloseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "light";
  size?: "default" | "small";
}

export function CloseButton({ variant = "default", size = "default", className = "", ...props }: CloseButtonProps) {
  const sizeClass = size === "small" ? styles.small : "";
  const variantClass = variant === "light" ? styles.light : "";

  return (
    <button
      className={`${styles.closeButton} ${variantClass} ${sizeClass} ${className}`}
      aria-label="Close modal"
      {...props}
    >
      ×
    </button>
  );
}
