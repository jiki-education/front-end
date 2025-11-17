"use client";

import { useAuthStore } from "@/stores/authStore";
import { FormField, Button } from "@/components/ui-kit";
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
        <FormField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email address"
          iconName="email"
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

        <Button type="submit" variant="primary" loading={isLoading} disabled={isLoading} fullWidth>
          {isLoading ? "Sending..." : "Send Reset Link"}
        </Button>

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
