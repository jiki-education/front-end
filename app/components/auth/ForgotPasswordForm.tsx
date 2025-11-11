"use client";

import { useAuthStore } from "@/stores/authStore";
import { StyledInput } from "@/components/ui/StyledInput";
import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";

export function ForgotPasswordForm() {
  const { requestPasswordReset, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");

  const validate = () => {
    const errors: Record<string, string> = {};

    if (!email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    setSuccessMessage("");

    if (!validate()) {
      return;
    }

    try {
      await requestPasswordReset(email);
      setSuccessMessage("If an account with that email exists, you'll receive reset instructions shortly.");
      setEmail("");
    } catch (err) {
      console.error("Password reset request failed:", err);
    }
  };

  return (
    <div className="flex flex-col gap-20">
      {error && (
        <div className="bg-[#e0f5d2] border-2 border-[#78ce4d] rounded-lg p-16 text-[#2e571d] text-15 font-medium leading-relaxed">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-[#e0f5d2] border-2 border-[#78ce4d] rounded-lg p-16 text-[#2e571d] text-15 font-medium leading-relaxed">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-20">
        <StyledInput
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email address"
          icon="email"
          value={email}
          error={validationErrors.email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (validationErrors.email) {
              setValidationErrors({ ...validationErrors, email: "" });
            }
          }}
          required
        />

        <button
          type="submit"
          disabled={isLoading}
          className={`
            w-full px-20 py-16 
            border-2 border-[#3b82f6] rounded-xl
            text-17 font-medium text-white
            bg-gradient-to-br from-[#3b82f6] to-[#2563eb]
            shadow-lg shadow-blue-200
            transition-all duration-300
            hover:border-[#2563eb] hover:shadow-xl hover:shadow-blue-300 hover:ring-4 hover:ring-blue-100
            focus:outline-none focus:ring-4 focus:ring-blue-100
            disabled:cursor-not-allowed
            ${isLoading ? "btn-loading" : ""}
          `}
          style={{
            ...(isLoading && {
              pointerEvents: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              opacity: 0.8
            })
          }}
        >
          {isLoading && (
            <div
              className="w-[18px] h-[18px] rounded-full border-2 animate-spin"
              style={{
                borderColor: "rgba(255, 255, 255, 0.3)",
                borderTopColor: "white"
              }}
            />
          )}
          {isLoading ? "Sending..." : "Send Reset Link"}
        </button>

        <div className="text-center">
          <p className="text-15 text-[#4a5568]">
            Remembered your password?{" "}
            <Link href="/auth/login" className="text-[#3b82f6] hover:text-[#2563eb] font-medium transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
