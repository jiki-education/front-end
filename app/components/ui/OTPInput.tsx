"use client";

import { useRef } from "react";
import styles from "./OTPInput.module.css";

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  hasError?: boolean;
  autoFocus?: boolean;
}

export function OTPInput({ value, onChange, disabled = false, hasError = false, autoFocus = false }: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, inputValue: string) => {
    // Filter to digits only
    const digits = inputValue.replace(/\D/g, "");
    if (!digits) {
      return;
    }

    // Handle multi-character input (autocomplete or fast typing)
    if (digits.length > 1) {
      const newValue = (value.slice(0, index) + digits).slice(0, 6);
      onChange(newValue);
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    // Single digit input
    const newValue = value.split("");
    newValue[index] = digits;
    onChange(newValue.join("").slice(0, 6));

    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pastedData);
    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div className={styles.container} role="group" aria-label="One-time password">
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={6}
          autoComplete={index === 0 ? "one-time-code" : "off"}
          autoFocus={autoFocus && index === 0}
          aria-label={`Digit ${index + 1} of 6`}
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={`${styles.input} ${hasError ? styles.inputError : ""}`}
        />
      ))}
    </div>
  );
}
