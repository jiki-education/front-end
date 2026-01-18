"use client";

import { forwardRef } from "react";
import styles from "./select.module.css";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: "default" | "small" | "large";
  state?: "default" | "error" | "success";
  fullWidth?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      variant = "default",
      state = "default",
      fullWidth = true,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const selectClasses = [
      styles.select,
      variant === "small" && styles.selectSmall,
      variant === "large" && styles.selectLarge,
      state === "error" && styles.selectError,
      state === "success" && styles.selectSuccess,
      !fullWidth && "w-auto",
      className
    ]
      .filter(Boolean)
      .join(" ");

    if (label) {
      return (
        <div className={styles.selectWrapper}>
          <label className={styles.selectLabel} htmlFor={props.id}>
            {label}
          </label>
          <select ref={ref} className={selectClasses} {...props}>
            {children}
          </select>
          {error && <div className={styles.selectErrorMessage}>{error}</div>}
          {helperText && !error && <div className={styles.selectHelperText}>{helperText}</div>}
        </div>
      );
    }

    return (
      <>
        <select ref={ref} className={selectClasses} {...props}>
          {children}
        </select>
        {error && <div className={styles.selectErrorMessage}>{error}</div>}
        {helperText && !error && <div className={styles.selectHelperText}>{helperText}</div>}
      </>
    );
  }
);

Select.displayName = "Select";

export default Select;
