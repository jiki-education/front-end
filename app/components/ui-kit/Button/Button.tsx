/**
 * Button Component
 *
 * Reusable button component with variants, loading states, and icon support.
 * Based on the UI kit design system.
 */

"use client";
import { forwardRef } from "react";
import type { ButtonProps, ButtonVariant } from "./types";
import { TRANSITION_CLASSES } from "../types";

function Spinner({ variant }: { variant: ButtonVariant }) {
  const spinnerClasses = [
    "w-[18px] h-[18px] border-2 rounded-full",
    "animate-[ui-spin_0.6s_linear_infinite]",
    variant === "primary" ? "border-white/30 border-t-white" : "border-blue-500/30 border-t-blue-500"
  ].join(" ");

  return <div className={spinnerClasses} />;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size: _size = "large",
      loading = false,
      disabled = false,
      fullWidth = false,
      icon,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    // Base button classes
    const baseClasses = [
      // Layout and positioning
      "inline-flex items-center justify-center gap-12",
      "text-center font-medium cursor-pointer",

      // Size-specific styles
      "px-20 py-16 text-[17px] rounded-[12px]",

      // Border and transitions
      "border-2",
      TRANSITION_CLASSES.all,

      // Full width handling
      fullWidth && "w-full",

      // Loading and disabled states
      (loading || disabled) && "pointer-events-none",
      loading && "opacity-80"
    ]
      .filter(Boolean)
      .join(" ");

    // Variant-specific classes
    const variantClasses = {
      primary: [
        // Colors
        "border-blue-500 text-white",
        "bg-gradient-to-br from-blue-500 to-blue-600",

        // Shadows
        "shadow-[0_2px_8px_var(--color-blue-shadow)]",

        // Hover states (only when not loading/disabled)
        !loading &&
          !disabled && [
            "hover:border-blue-600",
            "hover:shadow-[0_0_0_4px_var(--color-blue-shadow-hover),0_4px_16px_rgba(59,130,246,0.4)]"
          ]
      ]
        .flat()
        .filter(Boolean)
        .join(" "),

      secondary: [
        // Colors
        "border-gray-200 text-gray-950 bg-white",

        // Shadows
        "shadow-[0_2px_8px_var(--color-shadow-subtle)]",

        // Hover states (only when not loading/disabled)
        !loading &&
          !disabled && [
            "hover:border-blue-500",
            "hover:shadow-[0_0_0_4px_rgba(59,130,246,0.1),0_4px_16px_rgba(59,130,246,0.2)]"
          ]
      ]
        .flat()
        .filter(Boolean)
        .join(" ")
    };

    const finalClasses = [baseClasses, variantClasses[variant], className].filter(Boolean).join(" ");

    return (
      <button ref={ref} className={finalClasses} disabled={disabled || loading} {...props}>
        {loading && <Spinner variant={variant} />}
        {!loading && icon}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
