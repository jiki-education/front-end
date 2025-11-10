import type { ReactNode } from "react";

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
  const baseClasses =
    "font-medium rounded transition-all duration-200 focus-ring disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary: "bg-button-primary-bg text-button-primary-text hover:opacity-90",
    secondary:
      "bg-button-secondary-bg text-button-secondary-text border border-button-secondary-border hover:bg-button-secondary-bg-hover",
    danger: "bg-red-600 text-white hover:bg-red-700 border border-red-600"
  };

  const sizeClasses = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg"
  };

  const isDisabled = disabled || loading;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-busy={loading}
    >
      {loading && (
        <div className="inline-flex items-center">
          <div
            className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"
            role="status"
            aria-label="Loading"
          />
          <span>Loading...</span>
        </div>
      )}
      {!loading && children}
    </button>
  );
}
