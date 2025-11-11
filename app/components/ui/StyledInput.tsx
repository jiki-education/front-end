"use client";

import React, { forwardRef, useState } from "react";
import type { ComponentProps } from "react";

interface StyledInputProps extends ComponentProps<"input"> {
  label: string;
  error?: string;
  icon?: "email" | "password";
}

function EmailIcon({ focused }: { focused: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      className={focused ? "block" : "hidden"}
    >
      <path
        stroke="#3b82f6"
        d="M7 12c0 1.3261 0.52678 2.5979 1.46447 3.5355C9.40215 16.4732 10.6739 17 12 17c1.3261 0 2.5979 -0.5268 3.5355 -1.4645C16.4732 14.5979 17 13.3261 17 12c0 -1.3261 -0.5268 -2.59785 -1.4645 -3.53553C14.5979 7.52678 13.3261 7 12 7c-1.3261 0 -2.59785 0.52678 -3.53553 1.46447C7.52678 9.40215 7 10.6739 7 12Z"
        strokeWidth="2"
      />
      <path
        stroke="#3b82f6"
        d="M19.7782 19.7782C17.7153 21.8411 14.9174 23 12 23c-2.91738 0 -5.71527 -1.1589 -7.77817 -3.2218S1 14.9174 1 12c0 -2.91738 1.15893 -5.71527 3.22183 -7.77817S9.08262 1 12 1c2.9174 0 5.7153 1.15893 7.7782 3.22183S23 9.08262 23 12c0 1.753 -0.4184 3.4629 -1.2 4.9961C19.1313 16.8911 17 14.6944 17 12"
        strokeWidth="2"
      />
    </svg>
  );
}

function EmailIconDefault({ focused }: { focused: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      className={focused ? "hidden" : "block"}
    >
      <path
        stroke="#707985"
        d="M7 12c0 1.3261 0.52678 2.5979 1.46447 3.5355C9.40215 16.4732 10.6739 17 12 17c1.3261 0 2.5979 -0.5268 3.5355 -1.4645C16.4732 14.5979 17 13.3261 17 12c0 -1.3261 -0.5268 -2.59785 -1.4645 -3.53553C14.5979 7.52678 13.3261 7 12 7c-1.3261 0 -2.59785 0.52678 -3.53553 1.46447C7.52678 9.40215 7 10.6739 7 12Z"
        strokeWidth="2"
      />
      <path
        stroke="#707985"
        d="M19.7782 19.7782C17.7153 21.8411 14.9174 23 12 23c-2.91738 0 -5.71527 -1.1589 -7.77817 -3.2218S1 14.9174 1 12c0 -2.91738 1.15893 -5.71527 3.22183 -7.77817S9.08262 1 12 1c2.9174 0 5.7153 1.15893 7.7782 3.22183S23 9.08262 23 12c0 1.753 -0.4184 3.4629 -1.2 4.9961C19.1313 16.8911 17 14.6944 17 12"
        strokeWidth="2"
      />
    </svg>
  );
}

function PasswordIcon({ focused }: { focused: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      className={focused ? "block" : "hidden"}
    >
      <path fill="#d7e0ff" d="M21 11 3 11l0 12 18 0 0 -12Z" strokeWidth="2" />
      <path stroke="#1b5fd4" d="M21 11 3 11l0 12 18 0 0 -12Z" strokeWidth="2" />
      <path stroke="#1b5fd4" d="M7 11V6c0 -2.76142 2.23858 -5 5 -5 2.7614 0 5 2.23858 5 5v5" strokeWidth="2" />
      <path stroke="#1b5fd4" d="M12 15v4" strokeWidth="2" />
    </svg>
  );
}

function PasswordIconDefault({ focused }: { focused: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      className={focused ? "hidden" : "block"}
    >
      <path fill="#ebefff" d="M21 11 3 11l0 12 18 0 0 -12Z" strokeWidth="2" />
      <path stroke="#737b87" d="M21 11 3 11l0 12 18 0 0 -12Z" strokeWidth="2" />
      <path stroke="#737b87" d="M7 11V6c0 -2.76142 2.23858 -5 5 -5 2.7614 0 5 2.23858 5 5v5" strokeWidth="2" />
      <path stroke="#737b87" d="M12 15v4" strokeWidth="2" />
    </svg>
  );
}

export const StyledInput = forwardRef<HTMLInputElement, StyledInputProps>(
  ({ label, error, icon, className, onFocus, onBlur, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    // Trigger shake animation when error appears
    React.useEffect(() => {
      if (error) {
        setIsAnimating(true);
        const timer = setTimeout(() => setIsAnimating(false), 500);
        return () => clearTimeout(timer);
      }
    }, [error]);

    return (
      <div className="space-y-2">
        <label
          htmlFor={props.id}
          className={`
            block text-sm font-medium leading-5 transition-colors duration-200
            ${isFocused && !error ? "text-[#3b82f6]" : error ? "text-[#ef4444]" : "text-[#374151]"}
          `}
        >
          {label}
        </label>
        <div className={`relative ${error ? "form-field-error" : ""}`}>
          <div className="absolute left-16 top-1/2 -translate-y-1/2 z-10">
            {icon === "email" && (
              <>
                <EmailIconDefault focused={isFocused || isHovered} />
                <EmailIcon focused={isFocused || isHovered} />
              </>
            )}
            {icon === "password" && (
              <>
                <PasswordIconDefault focused={isFocused || isHovered} />
                <PasswordIcon focused={isFocused || isHovered} />
              </>
            )}
          </div>
          <input
            ref={ref}
            className={`
              w-full p-16 pl-48
              border-2 rounded-xl
              text-base placeholder:text-[#9ca3af]
              transition-all duration-200
              focus:outline-none
              ${
                error
                  ? "border-[#ef4444] hover:border-[#ef4444] focus:border-[#ef4444] focus:ring-4 focus:ring-red-100"
                  : "border-[#e5e7eb] hover:border-[#3b82f6] focus:border-[#3b82f6] focus:ring-4 focus:ring-blue-100"
              }
              ${isAnimating ? "animate-[shake_0.5s_ease-in-out]" : ""}
              ${className || ""}
            `}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-[#ef4444] leading-5 mt-1">{error}</p>}
      </div>
    );
  }
);

StyledInput.displayName = "StyledInput";
