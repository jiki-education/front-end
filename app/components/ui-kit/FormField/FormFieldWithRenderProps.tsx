"use client";

import React, { forwardRef, type ReactNode, useState } from "react";
import type { FormFieldProps } from "./types";

interface FormFieldRenderProps {
  isFocused: boolean;
  hasError: boolean;
  fieldId: string;
  value: string | undefined;
  inputProps: {
    id: string;
    className: string;
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  };
  labelProps: {
    htmlFor: string;
    className: string;
  };
  errorProps?: {
    id: string;
    className: string;
    role: string;
  };
}

interface FormFieldWithRenderPropsProps extends Omit<FormFieldProps, "icon" | "focusedIcon" | "children"> {
  children: (props: FormFieldRenderProps) => ReactNode;
  renderIcon?: (props: { isFocused: boolean; hasError: boolean }) => ReactNode;
  renderError?: (props: { error: string }) => ReactNode;
  renderLabel?: (props: { label: string; isFocused: boolean; hasError: boolean }) => ReactNode;
}

export const FormFieldWithRenderProps = forwardRef<HTMLInputElement, FormFieldWithRenderPropsProps>(
  (
    { children, label, error, className, onFocus, onBlur, value, renderIcon, renderError, renderLabel, ...inputProps },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasError = Boolean(error);
    const fieldId = React.useId();
    const errorId = `${fieldId}-error`;

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    // Base input classes
    const inputClassName = `
      w-full border-2 rounded-[12px] bg-white font-normal px-16 py-[14px] text-[16px]
      ${renderIcon ? "pl-48" : ""}
      ${
        hasError
          ? "border-error-500"
          : "border-gray-200 hover:border-blue-500 hover:shadow-[0_0_0_2px_rgba(59,130,246,0.1)] focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.15)]"
      }
      transition-all duration-300 ease-in-out
      ${className || ""}
    `
      .trim()
      .replace(/\s+/g, " ");

    const labelClassName = `
      block text-[15px] font-medium mb-8 transition-colors
      ${isFocused ? (hasError ? "text-error-500" : "text-blue-500") : "text-gray-700"}
    `
      .trim()
      .replace(/\s+/g, " ");

    const containerClassName = `
      ${hasError ? "animate-[ui-shake_0.5s]" : ""}
    `.trim();

    const renderProps: FormFieldRenderProps = {
      isFocused,
      hasError,
      fieldId,
      value: value as string | undefined,
      inputProps: {
        id: fieldId,
        className: inputClassName,
        onFocus: handleFocus,
        onBlur: handleBlur
      },
      labelProps: {
        htmlFor: fieldId,
        className: labelClassName
      },
      errorProps: hasError
        ? {
            id: errorId,
            className: "text-error-500 text-[14px] mt-8",
            role: "alert"
          }
        : undefined
    };

    return (
      <div className={containerClassName}>
        {/* Custom label renderer */}
        {renderLabel ? renderLabel({ label, isFocused, hasError }) : <label {...renderProps.labelProps}>{label}</label>}

        {/* Input container with icon support */}
        <div className="relative">
          {renderIcon && (
            <div className="absolute left-16 top-1/2 transform -translate-y-1/2 z-10">
              {renderIcon({ isFocused, hasError })}
            </div>
          )}

          {/* Render props pattern - allows complete customization of input */}
          {children({
            ...renderProps,
            inputProps: {
              ...renderProps.inputProps,
              ...inputProps,
              ref,
              value,
              "aria-invalid": hasError,
              "aria-describedby": hasError ? errorId : undefined
            } as any
          })}
        </div>

        {/* Custom error renderer */}
        {hasError &&
          renderProps.errorProps &&
          (renderError ? renderError({ error: error! }) : <div {...renderProps.errorProps}>{error}</div>)}
      </div>
    );
  }
);

FormFieldWithRenderProps.displayName = "FormFieldWithRenderProps";
