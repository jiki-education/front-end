/**
 * FormField Component
 *
 * Form input component with label, icon support, error states, and focus behavior.
 * Based on the UI kit design system.
 */

"use client";
import { forwardRef, useState, useId } from "react";
import type { FormFieldProps } from "./types";
import { TRANSITION_CLASSES } from "../types";

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, size: _size = "large", icon, focusedIcon, className = "", ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const fieldId = useId();
    const errorId = `${fieldId}-error`;

    // Container classes
    const containerClasses = [
      "relative",
      // Error state adds shake animation
      error && "animate-[ui-shake_0.5s]"
    ]
      .filter(Boolean)
      .join(" ");

    // Label classes
    const labelClasses = [
      "block font-semibold mb-8",
      // Size-specific styles
      "text-[15px]",
      // Color based on focus state
      isFocused ? "text-blue-500" : "text-gray-700",
      // Transition
      TRANSITION_CLASSES.colors
    ]
      .filter(Boolean)
      .join(" ");

    // Input wrapper classes
    const wrapperClasses = "relative";

    // Input classes
    const inputClasses = [
      "w-full border-2 rounded-[12px] bg-white font-normal",
      // Size-specific styles
      "px-16 py-[14px] text-[16px]",

      // Placeholder styling
      "placeholder:text-gray-400",

      // Icon spacing (add left padding when icon is present)
      (icon || focusedIcon) && "pl-48",

      // Default state
      !error && "border-gray-200",

      // Error state
      error && "border-error-500",

      // Hover state (only when not in error state)
      !error && "hover:border-blue-500 hover:shadow-[0_0_0_2px_rgba(59,130,246,0.1)]",

      // Focus state
      "focus:outline-none",
      !error && "focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.15)]",
      error && "focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.15)]",

      // Transitions
      TRANSITION_CLASSES.all,

      className
    ]
      .filter(Boolean)
      .join(" ");

    // Icon classes
    const iconClasses = [
      "absolute left-16 top-1/2 -translate-y-1/2 w-[18px] h-[18px] pointer-events-none",
      TRANSITION_CLASSES.opacity
    ]
      .filter(Boolean)
      .join(" ");

    // Error message classes
    const errorClasses = ["mt-4 text-[14px] font-medium text-error-500"].filter(Boolean).join(" ");

    // Determine which icons to show
    const defaultIcon = icon;

    return (
      <div className={containerClasses}>
        {/* Label */}
        <label htmlFor={fieldId} className={labelClasses}>
          {label}
        </label>

        {/* Input wrapper with icons */}
        <div className={wrapperClasses}>
          {/* Default icon (hidden when focused if focusedIcon is provided) */}
          {defaultIcon && (
            <div className={`${iconClasses} ${isFocused && focusedIcon ? "opacity-0" : "opacity-100"}`}>
              {defaultIcon}
            </div>
          )}

          {/* Focused icon (shown when focused) */}
          {focusedIcon && (
            <div className={`${iconClasses} ${isFocused ? "opacity-100" : "opacity-0"}`}>{focusedIcon}</div>
          )}

          {/* Input field */}
          <input
            ref={ref}
            id={fieldId}
            className={inputClasses}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? errorId : undefined}
            {...props}
          />
        </div>

        {/* Error message */}
        {error && (
          <div id={errorId} className={errorClasses} role="alert">
            {error}
          </div>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";
