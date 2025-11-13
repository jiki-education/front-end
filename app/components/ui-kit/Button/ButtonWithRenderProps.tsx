import React, { forwardRef, type ReactNode } from "react";
import type { ButtonProps } from "./types";

interface ButtonRenderProps {
  isLoading: boolean;
  isDisabled: boolean;
  variant: "primary" | "secondary";
  className: string;
  buttonProps: {
    type: "button";
    disabled: boolean;
    className: string;
  };
}

interface ButtonWithRenderPropsProps extends Omit<ButtonProps, "children" | "icon"> {
  children: (props: ButtonRenderProps) => ReactNode;
  renderIcon?: (props: { isLoading: boolean; variant: "primary" | "secondary" }) => ReactNode;
  renderSpinner?: (props: { variant: "primary" | "secondary" }) => ReactNode;
  renderContent?: (props: { children: ReactNode; isLoading: boolean }) => ReactNode;
}

export const ButtonWithRenderProps = forwardRef<HTMLButtonElement, ButtonWithRenderPropsProps>(
  (
    {
      children,
      variant = "primary",
      loading = false,
      disabled = false,
      fullWidth = false,
      className,
      renderIcon,
      renderSpinner,
      renderContent,
      ...buttonProps
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    // Base button classes
    const baseClasses = `
      inline-flex items-center justify-center gap-12 text-center font-medium cursor-pointer
      px-20 py-16 text-[17px] rounded-[12px] border-2 transition-all duration-300 ease-in-out
      ${fullWidth ? "w-full" : ""}
      ${isDisabled ? "pointer-events-none" : ""}
      ${loading ? "opacity-80" : ""}
    `
      .trim()
      .replace(/\s+/g, " ");

    // Variant-specific classes
    const variantClasses = {
      primary: `
        border-blue-500 text-white bg-gradient-to-br from-blue-500 to-blue-600
        shadow-[0_2px_8px_var(--color-blue-shadow)]
        ${!isDisabled ? "hover:border-blue-600 hover:shadow-[0_0_0_4px_var(--color-blue-shadow-hover),0_4px_16px_rgba(59,130,246,0.4)]" : ""}
      `
        .trim()
        .replace(/\s+/g, " "),
      secondary: `
        border-gray-200 text-gray-950 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.05)]
        ${!isDisabled ? "hover:border-blue-500 hover:shadow-[0_0_0_4px_rgba(59,130,246,0.15)]" : ""}
      `
        .trim()
        .replace(/\s+/g, " ")
    };

    const buttonClassName = `${baseClasses} ${variantClasses[variant]} ${className || ""}`;

    // Default spinner renderer
    const defaultSpinnerRenderer = ({ variant: spinnerVariant }: { variant: "primary" | "secondary" }) => (
      <div
        className={`
          w-[18px] h-[18px] border-2 rounded-full animate-[ui-spin_0.6s_linear_infinite]
          ${spinnerVariant === "primary" ? "border-white/30 border-t-white" : "border-blue-500/30 border-t-blue-500"}
        `
          .trim()
          .replace(/\s+/g, " ")}
      />
    );

    const renderProps: ButtonRenderProps = {
      isLoading: loading,
      isDisabled,
      variant,
      className: buttonClassName,
      buttonProps: {
        type: "button" as const,
        disabled: isDisabled,
        className: buttonClassName,
        ...buttonProps,
        ref
      } as any
    };

    return (
      <button {...renderProps.buttonProps}>
        {/* Icon or spinner */}
        {loading
          ? renderSpinner
            ? renderSpinner({ variant })
            : defaultSpinnerRenderer({ variant })
          : renderIcon && renderIcon({ isLoading: loading, variant })}

        {/* Button content */}
        {renderContent ? renderContent({ children: children(renderProps), isLoading: loading }) : children(renderProps)}
      </button>
    );
  }
);

ButtonWithRenderProps.displayName = "ButtonWithRenderProps";
